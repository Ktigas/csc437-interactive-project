import { getCollection } from "../db.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export async function createUser(userData) {
  const users = await getCollection(process.env.USERS_COLLECTION_NAME);
  
  const existingUser = await users.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new Error("Email already registered");
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const user = {
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    name: userData.name,
    memberSince: new Date(),
    createdAt: new Date()
  };
  
  const result = await users.insertOne(user);
  return { 
    _id: result.insertedId,
    email: user.email,
    name: user.name,
    memberSince: user.memberSince
  };
}

export async function findUserByEmail(email) {
  const users = await getCollection(process.env.USERS_COLLECTION_NAME);
  return await users.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id) {
  const users = await getCollection(process.env.USERS_COLLECTION_NAME);
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function verifyPassword(user, password) {
  return await bcrypt.compare(password, user.password);
}