import validUrl from 'valid-url';
import Url from '../models/Url.js';
const PORT = process.env.PORT || 3002;

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

export const generateUrl = async (req, res) => {
  try {
    const { longUrl, customShortCode } = req.body;

    // Validation
    if (!longUrl || longUrl.trim() === '') {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    let shortCode = customShortCode && customShortCode.trim() !== '' 
      ? customShortCode.trim() 
      : generateShortCode();

    shortCode = shortCode.replace(/[^a-zA-Z0-9]/g, '');
    if (shortCode.length === 0) {
      shortCode = generateShortCode();
    }

    const existingUrl = await Url.findOne({ shortCode });
    if (existingUrl) {
      return res.status(400).json({ error: 'Short code already taken. Please choose another.' });
    }

    const newUrl = new Url({
      longUrl,
      shortCode,
      clicks: 0,
    });

    await newUrl.save();

    res.json({
      shortCode: newUrl.shortCode,
      shortUrl: `http://localhost:${PORT}/${newUrl.shortCode}`,
      longUrl: newUrl.longUrl,
      clicks: newUrl.clicks,
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export const reDirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>URL Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #dc2626; }
            a { color: #3b82f6; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>🔗 404 - Short URL not found</h1>
          <p>The short link "${shortCode}" does not exist.</p>
          <a href="http://localhost:5173">← Go to URL Shortener</a>
        </body>
        </html>
      `);
    }

    urlEntry.clicks += 1;
    await urlEntry.save();

    res.redirect(302, urlEntry.longUrl);
  } catch (error) { 
    console.error('Error redirecting:', error);
    res.status(500).send('Server error');
  }
}

export const getRecentUrls = async (req, res) => {
  try {
    const recentUrls = await Url.find().sort({ createdAt: -1 }).limit(5);
    res.json(recentUrls);
  } catch (error) {
    console.error('Error fetching recent URLs:', error);
    res.status(500).json({ error: 'Server error' });
  }
}