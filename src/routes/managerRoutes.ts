import express from "express"
import {getManager, createManager, updateManager, getManagerProperties} from "../controllers/managerControllers.js"
const router = express.Router()

router.get("/:managerId", getManager)
router.get("/:managerId", updateManager)
router.get("/:cognitoId/properties",getManagerProperties)
router.post("/", createManager)

export default router