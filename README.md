# AbleWork - Backend

This is the backend of the AbleWork application. It is designed to handle various API requests and manage database interactions. Follow the steps below to get started with the project.

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
   Create a `.env` file in the root directory of the project to store sensitive information like your MongoDB connection string, JWT secret, and other configuration details.

   Example `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   PORT=8080
   AI_API=http://localhost:5000/
   ```

   - Replace `aaaa` with the appropriate values:
     - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas or your local MongoDB instance).
     - `JWT_SECRET`: A secret key used to sign and verify JWT tokens (use a secure random string).
     - `HUGGINGFACE_API_KEY`: Your Hugging Face API key.
     - `PORT`: The port on which your backend will run (default is `8080`).
     - `AI_API`: The URL to AI API (default is `http://localhost:5000/`).

3. **Start the server**:
   Once the dependencies are installed and your `.env` file is set up, run the following command to start the server:
   ```bash
   npm run dev
   ```

   The server will now be running on `http://localhost:8080` (or another port if specified in your `.env` file or configuration).

## MongoDB Database

This project relies on a MongoDB database for data storage. Ensure that your database is up and running:

- **Local MongoDB**: If you have MongoDB installed locally, make sure the MongoDB service is running.
- **MongoDB Atlas**: If you're using MongoDB Atlas, create a new database cluster, generate a connection string, and use it in your `.env` file.

## Development & Testing

- To run the application in development mode, use:
  ```bash
  npm run dev
  ```

## Additional Configuration

You might need to set up additional services such as Hugging Face, AI APIs, or any other integrations your application depends on. Follow the respective service's setup guides for API keys and configurations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This update includes the new environment variables (`MONGO_URI`, `JWT_SECRET`, `HUGGINGFACE_API_KEY`, `PORT`, and `AI_API`). Let me know if you need further modifications!
