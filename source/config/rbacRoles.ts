

enum Permission {
    MANAGE_USERS = "MANAGE_USERS",
    VIEW_ALL_CLASSES = "VIEW_ALL_CLASSES",
    EDIT_ALL_GRADES = "EDIT_ALL_GRADES",
    VIEW_CLASSES = "VIEW_CLASSES",
    EDIT_GRADES = "EDIT_GRADES",
    VIEW_OWN_GRADES = "VIEW_OWN_GRADES",
    VIEW_CHILD_PROGRESS = "VIEW_CHILD_PROGRESS",
}


export const rolePermissions: Record<string, Permission[]> = {
    ADMIN: [Permission.MANAGE_USERS, Permission.VIEW_ALL_CLASSES, Permission.EDIT_ALL_GRADES],
    TEACHER: [Permission.VIEW_CLASSES, Permission.EDIT_GRADES],
    STUDENT: [Permission.VIEW_OWN_GRADES],
    PARENT: [Permission.VIEW_CHILD_PROGRESS],
}