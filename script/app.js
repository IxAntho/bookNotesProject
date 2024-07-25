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
app.use(express.json());

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

app.get("/addbook", (req, res) => {
  res.render("addbook.ejs");
});

app.get("/bookview/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await db.getBook(bookId);
    const notes = await db.getNotes(bookId);
    res.render("bookview.ejs", { book, notes });
  } catch (error) {
    console.error(
      `Error fetching book details for id ${req.params.id}:`,
      error
    );
    res.status(404).render("error.ejs", { message: "Book not found" });
  }
});

app.post("/newNote", async (req, res) => {
  try {
    const newNote = req.body.note;
    const bookId = req.body.bookId;
    await db.addNote(newNote, bookId);
    res.redirect(`/bookview/${bookId}#notes`);
  } catch (error) {
    console.error("Error adding new note:", error);
    res.status(500).json({ success: false, message: "Failed to add note" });
  }
});

app.post("/editNote/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const newNote = req.body.content;
    console.log(newNote);
    await db.updateNote(noteId, newNote);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error updating note for id: ${noteId}`, error);
    res.status(500).json({ success: false, message: "Failed to update note" });
  }
});

app.post("/deleteNote/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    await db.deleteNote(noteId);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error deliting note for id: ${noteId}`, error);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
});

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
