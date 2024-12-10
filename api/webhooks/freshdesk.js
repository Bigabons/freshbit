const freshdeskService = require('../../services/freshdesk');
const BitrixService = require('../../services/bitrix');

const bitrixService = new BitrixService();

async function handleFreshdeskWebhook(req, res) {
  try {
    const webhookData = req.body;
    console.log('Processing webhook for ticket:', webhookData.ticket_id);

    const contactData = {
      EMAIL: [{ VALUE: webhookData.email, VALUE_TYPE: 'WORK' }],
      NAME: webhookData.requester_name || '',
      TYPE_ID: 'CLIENT',
      SOURCE_ID: 'FRESHDESK'
    };

    const contact = await bitrixService.createContact(contactData);
    
    return res.json({
      success: true,
      contactId: contact.ID,
      ticketId: webhookData.ticket_id
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
    try {
      // Najpierw spróbujmy pobrać dane ticketu
      console.log('Fetching ticket details for ID:', webhookData.ticket_id);
      const ticket = await freshdeskService.getTicket(webhookData.ticket_id);
      console.log('Retrieved ticket details:', JSON.stringify(ticket, null, 2));

      // Teraz spróbujmy znaleźć kontakt
      console.log('Looking for contact with email:', ticket.email);
      const contact = await bitrixService.findContactByEmail(ticket.email);
      console.log('Contact search result:', contact ? 'Found' : 'Not found');

      if (!contact) {
        console.log('Creating new contact in Bitrix...');
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

        const newContact = await bitrixService.createContact(contactData);
        console.log('New contact created:', newContact);
      }

      // Zwróćmy sukces nawet jeśli nie wszystko się udało
      return res.json({
        success: true,
        message: 'Webhook processed'
      });

    } catch (apiError) {
      console.error('API Error details:', {
        message: apiError.message,
        response: apiError.response?.data,
        stack: apiError.stack
      });
      throw apiError; // Przekażmy błąd dalej
    }

  } catch (error) {
    console.error('Error handling webhook:', {
      error: error.message,
      stack: error.stack,
      responseData: error.response?.data,
      requestBody: req.body
    });

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
}

module.exports = handleFreshdeskWebhook;
