import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import * as db from "./db.js";

// Get the current file path and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

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
  try {
    const books = await db.getAllBooks();
    console.log(books);

    res.render("index.ejs", { books: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error fetching books");
  }
});

app.get("/addbook", async (req, res) => {
  await res.render("addbook.ejs");
});

app.get("/bookview/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await db.getBook(bookId);
    const notes = await db.getNotes(bookId);
    res.render("bookview.ejs", { book: book, notes: notes });
  } catch (error) {
    console.log("error: ", error);
  }
});

app.post("/notes", async (req, res) => {
  const newNote = req.body.app;
});

// app.post("/editNote/:id", (req, res) => {
//   const noteId = req.params.id;
//   const newContent = req.body.content;
//   // Update the note in your database
//   // ...

//   res.json({ success: true });
// });

// app.post("/deleteNote/:id", (req, res) => {
//   const noteId = req.params.id;
//   // Delete the note from your database
//   // ...

//   res.json({ success: true });
// });

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
