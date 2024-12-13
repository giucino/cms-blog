import { Router } from "express";
import {
  addTagController,
  deleteTagController,
  getPostTagsController,
  getTagBySlugController,
  getTagsController,
  updateTagController,
} from "../controllers/tag.controller";
import { authenticateJWT } from "../shared/auth.util";

const router = Router();

router.get("/", getTagsController);
router.post("/", authenticateJWT, addTagController);
router.put("/", authenticateJWT, updateTagController);
router.delete("/", authenticateJWT, deleteTagController);
router.get('/getPostTagRelations/:postId', getPostTagsController);
router.get('/getTagBySlug/:slug', getTagBySlugController);

export default router;
