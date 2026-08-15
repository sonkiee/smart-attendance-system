import express from "express";
import api from "./api.routes";

const router = express.Router();

router.route("/").get((_req, res) => {
  res.json({
    ok: true,
  });
});

router.use("/api", api);

router.get("/favicon.ico", (_req, res) => res.status(204).end());

export default router;
