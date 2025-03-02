import { BadRequestError } from "../Errors/ClientError";
import { userSchema } from "../Validators/userValidator";
import { ICryptoServices, IUserServices } from "../implements/implements_services";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { formatZodErrors } from "../Utils/utils";
import { BaseUser, StudentUser, UserType, UserUpdateData } from "../Types/user";
import { $Enums, Prisma, Roles, User } from "@prisma/client";
import { Services } from ".";



@injectable()
class UserServices extends Services<"user"> implements IUserServices {

    constructor(
        @inject(TOKENS.services.CryptoServices) private cryptoServices: ICryptoServices
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
     * @throws {BadRequestError} - Se o e-mail já estiver em uso.
     */
    private async validateEmailUniqueness(email: string): Promise<void> {
        const existingUser = await this.findUnique({ where: { email } });
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
     * @returns {Promise<User>} - Usuário encontrado.
     * @throws {NotFoundError} - Se o usuário não for encontrado.
     */
    public async getUserByEmail(user_email: string): Promise<User> {
        return await this.validateRecordExists(async () => await this.findUnique({
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
    public async createUser(user: Prisma.UserCreateInput): Promise<User> {

        this.validateUserData(user);
        await this.validateEmailUniqueness(user.email);

        const hashedPassword = await this.hashPassword(user.password);

        const newUser: User = await this.create({
            data: {
                ...user,
                password: hashedPassword
            }
        });

        return newUser;
    }

    /**
     * Atualiza os dados de um usuário.
     * @param userId - ID do usuário.
     * @param data: {BaseUser} - Dados a serem atualizados.
     * @returns {Promise<User>} - Usuário atualizado.
     * @throws {NotFoundError} - Se o usuário não for encontrado.
     */
    public async updateUser(userId: number, newData: Prisma.UserUpdateInput): Promise<User> {
        if (newData.email) {
            await this.validateEmailUniqueness(newData.email as string);
        }

        if (newData.password) {
            newData.password = await this.hashPassword(newData.password as string);
        }

        await this.getUserById(userId);

        return this.update({
            where: { id: userId },
            data: {
                ...newData
            },
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