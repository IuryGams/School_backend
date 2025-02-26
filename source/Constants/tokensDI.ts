export const TOKENS = {

    // Services
    AuthServices: Symbol("AuthServices"),
    CryptoServices: Symbol("CryptoServices"),
    UserServices: Symbol("UserServices"),
    TeacherServices: Symbol("TeacherServices"),
    ParentServices: Symbol("ParentServices"),
    StudentServices: Symbol("StudentServices"),

    // Controllers
    AuthController: Symbol("AuthController"),
    UserController: Symbol("UserController"),
    StudentController: Symbol("StudentController"),
    ParentController: Symbol("ParentController"),
    
} as const;

// @Injectable Quando precisarmos que ela seja injetada.

// @inject -> Só sera utilizado quando uma Class Precisa de metodos de outra class.
// Exemplo: AuthController, utiliza metodos de AuthServices. Logo, AuthServices precisa ser inject dentro de AuthController.