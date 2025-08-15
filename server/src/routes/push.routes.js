import express from "express";
import auth from "../middlewares/auth.js";
import { getPublicKey, subscribe, unsubscribe } from "../controllers/push.controller.js";

const router = express.Router();
router.get("/public-key", auth, getPublicKey);
router.post("/subscribe", auth, subscribe);
router.post("/unsubscribe", auth, unsubscribe);
export default router;
