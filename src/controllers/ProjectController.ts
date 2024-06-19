import type { Request, Response } from "express";
import Project from "../models/Projects";

export class ProjectController {


    static createProject = async (req : Request, res : Response) => {
        
        try {
            const project = await Project.create(req.body)
            res.json({
                message : "Project created",
                project : project})
        } catch (error) {
            res.json({
                message : "Error creating project",
                error : error
            })
        }

    }

    static getAllProjects = async (req : Request, res : Response) => {
        
        try {
            const projects = await Project.find()
            res.json({projects : projects})
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req : Request, res : Response) => {
        
        try {
            const project = await Project.findById(req.params.id).populate('tasks')
            res.json({project : project})
            if(!project){
                res.status(404).json({message : "project not found"})
            }
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req : Request, res : Response) => {
        const { id } = req.params
        
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)
            if (!project) {
                res.status(404).json({ message: "Project not found" });
                return;
            }
            
            res.json({
                message : "Project updated",
                data : project
            })
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req : Request, res : Response) => {
        const { id } = req.params
        
        try {
            const project = await Project.findByIdAndDelete(id)
            if (!project) {
                res.status(404).json({ message: "Project not found" });
                return;
            }
            
            res.json({project : {
                message : "Project deleted",
                data: project
            } })
        } catch (error) {
            console.log(error)
        }
    }

}