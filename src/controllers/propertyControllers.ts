import type  { Request, Response } from "express";
import { createPropertyDB, getPropertiesDB, getPropertyDB } from "../service/propertyService.js";


export const getProperties= async(req:Request, res:Response):Promise<void>=>{
    try{
        const properties = await getPropertiesDB(req.query)
        if(properties){
            res.status(202).json(properties)
        }else{
            res.status(404).json({message:"Properties not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving Properties: ${error.message}`})
    }
}
export const getProperty= async(req:Request, res:Response):Promise<void>=>{
    try{
        const {id}= req.query
        const property = await getPropertyDB(String(id))
        if(property){
            res.status(202).json(property)
        }else{
            res.status(404).json({message:"Property not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving Property: ${error.message}`})
    }
}

export const createProperty= async(req:Request, res:Response):Promise<void>=>{
    try{
        const files = req.files as Express.Multer.File[]
        const property = await createPropertyDB(req.body, files)
        if(property){
            res.status(202).json(property)
        }else{
            res.status(404).json({message:"Error creating property"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving Property: ${error.message}`})
    }
}


