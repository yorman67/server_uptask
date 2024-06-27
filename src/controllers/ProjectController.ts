import type { Request, Response } from "express";
import Project from "../models/Projects";

export class ProjectController {


    static createProject = async (req: Request, res: Response) => {

        try {
            const project = req.body
            //assign manager
            project.manager = req.auth.id

            //Create
            await Project.create(project)

            res.json({
                message: "Project created",
                project: project
            })
        } catch (error) {
            res.json({
                message: "Error creating project",
                error: error
            })
        }

    }

    static getAllProjects = async (req: Request, res: Response) => {
       
        try {
            const projects = await Project.find({
                $or: [
                    { manager: {$in: req.auth.id} },
                    { team: {$in: req.auth.id} }
                ]
            })
            res.json({ projects: projects })
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {

        try {
            const project = await Project.findById(req.params.id).populate('tasks')
          
            if (!project) {
                res.status(404).json({ message: "project not found" })
            }

            if (project.manager.toString() !== req.auth.id.toString() && !project.team.includes(req.auth.id)) {
                res.status(401).json({ message: "Unauthorized" })
            }

            res.json({ project: project })
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const project = await Project.findById(id)
            if (!project) {
                res.status(404).json({ message: "Project not found" });
                return;
            }
            if (project.manager.toString() !== req.auth.id.toString()) {
                res.status(401).json({ message: "Unauthorized, you are not the project manager" })
            }
            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description

            await project.save()

            res.json({
                message: "Project updated",
                data: project
            })
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params

        try {

            const project = await Project.findById(id)
            if (!project) {
                res.status(404).json({ message: "Project not found" });
                return;
            }

            if (project.manager.toString() !== req.auth.id.toString()) {
                res.status(401).json({ message: "Unauthorized, you are not the project manager" })
            }

            await project.deleteOne()

            res.json({  
                project: {
                    message: "Project deleted",
                    data: project
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    
}