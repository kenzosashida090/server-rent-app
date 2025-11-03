import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {getManager, createManager} from "../controllers/managerControllers.js"
const router = express.Router()

router.get("/:managerId", getManager)
router.post("/", createManager)

export default router