import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export type SendConfirmationParams = {
  email_address: string;
}

export type ConfirmTokenParams = {
  token: string;
}

export type ChangePasswordParams = {
  token: string;
  new_password: string;
  confirm_password: string;
}

export class SendConfirmationDTO implements SendConfirmationParams {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email_address!: string;
}

export class ConfirmTokenDTO implements ConfirmTokenParams {
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token cannot be empty' })
  @Transform(({ value }) => value?.trim())
  token!: string;
}

export class ChangePasswordDTO implements ChangePasswordParams {
  @IsString({ message: 'Token is required' })
  @IsNotEmpty({ message: 'Token cannot be empty' })
  @Transform(({ value }) => value?.trim())
  token!: string;

  @IsString({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[\W_]/, {
    message: 'Password must contain at least one special character',
  })
  @Transform(({ value }) => value?.trim())
  new_password!: string;

  @ValidateIf((o) => o.new_password)
  @IsString({ message: 'Confirm password is required' })
  @Transform(({ value }) => value?.trim())
  confirm_password!: string;
}
