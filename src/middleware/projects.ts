import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Projects";
import { check, validationResult } from "express-validator";

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export const ProjectValidation = async (req: Request, res: Response, next: NextFunction) => {
    // Validaciones
    await check("projectName", "El nombre del proyecto es obligatorio").not().isEmpty().run(req);
    await check("clientName", "El nombre del cliente es obligatorio").not().isEmpty().run(req);
    await check("description", "La descripción es obligatoria").not().isEmpty().run(req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } next();
}

export const validateId = async (req: Request, res: Response, next: NextFunction) => {

    await check("id", "ID no válido").isMongoId().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "ID no válido" });
    }
    next();
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {

        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            const error = new Error('Error creating project')
            return res.status(404).json({ error: error.message })
        }
        req.project = project
        next()
    } catch (error) {
        return res.status(500).json({ error: 'There was an error' })
    }
}

export const validateProjectId = async (req: Request, res: Response, next: NextFunction) => {

    await check("projectId").isMongoId().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "invalid projectId" });
    }
    next();
}