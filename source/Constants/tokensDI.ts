
export const TOKENS = {

    // Services
    services: {
        AuthServices: Symbol("AuthServices"),
        CryptoServices: Symbol("CryptoServices"),
        EnrollmentServices: Symbol("EnrollmentServices"),
        ParentServices: Symbol("ParentServices"),
        StudentServices: Symbol("StudentServices"),
        SubjectServices: Symbol("SubjectServices"),
        TeacherServices: Symbol("TeacherServices"),
        TuitionServices: Symbol("TuitionServices"),
        UserServices: Symbol("UserServices"),
    },

    // Controllers
    controllers: {
        AuthController: Symbol("AuthController"),
        EnrollamentController: Symbol("EnrollamentController"),
        ParentController: Symbol("ParentController"),
        StudentController: Symbol("StudentController"),
        SubjectController: Symbol("SubjectController"),
        TeacherController: Symbol("TeacherController"),
        TuitionController: Symbol("TuitionController"),
        UserController: Symbol("UserController"),
    }
    
} as const;

// @Injectable Quando precisarmos que ela seja injetada.

// @inject -> Só sera utilizado quando uma Class Precisa de metodos de outra class.
// Exemplo: AuthController, utiliza metodos de AuthServices. Logo, AuthServices precisa ser inject dentro de AuthController.