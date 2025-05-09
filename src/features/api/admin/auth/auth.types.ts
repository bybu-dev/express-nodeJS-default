import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export type ISignIn = {
  email_address: string;
  password: string;
}

export class SignInDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email_address!: string;

  @IsString({ message: 'Password is required' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Transform(({ value }) => value?.trim())
  password!: string;
}

export type ISignUp = {
  name: string;
  email_address: string;
  password: string;
}

export class SignUpDTO {
  @IsString({ message: 'Name is required' })
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  name!: string;


  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email_address!: string;

  @IsString({ message: 'Password is required' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Transform(({ value }) => value?.trim())
  password!: string;
}