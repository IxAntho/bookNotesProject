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

export const addBook = async (
  title,
  author,
  dateRead,
  rating,
  isbn = 123456789,
  bookReview,
  aLink = "#"
) => {
  try {
    const query =
      "INSERT INTO books (title, author, date_read, rating, ISBN, review, amazon_link) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    await db.query(query, [
      title,
      author,
      dateRead,
      rating,
      isbn,
      bookReview,
      aLink,
    ]);
  } catch (error) {
    console.error("Error trying to add a new book", error);
    throw new Error("Failed to add book");
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
