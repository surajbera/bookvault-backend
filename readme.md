# BookVault Backend API

## Introduction

BookVault is a backend service designed to manage a digital library of books. It provides secure
access to book resources, including the ability to upload, retrieve, update, and delete book
entries. This service was developed using TypeScript, marking my first endeavor in building a
backend entirely in this language. The project is intended for developers looking to integrate book
management functionalities into their applications, leveraging TypeScript for more reliable and
maintainable code.

## Getting Started

To get started with the BookVault backend, clone this repository and install the necessary
dependencies.

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account for file storage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/surajbera/bookvault-backend.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in a .env file:

   ```txt
   PORT=xxx
   MONGO_CONNECTION_STRING=mongodb://localhost:27017/bookvault_backend
   NODE_ENV=development
   SALT_ROUNDS=8
   JWT_SECRET=xxxx
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```

4. Running the Application Run the server using:

   ```bash
   npm run dev
   ```

## API Endpoints

### User Endpoints

#### Register

- **URL**: /api/users/register
- **Method**: POST
- **Description**: Register a new user.
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

#### Login

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Description:** Authenticate users and return a token.
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

### Book Endpoints

#### Get All Books:

- **URL**: /api/books
- **Method**: GET
- **Description**: Retrieve all books in the database.

#### Get a Single Book:

- **URL**: /api/books/{bookId}
- **Method**: GET
- **Description**: Retrieve details of a specific book by ID.

#### Create a Book:

- **URL**: /api/books
- **Method**: POST
- **Description**: Add a new book to the database. Requires authentication.
- **Body**:
  ```json
  {
    "title": "New Book Title",
    "genre": "Fiction",
    "coverImage": "file",
    "bookFile": "file"
  }
  ```

#### Update a Book:

- **URL**: /api/books/{bookId}
- **Method**: PUT
- **Description**: Update details of an existing book. Requires authentication.
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "genre": "Non-Fiction",
    "coverImage": "file",
    "bookFile": "file"
  }
  ```

#### Delete a Book:

- **URL**: /api/books/{bookId}
- **Method**: DELETE
- **Description**: Remove a book from the database. Requires authentication
