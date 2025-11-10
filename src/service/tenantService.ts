import { PrismaClient, type Tenant } from "@prisma/client"
import { wktToGeoJSON } from "@terraformer/wkt"
type TenantBody = {
    cognitoId:string,
    name:string,
    email:string,
    phoneNumber:string
}

type SettingsBody = {
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
    return tenant
}

export const updateTenantService = async(cognitoId:string, data:SettingsBody)=>{
    const tenant = await prisma.tenant.update({
           where: {cognitoId}, data
        })
    return tenant
}

export const getTenantPropertiesDB = async(tenantId:string) =>{
    try{

        const properties = await prisma.property.findMany({
            where:{tenants:{ some:{cognitoId:tenantId}}},
            include:{
                location:true
            }
        })
        const propertiesWithFormattedLocation = await Promise.all(
            properties.map(async(property)=>{
                const coordinates:{coordinates:string}[] =
                await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`
                
                const geoJSON: any = wktToGeoJSON( coordinates[0]?.coordinates || "")
                const longitude = geoJSON.coordianates[0]
                const latitude  = geoJSON.coordinates[1]
                
                const propertyWithCoordinates = {
                    ...property,
                    location: {
                        ...property.location,
                        coordinates: {
                            longitude,
                            latitude
                            }
                        }
                    }
                    
                    return propertyWithCoordinates
                })
            )
            return propertiesWithFormattedLocation
        }catch(error){
            throw new Error("Error retrieving manager properties ")
        }
        }

export const addFavoritePropertyDB = async(data:any)=>{
    try{
        const tenant = await getTenantService(data.cognitoId)
        const propertyIdNumber = Number(data.propertyId)
        const existingFavorites = tenant?.favorites || []
        if(!existingFavorites.some((fav)=> fav.id === propertyIdNumber)){
        const  updateTenant = await prisma.tenant.update({
            where:{cognitoId:data.cognitoId},
            data:{
                favorites:{
                    connect:{id:propertyIdNumber}
                }
            },
            include:{favorites:true}
        })
        return updateTenant
        }else{
            throw new Error("Property already added as favorite.")
        }
    }catch(error){

    }
}

export const removeFavoritePropertyDB = async(data:any)=>{
    try{
        const propertyIdNumber = Number(data.propertyId)
        const  updateTenant = await prisma.tenant.update({
            where:{cognitoId:data.cognitoId},
            data:{
                favorites:{
                    disconnect:{id:propertyIdNumber}
                }
            },
            include:{favorites:true}
        })
        return updateTenant

    }catch(error){
        throw new Error("Fail to remove favorite property, try next time.")
    }
}