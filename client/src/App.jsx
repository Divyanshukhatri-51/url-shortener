// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link2, Copy, Check, AlertCircle, TrendingUp, Clock } from 'lucide-react';

const API_URL = 'http://localhost:3002/api';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRecentUrls();
  }, []);

  const fetchRecentUrls = async () => {
    try {
      const response = await axios.get(`${API_URL}/recent`);
      setRecentUrls(response.data);
    } catch (err) {
      console.error('Error fetching recent URLs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);
    setLoading(true);

    if (!longUrl.trim()) {
      setError('Please enter a long URL');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/shorten`, {
        longUrl: longUrl.trim(),
        customShortCode: customShortCode.trim(),
      });

      setShortUrl(response.data.shortUrl);
      setLongUrl('');
      setCustomShortCode('');
      fetchRecentUrls();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Something went wrong';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFullShortUrl = (shortCode) => {
    return `http://localhost:3002/${shortCode}`;
  };

  const handleLinkClick = (shortCode) => {
    setRecentUrls(prevUrls =>
      prevUrls.map(url =>
        url.shortCode === shortCode ? { ...url, clicks: url.clicks + 1 } : url
      )
    );
    setTimeout(fetchRecentUrls, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
            <Link2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">URL Shortener</h1>
          <p className="text-blue-100 text-lg">Transform long URLs into short, shareable links</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Long URL Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Long URL *
              </label>
              <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Custom Short Code Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Short URL (optional)
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-500 transition-colors">
                <span className="px-4 py-3 bg-gray-50 text-gray-600 text-sm border-r-2 border-gray-200">
                  localhost:3002/
                </span>
                <input
                  type="text"
                  value={customShortCode}
                  onChange={(e) => setCustomShortCode(e.target.value)}
                  placeholder="my-custom-link"
                  className="flex-1 px-4 py-3 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only letters and numbers allowed. Leave empty for auto-generated code.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Shortening...</span>
                </div>
              ) : (
                'Shorten URL ✨'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Result Card */}
          {shortUrl && (
            <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <h3 className="text-sm font-semibold text-green-800 mb-3">✅ Your Short URL is ready!</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    const code = shortUrl.split('/').pop();
                    if (code) handleLinkClick(code);
                  }}
                  className="flex-1 text-purple-600 font-medium hover:text-purple-700 underline break-all"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent URLs Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Recently Shortened</h2>
          </div>

          {recentUrls.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-blue-200 mx-auto mb-4" />
              <p className="text-blue-100">No URLs shortened yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUrls.map((url) => (
                <div key={url._id} className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <a
                        href={getFullShortUrl(url.shortCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick(url.shortCode)}
                        className="text-purple-600 font-medium hover:text-purple-700 underline block truncate"
                      >
                        {getFullShortUrl(url.shortCode)}
                      </a>
                      <p className="text-sm text-gray-500 mt-1 truncate" title={url.longUrl}>
                        {url.longUrl.length > 60 ? url.longUrl.substring(0, 60) + '...' : url.longUrl}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-gray-700">👆 {url.clicks}</span>
                      <span className="text-xs text-gray-500">clicks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;