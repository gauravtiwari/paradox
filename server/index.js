import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from '../dist-server/entry-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://railway.com"
  ],
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

async function createServer() {
  const app = express();
  
  // Enable CORS for development
  app.use(cors(corsOptions));
  
  // Parse JSON bodies
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/graphql', async (req, res) => {
    try {
      req.headers = {}
      const response = await fetch(process.env.VITE_RAILWAY_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_RAILWAY_API_TOKEN}`,
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('API proxy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, '../dist'), {
    index: false,
  }));

  // SSR handler
  app.get('*', async (req, res) => {
    try {
      const { appHtml, dehydratedState } = await render();
      // Read the index.html to get the correct asset filenames
      const indexPath = path.join(__dirname, '../dist/index.html');
      const indexHtml = await import('fs').then(fs => fs.readFileSync(indexPath, 'utf-8'));
      
      // Extract CSS and JS filenames from the built index.html
      const cssMatch = indexHtml.match(/href="([^"]*\.css)"/);
      const jsMatch = indexHtml.match(/src="([^"]*\.js)"/);
      
      const cssFile = cssMatch ? cssMatch[1] : '/assets/index-0tK9CJVv.css';
      const jsFile = jsMatch ? jsMatch[1] : '/assets/index-BgVJLCo8.js';
      
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Paradox - TanStack SSR</title>
            <link rel="icon" type="image/svg+xml" href="/railway.svg" />
            <link rel="stylesheet" href="${cssFile}" />
          </head>
          <body>
            <div id="root">${appHtml}</div>
            <script>
              window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
            </script>
            <script type="module" src="${jsFile}"></script>
          </body>
        </html>
      `;
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error('SSR error:', e);
      res.status(500).send('Internal Server Error');
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 SSR server running at http://localhost:${port}`);
  });
}

createServer();
