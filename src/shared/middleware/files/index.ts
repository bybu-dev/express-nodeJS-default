//@ts-check
import FileRepository from '@/repositories/files';
import { RequestHandler } from 'express';
import multer, { Field } from 'multer';

export const multipleUpload = (fileRepo: FileRepository, {fields} : {fields: readonly Field[]}): RequestHandler => {
    return multer({ storage: fileRepo.getStorageEngine }).fields(fields) as unknown as RequestHandler;
}

export const universalUpload = (fileRepo: FileRepository): RequestHandler => {
    return multer({ storage: fileRepo.getStorageEngine }).any() as unknown as RequestHandler;
}
    
export const singleUpload = (fileRepo: FileRepository, {fileField} : {fileField: string}): RequestHandler => {
    return multer({ storage: fileRepo.getStorageEngine }).single(fileField) as unknown as RequestHandler;
}

export const arrayUpload = (fileRepo: FileRepository, {fileField} : {fileField:string}): RequestHandler => {
    return multer({ storage: fileRepo.getStorageEngine }).array(fileField) as unknown as RequestHandler;
}