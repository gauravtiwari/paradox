import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import App from './App.jsx';
import { api } from './api/queries.js';

export async function render() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['projects', process.env.VITE_RAILWAY_TEAM_ID],
    queryFn: () => api.getProjects(process.env.VITE_RAILWAY_TEAM_ID),
  });

  const dehydratedState = dehydrate(queryClient);

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  return { appHtml, dehydratedState };
} 
