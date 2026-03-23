import express from "express"
import {getManager, createManager, updateManager, getManagerProperties, getManagerPropertiesLeases} from "../controllers/managerControllers.js"
const router = express.Router()

router.get("/:cognitoId", getManager)
router.put("/:cognitoId", updateManager)
router.get("/:cognitoId/properties",getManagerProperties)
router.post("/", createManager)

export default router