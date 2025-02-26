import { container } from "tsyringe";
import { CryptoServices } from "../Services/CryptoServices";
import UserServices from "../Services/UserServices";
import { TOKENS } from "../Constants/tokensDI";
import AuthServices from "../Services/AuthServices";
import StudentServices from "../Services/StudentServices";
import TeacherServices from "../Services/TeacherServices";
import ParentServices from "../Services/ParentServices";

// Controllers
import {UserController, AuthController, StudentController, ParentController} from "../Controller";

// Registre as dependências no contêiner
function configureContainerDI() {
    // Services
    container.register(TOKENS.AuthServices, { useClass: AuthServices });
    container.register(TOKENS.CryptoServices, { useClass: CryptoServices });
    container.register(TOKENS.UserServices, { useClass: UserServices });
    container.register(TOKENS.StudentServices, { useClass: StudentServices });
    container.register(TOKENS.TeacherServices, { useClass: TeacherServices });
    container.register(TOKENS.ParentServices, { useClass: ParentServices });

    // Controllers
    container.register(TOKENS.UserController, { useClass: UserController }); // Adicione esta linha
    container.register(TOKENS.AuthController, { useClass: AuthController }); // Adicione esta linha
    container.register(TOKENS.StudentController, { useClass: StudentController }); // Adicione esta linha
    container.register(TOKENS.ParentController, { useClass: ParentController }); // Adicione esta linha

    // Adicione outras dependências aqui
}

configureContainerDI();

// Exporte o contêiner configurado
export { container };