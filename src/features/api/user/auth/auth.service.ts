import { UserModel } from "@/models/user";
import { Token } from "@/repositories/encryption";
import { IAuthResponse, IAuthUser, IResponse } from "@/utils/types/types";
import { Repositories } from "@/repositories";
import { Models } from "@/models";
import { ISignIn, ISignUp } from "./auth.types";

class AuthService {
    constructor(
        private readonly repo: Repositories,
        private readonly model: Models
    ) {}

    login = async (request: ISignIn) : Promise<IResponse<IAuthResponse>> => {
        try {
            const user = await this.model.user.findOne({ where: { personal: { email_address: request.email_address }}});
            if (!user) return { status: false, error: [{ message: "invalid credentials" }] };

            const isUserValid = this.repo.encryption.comparePassword(request.password, user.password);
            if (!isUserValid) return { status: false, error: [{ message: "invalid credentials" }], message: "invalid credentials" };

            const auth: IAuthUser = {
                id: user.id,
                first_name: user.personal.first_name,
                email_address: user.personal.email_address,
                created_at: new Date(),
            }

            const accessToken = this.repo.encryption.encryptToken(auth, Token.accessToken);
            const refreshToken = this.repo.encryption.encryptToken(auth, Token.refreshToken);

            return { status: true, data: {
                id: auth.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                created_at: (new Date()).toISOString(),
            }};
        } catch (err) {
            console.log("err: ", err);
            return { status: false, message: err as string };
        }
    }

    register = async (request: ISignUp) : Promise<IResponse<IAuthResponse>> => {
        try {
            const userExist = await this.model.user.findOne({ where: { personal: { email_address : request.email_address }}});
            if (userExist) return { status: false, error: [{ message: "user exist already" }] };

            const password = this.repo.encryption.encryptPassword(request.password);
            const user = await this.model.user.save({
                personal: {
                  first_name: request.first_name,
                  second_name: request.second_name,
                  email_address: request.email_address,
                },
                password: password,
                setting: {
                    is_banned: false,
                }
              });
            if (!user) return { status: false, error: [{ message: "unable to create account" }] };

            const auth: IAuthUser = {
                id: user.id,
                first_name: user.personal.first_name,
                email_address: user.personal.email_address,
                created_at: new Date(),
            }
            const accessToken = this.repo.encryption.encryptToken(auth, Token.accessToken);
            const refreshToken = this.repo.encryption.encryptToken(auth, Token.refreshToken);

            return { status: true, data: {
                id: auth.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                created_at: (new Date()).toISOString(),
            }};
        } catch (err) {
            return { status: false, message: err as string };
        }
    }
}

export default AuthService;