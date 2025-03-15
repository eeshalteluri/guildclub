import dotenv from "dotenv"

dotenv.config()

const { 
    PORT, 
    MONGODB_URI, 
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    NODE_ENV
} = process.env


if (!MONGODB_URI || !JWT_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !NODE_ENV) {
    throw new Error("Missing required environment variables");
  }


export { PORT, MONGODB_URI, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV }

