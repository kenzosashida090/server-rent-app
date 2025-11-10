
import type  {  NextFunction, Request, Response } from "express";
import { getLeasePaymentsDB, getLeasesDB } from "../service/leaseService.js";
import { createApplicationDB, listApplicationsDB, updatingApplicationStatusDB } from "../service/applicationService.js";
export const getApplicationsList = async(req:Request<{}, {}, {}, { userId: string; userType: string }>, res:Response):Promise<void>=>{
    try{
        const {userId, userType} = req.query
        const application = await listApplicationsDB(userId, userType)
        if(application){
            res.status(202).json(application)
        }else{
            res.status(404).json({message:"Leases not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving Leases: ${error.message}`})
    }
}

export const createApplication = async(req:Request, res:Response):Promise<void>=>{
    try{
        const createApplication = await createApplicationDB(req.body)
        res.status(202).json(createApplication)
     
    }catch(error:any){
        res.status(505).json({message:`Error trying to create application: ${error.message}`})
    }
}
export const updateApplication = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
    const {id} = req.params
    const {status} = req.body
    if(!id || !status){
        res.status(400).json({message:"Bad request missing parameters"})
        return
    }
    try{
        const updateApplication = await updatingApplicationStatusDB(id,status)
        res.status(202).json(updateApplication)
     
    }catch(error:any){
        res.status(505).json({message:`Error trying to update application: ${error.message}`})
    }
}