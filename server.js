const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: '缺少 URL 參數' });
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: '代理錯誤', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});