import { container } from "tsyringe";
import { CryptoServices } from "../Services/CryptoServices";
import { TOKENS } from "../Constants/tokensDI";
import AuthServices from "../Services/AuthServices";

// Controllers
import {UserController, AuthController, StudentController, ParentController, TeacherController, TuitionController} from "../Controller";
import { EnrollmentServices } from "../Services/EnrollmentServices";
import { SubjectServices } from "../Services/SubjectServices";
import { TuitionServices } from "../Services/TuitionServices";
import { ParentServices, StudentServices, TeacherServices, UserServices } from "../Services/Users";

// Registre as dependências no contêiner
function configureContainerDI() {
    const { services, controllers } = TOKENS;

    // Services
    container.register(services.AuthServices, { useClass: AuthServices });
    container.register(services.CryptoServices, { useClass: CryptoServices });
    container.register(services.EnrollmentServices, { useClass: EnrollmentServices });
    container.register(services.ParentServices, { useClass: ParentServices });
    container.register(services.StudentServices, { useClass: StudentServices });
    container.register(services.SubjectServices, { useClass: SubjectServices });
    container.register(services.TeacherServices, { useClass: TeacherServices });
    container.register(services.TuitionServices, { useClass: TuitionServices });
    container.register(services.UserServices, { useClass: UserServices });

    // Controllers
    container.register(controllers.AuthController, { useClass: AuthController });
    // container.register(controllers.EnrollamentController, { useClass: EnrollamentController });
    container.register(controllers.ParentController, { useClass: ParentController });
    container.register(controllers.StudentController, { useClass: StudentController });
    // container.register(controllers.SubjectController, { useClass: SubjectController });
    container.register(controllers.TeacherController, { useClass: TeacherController });
    container.register(controllers.TuitionController, { useClass: TuitionController });
    container.register(controllers.UserController, { useClass: UserController });

    // Adicione outras dependências aqui
}

configureContainerDI();

// Exporte o contêiner configurado
export { container };