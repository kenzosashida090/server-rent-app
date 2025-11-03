import { PrismaClient, type Tenant } from "@prisma/client"
type TenantBody = {
    cognitoId:string,
    name:string,
    email:string,
    phoneNumber:string
}

const prisma = new PrismaClient() // Create prisma client to access db
export const getTenantService = async(cognitoId:string) =>{
        const tenant = await prisma.tenant.findUnique({
        where:{ cognitoId },
            include: {
                favorites:true
            }
        })
        return tenant
    }
export const createTenantService = async(data:TenantBody)=>{
    const tenant = await prisma.tenant.create({
            data
        })
    console.log("tenant de db", tenant)
    return tenant
}
