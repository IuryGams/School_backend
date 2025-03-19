import { inject, injectable } from "tsyringe";
import { ICryptoServices, IStudentServices, IUserServices } from "../../implements/implements_services";
import { TOKENS } from "../../Constants/tokensDI";
import { StudentUser } from "../../@Types/user";
import { Prisma, Student, User } from "@prisma/client";
import { Services } from "../BaseServices";
import { BadRequestError } from "../../Errors/ClientError";

@injectable()
class StudentServices extends Services<"student"> implements IStudentServices {

    constructor(
        @inject(TOKENS.services.UserServices) private userServices: IUserServices,
        @inject(TOKENS.services.CryptoServices) private cryptoServices: ICryptoServices
    ) {
        super("student");
    }

    // Private Methods

    /**
     * Gera um código de acesso aleatório de 6 dígitos.
     * @returns {string} - Código de acesso gerado.
     */
    private async generateAccessCode(code: string): Promise<string> {
        let exists: boolean;
        do {
            code = Math.floor(100000 + Math.random() * 900000).toString();
            exists = await this.accessCodeExists(code);
        } while (exists);
        return code;
    }

    /**
     * Verifica se o código de acesso já existe no banco de dados.
     * @param code - Código de acesso a ser verificado.
     * @returns {Promise<boolean>} - Retorna verdadeiro se o código já existir, falso caso contrário.
     */
    private async accessCodeExists(code: string): Promise<boolean> {
        const foundCode = await this.findUnique({ where: { accessCode: code } });
        return !!foundCode;
    }

    /**
     * Criptografa um código de acesso antes de salvar no banco.
     * @param code - Código de acesso a ser criptografado.
     * @returns {Promise<string>} - Código de acesso criptografado.
     */
    private async encryptAccessCode(code: string): Promise<string> {
        return this.cryptoServices.hash(code);
    }

    public generateUsername(name: string, lastName: string): string {

        if(!lastName || !name) {
            throw new BadRequestError("Empty field");
        }

        if(name.length < 3 || lastName.length < 3) {
            throw new BadRequestError("Empty field");
        }

        return `${name.toLocaleLowerCase()}.${lastName.toLocaleLowerCase()}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Public Methods



    /**
     * Cria um código de acesso único, validando com Zod e garantindo unicidade.
     * @returns {Promise<string>} - Código de acesso único e criptografado.
     * @throws {BadRequestError} - Se a validação do código falhar.
     */
    public async createUniqueAccessCode(): Promise<string> {
        let accessCode: string = "";
        accessCode = await this.generateAccessCode(accessCode);
        return this.encryptAccessCode(accessCode);
    }

    /**
     * Cria um novo estudante no sistema.
     * @param student - Dados do estudante.
     * @param parent_id - ID do responsável.
     * @param tx - prisma.$transaction (opcional).
     * @returns {Promise<User>} - Usuário criado.
     */
    public async createStudent(student: Omit<StudentUser, "role">, parent_id: number, tx?: Prisma.UserDelegate): Promise<User> {
        const accessCode = await this.createUniqueAccessCode();

        return await this.userServices.createUser({
            name: student.name,
            email: student.email, 
            lastName: student.lastName,
            password: student.password,
            role: "STUDENT",
            student: {
                create: {
                    parentId: parent_id,
                    isActive: true,
                    accessCode,
                    username: this.generateUsername(student.name, student.lastName),
                }
            }
        }, {tx, student: true});
    }

    /**
     * Cria múltiplos estudantes em uma única chamada.
     * @param students - Lista de estudantes a serem criados.
     * @param parent_id - ID do responsável.
     * @param tx - prisma.$transaction (opcional).
     * @returns {Promise<User[]>} - Lista de usuários criados.
     */
    public async createStudents(students: Omit<StudentUser, "role">[], parent_id: number, tx?: Prisma.UserDelegate): Promise<User[]> {
        return await Promise.all(students.map(student => this.createStudent(student, parent_id, tx)));
    }

    /**
     * Busca um estudante pelo ID e retorna suas informações.
     * @param studentId - ID do estudante.
     * @returns {Promise<Student>} - Dados do estudante encontrado.
     * @throws {NotFoundError} - Se o estudante não for encontrado.
     */
    public async getStudentById(studentId: number): Promise<Student> {
        return await this.validateRecordExists(async () => await this.findUnique({
            where: { id: studentId },
            include: { user: true },
        }),
            "Student not found"
        );
    }

    /**
     * Busca um estudante pelo accessCode.
     * @param accessCode - Código de acesso do estudante.
     * @returns {Promise<Student>} - Dados do estudante encontrado.
     * @throws {NotFoundError} - Se o estudante não for encontrado.
     */
    public async getStudentByAccessCode(accessCode: string): Promise<Student> {
        return await this.validateRecordExists(async () => await this.findUnique({
            where: { accessCode },
            include: { user: true },
        }),
            "Student not found"
        );
    }

    /**
     * Retorna todos os estudantes cadastrados no sistema.
     * @returns {Promise<Student[]>} - Lista de estudantes.
     */
    public async getAllStudents(): Promise<Student[]> {
        return await this.findMany({
            include: { user: true },
        });
    }

    /**
     * Atualiza os dados de um estudante existente.
     * @param studentId - ID do estudante a ser atualizado.
     * @param data - Dados a serem atualizados.
     * @returns {Promise<User>} - Estudante atualizado.
     */
    public async updateStudent(studentId: number, data: Partial<StudentUser>): Promise<User> {
        const student = await this.getStudentById(studentId);
        return this.userServices.updateUser(student.userId, data);
    }

}

export {StudentServices};