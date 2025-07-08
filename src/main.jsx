import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.jsx'

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser.js')
  worker.start()
}

const dehydratedState = window.__REACT_QUERY_STATE__

const queryClient = new QueryClient()

import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root'))

root.render(
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </HydrationBoundary>
  </QueryClientProvider>
) 
