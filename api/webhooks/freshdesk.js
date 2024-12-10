const BitrixService = require('../services/bitrix');
const FreshdeskService = require('../services/freshdesk');

const bitrixService = new BitrixService();
const freshdeskService = new FreshdeskService();

async function handleFreshdeskWebhook(req, res) {
  try {
    const webhookData = req.body;
    console.log('Received Freshdesk webhook:', webhookData);

    // Pobierz pełne dane ticketu
    const ticket = await freshdeskService.getTicket(webhookData.ticket_id);
    const conversations = await freshdeskService.getTicketConversations(webhookData.ticket_id);

    // Znajdź lub stwórz kontakt w Bitrixie
    let contact = await bitrixService.findContactByEmail(ticket.email);
    
    if (!contact) {
      const contactData = {
        EMAIL: [{ VALUE: ticket.email, VALUE_TYPE: 'WORK' }],
        NAME: ticket.name || '',
        TYPE_ID: 'CLIENT',
        SOURCE_ID: 'FRESHDESK',
        COMMENTS: `Created from Freshdesk ticket #${ticket.id}`
      };

      if (ticket.phone) {
        contactData.PHONE = [{ VALUE: ticket.phone, VALUE_TYPE: 'WORK' }];
      }

      contact = await bitrixService.createContact(contactData);
    }

    // Stwórz aktywność w Bitrixie
    const activityData = {
      OWNER_TYPE_ID: 3, // Contact
      OWNER_ID: contact.ID,
      TYPE_ID: 4, // Email
      SUBJECT: ticket.subject,
      DESCRIPTION: `
        Ticket #${ticket.id}
        Status: ${ticket.status}
        Priority: ${ticket.priority}
        
        Description:
        ${ticket.description}
        
        ${conversations.map(conv => `
          --- ${conv.private ? 'Private note' : 'Public reply'} by ${conv.user_id} ---
          ${conv.body_text}
        `).join('\n')}
      `,
      START_TIME: new Date(ticket.created_at).toISOString(),
      COMPLETED: 'Y',
      DIRECTION: 2, // Incoming
      SETTINGS: {
        EMAIL: {
          TICKET_ID: ticket.id,
          SOURCE: 'FRESHDESK'
        }
      }
    };

    const activity = await bitrixService.createActivity(activityData);

    return res.json({
      success: true,
      contactId: contact.ID,
      activityId: activity.ID
    });

  } catch (error) {
    console.error('Error handling Freshdesk webhook:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = handleFreshdeskWebhook;
