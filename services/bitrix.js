const axios = require('axios');
const { BITRIX } = require('../config/constants'); // zmiana ścieżki

class BitrixService {
  constructor() {
    this.webhookUrl = "https://amso.bitrix24.pl/rest/73/wv8r8q74pxb5emue/";
  }

  async findContactByEmail(email) {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.contact.list`, {
        filter: { 'EMAIL': email },
        select: ['ID', 'NAME', 'LAST_NAME', 'EMAIL', 'PHONE']
      });
      
      return response.data.result[0] || null;
    } catch (error) {
      console.error('Error finding contact:', {
        email,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async createContact(contactData) {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.contact.add`, {
        fields: contactData
      });
      
      return { ID: response.data.result };
    } catch (error) {
      console.error('Error creating contact:', {
        contactData,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async createActivity(activityData) {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.activity.add`, {
        fields: {
          ...activityData,
          COMMUNICATIONS: [
            {
              VALUE: activityData.EMAIL,
              TYPE: 'EMAIL'
            }
          ]
        }
      });
      
      return { ID: response.data.result };
    } catch (error) {
      console.error('Error creating activity:', {
        activityData,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async uploadActivityFile(fileData, activityId) {
    // Implementacja uploadu plików do Bitrixa
    // To zaimplementujemy w następnym kroku
  }
}

module.exports = BitrixService;
