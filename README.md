# Railway Deployment Dashboard

A simple React app for managing Railway deployments with GraphQL.

## Tech Stack
- React 18
- TypeScript
- Vite
- TanStack Query (React Query)
- Tailwind CSS

## Setup
1. Clone the repo
   ```bash
   git clone <repository-url>
   cd paradox
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up your `.env` file:
   ```env
   VITE_RAILWAY_API_TOKEN=your_token
   VITE_RAILWAY_GRAPHQL_ENDPOINT=https://backboard.railway.app/graphql/v2
   VITE_RAILWAY_TEAM_ID=your_team_id
   ```
4. Start the dev server
   ```bash
   npm run dev:ssr
   ```

## Usage
- Create and manage Railway projects and services
- Deploy and view status in real time

## License
MIT
