import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import 'dotenv/config'; // ✅ esto carga automáticamente el archivo .env
import { authMiddleware } from "./middleware/authMiddleware.js"
import propertyRoutes from "../src/routes/propertyRoutes.js"
//Routes
import tentantRoutes from "../src/routes/tenantRoutes.js"
import managerRoutes from "../src/routes/managerRoutes.js"
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
const port = process.env.PORT || 3002
app.listen(port, 
    ()=>{
        console.log(`Server running on port ${port}`)
    }
)