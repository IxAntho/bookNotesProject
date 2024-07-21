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

// Close the database connection when the process is exiting
process.on("exit", () => {
  db.end();
});

// Close the database connection when the server is stopping
process.on("SIGINT", () => {
  db.end();
  process.exit();
});
