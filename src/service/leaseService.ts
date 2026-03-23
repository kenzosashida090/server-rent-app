import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const getLeasesDB = async()=>{
    try{

        const leases = await prisma.lease.findMany({
            include:{
                tenant:true
            }
        })
        return leases
    }catch(error:any){
        throw new Error("Error retrieving leases")
    }
}

export const getLeaseDB = async(id:string)=>{
    const propertyId = Number(id)
    try{
        const leaseProperty = await prisma.lease.findMany({
            where:{propertyId: propertyId},
            include:{
                tenant:true,
            }
        })
        console.log('this is the properties', leaseProperty)
        return leaseProperty
    }catch(error){
        console.log(error)
    }
}
export const getLeasePaymentsDB  = async(id:string)=>{
    try{
        const payments = await prisma.payment.findMany({
            where:{leaseId:Number(id)}
        })
        return payments
    }catch(error){
        throw new Error("Error retrieving lease payments")
    }
}
