import EncryptionRepository, { Token } from '@/repositories/encryption';
import { IAuthUser, SuccessResponseProps } from '@/utils/types/types';

describe('EncryptionRepository', () => {
  const encryption = new EncryptionRepository();

  describe('Token encryption/decryption', () => {
    it('should sign and verify token correctly', () => {
      const payload: IAuthUser = {
        id: '123',
        first_name: '',
        email_address: '',
        created_at: new Date()
      };
      const signed = encryption.encryptToken(payload, "accessToken" as "Special Token", 60);
      const decoded = encryption.decryptToken(signed, "accessToken" as "Special Token") as any;

      expect(decoded.id).toBe(payload.id);
    });
  });

  // describe('Password encryption/compare', () => {
  //   it('should hash and compare password correctly', () => {
  //     const password = 'supersecret';
  //     const hash = encryption.encryptPassword(password);

  //     const match = encryption.comparePassword(password, hash);
  //     const fail = encryption.comparePassword('wrong', hash);

  //     expect(match).toBe(true);
  //     expect(fail).toBe(false);
  //   });
  // });

  // describe('createSpecialKey', () => {
  //   it('should generate UUID with prefix/suffix and optional dashes removed', () => {
  //     const key = encryption.createSpecialKey({ prefix: 'PRE-', suffix: '-SUF', removeDashes: true });
  //     expect(key.startsWith('PRE-')).toBe(true);
  //     expect(key.endsWith('-SUF')).toBe(true);
  //   });
  // });

  // describe('verifyBearerToken', () => {
  //   it('should verify a valid bearer token', () => {
  //     const token = encryption.encryptToken({ user: 'jude' }, Token.accessToken);
  //     const bearer = `Bearer ${token}`;
  //     const result = encryption.verifyBearerToken(bearer, Token.accessToken);

  //     expect(result.status).toBe(true);
  //     expect((result.data as any).user).toBe('jude');
  //   });

  //   it('should reject invalid or expired token', () => {
  //     const result = encryption.verifyBearerToken('Bearer invalid-token', Token.accessToken);
  //     expect(result.status).toBe(false);
  //   });
  // });

  // describe('generateVerificationCode', () => {
  //   it('should generate numeric code with timeout', () => {
  //     const { code, timeout } = encryption.generateVerificationCode(6);
  //     expect(code).toHaveLength(6);
  //     expect(+code).not.toBeNaN();
  //     expect(timeout).toBeGreaterThan(Date.now());
  //   });
  // });

  // describe('generateRandomStringCode', () => {
  //   it('should generate alphanumeric string of given length', () => {
  //     const code = encryption.generateRandomStringCode(10);
  //     expect(code).toMatch(/^[A-Za-z0-9]{10}$/);
  //   });
  // });

  // describe('encryptId and decryptId', () => {
  //   it('should encrypt and decrypt an ID', () => {
  //     const originalId = 'abc-123';
  //     const encrypted = encryption.encryptId(originalId, Token.accessToken) as SuccessResponseProps<string>;
  //     expect(encrypted.status).toBe(true);

  //     const decrypted = encryption.decryptId(encrypted.data!, Token.accessToken) as SuccessResponseProps<string>;
  //     expect(decrypted.status).toBe(true);
  //     expect(decrypted.data).toBe(originalId);
  //   });
  // });

  // describe('generateKeyPairs', () => {
  //   it('should generate a public and private key', () => {
  //     const { publicKey, privateKey } = encryption.generateKeyPairs();
  //     expect(publicKey).toContain('BEGIN PUBLIC KEY');
  //     expect(privateKey).toContain('BEGIN ENCRYPTED PRIVATE KEY');
  //   });
  // });

  // describe('encryptWithPublicKey', () => {
  //   it('should encrypt data with a public key', () => {
  //     const { publicKey } = encryption.generateKeyPairs();
  //     const encrypted = encryption.encryptWithPublicKey('secret-data', publicKey) as SuccessResponseProps<string>;
  //     expect(encrypted.status).toBe(true);
  //     expect(typeof encrypted.data).toBe('string');
  //   });
  // });
});
