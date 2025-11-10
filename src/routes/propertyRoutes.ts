import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {getProperties, createProperty, getProperty} from "../controllers/propertyControllers.js"
import multer from "multer"
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage})
router.get("/", getProperties)
router.get("/:id", getProperty)
router.post("/", authMiddleware(["manager"]), upload.array("photos  ")  ,createProperty)

export default router