import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { ITeacherServices, IUserServices } from "../implements/implements_services";
import { TeacherUser } from "../Types/user";
import { Teacher, User } from "@prisma/client";
import { Services } from ".";

@injectable()
class TeacherServices extends Services<"teacher"> implements ITeacherServices {

    constructor(@inject(TOKENS.services.UserServices) private userServices: IUserServices) {
        super("teacher")
    }

    // Private Methods


    // Public methods

    /**
     * Cria um novo professor no sistema.
     *
     * @param teacher - Objeto contendo os dados do professor, exceto a role
     * @returns {Promise<User>} - Retorna o usuário criado
     */
    public async createTeacher(teacher: Omit<TeacherUser, "role">): Promise<User> {
        return await this.userServices.createUser(
            {
                name: teacher.name,
                email: teacher.email,
                password: teacher.password,
                role: "TEACHER",
                teacher: {
                    create: {}
                }
            }
        );
    }

    /**
     * Busca um professor pelo ID.
     *
     * @param teacherId - ID do professor a ser buscado
     * @returns {Promise<Teacher>} - Retorna os dados do professor encontrado
     * @throws {NotFoundError} se o professor não existir
     */
    public async getTeacherById(teacherId: number): Promise<Teacher> {
        return await this.validateRecordExists(async () => await this.findUnique({
            where: { id: teacherId },
            include: { user: true },
        }),
            "Teacher not found"
        );
    }

    /**
     * Obtém a lista de todos os professores cadastrados no sistema.
     *
     * @returns {Promise<Teacher[]>} - Retorna uma lista de professores
     */
    public async getAllTeachers(): Promise<Teacher[]> {
        return await this.findMany({
            include: { user: true },
        });
    }

    /**
     * Atualiza os dados de um professor específico.
     *
     * @param teacherId - ID do professor a ser atualizado
     * @param data - Objeto contendo os dados a serem atualizados
     * @returns {Promise<User>} Retorna o usuário atualizado
     * @throws {NotFoundError} se o professor não existir
     */
    public async updateTeacher(teacherId: number, data: Partial<TeacherUser>): Promise<User> {
        const teacher = await this.getTeacherById(teacherId);
        return this.userServices.updateUser(teacher.userId, data);
    }

    /**
     * Deleta um professor do sistema.
     *
     * @param teacherId - ID do professor a ser deletado
     * @throws {NotFoundError} se o professor não existir
     */
    public async deleteTeacher(teacherId: number): Promise<void> {
        const teacher = await this.getTeacherById(teacherId);
        await this.delete({ where: { id: teacherId } });
        await this.userServices.deleteUser(teacher.userId);
    }
}

export default TeacherServices;