import type { Request, Response } from "express";
import Task from "../models/Task";


export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()]) // allsetled es una promesa que se resuelve cuando todas las promesas se resuelven
            res.json({
                message: 'Task created successfully',
                task: task
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project')
            res.json({
                tasks: tasks
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static gettaskById = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id) {
                return res.status(404).json({ error: 'this task does not belong to this project' })
            }
            res.json({ tasks : req.task})
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id) {
                return res.status(404).json({ error: 'this task does not belong to this project' })
            }
            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()

            res.json({
                message: 'Task updated successfully',
                task: req.task
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {

            if (req.task.project.toString() !== req.project.id) {
                return res.status(404).json({ error: 'this task does not belong to this project' })
            }
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.json({
                message: 'Task deleted successfully',
                task: req.task
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })

        }
    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
    
            const { status } = req.body
            req.task.status = status
            await req.task.save()

            res.json({
                message: 'Task status updated successfully',
                task: req.task
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

}