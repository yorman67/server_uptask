import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";
import { check, validationResult } from "express-validator";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export const TaskValidation = async (req: Request, res: Response, next: NextFunction) => {
    // Validaciones
    await check("name", "El nombre de la tarea es obligatorio").not().isEmpty().run(req);
    await check("description", "La descripción es obligatoria").not().isEmpty().run(req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } next();
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error('Task not found')
            return res.status(404).json({ error: error.message })
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: 'There was an error' })
    }
}

export const validateTaskId = async (req: Request, res: Response, next: NextFunction) => {

    await check("taskId", "invalid idTask").isMongoId().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "invalid idTask" });
    }
    next();
}


export const validateStatus = async (req: Request, res: Response, next: NextFunction) => {

    await check("status").not().isEmpty().run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "status is required " });
    }
    next();
}

export const taskBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
    if (req.task.project.toString() !== req.project.id) {
        const error = new Error('this task does not belong to this project')
        return res.status(404).json({ error: error.message })
    }
    next();
}

export const hasAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    if (req.auth.id.toString() !== req.project.manager.toString()) {
        const error = new Error('action not allowed')
        return res.status(400).json({ error: error.message })
    }
    next();
}