const handleFreshdeskWebhook = require('./webhooks/freshdesk');


module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    switch (pathname) {
      case '/webhook/freshdesk/ticket':
        return await handleFreshdeskWebhook(req, res);
      default:
        return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Webhook handler error:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
};
