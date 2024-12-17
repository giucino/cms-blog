import { Request, Response } from "express";
import { z } from "zod";
import { addUser, getUserByEmail, updateUser } from "../services/user.service";
import {
  encryptPassword,
  generateToken,
  verifyToken,
} from "../shared/auth.util";
import { addToken, deleteTokens, getToken } from "../services/token.service";
import {
  sendConfirmationEmail,
  sendForgotPasswordEmail,
} from "../shared/email.util";
const passwordZodRules = z
  .string()
  .min(6)
  .max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter and one number.",
  }); // Minimum six characters, at least one uppercase letter, one lowercase letter and one number

export const registerController = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: passwordZodRules,
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  let { email, password, name } = parsedData.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    res.status(400).json({ message: "User already exists." });
    return;
  }

  password = encryptPassword(password);

  // Create user
  let user = await addUser(email, password, name);

  user = user.toJSON();

  delete user.password;

  // Send email verification
  const token = generateToken(user.id!);

  await addToken(token, "activation", user.id!);

  await sendConfirmationEmail(email, token);

  res.status(201).json(user);
  return;
};

export const loginController = async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  const { email, password } = parsedData.data;
  const user = await getUserByEmail(email);

  if (!user) {
    res.status(400).json({ message: "User not found." });
    return;
  }

  if (user.get('status') !== 'active') {
    res.status(400).json({ message: 'Please confirm your email.' });
    return;
}

  const dbPassword = verifyToken(user.password!);

  if (dbPassword !== password) {
    res.status(400).json({ message: "Invalid password." });
    return;
  }

  // Generate token
  const accessToken = generateToken(user.get("id"));
  const refreshToken = generateToken(user.get("id"), "7d");

  // Delete old tokens
  await deleteTokens(user.get("id"));

  // Save refresh token
  await addToken(refreshToken, "refresh", user.get("id"));
  await addToken(accessToken, "access", user.get("id"));

  // create and send session to client
  const session = {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };

  delete session.user.password;

  res.status(200).json(session);
  return;
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const schema = z.object({
    refreshToken: z.string(),
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  const { refreshToken } = parsedData.data;

  const isTokenValid = verifyToken(refreshToken);

  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired." });
    return;
  }

  const dbRefreshToken = await getToken(refreshToken);

  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Invalid token." });
    return;
  }

  const userId = dbRefreshToken.get("userId");

  const accessToken = generateToken(userId!);
  const newRefreshToken = generateToken(userId!, "7d");

  // delete old tokens
  await deleteTokens(userId!);

  // Save refresh token
  await addToken(newRefreshToken, "refresh", userId!);

  // Save access token
  await addToken(accessToken, "access", userId!);

  res.status(200).json({
    accessToken,
    refreshToken: newRefreshToken,
  });
  return;
};

export const logoutController = async (req: Request, res: Response) => {
  const schema = z.object({
    refreshToken: z.string(),
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  const { refreshToken } = parsedData.data;

  const isTokenValid = verifyToken(refreshToken);

  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired." });
    return;
  }

  const dbRefreshToken = await getToken(refreshToken);

  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Invalid token." });
    return;
  }

  const userId = dbRefreshToken.get("userId");

  await deleteTokens(userId!);

  res.status(200).json({ message: "Logged out." });
  return;
};

export const confirmEmailController = async (req: Request, res: Response) => {
  const { token } = req.params;

  const isTokenValid = verifyToken(token);

  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired." });
    return;
  }

  const dbToken = await getToken(token);

  if (!dbToken || dbToken.get("type") !== "activation") {
    res.status(400).json({ message: "Invalid token." });
    return;
  }

  const userId = dbToken.get("userId");

  await updateUser({
    id: userId!,
    status: "active",
  });

  await deleteTokens(userId!);

  res.redirect(
    process.env.FRONTEND_URL +
    '/auth/login');
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email(),
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  const { email } = parsedData.data;

  const user = await getUserByEmail(email);

  if (!user) {
    res.status(400).json({ message: "User not found." });
    return;
  }

  // Generate token
  const token = generateToken(user.get("id"));

  // delete old tokens
  await deleteTokens(user.get("id"));

  // Save new token in database
  await addToken(token, "reset", user.get("id"));

  // Send email
  await sendForgotPasswordEmail(email, token);

  res.status(200).json({ message: "Email sent." });
  return;
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const schema = z.object({
    token: z.string(),
    password: passwordZodRules,
  });

  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }

  const { token, password } = parsedData.data;

  const isTokenValid = verifyToken(token);

  if (!isTokenValid) {
    res.status(400).json({ message: "Invalid token or expired." });
    return;
  }

  const dbToken = await getToken(token);

  if (!dbToken || dbToken.get("type") !== "reset") {
    res.status(400).json({ message: "Invalid token." });
    return;
  }

  const userId = dbToken.get("userId");

  const encryptedPassword = encryptPassword(password);

  await updateUser({
    id: userId!,
    password: encryptedPassword,
  });

  await deleteTokens(userId!);

  res.status(200).json({ message: "Password updated." });
  return;
};
