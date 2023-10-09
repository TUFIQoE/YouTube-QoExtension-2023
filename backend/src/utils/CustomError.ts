import { ValidationError } from "express-validator"

export class CustomError extends Error{
    public statusCode: number | null = null
    public errors: ValidationError[] | null = null

    constructor(msg: string, code: number, errors?: ValidationError[]){
        super(msg)
        this.name = Error.name
        this.errors = errors
        this.statusCode = code
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this)
    }
}

