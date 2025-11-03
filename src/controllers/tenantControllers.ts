import type  { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createTenantService, getTenantService } from "../service/tenantService.js";

const prisma = new PrismaClient()

export const getTenant = async(req:Request, res:Response):Promise<void>=>{
    try{
        const { cognitoId } = req.params
        if(!cognitoId) {
            res.status(401).json({message:"Unauthorized"})
            return
        }
        const tenant = await getTenantService(cognitoId)
        if(tenant){
            res.json(tenant)
        }else{
            res.status(404).json({message:"Tenant not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving tenent: ${error.message}`})
    }
}

export const createTenant = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const {cognitoId, name, email, phoneNumber} =req.body
        const data =  {
            cognitoId,
            name,
            email,
            phoneNumber
        } 
        const tenant = await createTenantService(data)
        console.log("-=======",tenant)
        if(tenant){
            res.status(202).json(tenant)
        }else{
            res.status(404).json({message:"There was an error, make sure all data is fullfiled, try again"})
        }
    }catch(error:any){
        console.log("error", error)
    }
}