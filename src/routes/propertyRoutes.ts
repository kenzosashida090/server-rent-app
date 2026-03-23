import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {getProperties, createProperty, getProperty} from "../controllers/propertyControllers.js"
import multer from "multer"
import { getManagerPropertiesLeases } from "../controllers/managerControllers.js"
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage})
router.get("/", getProperties)
router.get("/:id", getProperty)
router.post("/", authMiddleware(["manager"]), upload.array("photos")  ,createProperty)
router.get("/:id/leases", getManagerPropertiesLeases)

export default router