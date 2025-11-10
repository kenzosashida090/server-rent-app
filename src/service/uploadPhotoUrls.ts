import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

const s3Client = new S3Client(
    {
        region: process.env.AWS_REGION!,
    }
)
export const UploadPhotosS3 = async(files: Express.Multer.File[] ) =>(
    await Promise.all(
        files.map(async (file)=>{
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `properties/${Date.now()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype
            }
            const uploadResult = await new Upload({
                client:s3Client,
                params: uploadParams
            }).done();
            return uploadResult.Location
        })
    )
    )
