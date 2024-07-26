import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

export const getAllBooks = async () => {
  try {
    const query = "SELECT * FROM books ORDER BY id ASC";
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    throw new Error("Failed to fetch books");
  }
};

export const getBook = async (id) => {
  try {
    const query = "SELECT * FROM books WHERE id = $1";
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error("Book not found");
    }
    return result.rows[0];
  } catch (error) {
    console.error(`Error in getBook for id ${id}:`, error);
    throw error;
  }
};

export const addBook = async (book, img) => {
  try {
    const {
      title,
      author,
      dateRead,
      rating,
      isbn = "123456789",
      bookReview,
      aLink = "#",
    } = book;
    const query =
      "INSERT INTO books (title, author, date_read, rating, ISBN, review, amazon_link, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    await db.query(query, [
      title,
      author,
      dateRead,
      rating,
      isbn,
      bookReview,
      aLink,
      img,
    ]);
  } catch (error) {
    console.error("Error trying to add a new book", error);
    throw new Error("Failed to add book");
  }
};

export const updateBook = async (bookId, updatedBook) => {
  try {
    const { title, author, dateRead, rating, isbn, bookReview, aLink } =
      updatedBook;

    let query = "UPDATE books SET ";
    const updateFields = [];
    const values = [];
    let paramCounter = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCounter}`);
      values.push(title);
      paramCounter++;
    }
    if (author !== undefined) {
      updateFields.push(`author = $${paramCounter}`);
      values.push(author);
      paramCounter++;
    }
    if (dateRead !== undefined) {
      updateFields.push(`date_read = $${paramCounter}`);
      values.push(dateRead);
      paramCounter++;
    }
    if (rating !== undefined) {
      updateFields.push(`rating = $${paramCounter}`);
      values.push(rating);
      paramCounter++;
    }
    if (isbn !== undefined) {
      updateFields.push(`isbn = $${paramCounter}`);
      values.push(isbn);
      paramCounter++;
    }
    if (bookReview !== undefined) {
      updateFields.push(`review = $${paramCounter}`);
      values.push(bookReview);
      paramCounter++;
    }
    if (aLink !== undefined) {
      updateFields.push(`amazon_link = $${paramCounter}`);
      values.push(aLink);
      paramCounter++;
    }

    if (updateFields.length === 0) {
      return; // No fields to update
    }

    query += updateFields.join(", ");
    query += ` WHERE id = $${bookId}`;

    await db.query(query, values);
  } catch (error) {
    console.error(`Error updating book with id ${bookId}:`, error);
    throw new Error("Failed to update book");
  }
};

export const deleteBook = (bookId) => {
  try {
    const query = "DELETE FROM books WHERE id = $1";
    db.query(query, [bookId]);
  } catch (error) {
    console.error(`Error deleting book for noteId ${bookId}`, error);
    throw new Error("Failed to delete book");
  }
};

export const getNotes = async (bookId) => {
  try {
    const query = "SELECT * FROM notes WHERE book_id = $1";
    const result = await db.query(query, [bookId]);
    return result.rows;
  } catch (error) {
    console.error(`Error in getNotes for bookId ${bookId}:`, error);
    throw new Error("Failed to fetch notes");
  }
};

export const addNote = async (newNote, bookId) => {
  try {
    const query = "INSERT INTO notes (note, book_id) VALUES ($1, $2)";
    await db.query(query, [newNote, bookId]);
  } catch (error) {
    console.error("Error trying to add a new note", error);
    throw new Error("Failed to add notes");
  }
};

export const updateNote = async (noteId, newNote) => {
  try {
    const query = "UPDATE notes SET note = $1 WHERE id = $2";
    await db.query(query, [newNote, noteId]);
  } catch (error) {
    console.error(`Error in updateNote for noteId ${noteId}:`, error);
    throw new Error("Failed to update note");
  }
};

export const deleteNote = async (noteId) => {
  try {
    const query = "DELETE FROM notes WHERE id = $1";
    await db.query(query, [noteId]);
  } catch (error) {
    console.error(`Error deleting note for noteId ${noteId}`, error);
    throw new Error("Failed to delete note");
  }
};

// Close the database connection when the process is exiting
process.on("exit", () => {
  db.end();
});

// Close the database connection when the server is stopping
process.on("SIGINT", () => {
  db.end();
  process.exit();
});
