const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/proxy", async (req, res) => {
	const { url } = req.query;
	if (!url) return res.status(400).json({ error: "缺少 URL 參數" });

	try {
		const browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			executablePath: "/usr/bin/chromium-browser",
			// executablePath: "/usr/bin/google-chrome", // 在 Render 上使用系統 Chrome！
		});

		const page = await browser.newPage();

		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
				"(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
		);

		await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

		// 等待 Cloudflare 檢查完成（簡單 5 秒延遲）
		await page.waitForTimeout(5000);

		const content = await page.evaluate(() => document.body.innerText);
		const data = JSON.parse(content);

		await browser.close();
		res.json(data);
	} catch (err) {
		console.error("❌ puppeteer 錯誤：", err.message);
		res.status(500).json({ error: "代理錯誤", details: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
