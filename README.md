# AbleWork - Backend

This is the backend of the AbleWork application. It is designed to handle various API requests and manage the database interactions. Follow the steps below to get started with the project.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v12 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (locally or using a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Installation

Follow these steps to set up the project locally:

1. **Install dependencies**:
   Run the following command to install the necessary Node.js dependencies:
   ```bash
   npm install
   ```

2. **Create a `.env` file**:
   Create a `.env` file in the root directory of the project to store sensitive information like your MongoDB connection string and JWT secret.

   Example `.env` file:
   ```
   MONGO_URL=mongodb://your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   - Replace `your_mongodb_connection_string` with your MongoDB connection URL (e.g., from MongoDB Atlas or your local database).
   - Replace `your_jwt_secret_key` with a secret key used to sign and verify JWT tokens. You can generate one using a secure random string.

3. **Start the server**:
   Once the dependencies are installed and your `.env` file is set up, run the following command to start the server:
   ```bash
   npm run dev
   ```

   The server will now be running on `http://localhost:5000` (or another port if specified in your `.env` file or configuration).

## MongoDB Database

This project relies on a MongoDB database for data storage. Ensure that your database is up and running:

- **Local MongoDB**: If you have MongoDB installed locally, make sure the MongoDB service is running.
- **MongoDB Atlas**: If you're using MongoDB Atlas, create a new database cluster, generate a connection string, and use it in your `.env` file.

## Development & Testing

- To run the application in development mode, use:
  ```bash
  npm run dev
  ```
