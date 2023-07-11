import express, { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const router: Router = express.Router();

let articles: any = JSON.parse(fs.readFileSync("db.json", "utf-8")).articles;

router.get("/articles", async (req: Request, res: Response) => {
	try {
		res.json(articles);
	} catch (error) {
		console.error("Error fetching articles:", error);
		res.status(500).send("Error fetching articles");
	}
});

router.post("/articles", async (req: Request, res: Response) => {
	try {
		const newArticle = {
			id: uuidv4(),
			...req.body,
		};

		articles.push(newArticle);
		fs.writeFileSync("db.json", JSON.stringify({ articles }));

		res.json(newArticle);
	} catch (error) {
		console.error("Error creating article:", error);
		res.status(500).send("Error creating article");
	}
});

router.delete("/articles/:id", async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		articles = articles.filter((article: any) => article.id !== id);
		fs.writeFileSync("db.json", JSON.stringify({ articles }));

		res.json({ message: "Article deleted successfully" });
	} catch (error) {
		console.error("Error deleting article:", error);
		res.status(500).send("Error deleting article");
	}
});

export default router;
