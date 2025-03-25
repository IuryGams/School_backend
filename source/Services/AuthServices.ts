import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../Errors/ClientError";
import { IAuthServices, ICryptoServices, IStudentServices, IUserServices } from "../implements/implements_services";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { Credentials, Token, UserResponse } from "../@Types/auth";
import { AuthSchema } from "../Validators/authValidator";
import { formatZodErrors } from "../Utils/utils";


@injectable()
class AuthServices implements IAuthServices {
    private readonly JWT_SECRET = process.env.JWT_SECRET as string;

    constructor(
        @inject(TOKENS.services.UserServices) private userServices: IUserServices,
        @inject(TOKENS.services.CryptoServices) private cryptoServices: ICryptoServices,
        @inject(TOKENS.services.StudentServices) private studentServices: IStudentServices
    ) { }

    private generateToken(user: User): string {
        const { email, role, name } = user;
        return jwt.sign({ email, role, name }, this.JWT_SECRET, { expiresIn: 1209600 });
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<void> {
        const isPasswordValid = await this.cryptoServices.compare(password, hashedPassword);
        if (isPasswordValid) throw new UnauthorizedError("email or password is incorrect");
    }

    private async validateAccessCode(accessCode: string): Promise<User> {
        const student = await this.studentServices.getStudentByAccessCode(accessCode);

        if (!student.isActive) {
            throw new UnauthorizedError("Student account is inactive");
        }

        return student.user;
    }

    private validateAuth(auth: Credentials): void {
        const { error } = AuthSchema.safeParse(auth);
        if (error) {
            throw new BadRequestError(formatZodErrors(error));
        }
    }

    // Public Methods
    public async login(credentials: Credentials): Promise<Token> {
        let user: User;

        if(credentials.username && credentials.accessCode) {
            user = await this.valida
        }
        

        this.validateAuth(auth);
        const foundUser = await this.userServices.getUserByEmail(auth.email);
        await this.validatePassword(auth.password, foundUser.password);
        const accessToken = this.generateToken(foundUser);

        return {
            accessToken,
            user: {
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role
            }
        }
    }

    public async decodeUser(token: string | undefined): Promise<UserResponse> {
        if (!token) {
            throw new UnauthorizedError("Token is required");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded as UserResponse;
    }
}


export default AuthServices;