import { Prisma, PrismaClient, type Location } from "@prisma/client"
import {wktToGeoJSON} from "@terraformer/wkt"
import { UploadPhotosS3 } from "./uploadPhotoUrls.js"
import { addressToCoordinates } from "./addressLonLat.js"
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
export const getPropertiesDB = async(query:any) =>{
    try{

    }catch(error){
         const { 
            favoriteIds,
            priceMin,
            priceMax,
            beds,
            baths,
            propertyType,
            squareFeetMin,
            squareFeetMax,
            amenities,
            availableFrom,
            latitude,
            longitude
        } = query
        let whereConditions:  Prisma.Sql[] = []
        if(favoriteIds){
            const favoiriteIdsArray = (favoriteIds as string).split(",").map(Number)
            whereConditions.push(
                Prisma.sql`p.id IN (${Prisma.join(favoiriteIdsArray)})`
            )
        }
        if(priceMin) {
            whereConditions.push(
                Prisma.sql`p."pricePerMonth" >= ${Number(priceMax)}`
            )
        }
        if(priceMax){
            whereConditions.push(
                Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
            )
        }
        if(beds && beds !== "any"){
            whereConditions.push(
                Prisma.sql`p.beds >= ${Number(beds)}`
            )
        }
        if(baths && baths !== "any"){
            whereConditions.push(
                Prisma.sql`p.baths >= ${Number(baths)}`

            )
        }
        if(squareFeetMin){
            whereConditions.push(
                Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
            )
        }
        if(squareFeetMax) {
            whereConditions.push(
                Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
            )
        }
        if(propertyType && propertyType !== "any"){
            whereConditions.push(
                Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
            )
        }
        if(amenities && amenities !== "any"){
            const amenitiesArray  = (amenities as string).split(",")
            whereConditions.push(
                Prisma.sql`p."amenities" @> ${amenitiesArray}`
            )
        }
        if(availableFrom && availableFrom !== "any"){
            const availableFromDate =
                typeof availableFrom === "string" ? availableFrom : null
            const date = new Date(availableFromDate!)
            if(!isNaN(date.getTime())){
                whereConditions.push(
                    Prisma.sql`EXISTS (
                        SELECT 1 FROM "Lease" l
                        WHERE l."propertyId" = p.id
                        AND l."startDate" <= ${date.toISOString()}
                     )`
                )
            }
        }
        if(latitude && longitude) {
            const lat = parseFloat(latitude as string)
            const lng = parseFloat(longitude as string)
            const radiusInKilometers = 1000;
            const degrees= radiusInKilometers / 111;
            whereConditions.push(
                Prisma.sql`ST_DWithin(
                    l.coordinates::geometry,
                    ST_SetSRID(ST_MakePoint(${lng}, ${lat},), 4326)
                    ${degrees}
                )`
            )
        }

        const completeQuery = Prisma.sql`
            SELECT
              p.*,
              json_build_object(
                'id',l.id,
                'address', l.address,
                'city', l.city,
                'state', l.state,
                'country', l.country,
                'postalCode', l."postalCode",
                "cooridnates", json_build_object(
                    'longitude', ST_X(l."coordinates"::geometry)
                    'latitude', ST_Y(l."coordinates"::geometry)
                )
              ) as location
            FROM "Property" p
            JOIN "Location" l ON p.*locationId* = l.id
            ${
                whereConditions.length > 0
                    ?  Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
                    : Prisma.empty
            }
        `;
        const properties = await prisma.$queryRaw(completeQuery)
        return properties
    }
}
export const getPropertyDB = async(id:string) =>{
    try{
    const property = await prisma.property.findUnique(
        {
            where:{id:Number(id)},
            include:{
                location:true
            }
        }
    )
    if(property){
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
        
     }
    }catch(error){
        throw new Error("There was an error in the db")
    }
}
export const createPropertyDB = async(data:any, images: Express.Multer.File[])=>{
        const {address, city, state, country, postalCode, managerCognitoId, ...propertyData}= data
    
    const [longitude, latitude] = await addressToCoordinates(data)
    const [location] = await prisma.$queryRaw<Location[]>`
        INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
        VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326 )) 
        RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates
    `
    const newProperty = prisma.property.create({
        data:{
            ...propertyData,
            photoUrls:await UploadPhotosS3(images),
            locationId: location!.id,
            managerCognitoId,
            amenities: typeof propertyData.amenities === "string" ? propertyData.amenities.split(",") : [],
            highlights:
                typeof propertyData.highlights === "string" ? propertyData.highlights.split(",") : [],
            isPetsAllowed: propertyData.isPetsAllowed === "true",
            isParkingIncluded: propertyData.isParkingIncluded === "true",
            pricePerMonth: parseFloat(propertyData.pricePerMonth),
            securityDeposit: parseFloat(propertyData.securityDeposit),
            applicationFee: parseFloat(propertyData.securityDeposit),
            bes: parseInt(propertyData.beds),
            baths: parseFloat(propertyData.baths),
            squareFeet: parseInt(propertyData.squareFeet)

        },
        include:{
            location:true,
            manager:true
        }
    })
    return newProperty

}