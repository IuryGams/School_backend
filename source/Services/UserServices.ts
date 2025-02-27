import { BadRequestError } from "../Errors/ClientError";
import { userSchema } from "../Validators/userValidator";
import { ICryptoServices, IUserServices } from "../implements/implements_services";
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

    /**
     * Valida os dados do usuário com base no schema.
     * @param user - Dados do usuário a serem validados.
     * @throws {BadRequestError} - Se os dados forem inválidos.
     */
    private validateUserData(user: BaseUser): void {
        const { error } = userSchema.safeParse(user);
        if (error) {
            throw new BadRequestError(formatZodErrors(error));
        }
    }

    /**
     * Verifica se o e-mail já está em uso.
     * @param email - E-mail a ser verificado.
     * @param userId - ID do usuário atual (opcional, para evitar conflito com o próprio usuário).
     * @throws {BadRequestError} - Se o e-mail já estiver em uso.
     */
    private async validateEmailUniqueness(email: string, userId?: number): Promise<void> {
        const existingUser = await this.findFirst({
            where: {
                email,
                NOT: { id: userId }, // Ignora o próprio usuário durante a atualização
            },
        });
        if (existingUser) {
            throw new BadRequestError("Email already in use");
        }
    }

    /**
     * Criptografa a senha do usuário.
     * @param password - Senha a ser criptografada.
     * @returns {Promise<string>} - Senha criptografada.
     */
    private async hashPassword(password: string): Promise<string> {
        return this.cryptoServices.hash(password);
    }

    /**
     * Adiciona dados específicos de acordo com o papel (role) do usuário.
     * @param user - Dados do usuário.
     * @param userData - Objeto de criação do usuário no Prisma.
     * @returns {Prisma.UserCreateInput} - Dados do usuário com informações específicas do papel.
     * @throws {BadRequestError} - Se o papel for inválido.
     */
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

    /**
     * Busca um usuário pelo ID.
     * @param userId - ID do usuário.
     * @returns {Promise<User>} - Usuário encontrado.
     * @throws {NotFoundError} - Se o usuário não for encontrado.
     */
    public async getUserById(userId: number): Promise<User> {
        return this.validateRecordExists(async () => await this.findUnique({
            where: {
                id: userId
            }
        }), "User not found")
    }

    /**
     * Busca um usuário pelo e-mail.
     * @param user_email - E-mail do usuário.
     * @returns {Promise<BaseUser>} - Usuário encontrado.
     * @throws {NotFoundError} - Se o usuário não for encontrado.
     */
    public async getUserByEmail(user_email: string): Promise<BaseUser> {
        return this.validateRecordExists(async () => await this.findUnique({
            where: {
                email: user_email
            }
        }), "User not found")
    }

    /**
     * Busca todos os usuários.
     * @returns {Promise<User[]>} - Lista de usuários.
     */
    public async getAllUsers(): Promise<User[]> {
        return this.findMany();
    }

    /**
     * Cria um novo usuário.
     * @param user - Dados do usuário.
     * @param tx - Transação do Prisma (opcional).
     * @returns {Promise<User>} - Usuário criado.
     * @throws {BadRequestError} - Se os dados forem inválidos ou o e-mail já estiver em uso.
     */
    public async createUser<T extends UserType>(user: T, tx?: Prisma.TransactionClient): Promise<User> {

        this.validateUserData(user);
        await this.validateEmailUniqueness(user.email);

        const hashedPassword = await this.hashPassword(user.password);

        const userData: Prisma.UserCreateInput = {
            ...user,
            password: hashedPassword,
        };

        this.addRoleSpecificData(user, userData);

        const newUser: User = await this.createWithTransaction({data: userData});

        return newUser;
    }

    /**
     * Atualiza os dados de um usuário.
     * @param userId - ID do usuário.
     * @param data - Dados a serem atualizados.
     * @returns {Promise<User>} - Usuário atualizado.
     * @throws {NotFoundError} - Se o usuário não for encontrado.
     */
    public async updateUser(userId: number, data: Partial<BaseUser>): Promise<User> {
        if (data.email) {
            await this.validateEmailUniqueness(data.email, userId);
        }

        if (data.password) {
            data.password = await this.hashPassword(data.password);
        }

        return this.update({
            where: { id: userId },
            data,
        });
    }

    /**
     * Deleta um usuário.
     * @param userId - ID do usuário.
     * @returns {Promise<void>}
     * @throws {NotFoundError} - Se o usuário não for encontrado.
     */
    public async deleteUser(userId: number): Promise<void> {
        await this.getUserById(userId);
        await this.delete({
            where: { id: userId },
        });
    }



}

export default UserServices;