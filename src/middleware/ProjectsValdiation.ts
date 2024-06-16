import { Request, Response, NextFunction } from "express";
import { body, check, param, validationResult } from "express-validator";
export const newProjectValidation = async (req: Request, res: Response, next: NextFunction) => {
    // Validaciones
    await check("projectName", "El nombre del proyecto es obligatorio").not().isEmpty().run(req);
    await check("clientName", "El nombre del cliente es obligatorio").not().isEmpty().run(req);
    await check("description", "La descripción es obligatoria").not().isEmpty().run(req);
       
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } next();
   }

   export const validateId=  async(req: Request, res: Response, next: NextFunction) => {

    await check("id", "ID no válido").isMongoId().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "ID no válido" });
    }
    next();
}
