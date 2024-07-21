import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import path from "path";
import { fileURLToPath } from "url";

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
  await res.render("index.ejs");
});

app.get("/addbook", async (req, res) => {
  await res.render("addbook.ejs");
});

app.get("/notes", async (req, res) => {
  await res.render("bookview.ejs");
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
