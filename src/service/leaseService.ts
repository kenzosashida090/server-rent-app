import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const getLeasesDB = async(id:string)=>{
    const leases = await 
}