import { ZodError } from "zod";

export function capitalize(text: string): string {
    if(!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatZodErrors(error: ZodError): string {
    return error.errors.map(err => {
        const nameError = capitalize(err.path.join("."));
        return `${nameError}: ${err.message}`
    }).join(", ")
}