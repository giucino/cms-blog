import dotenv from "dotenv";
import express, { Request, Response } from "express";
dotenv.config({
  path: "./src/.env",
});
import "express-async-errors";
import "./database/index";
import categoryRoutes from "./routes/category.routes";
import tagRoutes from "./routes/tag.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import authRoutes from "./routes/auth.routes";
import logger from "./shared/logger.util";
import { Category } from "./models/Category";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/test', authenticateJWT, (req, res) => {
//     res.json((req as any).user);
//   });

// app.get("/", async (req, res) => {
//   // @ts-ignore
//   await Category.findAlll();
//   res.send("Hello World!");
// });

app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error({
    message: err.message,
    stack: err.stack,
  });

  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Server listening at ${process.env.BACKEND_URL}`);
});
