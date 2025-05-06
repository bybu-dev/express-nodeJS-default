import { logger } from "@/utils/lib/logger"
import { IError } from "./types"

export class RepoErrorConstructor extends Error {
    constructor(readonly message: string, packages: string, error?: IError[]) {
        super(message)
        logger.error("Error in package", {packages, error})
    }
}

export const RepoError = (message: string, packages: string, error?: IError[]) => new RepoErrorConstructor(message, packages, error);