import jsonwebtoken from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../db/schema/index.js";

export const jwt = {
  sign: (payload: User) => {
    return jsonwebtoken.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
    });
  },
  verify: (token: string) => {
    return jsonwebtoken.verify(token, env.JWT_SECRET);
  },
};
