import axios from "axios"

type Location = {
    address: string,
    city:string,
    country:string,
    postalCode:string
}
export const addressToCoordinates = async (location:Location)=>{
const {address, city, country, postalCode} = location  
const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
    {
        street: address,
        city,
        country,
        postalcode: postalCode,
        format: "json",
        limit: "1"
    }
).toString()}`
const geoCodingResponse = await axios.get(geocodingUrl,{
    headers: {
        "User-Agent": 'RealEstateApp (kenzosashida1@gmail.com'
    }
})
const [longitude, latitude] = geoCodingResponse.data[0]?.lon && geoCodingResponse.data[0]?.lat ? [
    parseFloat(geoCodingResponse.data[0]?.lon),
    parseFloat(geoCodingResponse.data[0]?.lat),
] : [0,0]

return [longitude, latitude]
}