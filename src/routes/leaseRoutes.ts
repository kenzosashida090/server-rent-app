import express from "express"
import {createManager, getManagerProperties} from "../controllers/managerControllers.js"
import { getLeasePayments, getLeases } from "../controllers/leaseControllers.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
const router = express.Router()

router.get("/", authMiddleware(["manager","tenant"]), getLeases)
router.get("/:leaseId/payments", authMiddleware(["manager", "tenant"]), getLeasePayments)


export default router