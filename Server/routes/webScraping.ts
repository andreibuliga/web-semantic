import { Request, Response, Router } from "express";
import puppeteer from "puppeteer";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto(
			"https://www.searchenginejournal.com/upgrade-to-json-ld-structured-data/319327/",
		);

		const jsonLdData = await page.$eval(
			"script[type='application/ld+json']",
			(el) => el.innerHTML,
		);

		await browser.close();
		res.send(jsonLdData);
	} catch (error) {
		console.error("Error scraping data:", error);
		res.status(500).send("Error scraping data");
	}
});

router.get("/xpath", async (req: Request, res: Response) => {
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto("https://www.smashingmagazine.com/articles/");

		const titleElements = await page.$x(
			"//h2[contains(@class, 'article--post__title')]/a",
		);
		const titles = await Promise.all(
			titleElements.map((element) =>
				element
					.getProperty("textContent")
					.then((prop) => prop.jsonValue()),
			),
		);

		const authorElements = await page.$x(
			"//span[contains(@class, 'article--post__author')]/a",
		);
		const authors = await Promise.all(
			authorElements.map((element) =>
				element
					.getProperty("textContent")
					.then((prop) => prop.jsonValue()),
			),
		);

		const records = titles
			.slice(0, 3)
			.map((title, index) => ({ title, author: authors[index] }));

		await browser.close();

		res.json(records);
	} catch (error) {
		console.error("Error scraping data:", error);
		res.status(500).send("Error scraping data");
	}
});

export default router;
