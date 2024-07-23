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
  const result = await db.query("SELECT * FROM books ORDER BY title");
  return result.rows;
};

export const getBook = async (id) => {
  const result = await db.query(`SELECT * FROM books WHERE books.id = ${id}`);
  return result.rows[0];
};

export const getNotes = async (bookId) => {
  const result = await db.query(
    `SELECT * FROM notes WHERE book_id = ${bookId}`
  );
  return result.rows;
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
