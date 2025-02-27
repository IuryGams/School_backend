import { container } from "tsyringe";
import { CryptoServices } from "../Services/CryptoServices";
import UserServices from "../Services/UserServices";
import { TOKENS } from "../Constants/tokensDI";
import AuthServices from "../Services/AuthServices";
import StudentServices from "../Services/StudentServices";
import TeacherServices from "../Services/TeacherServices";
import ParentServices from "../Services/ParentServices";

// Controllers
import {UserController, AuthController, StudentController, ParentController, TeacherController} from "../Controller";
import { EnrollmentServices } from "../Services/EnrollmentServices";
import { SubjectServices } from "../Services/SubjectServices";
import { TuitionServices } from "../Services/TuitionServices";

// Registre as dependências no contêiner
function configureContainerDI() {
    // Services
    container.register(TOKENS.services.AuthServices, { useClass: AuthServices });
    container.register(TOKENS.services.CryptoServices, { useClass: CryptoServices });
    container.register(TOKENS.services.EnrollmentServices, { useClass: EnrollmentServices });
    container.register(TOKENS.services.ParentServices, { useClass: ParentServices });
    container.register(TOKENS.services.StudentServices, { useClass: StudentServices });
    container.register(TOKENS.services.SubjectServices, { useClass: SubjectServices });
    container.register(TOKENS.services.TeacherServices, { useClass: TeacherServices });
    container.register(TOKENS.services.TuitionServices, { useClass: TuitionServices });
    container.register(TOKENS.services.UserServices, { useClass: UserServices });

    // Controllers
    container.register(TOKENS.controllers.AuthController, { useClass: AuthController });
    // container.register(TOKENS.controllers.EnrollamentController, { useClass: EnrollamentController });
    container.register(TOKENS.controllers.ParentController, { useClass: ParentController });
    container.register(TOKENS.controllers.StudentController, { useClass: StudentController });
    // container.register(TOKENS.controllers.SubjectController, { useClass: SubjectController });
    container.register(TOKENS.controllers.TeacherController, { useClass: TeacherController });
    // container.register(TOKENS.controllers.TuitionController, { useClass: TuitionController });
    container.register(TOKENS.controllers.UserController, { useClass: UserController });

    // Adicione outras dependências aqui
}

configureContainerDI();

// Exporte o contêiner configurado
export { container };