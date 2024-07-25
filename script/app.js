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

app
  .route("/addbook")
  .get((req, res) => {
    try {
      res.render("addbook.ejs");
    } catch (error) {
      console.error("Failed to render tempalte", error);
      res.status(404).send("Error render template");
    }
  })
  .post(async (req, res) => {
    try {
      const title = req.body.name;
      const author = req.body.author;
      const dateRead = req.body.dateRead;
      const rating = req.body.recommendation;
      const isbn = req.body.isbn;
      const bookReview = req.body.summary;
      const aLink = req.body.amazonLink;
      // add a new column to books called img, to add there the link for the book covers api
      // Also check if ths isbn is null to display a general cover for books without an isbn
      await db.addBook(
        title,
        author,
        dateRead,
        rating,
        isbn,
        bookReview,
        aLink
      );
      res.redirect("/");
    } catch (error) {
      console.error("Error adding a new book: ", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to add book" })
        .redirect("/");
    }
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
    res
      .status(404)
      .json({ success: false, message: "Failed to render template" })
      .redirect("/");
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
