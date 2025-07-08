// Use server proxy in production, direct API in development
const API_URL = typeof window === 'undefined'
  ? process.env.VITE_RAILWAY_GRAPHQL_ENDPOINT
  : '/api/graphql';

export async function graphqlRequest(query, variables = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Only add Authorization header on server-side (direct to Railway)
  if (typeof window === 'undefined') {
    headers.Authorization = `Bearer ${process.env.VITE_RAILWAY_API_TOKEN}`;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }
    return data;
  } catch (err) {
    if (typeof window === 'undefined') {
      console.error('GRAPHQL ERROR:', err);
    }
    throw err;
  }
} 
