import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

export default generateToken;

