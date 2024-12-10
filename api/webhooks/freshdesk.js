const freshdeskService = require('../../services/freshdesk');
const BitrixService = require('../../services/bitrix');

const bitrixService = new BitrixService();

async function handleFreshdeskWebhook(req, res) {
  try {
    const webhookData = req.body;
    
    // Tworzymy kontakt
    const contactData = {
      EMAIL: [{ VALUE: webhookData.email, VALUE_TYPE: 'WORK' }],
      NAME: webhookData.requester_name || '',
      TYPE_ID: 'CLIENT',
      SOURCE_ID: 'FRESHDESK'
    };

    const contact = await bitrixService.findContactByEmail(webhookData.email) || 
                   await bitrixService.createContact(contactData);

    // Tworzymy aktywność
    const activityData = {
      OWNER_TYPE_ID: 3, // Contact
      OWNER_ID: contact.ID,
      TYPE_ID: 4, // Email
      SUBJECT: webhookData.subject,
      DESCRIPTION: webhookData.description,
      START_TIME: webhookData.created_at,
      COMPLETED: 'Y',
      DIRECTION: 2, // Incoming
      PRIORITY: webhookData.priority || 2,
      COMMUNICATIONS: [{
        TYPE: 'EMAIL',
        VALUE: webhookData.email
      }]
    };

    const activity = await bitrixService.createActivity(activityData);

    return res.json({
      success: true,
      contactId: contact.ID,
      activityId: activity.ID
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
module.exports = handleFreshdeskWebhook;
