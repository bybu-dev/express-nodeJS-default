import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export type IUpdateUser = {
    first_name: string;
    surname: string;
};

export type IUpdateProfile = {
    image?: string;
};

export class UpdateUserDTO implements IUpdateUser {
  @IsString({ message: 'First name must be a string' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  first_name!: string;

  @IsString({ message: 'Surname must be a string' })
  @Length(1, 50, { message: 'Surname must be between 1 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  surname!: string;
}