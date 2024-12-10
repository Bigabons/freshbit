// services/freshdesk.js
const axios = require('axios');
const { FRESHDESK } = require('../config/constants');

class FreshdeskService {
  constructor() {
    this.apiKey = 'fudeK2qmGxOtp73ySDFj';
    // Dodajmy więcej logowania
    console.log('FreshdeskService configuration:', {
      domain: FRESHDESK.DOMAIN,
      baseURL: `https://${FRESHDESK.DOMAIN}.freshdesk.com/api/v2`
    });

    if (!FRESHDESK.DOMAIN) {
      throw new Error('FRESHDESK_DOMAIN environment variable is not set');
    }

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
    try {
      console.log(`Attempting to fetch ticket ${ticketId} from Freshdesk`);
      console.log(`Full URL: ${this.client.defaults.baseURL}/tickets/${ticketId}`);
      
      const response = await this.client.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Detailed error in getTicket:', {
        ticketId,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers
      });
      throw error;
    }
  }
}

const freshdeskService = new FreshdeskService();
module.exports = freshdeskService;
