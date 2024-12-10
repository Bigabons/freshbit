// api/webhooks/freshdesk.js
const freshdeskService = require('../../services/freshdesk');
const bitrixService = require('../../services/bitrix');

const bitrixService = new BitrixService();
const freshdeskService = new FreshdeskService();

async function handleFreshdeskWebhook(req, res) {
  try {
    const webhookData = req.body;
    console.log('Full webhook payload:', JSON.stringify(webhookData, null, 2));

    // Walidacja danych wejściowych
    if (!webhookData.freshdesk_webhook?.ticket_id) {
      console.log('Looking for ticket_id in different payload structure...');
      console.log('Available fields:', Object.keys(webhookData));
      
      // Próbujmy znaleźć ticket_id w różnych miejscach payloadu
      const ticketId = webhookData.ticket_id || 
                      webhookData.data?.ticket_id || 
                      webhookData.freshdesk_webhook?.ticket_id;

      if (!ticketId) {
        return res.status(400).json({
          success: false,
          error: 'Missing ticket_id in webhook data'
        });
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
