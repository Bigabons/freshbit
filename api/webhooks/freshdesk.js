// webhook-handler.js

const BitrixService = require('./services/bitrix');
const FreshdeskService = require('./services/freshdesk'); 

class WebhookHandler {
  constructor() {
    this.bitrixService = new BitrixService();
    this.freshdeskService = new FreshdeskService();
  }

  async handleTicketCreate(webhookData) {
    try {
      // Wyciągnij dane z webhooka
      const {
        ticket_id,
        email,
        subject,
        description,
        attachments,
        created_at
      } = webhookData;

      // Znajdź kontakt w Bitrixie po emailu
      const contact = await this.bitrixService.findContactByEmail(email);
      
      if(!contact) {
        // Stwórz nowy kontakt jeśli nie istnieje
        const contactData = {
          EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
          TYPE_ID: 'CLIENT',
          SOURCE_ID: 'FRESHDESK'
        };
        
        const newContact = await this.bitrixService.createContact(contactData);
        contactId = newContact.ID;
      } else {
        contactId = contact.ID;
      }

      // Dodaj aktywność do kontaktu w Bitrixie
      const activityData = {
        OWNER_TYPE_ID: 3, // Contact
        OWNER_ID: contactId,
        TYPE_ID: 4, // Email
        SUBJECT: subject,
        DESCRIPTION: description,
        START_TIME: created_at,
        COMPLETED: 'Y',
        DIRECTION: 2, // Incoming
        SETTINGS: {
          EMAIL: {
            TICKET_ID: ticket_id,
            SOURCE: 'FRESHDESK'
          }
        }
      };

      await this.bitrixService.createActivity(activityData);

      // Obsłuż załączniki
      if(attachments && attachments.length > 0) {
        for(const attachment of attachments) {
          const fileData = await this.freshdeskService.downloadAttachment(attachment.id);
          await this.bitrixService.uploadActivityFile(fileData, activityId);
        }
      }

      return {
        success: true,
        contactId,
        activityId  
      };

    } catch(error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }
}

module.exports = WebhookHandler;
