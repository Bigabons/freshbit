const axios = require('axios');
const { FRESHDESK } = require('../config/constants'); // zmiana ścieżki

class FreshdeskService {
  constructor() {
    this.apiKey = 'fudeK2qmGxOtp73ySDFj';
    this.domain = 'https://amso.freshdesk.com/';
    this.client = axios.create({
      baseURL: `https://amso.freshdesk.com/api/v2`,
      auth: {
        username: this.apiKey,
        password: 'X'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getTicket(ticketId) {
    try {
      const response = await this.client.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting ticket:', {
        ticketId,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async getTicketConversations(ticketId) {
    try {
      const response = await this.client.get(`/tickets/${ticketId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error getting ticket conversations:', {
        ticketId,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async downloadAttachment(attachmentId) {
    try {
      const response = await this.client.get(`/attachments/${attachmentId}`, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading attachment:', {
        attachmentId,
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = FreshdeskService;
