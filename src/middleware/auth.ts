import { body, check, param, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Auth, { IAuth } from "../models/Auth";


declare global {
    namespace Express {
        interface Request {
            auth?:IAuth
        }
    }
}

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

export const emailValidation = async (req: Request, res: Response, next: NextFunction) => {
    await check("email").not().isEmpty().isEmail().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('email can not be empty, must be a valid email')
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

export const validateRecoverPassword = async (req: Request, res: Response, next: NextFunction) => {

    // Validaciones
    await param("token", "debe ser numerico ").isNumeric().run(req);
    await body("password", "La contraseña es obligatoria, minimo 6 caracteres").not().isEmpty().isLength({ min: 6 }).run(req);
    await body("password_confirmation", "La confirmacion de la contraseña es obligatoria").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true
    }).run(req);


    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('password can not update, token is not correct')
        return res.status(404).json({
            error: error.message,
            errors: errors
        })
    } next();

}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('Not authorized')
        return res.status(401).json({
            error: error.message
        })
    }

    const token = bearer.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decoded === 'object' && decoded.payload.id) {
            const user = await Auth.findById(decoded.payload.id).select('_id name email')
            if(user) {
               req.auth = user
               next()
            }else{
                const error = new Error('invalid token')
                return res.status(500).json({
                    error: error.message
                })
            }
        }
       
    } catch (error) {
        return res.status(500).json({
            error: "invalid token"
        })
    }
}
