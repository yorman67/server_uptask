import type { Request, Response } from "express";
import Auth from "../models/Auth";
import Project from "../models/Projects";

export class TeamController {

    static findMemberbyEmail = async (req: Request, res: Response) => {
        const { email } = req.body
        try {
            const user = await Auth.findOne({ email }).select('_id name email')
            if (!user) {
                const error = new Error('Usuario No Encontrado')
                return res.status(404).json({ error: error.message })
            }
            res.json({ user: user })
        } catch (error) {
            console.log(error)
        }
    }

    static addMemberbyId = async (req: Request, res: Response) => {
        const { id } = req.body

        try {
            const user = await Auth.findById(id).select('_id name email')

            if (!user) {
                const error = new Error('Usuario No Encontrado')
                return res.status(404).json({ error: error.message })
            }

            if (req.project.team.some(team => team._id.toString() === user._id.toString())) {
                const error = new Error("User already in team")
                return res.status(409).json({ 
                    error:  error.message
                 });
            }

            req.project.team.push(user)
            await req.project.save()

            res.json({
                message: 'User added successfully',
                project: req.project
            })
        } catch (error) {
            console.log(error)
        }
    }

    static getTeamProject = async (req: Request, res: Response) => {
        const { team } = await req.project.populate('team', '_id name email')

        res.json({ team: team })
    }


    static removeMember = async (req: Request, res: Response) => {

        const { userId } = req.params

        if (!req.project.team.some(team => team._id.toString() === userId)) {
            const error = new Error("user does not exist")
            return res.status(409).json({ 
                error:  error.message
             });
        }

        req.project.team = req.project.team.filter(team => team._id.toString() !== userId)

        await req.project.save()
        res.json({ message: 'User removed successfully', project: req.project })
    }

}