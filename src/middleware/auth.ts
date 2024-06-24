import { check, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";


export const accountValidation = async (req: Request, res: Response, next: NextFunction) => {
    // Validaciones
    await check("name", "El nombre del proyecto es obligatorio").not().isEmpty().run(req);
    await check("password", "La contraseña es obligatoria, minimo 6 caracteres").not().isEmpty().isLength({ min: 6 }).run(req);
    await check("password_confirmation", "La confirmacion de la contraseña es obligatoria").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true
    }).run(req);
    await check("email", "El email es obligatorio").not().isEmpty().run(req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Error creating account')
        return res.status(404).json({
             error: error.message,
             errors: errors
             })
    } next();
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {   

    await check("token").not().isEmpty().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('token can not be empty')
        return res.status(404).json({
             error: error.message,
             errors: errors
             })
    } next();
}

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {

    await check("email").not().isEmpty().run(req);
    await check("password").not().isEmpty().run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('email or password can not be empty')
        return res.status(404).json({
             error: error.message,
             errors: errors
             })
    } next();
}
