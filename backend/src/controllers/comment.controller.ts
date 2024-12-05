import { Request, Response } from "express";
import { z } from "zod";
import { getPostById } from "../services/post.service";
import {
  addComment,
  deleteComment,
  getCommentById,
  getPostComments,
  updateComment,
} from "../services/comment.service";

export const getPostCommentsController = async (
  req: Request,
  res: Response
) => {
  const schema = z.object({
    postId: z.number(),
  });

  const safeData = schema.safeParse({
    postId: parseInt(req.params.postId),
  });

  if (!safeData.success) {
    res.status(400).json(safeData.error);
    return;
  }

  const { postId } = safeData.data;

  const post = await getPostById(postId);

  if (!post) {
    res.status(400).json({ message: "Invalid post id" });
    return;
  }

  const comments = await getPostComments(postId);

  res.json(comments);
  return;
};

export const addCommentController = async (req: Request, res: Response) => {
  const schema = z.object({
    postId: z.number(),
    content: z.string(),
  });

  const safeData = schema.safeParse(req.body);
  if (!safeData.success) {
    res.status(400).json(safeData.error);
    return;
  }

  const { postId, content } = safeData.data;
  const userId = 1; // hardcoded user id

  const post = await getPostById(postId);

  if (!post) {
    res.status(400).json({
      message: "Invalid post id",
    });
    return;
  }

  const comment = await addComment(postId, userId, content);

  res.json(comment);
  return;
};

export const updateCommentController = async (req: Request, res: Response) => {
  const schema = z.object({
    commentId: z.number(),
    content: z.string(),
  });

  const safeData = schema.safeParse(req.body);
  if (!safeData.success) {
    res.status(400).json(safeData.error);
    return;
  }

  const { commentId, content } = safeData.data;
  const userId = 1; // hardcoded user id

  // check if commentId is valid
  const comment = await getCommentById(commentId);

  if (!comment) {
    res.status(400).json({ message: "Invalid comment id" });
    return;
  }

  // check if current user is the owner of the comment
  if (comment.userId !== userId) {
    res.status(400).json({ message: "You are not the owner of the comment" });
    return;
  }

  // update the comment
  const updatedComment = await updateComment(commentId, content);

  res.json(updatedComment);
  return;
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const schema = z.object({
    commentId: z.number(),
  });

  const safeData = schema.safeParse(req.body);
  if (!safeData.success) {
    res.status(400).json(safeData.error);
    return;
  }

  const { commentId } = safeData.data;

  const userId = 1; // hardcoded user id

  // check if commentId is valid
  const comment = await getCommentById(commentId);
  if (!comment) {
    res.status(400).json({ message: "Invalid comment id" });
    return;
  }

  // check if current user is the owner of the comment
  if (comment.userId !== userId) {
    res.status(400).json({ message: "You are not the owner of the comment" });
    return;
  }

  // delete the comment
  await deleteComment(commentId);

  res.json(comment);
  return;
};
