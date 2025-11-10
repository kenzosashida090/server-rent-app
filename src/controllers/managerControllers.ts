import type  { NextFunction, Request, Response } from "express";
import { getManagerDB, createManagerDB, updateManagerDB, getManagerPropertiesDB } from "../service/managerService.js";


export const getManager = async(req:Request, res:Response):Promise<void>=>{
    try{
        const { cognitoId } = req.params
        if(!cognitoId) {
            res.status(401).json({message:"Unauthorized"})
            return
        }
        const tenant = await getManagerDB(cognitoId)
        if(tenant){
            res.json(tenant)
        }else{
            res.status(404).json({message:"Tenant not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving tenent: ${error.message}`})
    }
}

export const createManager = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const {cognitoId, name, email, phoneNumber} =req.body
        const data =  {
            cognitoId,
            name,
            email,
            phoneNumber
        } 
        const tenant = await createManagerDB(data)
        if(tenant){
            res.status(202).json(tenant)
        }else{
            res.status(404).json({message:"There was an error, make sure all data is fullfiled, try again"})
        }
    }catch(error:any){

    }
}
export const updateManager = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const {cognitoId} = req.params
        const { name, email, phoneNumber} =req.body
        const data =  {
            name,
            email,
            phoneNumber
        } 
        const manager = await updateManagerDB(cognitoId!,data)
        if(manager){
            res.status(202).json(manager)
        }else{
            res.status(404).json({message:"There was an error, make sure all data is fullfiled, try again"})
        }
    }catch(error:any){
res.status(404).json({message:"Error updationg manager"})
    }
}

export const getManagerProperties = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    try{
        const {cognitoId} = req.params

        const managerProperties = await  getManagerPropertiesDB(String(cognitoId))
        if(managerProperties){
            res.status(202).json(managerProperties)
        }else{
            res.status(404).json({message:"There was an error, try again"})
        }
    }catch(error:any){
res.status(404).json({message:"Error retrieving managers properties"})
    }
}