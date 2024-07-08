import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file path and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config();
// const password = process.env.PASSWORD;

const app = express();
const port = 3000;

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "U-postgres",
//   password: `${password}`,
//   port: 5432,
// });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the correct path for static files
const publicPath = path.join(__dirname, "..", "public");
app.use("/public", express.static(publicPath));

// Debugging middleware
app.use((req, res, next) => {
  console.log("Requested URL:", req.url);
  console.log(
    "File path:",
    path.join(publicPath, req.url.replace("/public", ""))
  );
  next();
});

app.get("/", async (req, res) => {
  await res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});

// // Close the database connection when the process is exiting
// process.on("exit", () => {
//   db.end();
// });

// // Close the database connection when the server is stopping
// process.on("SIGINT", () => {
//   db.end();
//   process.exit();
// });
