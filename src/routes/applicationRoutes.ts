import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { createApplication, getApplicationsList, updateApplication } from "../controllers/applicationControllers.js"
const router = express.Router()

router.get("/", authMiddleware(["tenant"]), createApplication)
router.put("/:id/status", authMiddleware(["manager", "tenant"]), updateApplication)
router.get("/", authMiddleware(["tenant","manager"]), getApplicationsList)


export default router