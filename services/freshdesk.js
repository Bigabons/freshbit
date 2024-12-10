// services/freshdesk.js
const axios = require('axios');
const { FRESHDESK } = require('../config/constants');

class FreshdeskService {
  constructor() {
    this.apiKey = 'fudeK2qmGxOtp73ySDFj';
    // Sprawdźmy czy mamy domenę
    if (!FRESHDESK.DOMAIN) {
      console.warn('Missing FRESHDESK_DOMAIN environment variable');
    }
    
    console.log('Initializing Freshdesk client with domain:', FRESHDESK.DOMAIN);
    
    this.client = axios.create({
      baseURL: `https://${FRESHDESK.DOMAIN}.freshdesk.com/api/v2`,
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
    console.log('Fetching ticket:', ticketId);
    try {
      const response = await this.client.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket:', {
        ticketId,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  }
}
