import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
  } from 'typeorm';

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
    _id: string,
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

  
class Personal {
    @Column({ type: 'varchar', length: 100 })
    first_name!: string;
  
    @Column({ type: 'varchar', length: 100 })
    surname!: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    email_address!: string;
}
  
class Wallet {
    @Column({ type: 'float', default: 0 })
    balance!: number;
}
  
class Setting {
    @Column({ type: 'boolean', default: false })
    is_banned!: boolean;
}
  
@Entity('users')
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column(() => Personal)
    personal!: Personal;
  
    @Column(() => Wallet)
    wallet!: Wallet;
  
    @Column(() => Setting)
    setting!: Setting;
  
    @Column({ type: 'varchar', length: 255 })
    password!: string;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    // 🧩 Helper methods (similar to Mongoose statics)
    toResponse(): ISecureUser {
      return {
        id: this.id,
        personal: this.personal,
        setting: this.setting,
        created_at: this.created_at,
        updated_at: this.updated_at,
      };
    }
  
    toGeneralResponse(): IGeneralUser {
      return {
        personal: this.personal,
        created_at: this.created_at,
        updated_at: this.updated_at,
      };
    }
}

export type IUserModel = UserModel;
  