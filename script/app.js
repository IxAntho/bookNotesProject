import express from "express";
import bodyParser from "body-parser";
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
      res.render("addbook.ejs", { book: null });
    } catch (error) {
      console.error("Failed to render tempalte", error);
      res.status(404).send("Error render template");
    }
  })
  .post(async (req, res) => {
    try {
      const book = {
        title: req.body.name,
        author: req.body.author,
        dateRead: req.body.dateRead,
        rating: req.body.recommendation,
        isbn: `${req.body.isbn}`,
        bookReview: req.body.summary,
        aLink: req.body.amazonLink,
      };

      const img = `https://covers.openlibrary.org/b/isbn/${book.isbn}-S.jpg?default=false`;
      await db.addBook(book, img);
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

app
  .route("/editBook/:id")
  .get(async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await db.getBook(bookId);
      res.render("addbook.ejs", { book: book });
    } catch (error) {
      console.error("Error fetching book for editing:", error);
      res.status(500).send("Error fetching book for editing");
    }
  })
  .post(async (req, res) => {
    try {
      const bookId = req.params.id;

      // First, fetch the existing book data
      const existingBook = await db.getBook(bookId);

      if (!existingBook) {
        throw new Error("Book not found");
      }

      const updatedBook = {};

      // Compare each field and only add to updatedBook if changed
      if (req.body.name !== existingBook.title)
        updatedBook.title = req.body.name;
      if (req.body.author !== existingBook.author)
        updatedBook.author = req.body.author;
      if (req.body.dateRead !== existingBook.date_read)
        updatedBook.dateRead = req.body.dateRead;
      if (req.body.recommendation !== existingBook.rating.toString())
        updatedBook.rating = req.body.recommendation;
      if (req.body.isbn !== existingBook.isbn) updatedBook.isbn = req.body.isbn;
      if (req.body.summary !== existingBook.review)
        updatedBook.bookReview = req.body.summary;
      if (req.body.amazonLink !== existingBook.amazon_link)
        updatedBook.aLink = req.body.amazonLink;

      // Only update the image if ISBN has changed
      let img;
      if (req.body.isbn !== existingBook.isbn) {
        img = `https://covers.openlibrary.org/b/isbn/${req.body.isbn}-S.jpg?default=false`;
      }

      // Only call updateBook if there are changes
      if (Object.keys(updatedBook).length > 0 || img !== undefined) {
        await db.updateBook(bookId, updatedBook, img);
      }

      res.redirect(`/bookview/${bookId}`);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).send(`Error updating book: ${error.message}`);
    }
  });

app.post("/deleteBook/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.deleteBook(bookId);
    res.redirect("/");
  } catch (error) {
    console.error(`Error deliting book for id: ${noteId}`, error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete book" })
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
