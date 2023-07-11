import express from "express";
import webScrapingRouter from "./routes/webScraping";
import cors from "cors";

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/scrape", webScrapingRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
