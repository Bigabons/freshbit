const axios = require('axios');
const { BITRIX } = require('../config/constants');

class BitrixService {
  constructor() {
    this.webhookUrl = BITRIX.WEBHOOK_URL;
    console.log('BitrixService initialized with URL:', this.webhookUrl);
  }
  
  findContactByEmail = async (email) => {
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

  createContact = async (fields) => {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.contact.add`, { fields });
      return { ID: response.data.result };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  createActivity = async (fields) => {
    try {
      const response = await axios.post(`${this.webhookUrl}/crm.activity.add`, {
        fields: { ...fields, CREATED_BY: 1 }
      });
      return response.data.result;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }
}

module.exports = new BitrixService();
