import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
