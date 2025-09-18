exports.handler = async (event) => {
  const { getStore } = await import("@netlify/blobs");
  
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const store = getStore("tasks");
    const userId = event.queryStringParameters?.userId || 'default-user';
    
    const data = await store.get(userId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: data || JSON.stringify({ tasks: [], weeklyPlans: [], completedTasks: [] })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};