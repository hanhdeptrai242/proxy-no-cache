const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      }
    });

    const contentType = response.headers.get('content-type') || 'text/plain';
    const body = await response.text();

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.send(body);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching target URL', details: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
