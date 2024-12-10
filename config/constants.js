const CONSTANTS = {
  BITRIX: {
    WEBHOOK_URL: process.env.BITRIX_WEBHOOK_URL,
    ACTIVITY_TYPES: {
      EMAIL: 4,
      TASK: 2,
      CALL: 1
    },
    ACTIVITY_DIRECTIONS: {
      INCOMING: 2,
      OUTGOING: 1
    },
    OWNER_TYPES: {
      CONTACT: 3,
      LEAD: 1,
      DEAL: 2
    }
  },
  
  FRESHDESK: {
    API_KEY: process.env.FRESHDESK_API_KEY,
    DOMAIN: process.env.FRESHDESK_DOMAIN,
    TICKET_PRIORITIES: {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      URGENT: 4
    },
    TICKET_STATUS: {
      OPEN: 2,
      PENDING: 3,
      RESOLVED: 4,
      CLOSED: 5
    }
  },

  ERROR_CODES: {
    INVALID_WEBHOOK: 'INVALID_WEBHOOK',
    CONTACT_NOT_FOUND: 'CONTACT_NOT_FOUND',
    ACTIVITY_CREATE_FAILED: 'ACTIVITY_CREATE_FAILED'
  }
};

module.exports = CONSTANTS;
