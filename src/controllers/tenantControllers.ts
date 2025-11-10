import type  { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { addFavoritePropertyDB, createTenantService, getTenantPropertiesDB, getTenantService, removeFavoritePropertyDB, updateTenantService } from "../service/tenantService.js";

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
export const updateTenant = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const {cognitoId} = req.params
        const {name, email, phoneNumber} =req.body
        const data =  {
            name,
            email,
            phoneNumber
        } 
        const tenant = await updateTenantService(cognitoId!,data)
        if(tenant){
            res.status(202).json(tenant)
        }else{
            res.status(404).json({message:"There was an error updating tenant, try again"})
        }
    }catch(error:any){
        console.log("error", error)
    }
}
export const getTenantProperties = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const {cognitoId} = req.params
        const tenantProperties = await  getTenantPropertiesDB(String(cognitoId))
        if(tenantProperties){
            res.status(202).json(tenantProperties)
        }else{
            res.status(404).json({message:"There was an error, try again"})
        }
    }catch(error:any){
res.status(404).json({message:"Error retrieving tenants properties"})
    }
}

export const addFavoriteProperty= async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const updatedTenantFavorites = await addFavoritePropertyDB(req.params)
        res.status(202).json(updatedTenantFavorites)
    }catch(error: any){
        res.status(404).json({message:error?.message})
    }

}

export const removeFavoriteProperty = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const updatedTenantFavorites = await removeFavoritePropertyDB(req.params)
        res.status(202).json(updatedTenantFavorites)
    }catch(error){

    }

}
