import { Request, Response } from "express";
import { z } from "zod";
import {
  addTag,
  deleteTag,
  getAllTags,
  getTagById,
  getTagBySlug,
} from "../services/tag.service";
import { generateSlug } from "../shared/general.util";
import { getPostById } from "../services/post.service";
import {
  deletePostTagRelations,
  getPostTags,
} from "../services/post-tag.service";
import { User } from "../models/User";

export const getTagsController = async (req: Request, res: Response) => {
  // get user from req
  const user = (req as any).user as User;

  const tags = await getAllTags({
    userId: user?.get("id"),
  });
  res.json(tags);
  return;
};

export const addTagController = async (req: Request, res: Response) => {
  const user = (req as any).user as User;

  const schema = z.object({
    name: z.string(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { name } = req.body;

  let slug = generateSlug(name);

  const tagAlreadyExists = await getTagBySlug(slug);

  if (tagAlreadyExists) {
    slug = generateSlug(name, true);
  }

  const newTag = await addTag(name, slug, user.get("id"));

  res.json(newTag);
  return;
};

export const updateTagController = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string(),
    id: z.number(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { name, id } = req.body;

  const tag = await getTagById(id);

  if (!tag) {
    res.status(404).json({ message: "Tag not found" });
    return;
  }

  if (tag.name === name) {
    res.status(400).json({ message: "Nothing was changed." });
    return;
  }

  let slug = generateSlug(name);
  const tagAlreadyExists = await getTagBySlug(slug);

  if (tagAlreadyExists) {
    slug = generateSlug(name, true);
  }

  tag.name = name;
  tag.slug = slug;
  await tag.save();

  res.json(tag);
};

export const deleteTagController = async (req: Request, res: Response) => {
  const schema = z.object({
    id: z.number(),
  });

  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { id } = req.body;
  const tag = await getTagById(id);

  if (!tag) {
    res.status(404).json({ message: "Tag not found" });
    return;
  }
  await deletePostTagRelations({ tagId: id });

  await deleteTag(id);

  res.json(tag);
};

export const getPostTagsController = async (req: Request, res: Response) => {
  let postId: any = req.params.postId;

  postId = parseInt(postId);

  if (!postId) {
    res.status(400).json({ message: "Post id is required" });
    return;
  }

  const post = await getPostById(postId);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const postTags = await getPostTags(postId);

  res.json(postTags);
  return;
};

export const getTagBySlugController = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    res.status(404).json({ message: "Tag not found" });
    return;
  }

  res.json(tag);
  return;
};
