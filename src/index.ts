import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
const db = require("./config/db");

const authRoutes = require("./routes/Auth.routes");
const accountRoutes = require("./routes/Account.routes");
const logRoutes = require("./routes/Log.routes");
const partnerRoutes = require("./routes/Partner.routes");
dotenv.config();
db.connectDB();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Michelle 2</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
  
          .container {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
          }
  
          h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
          }
  
          p {
            color: #777;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Michelle 2 Apple Developer Academy Endpoint</h1>
          <p>Unauthorized access is strictly prohibited!</p>
        </div>
      </body>
      </html>
      `;
  res.send(htmlResponse);
});

// Routes
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use("/log", logRoutes);
app.use("/partner", partnerRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});

export default app;
