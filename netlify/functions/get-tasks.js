const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Check for authenticated user from Netlify Identity
  const userId = context.clientContext && context.clientContext.user ? context.clientContext.user.sub : null;
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Authentication required' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const store = getStore("tasks");
    
    // Use the authenticated user ID as the key for storage
    await store.set(userId, JSON.stringify(data));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true, userId: userId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
