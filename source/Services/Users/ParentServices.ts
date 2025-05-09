import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Constants/tokensDI";
import { IParentServices, IStudentServices, IUserServices } from "../../implements/implements_services";
import { ParentWithStudents, ParentWithStudentsReply, ParentUser, ParentExtend
 } from "../../@Types/user";
import { Parent, Prisma, User } from "@prisma/client";
import { Services } from "../BaseServices";
import { NotFoundError } from "../../Errors/ClientError";





@injectable()
export class ParentServices extends Services<"parent"> implements IParentServices {

    constructor(
        @inject(TOKENS.services.UserServices) private userServices: IUserServices,
        @inject(TOKENS.services.StudentServices) private studentServices: IStudentServices,
    ) {
        super("parent");
    }
    // Public Methods
    /**
     * Crie um novo Responsável/Pai.
     * @param parent - Dados do Responsável/Pai.
     * @param tx - prisma.$transactions. (opcional)
     * @returns {Promise<User>} - Usuário criado.
     * @throws {BadRequestError} - Se os dados forem inválidos ou o e-mail já estiver em uso.
     */
    public async createParent(parent: ParentUser, tx?: Prisma.UserDelegate): Promise<ParentExtend> {
        return await this.userServices.createUser({
            name: parent.name,
            lastName: parent.lastName,
            email: parent.email,
            password: parent.password,
            role: "PARENT",
            parent: {
                create: {}
            }
        }, {tx, parent: true}); 
    }

    /**
     * Cria um responsável/pai e seus respectivos estudantes em uma única transação.
     *
     * @param parentStudent - Objeto contendo os dados do responsável e uma lista de estudantes.
     * @returns {Promise<ParentWithStudentsReply>} - Retorna o responsável criado juntamente com os estudantes criados.
     * @throws {BadRequestError} - Se houver erro na criação de qualquer entidade.
     */
    public async createParentWithStudents(parentStudent: ParentWithStudents): Promise<ParentWithStudentsReply> {
        const { parent, students } = parentStudent;

        return this.queryWithTransactions(async (tx) => {

            const createdUser = await this.createParent(parent, tx.user);

            if(createdUser.parent) {
                const createdStudents = await this.studentServices.createStudents(students, createdUser.parent.id, tx.user)

                return {
                    parent: createdUser,
                    students: createdStudents
                }
            }

            throw new NotFoundError("Parent not found")
        })
    }

    /**
     * Busca um responsável/pai pelo ID.
     *
     * @param parentId - ID do responsável/pai a ser buscado.
     * @param includeStudents - Indica se deve incluir os estudantes relacionados ao responsável.
     * @returns {Promise<Parent>} - Retorna os dados do responsável encontrado.
     * @throws {NotFoundError} - Se o responsável não for encontrado.
     */
    public async getParentById(parentId: number, includeStudents: boolean = false): Promise<Parent> {
        return this.validateRecordExists(async () => await this.findUnique({
            where: { id: parentId },
            include: {
                user: true,
                students: includeStudents,
            },
        }),
            "Parent not found"
        );
    }

    /**
     * Obtém a lista de todos os responsáveis cadastrados no sistema.
     *
     * @param includeStudents - Indica se deve incluir os estudantes relacionados a cada responsável.
     * @returns {Promise<Parent[]>} - Retorna uma lista de responsáveis.
     */
    public async getAllParents(includeStudents: boolean = false): Promise<Parent[]> {
        return await this.findMany({
            include: {
                user: true,
                students: includeStudents,
            },
        });
    }

    /**
     * Atualiza os dados de um responsável/pai específico.
     *
     * @param parentId - ID do responsável a ser atualizado.
     * @param dataUpdate - Objeto contendo os dados a serem atualizados.
     * @returns {Promise<User>} - Retorna o usuário atualizado.
     * @throws {NotFoundError} - Se o responsável não for encontrado.
     */
    public async updateParent(parentId: number, dataUpdate: Partial<ParentUser>): Promise<User> {
        await this.getParentById(parentId);
        return this.userServices.updateUser(parentId, dataUpdate);
    }

    /**
     * Deleta um responsável/pai do sistema.
     *
     * @param parentId - ID do responsável a ser deletado.
     * @throws {NotFoundError} - Se o responsável não for encontrado.
     */
    public async deleteParent(parentId: number): Promise<void> {
        const parent = await this.getParentById(parentId);
        await this.userServices.deleteUser(parent.userId);
    }

}
