import { 
  IsEmail, 
  IsString, 
  Length, 
  Matches, 
  IsOptional 
} from 'class-validator';
import { Transform } from 'class-transformer';

export type ISignIn = {
  email_address: string;
  password: string;
};

export type ISignUp = {
  first_name: string;
  second_name?: string;
  email_address: string;
  password: string;
};

export class SignInDTO implements ISignIn {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email_address!: string;

  @IsString({ message: 'Password is required' })
  @Transform(({ value }) => value?.trim())
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password!: string;
}

export class SignUpDTO implements ISignUp {
  @IsString({ message: 'First name is required' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  first_name!: string;

  @IsOptional()
  @IsString({ message: 'Second name must be a string' })
  @Length(0, 50, { message: 'Second name too long' })
  @Transform(({ value }) => value?.trim())
  second_name?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email_address!: string;

  @IsString({ message: 'Password is required' })
  @Transform(({ value }) => value?.trim())
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password!: string;
}
