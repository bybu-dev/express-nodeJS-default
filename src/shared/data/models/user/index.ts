import { Schema, model, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IWallet = {
    balance: number;
}

export type IPersonal = {
    first_name: string;
    surname: string;
    email_address: string;
}

export type ISetting = {
    is_banned: boolean;
}

export type IUser = {
    _id: Schema.Types.ObjectId,
    personal: IPersonal,
    password: string,
    wallet: IWallet;
    setting: ISetting;
    created_at: Date;
    updated_at: Date;
};

export type ISecureUser = {
    id: string;
    personal: IPersonal;
    setting: ISetting;
    updated_at: Date;
    created_at: Date;
};

export interface IGeneralUser {
    personal: IPersonal;
    updated_at: Date;
    created_at: Date;
}

const PersonalSchema = new Schema<IPersonal>({
    first_name: {
        type: String,
    },
    surname: {
        type: String,
    },
    email_address: {
        type: String,
    },
})

const WalletSchema = new Schema<IWallet>({
    balance: {
        type: Number,
        default: 0,
    },
})

const SettingSchema = new Schema<IWallet>({
    balance: {
        type: Number,
        default: 0,
    },
})

const UserSchema = new Schema<IUser>({
    personal: PersonalSchema,
    wallet: WalletSchema,
    setting: SettingSchema,
    password: {
        type: String,
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
});

mongoosePaginate(UserSchema);

UserSchema.statics.toGeneralResponse = function(user: IUser): IGeneralUser {
    return {
      personal: user.personal,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
};

UserSchema.statics.toResponse = function(user: IUser): ISecureUser {
    return {
      id: user._id.toString(),
      personal: user.personal,
      setting: user.setting,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
};

export interface IUserModel extends PaginateModel<IUser>{
    toGeneralResponse: (user: IUser) => IGeneralUser;
    toResponse: (user: IUser) => ISecureUser
}

export const UserModel = model<IUser, PaginateModel<IUser>>("user", UserSchema) as IUserModel;

export type IPaginatedUser = {
    total_users: number;
    users: IUser[];
    has_next: boolean;
}