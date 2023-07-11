import React, { useEffect, useState } from "react";
import {
	Button,
	Container,
	CssBaseline,
	Grid,
	TextField,
	Typography,
	Box,
} from "@mui/material";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import axios from "axios";
import CustomDataGrid from "./StyledDataGrid";
import { v4 as uuidv4 } from "uuid";

const columns: GridColDef[] = [
	{ field: "title", headerName: "Title", width: 250 },
	{ field: "author", headerName: "Author", width: 250 },
];

const scrapedColumns: GridColDef[] = [
	{
		field: "websiteInformation",
		headerName: "Website Information",
		width: 250,
	},
	{ field: "data", headerName: "Data", width: 250 },
];

function App() {
	const [xpathData, setXpathData] = useState<GridRowsProp>([]);
	const [scrapeData, setScrapeData] = useState<GridRowsProp>([]);
	const [jsonData, setJsonData] = useState<GridRowsProp>([]);
	const [inputTitle, setInputTitle] = useState("");
	const [inputAuthor, setInputAuthor] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [lastGridData, setLastGridData] = useState<GridRowsProp>([]);
	const [deleteTitle, setDeleteTitle] = useState<string>("");

	useEffect(() => {
		const fetchScrapedData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3001/scrape",
				);
				const data = response.data["@graph"];

				const newsArticle = data.find(
					(item: any) => item["@type"] === "NewsArticle",
				);
				if (!newsArticle) {
					console.error("No NewsArticle object found in the data.");
					return;
				}

				const formattedData = [
					{
						id: 1,
						websiteInformation: "Webpage URL",
						data: newsArticle["@id"],
					},
					{
						id: 2,
						websiteInformation: "Headline",
						data: newsArticle.headline,
					},
					{
						id: 3,
						websiteInformation: "Date Published",
						data: newsArticle.datePublished,
					},
				];

				setScrapeData(formattedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchScrapedData();
	}, []);

	const handleButtonClick = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3001/scrape/xpath",
			);
			const data = response.data;

			const rows = data.map((item: any, index: number) => ({
				id: index,
				title: item.title,
				author: item.author,
			}));

			setXpathData(rows);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputTitle(event.target.value);
	};

	const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputAuthor(event.target.value);
	};

	const handleJsonButtonClick = async () => {
		if (!inputTitle || !inputAuthor) {
			setErrorMessage("Completati ambele campuri!");
			return;
		}

		try {
			const newArticle = {
				id: uuidv4(),
				title: inputTitle,
				author: inputAuthor,
			};

			await axios.post("http://localhost:4000/articles", newArticle);

			setInputTitle("");
			setInputAuthor("");
			setErrorMessage("");

			const response = await axios.get("http://localhost:4000/articles");
			const data = response.data;

			const formattedData = data.map((item: any) => ({
				id: item.id || uuidv4(),
				title: item.title,
				author: item.author,
			}));

			setJsonData(formattedData);

			for (let article of xpathData) {
				const formattedArticle = {
					id: uuidv4(),
					title: article.title,
					author: article.author,
				};

				await axios.post(
					"http://localhost:4000/articles",
					formattedArticle,
				);
			}

			const responseAfterScraping = await axios.get(
				"http://localhost:4000/articles",
			);
			const dataAfterScraping = responseAfterScraping.data;

			const formattedDataAfterScraping = dataAfterScraping.map(
				(item: any) => ({
					id: item.id || uuidv4(),
					title: item.title,
					author: item.author,
				}),
			);

			setJsonData(formattedDataAfterScraping);
		} catch (error) {
			console.error("Error adding data:", error);
		}
	};

	const handleDeleteTitleChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setDeleteTitle(event.target.value);
	};

	const handleFindButtonClick = async () => {
		try {
			const response = await axios.get("http://localhost:4000/articles");
			const allArticles = response.data;

			const article = allArticles.find(
				(item: any) => item.title === deleteTitle,
			);

			if (article) {
				await axios.delete(
					`http://localhost:4000/articles/${article.id}`,
				);
			}

			const updatedResponse = await axios.get(
				"http://localhost:4000/articles",
			);
			const updatedData = updatedResponse.data;

			const formattedData = updatedData.map((item: any) => ({
				id: item.id || uuidv4(),
				title: item.title,
				author: item.author,
			}));

			setLastGridData(formattedData);
		} catch (error) {
			console.error("Error deleting article:", error);
		}
	};

	return (
		<React.Fragment>
			<CssBaseline />
			<Container>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					textAlign={"center"}
					mt={5}
				>
					Web Semantic Project
				</Typography>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="space-around"
					width="100%"
				>
					<Container>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Typography variant="h6">Tabel 1</Typography>
								<CustomDataGrid
									rows={scrapeData}
									columns={scrapedColumns}
									onButtonClick={() => {
										return 0;
									}}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="h6">Tabel 2</Typography>
								<CustomDataGrid
									rows={xpathData}
									columns={columns}
									onButtonClick={handleButtonClick}
								/>
							</Grid>
							<Grid mt={5} item xs={12}>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									onClick={handleButtonClick}
								>
									Button 1 (scraping + afișare)
								</Button>
							</Grid>
						</Grid>
					</Container>
					<Container style={{ marginTop: "3rem" }}>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Typography variant="h6">Formular 1</Typography>
								<form>
									<Box
										display="flex"
										flexDirection="column"
										gap={2}
									>
										<TextField
											label="Câmp1"
											value={inputTitle}
											onChange={handleTitleChange}
										/>
										<TextField
											label="Câmp2"
											value={inputAuthor}
											onChange={handleAuthorChange}
										/>
										<Button
											fullWidth
											variant="contained"
											color="primary"
											onClick={handleJsonButtonClick}
										>
											Buton 2 (inserare în server 1 +
											reafișare)
										</Button>
										{errorMessage && (
											<Typography
												color="error"
												variant="body2"
												mt={1}
											>
												{errorMessage}
											</Typography>
										)}
									</Box>
								</form>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="h6">Tabel 3</Typography>
								<CustomDataGrid
									rows={jsonData}
									columns={columns}
									onButtonClick={handleJsonButtonClick}
								/>
							</Grid>
						</Grid>
					</Container>
					{/* <Container
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginBottom: "3rem",
						}}
					>
						<Box mt={5} mb={5}>
							<Button
								fullWidth
								variant="contained"
								color="primary"
							>
								Buton 3 (inserare + reafișare)
							</Button>
						</Box>
						<Typography variant="h6">Tabel 3</Typography>
						<CustomDataGrid
							rows={rows}
							columns={columns}
							onButtonClick={() => {
								return 0;
							}}
						/>
					</Container> */}
					<Container
						style={{
							marginTop: "3rem",
							marginBottom: "3rem",
						}}
					>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Typography variant="h6">Formular 2</Typography>
								<form>
									<Box
										display="flex"
										flexDirection="column"
										gap={2}
									>
										<TextField
											label="Title to delete"
											value={deleteTitle}
											onChange={handleDeleteTitleChange}
										/>
										<Button
											fullWidth
											variant="contained"
											color="primary"
											onClick={handleFindButtonClick}
										>
											Buton 4 (Ștergere + afișare)
										</Button>
									</Box>
								</form>
							</Grid>
							<Grid item xs={12} md={6} pl={10}>
								<Typography variant="h6">Tabel 4</Typography>
								<CustomDataGrid
									rows={lastGridData}
									columns={columns}
									onButtonClick={() => {
										return 0;
									}}
								/>
							</Grid>
						</Grid>
					</Container>
				</Box>
			</Container>
		</React.Fragment>
	);
}

export default App;
