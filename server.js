const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/proxy", async (req, res) => {
	const { url } = req.query;
	if (!url) return res.status(400).json({ error: "缺少 URL 參數" });
	try {
		const response = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
				Accept: "application/json, text/plain, */*",
				"Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
				Referer: "https://publicartap.moc.gov.tw/",
				Origin: "https://publicartap.moc.gov.tw",
				Host: "publicartap.moc.gov.tw",
			},
		});
		res.json(response.data);
	} catch (err) {
		const status = err.response?.status || 500;
		const message = err.response?.data || err.message;
		res.status(status).json({ error: "代理錯誤", details: message });
	}
});

app.listen(PORT, () => {
	console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
