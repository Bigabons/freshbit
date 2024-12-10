// services/bitrix.js
const axios = require('axios');
const { BITRIX } = require('../config/constants');

class BitrixService {
  constructor() {
    this.webhookUrl = BITRIX.WEBHOOK_URL;
  }

  async findContactByEmail(email) {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.contact.list`, {
        filter: { 'EMAIL': email },
        select: ['ID', 'NAME', 'EMAIL']
      });
      return response.data.result[0];
    } catch (error) {
      console.error('Error finding contact:', error);
      throw error;
    }
  }

  async createContact(fields) {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.contact.add`, {
        fields
      });
      return { ID: response.data.result };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async createActivity(fields) {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.activity.add`, {
        fields: {
          ...fields,
          CREATED_BY: 1
        }
      });
      return response.data.result;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }
}

module.exports = new BitrixService();
