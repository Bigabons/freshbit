const bitrixService = require('../../services/bitrix');
const freshdeskService = require('../../services/freshdesk');

async function handleFreshdeskWebhook(req, res) {
  try {
    const webhookData = req.body;
    console.log('Webhook data:', webhookData);

    const contactData = {
      EMAIL: [{ VALUE: webhookData.email, VALUE_TYPE: 'WORK' }],
      NAME: webhookData.requester_name || '',
      TYPE_ID: 'CLIENT',
      SOURCE_ID: 'FRESHDESK'
    };

    let contact = await bitrixService.findContactByEmail(webhookData.email);
    if (!contact) {
      contact = await bitrixService.createContact(contactData);
    }

    const activityData = {
      OWNER_TYPE_ID: 3,
      OWNER_ID: contact.ID,
      TYPE_ID: 4,
      SUBJECT: webhookData.subject,
      DESCRIPTION: webhookData.description,
      START_TIME: webhookData.created_at,
      COMPLETED: 'Y',
      DIRECTION: 2,
      COMMUNICATIONS: [{
        TYPE: 'EMAIL',
        VALUE: webhookData.email
      }]
    };

    const activityId = await bitrixService.createActivity(activityData);

    return res.json({
      success: true,
      contactId: contact.ID,
      activityId
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handleFreshdeskWebhook;
