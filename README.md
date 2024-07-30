# Book Notes Project

## Overview

The Book Notes Project is a web application that allows users to manage their book collection, add notes to books they've read, and sort their library. Users can add new books, edit existing entries, delete books, and add personal notes for each book.

## Features

- Add new books to your collection
- Edit existing book entries
- Delete books from your collection
- Add and manage notes for each book
- View book details including cover image, title, author, and personal rating
- Sort books by title, rating, or date read

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- PostgreSQL
- HTML5
- CSS3
- JavaScript (ES6+)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v12.0.0 or higher)
- npm (usually comes with Node.js)
- PostgreSQL (v10.0 or higher)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/book-notes-project.git
cd book-notes-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

- Create a new PostgreSQL database for the project

```sql
CREATE DATABASE book_notes;
```

- Create the necessary tables:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  date_read DATE,
  rating INTEGER,
  isbn VARCHAR(13),
  review TEXT,
  amazon_link VARCHAR(255),
  img VARCHAR(255)
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Set up environment variables

Create a `.env` file in the root directory and add the following:

```
DB_USER=your_database_username
DB_HOST=localhost
DB_NAME=book_notes
DB_PASSWORD=your_database_password
DB_PORT=5432
PORT=3000
```

Replace the values with your actual database credentials.

### 5. Start the application

```bash
npm start
```

The application should now be running on `http://localhost:3000`.

## Usage

- To add a new book, click on the "Add Book" button and fill out the form.
- To view book details or add notes, click on a book's title.
- To edit or delete a book, use the respective buttons on the book's detail page.
- To sort books, use the "Sort by" dropdown menu at the top of the book list.
