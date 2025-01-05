import { Router } from "express";
import {
  addPostController,
  deletePostController,
  getAdminPostsController,
  getPostBySlugController,
  getPublicPostsController,
  updatePostController,
} from "../controllers/post.controller";
import { authenticateJWT, authenticateJWTOptional } from "../shared/auth.util";

const router = Router();
router.get("/public", authenticateJWTOptional, getPublicPostsController);
router.get("/admin", authenticateJWT, getAdminPostsController);
router.get("/slug/:slug", getPostBySlugController);
router.post("/", authenticateJWT, addPostController);
router.put("/", authenticateJWT, updatePostController);
router.delete("/", authenticateJWT, deletePostController);

export default router;
