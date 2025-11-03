import { PrismaClient, type Tenant } from "@prisma/client"
type TenantBody = {
    cognitoId:string,
    name:string,
    email:string,
    phoneNumber:string
}

const prisma = new PrismaClient() // Create prisma client to access db
export const getManagerDB = async(cognitoId:string) =>{
        const tenant = await prisma.manager.findUnique({
        where:{ cognitoId }})
        return tenant
    }
export const createManagerDB = async(data:TenantBody)=>{
    const tenant = await prisma.manager.create({
            data
        })
    return tenant
}
