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
export const getManagerDB = async(cognitoId:string) =>{
        const manager = await prisma.manager.findUnique({
        where:{ cognitoId }})
        return manager
    }
export const createManagerDB = async(data:TenantBody)=>{
    const manager = await prisma.manager.create({
            data
        })
    return manager
}
export const updateManagerDB = async(cognitoId:string,data:SettingsBody)=>{
    const manager = await prisma.manager.update({
        where:{cognitoId},    
        data
        })
    return manager 
}

export const getManagerPropertiesDB = async(managerId:string) =>{
    try{

        const properties = await prisma.property.findMany({
            where:{managerCognitoId: managerId},
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