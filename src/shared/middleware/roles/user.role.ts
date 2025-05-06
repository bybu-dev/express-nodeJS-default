import { Request, Response } from "express";
import EncryptionRepository, { Token } from "../../data/repositories/encryption";
import { IData } from "../../utils/types/types";

export const UserRole = (data: IData) => 
    (req: Request, res: Response, next: () => any) => {
        try {
            if (!req.headers['authorization']) {
                res.status(500).json({ status: false, no_token: true, message: "missing auth key" });
                return;
            }
            const response = data.repo.encryption.verifyBearerToken(req.headers['authorization'], Token.accessToken);
            if ( !response.status ) {
                return res.status(403).json({
                    status: response.status,
                    message: response.error,
                    no_token: true,
                    error: [{ message: response.error }]
                });
            }
            req.user = response.data;
            return next();
        } catch (error) {
            res.status(500).json({ status: false, no_token: true, message: "unable to authenticate admin" });
        }
    }