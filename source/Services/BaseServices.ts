

import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import prisma from "../Lib/prisma";
import { NotFoundError } from "../Errors/ClientError";

interface PrismaModels {
  user: Prisma.UserDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  address: Prisma.AddressDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  student: Prisma.StudentDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  teacher: Prisma.TeacherDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  coordinator: Prisma.CoordinatorDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  parent: Prisma.ParentDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  subject: Prisma.SubjectDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  class: Prisma.ClassDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  enrollment: Prisma.EnrollmentDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
  tuition: Prisma.TuitionDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
}

abstract class Services<Model extends keyof PrismaModels> {
  protected model: PrismaModels[Model];

  constructor(tableModel: Model) {
    this.model = prisma[tableModel];
  }

  // Public Methods
  protected async findMany<Args extends Parameters<PrismaModels[Model]['findMany']>[0]>(args?: Args): Promise<ReturnType<PrismaModels[Model]['findMany']>> {
    return (this.model.findMany as any)(args);
  }

  protected async findUnique<Args extends Parameters<PrismaModels[Model]['findUnique']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['findUnique']> | null> {
    return (this.model.findUnique as any)(args);
  }

  protected async findFirst<Args extends Parameters<PrismaModels[Model]['findFirst']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['findFirst']> | null> {
    return (this.model.findFirst as any)(args);
  }

  protected async findOrCreate<Args extends Parameters<PrismaModels[Model]['upsert']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['upsert']> | null> {
    return (this.model.upsert as any)(args);
  }

  protected async groupBy<Args extends Parameters<PrismaModels[Model]['groupBy']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['groupBy']>> {
    return (this.model.groupBy as any)(args);
  }

  protected async create<Args extends Parameters<PrismaModels[Model]['create']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['create']>> {
    return (this.model.create as any)(args);
  }
  protected async createMany<Args extends Parameters<PrismaModels[Model]['createMany']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['createMany']>> {
    return (this.model.createMany as any)(args);
  }

  protected async update<Args extends Parameters<PrismaModels[Model]['update']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['update']>> {
    return (this.model.update as any)(args);
  }
  protected async updateManyAndReturn<Args extends Parameters<PrismaModels[Model]['updateManyAndReturn']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['updateManyAndReturn']>> {
    return (this.model.updateManyAndReturn as any)(args);
  }

  protected async delete<Args extends Parameters<PrismaModels[Model]['delete']>[0]>(args: Args): Promise<ReturnType<PrismaModels[Model]['delete']>> {
    return (this.model.delete as any)(args);
  }

  protected async queryWithTransactions<T>(callback: (model: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (ctx) => callback(ctx));
  }

  /**
     * Método privado para validar a existência de um registro no banco de dados.
     * Se o registro não for encontrado, lança um erro NotFoundError.
     *
     * @param findFunction - Função assíncrona que retorna um registro ou null.
     * @param errorMessage - Mensagem de erro caso o registro não seja encontrado.
     * @returns Retorna o registro encontrado do tipo T.
     * @throws {NotFoundError} - Se o registro não for encontrado.
  */
  protected async validateRecordExists<T>(findFunction: () => Promise<T | null>, errorMessage: string): Promise<T> {
    const record = await findFunction();
    if (!record) {
      throw new NotFoundError(errorMessage);
    }
    return record;
  }
}

export { Services };