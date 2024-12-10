const CONSTANTS = {
  BITRIX: {
    WEBHOOK_URL: 'https://amso.bitrix24.pl/rest/73/audb28knfpklnuwq',
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
    API_KEY: 'fudeK2qmGxOtp73ySDFj',
    DOMAIN: 'amso',
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
