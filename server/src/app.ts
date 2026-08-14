import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

export const app = express();

app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
