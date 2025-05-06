import { Models } from "@/models";
import { Repositories } from "@/repositories";

export type IError = {
    field?: string;
    message: string;
}

export type ErrorResponseProps = {
    status: false;
    message: string;
    error?: IError[];
} | {
    status: false;
    message?: string;
    error: IError[];
}
export type SuccessResponseProps<Response> = {
    status: true;
    message?: string;
    data: Response
}
export type ResponseProps<Response> = ErrorResponseProps | SuccessResponseProps<Response>

export type IAuthUser = {
    id: string;
    first_name: string;
    email_address: string;
    created_at: Date;
}

export type IAuthResponse = {
    id: string;
    access_token: string;
    refresh_token: string;
    created_at: string;
}

export type IAuthApp = {
    user_id: string,
    account_id: string,
}

export type IResponse<Response> = Promise<ResponseProps<Response>>

export type IPaginateOptions = {
    page: number;
    limit: number;
}

export type IData = {
    model: Models
    repo: Repositories
}