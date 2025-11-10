import { ApplicationStatus, PrismaClient } from "@prisma/client"
import { calculateNextPaymentDate } from "../utils/paymentDate.js"
import { connect } from "http2"

const prisma = new PrismaClient()
export const listApplicationsDB = async(userId:string, userType:string)=>{
    try{
        let whereClauses = {}
        if(userId && userType) {
            if(userType === "tenant"){
                whereClauses = { tenantCognitoId: String(userId)}
            } else if(userType === "manager") {
                whereClauses = {
                    property: {
                        managerCognitoId: String(userId)
                    }
                }
            }
        }
        const application = await prisma.application.findMany({
            where:whereClauses,
            include:{
                property:{
                    include:{
                        location:true,
                        manager:true
                    }
                },
                tenant:true
            }
        })
       const formattedApplication = await Promise.all(
        application.map(async (app)=>{
            const lease = await prisma.lease.findFirst({
                where:{
                    tenant: {
                        cognitoId: app.tenantCognitoId
                    },
                    propertyId: app.propertyId
                },
                orderBy: {startDate:"desc"}
            })
            return {
                ...app,
                property:{
                    ...app.property,
                    address: app.property.location.address
                },
                manager: app.property.manager,
                lease: lease 
                    ? {
                        ...lease,
                        nextPayment: calculateNextPaymentDate(lease.startDate)
                    } : null
            }
        })
       )
       return formattedApplication
    }catch(error:any){
        throw new Error("Error retrieving applications")
    }
}

export const createApplicationDB  = async(body: { applicationDate: any; status: any; propertyId: any; tenantCognitoId: any; name: any; email: any; phoneNumber: any; message: any })=>{
    try{
        const {
            applicationDate,
            status,
            propertyId,
            tenantCognitoId,
            name,
            email,
            phoneNumber,
            message,
        } = body
        const property = await prisma.property.findUnique({
            where: {id: propertyId},
            select: {pricePerMonth:true, securityDeposit:true}
        })
        if(!property) {
            throw new Error("No property was found.")
        }
        const newApplication = await prisma.$transaction(async(primsa)=>{ // transaction means that if one of this actions fails no one will be saved into the db (if one fails all fails)
           // in oirder to create application fisrt we need to create lease, then we create the application
            const lease = await primsa.lease.create({
                data:{
                    startDate: new Date(), // this is hardcoded
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                    ), // hardcoded
                    rent: property.pricePerMonth,
                    deposit: property.securityDeposit,
                    property: {
                        connect: {id: propertyId}
                    },
                    tenant:{
                        connect: {cognitoId: tenantCognitoId}
                    }
                }
            }) 

            const application = await primsa.application.create({
                data: {
                    applicationDate: new Date(applicationDate),
                    status,
                    name,
                    email,
                    phoneNumber,
                    message,
                    property: {
                        connect: {id: propertyId}
                    },
                    tenant:{
                        connect: {cognitoId: tenantCognitoId}
                    },
                    lease:{
                        connect: {id: lease.id}
                    }
                },
                include:{
                    property:true,
                    tenant:true,
                    lease:true
                }
            })
            return application
        })
        return newApplication
    }catch(error){
        throw new Error("Error creating application.")
    }
}

export const updatingApplicationStatusDB  = async(id:string, status:ApplicationStatus)=>{
    try{
        const application = await prisma.application.findUnique({
            where:{id: Number(id)},
            include:{
                property:true,
                tenant:true
            }
        })
        if(!application){
            throw new Error("There was an error retrieving application.")
        }
        if(status === "Approved"){
            const newLease = await prisma.lease.create({
                data:{
                    startDate: new Date(),
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear()+1)
                    ),
                    rent: application?.property.pricePerMonth,
                    deposit: application?.property.securityDeposit,
                    propertyId: application?.propertyId,
                    tenantCognitoId: application?.tenantCognitoId
                }
            })

            await prisma.property.update({
                where: {id: application.propertyId},
                data:{
                    tenants:{
                        connect:{cognitoId:application.tenantCognitoId}
                    }
                }
            })
            // Update application with the new lease ID
            await prisma.application.update({
                where:{id:Number(id)},
                data:{
                    status,
                    leaseId: newLease.id
                },
                include:{
                    property:true,
                    tenant:true,
                    lease:true
                }

            })
        }else{
            await prisma.application.update({
                where:{ id: Number(id)},
                data:{ status:status}
            })
        }
        const updateApplication = prisma.application.findUnique({
            where:{id:Number(id)},
            include:{
                property:true,
                tenant:true,
                lease:true
            }
        })
        return updateApplication
    }catch(error){
        throw new Error("Error updating applicacion")
    }
}
