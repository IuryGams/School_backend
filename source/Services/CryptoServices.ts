import crypto from "crypto";
import bcrypt from "bcrypt";
import { ICryptoServices } from "../interfaces/Implements";
import { injectable } from "tsyringe";

@injectable()
export class CryptoServices implements ICryptoServices {
    private readonly CRYPTO_KEY: string;
    private readonly ALGORITHM: string;
    private readonly TEXT_ENCODING = "utf8";
    private readonly CIPHER_TEXT_ENCODING = "hex";
    private readonly saltRounds: number = 10;

    constructor() {
        this.CRYPTO_KEY = process.env.CRYPTO_KEY as string;
        this.ALGORITHM = process.env.CRYPTO_ALGORITHM as string;
    };

    public encrypt(text: string): string {
        const IV = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            this.ALGORITHM,
            Buffer.from(this.CRYPTO_KEY, this.CIPHER_TEXT_ENCODING),
            IV
        );

        let encrypted = cipher.update(text, this.TEXT_ENCODING, this.CIPHER_TEXT_ENCODING);
        encrypted += cipher.final(this.CIPHER_TEXT_ENCODING);

        return IV.toString(this.CIPHER_TEXT_ENCODING) + ":" + encrypted;
    };

    public decrypt(encryptedText: string): string {
        const [IV, encrypted] = encryptedText.split(":");
        const decipher = crypto.createDecipheriv(
            this.ALGORITHM,
            Buffer.from(this.CRYPTO_KEY, this.CIPHER_TEXT_ENCODING),
            Buffer.from(IV, this.CIPHER_TEXT_ENCODING)
        );

        let decrypted = decipher.update(encrypted, this.CIPHER_TEXT_ENCODING, this.TEXT_ENCODING);
        decrypted += decipher.final(this.TEXT_ENCODING);

        return decrypted;
    }

    public hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
    
}