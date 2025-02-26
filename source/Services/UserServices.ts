import { BadRequestError, NotFoundError } from "../Errors/ClientError";
import { userSchema } from "../Validators/userValidator";
import { ICryptoServices, IUserServices } from "../interfaces/Implements";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { formatZodErrors } from "../Utils/utils";
import { BaseUser, UserType } from "../Types/user";
import { Prisma, Roles, User } from "@prisma/client";
import { Services } from ".";



@injectable()
class UserServices extends Services<"user"> implements IUserServices {

    constructor(
        @inject(TOKENS.CryptoServices) private cryptoServices: ICryptoServices
    ) {
        super("user");
    }

    // Private Methods
    public async findUser(email: string): Promise<BaseUser | null> {
        const foundUser = await this.findUnique({ where: { email } });
        return foundUser;
    }

    private async validateUser(user: BaseUser): Promise<void> {
        const { error } = userSchema.safeParse(user);
        if (error) {
            throw new BadRequestError(formatZodErrors(error));
        }
        const foundUser = await this.findUser(user.email);
        if (foundUser) throw new BadRequestError("User already exists");
    }

    private addRoleSpecificData<T extends UserType>(
        user: T,
        userData: Prisma.UserCreateInput
    ): Prisma.UserCreateInput {
        switch (user.role) {
            case Roles.STUDENT:
                if (user.student) {
                    userData.student = { ...user.student };
                }
                break;

            case Roles.TEACHER:
                if (user.teacher) {
                    userData.teacher = { ...user.teacher };
                }
                break;

            case Roles.PARENT:
                if (user.parent) {
                    userData.parent = { ...user.parent };
                }
                break;

            default:
                throw new BadRequestError("Invalid user role");
        }

        return userData;
    }

    // Public Methods
    public async getUserByEmail(user_email: string): Promise<BaseUser> {
        const foundUser = await this.findUser(user_email);
        if (!foundUser) throw new NotFoundError("User not found");
        return foundUser;
    }

    public async createUser<T extends UserType>(user: T, tx?: Prisma.TransactionClient): Promise<User> {
        await this.validateUser(user);

        const hashedPassword = await this.cryptoServices.hash(user.password)

        const userData: Prisma.UserCreateInput = {
            ...user,
            password: hashedPassword,
        };

        this.addRoleSpecificData(user, userData);

        const newUser: User = await this.createWithTransaction({data: userData});

        return newUser;
    }

}

export default UserServices;