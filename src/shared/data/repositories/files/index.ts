//@ts-check
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import S3StorageEngine from './engines/s3.engine';
import { diskStorage, memoryStorage } from 'multer';

class FileRepository {
    private storageS3;
    // private s3Config;

    constructor () {
        // this.s3Config = new S3Client({
        //     region: 'eu-north-1',
        //     credentials:{
        //        accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID!,
        //        secretAccessKey: process.env.AWS_USER_ACCESS_SECRET!
        //     }
        // })
        // this.storageS3 = S3StorageEngine(this.s3Config, process.env.AWS_S3_BUCKET_NAME!);
        this.storageS3 = diskStorage({ destination: `${process.cwd()}/public/image` });
    }

    get getStorageEngine() {
        return this.storageS3;
    }

    deleteFile = async (fileName:string) => {
          try {
            const command = new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: fileName.split('/')[fileName.split('/').length - 1],
            });
            // const response = await this.s3Config.send(command);
            // console.log('response :', response);
        } catch (err) {
            console.error(err);
        }
    }
}


export default FileRepository;