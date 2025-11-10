
import type  {  Request, Response } from "express";
import { getLeasePaymentsDB, getLeasesDB } from "../service/leaseService.js";
export const getLeases = async(req:Request, res:Response):Promise<void>=>{
    try{
        const leases = await getLeasesDB()
        if(leases){
            res.status(202).json(leases)
        }else{
            res.status(404).json({message:"Leases not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving Leases: ${error.message}`})
    }
}

export const getLeasePayments = async(req:Request, res:Response):Promise<void>=>{
    try{
        const {leaseId} = req.params
        const leasePayment = await getLeasePaymentsDB(leaseId!)
        if(leasePayment){
            res.status(202).json(leasePayment)
        }else{
            res.status(404).json({message:"Leases not found"})
        }
    }catch(error:any){
        res.status(505).json({message:`Error retrieving Leases: ${error.message}`})
    }
}