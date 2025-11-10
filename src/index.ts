import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import 'dotenv/config'; 
import { authMiddleware } from "./middleware/authMiddleware.js"
//Routes
import propertyRoutes from "../src/routes/propertyRoutes.js"
import tentantRoutes from "../src/routes/tenantRoutes.js"
import managerRoutes from "../src/routes/managerRoutes.js"
import leaseRoutes from "../src/routes/leaseRoutes.js"
import applicationRoutes from "../src/routes/applicationRoutes.js"
// Config

dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

app.get("/", (req:Request, res:Response)=>{
    res.send("This sucks")
})

app.use("/properties", propertyRoutes)
app.use("/tenants", authMiddleware(["tenant"]),tentantRoutes)
app.use("/managers", authMiddleware(["managger"]),managerRoutes)
app.use("/leases", leaseRoutes)
app.use("/applications", applicationRoutes )
const port = process.env.PORT || 3002
app.listen(port, 
    ()=>{
        console.log(`Server running on port ${port}`)
    }
)