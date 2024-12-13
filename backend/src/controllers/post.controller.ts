import { Request, Response } from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  updatePost,
} from "../services/post.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getCategoryById } from "../services/category.service";
import { getTagsByIds } from "../services/tag.service";
import { addPostTags, getPostTags } from "../services/post-tag.service";

export const getAllPostsController = async (req: Request, res: Response) => {
  // zod schema for accepting filters from query string variables
  const schema = z.object({
    categoryId: z.string().optional(),
    tagId: z.string().optional(),
  });

  // parsing query string variables
  const safeData = schema.safeParse(req.query);

  if (!safeData.success) {
    res.status(400).json(safeData.error);
    return;
  }

  const { categoryId, tagId } = safeData.data;

  const posts = await getAllPosts({
    categoryId: categoryId ? parseInt(categoryId) : undefined,
    tagId: tagId ? parseInt(tagId) : undefined,
  });
  res.json(posts);
  return;
};

export const addPostController = async (req: Request, res: Response) => {
  const schema = z.object({
    title: z.string(),
    content: z.string(),
    categoryId: z.number(),
    tagIds: z.array(z.number()).optional(),
  });

  const safeData = schema.safeParse(req.body);

  if (!safeData.success) {
    res.status(400).json(safeData.error);
    return;
  }

  const { title, content, categoryId, tagIds } = safeData.data;

  await validateTags(res, tagIds);

  let slug = generateSlug(title);

  // check if slug is unique
  const existingPostWithGivenSlug = await getPostBySlug(slug);

  if (existingPostWithGivenSlug) slug = generateSlug(title, true);

  // verify if category id is valid
  const category = await getCategoryById(categoryId);
  if (!category) {
    res.status(400).json({ message: "Invalid category id" });
    return;
  }

  const post = await addPost(
    title,
    content,
    categoryId,
    1, // hardcoded user id
    slug
  );

  // add tags to post
  if (tagIds && tagIds.length > 0) {
    await addPostTags(post.id, tagIds);
  }

  res.json(post);
  return;
};

export const updatePostController = async (req: Request, resp: Response) => {
  const userId = 1; // hardcoded user id

  const schema = z.object({
    id: z.number(),
    title: z.string().optional(),
    content: z.string().optional(),
    categoryId: z.number().optional(),
    tagIds: z.array(z.number()).optional(),
  });

  const safeData = schema.safeParse(req.body);

  if (!safeData.success) {
    resp.status(400).json(safeData.error);
    return;
  }

  let { id, title, content, categoryId, tagIds } = safeData.data;

  // checking if post id is valid
  const post = await getPostById(id);

  // check if all tags are valid
  await validateTags(resp, tagIds);

  if (!post) {
    resp.status(400).json({ message: "Invalid post id" });
    return;
  }

  // make sure if user has rights to update the post
  if (post.userId !== userId) {
    resp
      .status(403)
      .json({ message: "You are not authorized to update this post" });
    return;
  }

  // check if category id is valid
  if (categoryId) {
    const category = await getCategoryById(categoryId);
    if (!category) {
      resp.status(400).json({ message: "Invalid category id" });
      return;
    }
  }
  let slug;
  // check if title was updated, if yes, generate new slug
  if (title && title !== post.title) {
    slug = generateSlug(title);

    // check if slug is unique
    const existingPostWithGivenSlug = await getPostBySlug(slug);

    if (existingPostWithGivenSlug) slug = generateSlug(title, true);
  }

  const updatedPost = await updatePost(id, title, content, categoryId, slug);

  const postTagRelations = await getPostTags(id);

  // add tags to post
  if (tagIds && tagIds.length > 0) {
    tagIds = tagIds?.filter((tagId) => {
      const postTag = postTagRelations.find((postTagRelation) => {
        return postTagRelation.tagId === tagId;
      });
      return !postTag;
    });

    if (tagIds.length > 0) await addPostTags(post.id, tagIds);
  }

  resp.json(updatedPost);
  return;
};

export const deletePostController = async (req: Request, resp: Response) => {
  const userId = 1; // hardcoded user id

  const schema = z.object({
    id: z.number(),
  });

  const safeData = schema.safeParse(req.body);

  if (!safeData.success) {
    resp.status(400).json(safeData.error);
    return;
  }

  const { id } = safeData.data;

  // checking if post id is valid
  const post = await getPostById(id);
  if (!post) {
    resp.status(400).json({ message: "Invalid post id" });
    return;
  }

  // make sure if user has rights to delete the post
  if (post.userId !== userId) {
    resp
      .status(403)
      .json({ message: "You are not authorized to delete this post" });
    return;
  }

  await deletePost(id);

  resp.json(post);
  return;
};

export const getPostBySlugController = async (req: Request, resp: Response) => {
  const { slug } = req.params;

  if (!slug) {
    resp.status(400).json({ message: "Invalid slug" });
    return;
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    resp.status(404).json({ message: "Post not found" });
    return;
  }

  resp.json(post);
  return;
};

async function validateTags(res: Response, tagIds?: number[]) {
  if (tagIds && tagIds.length > 0) {
    // check if all tags are valid
    const tags = await getTagsByIds(tagIds);
    if (tags.length !== tagIds.length) {
      res.status(400).json({ message: "Invalid tag id(s)" });
      return;
    }
  }
}
