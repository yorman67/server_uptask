import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";

type NodeParams = {
    noteId: string
}
export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {

        const note = new Note(req.body)
        note.createdBy = req.auth.id
        note.task = req.task.id
        console.log(req.task)
        req.task.notes.push(note.id)

        try {
            await Promise.allSettled([note.save(), req.task.save()])
            res.json({
                message: 'Note created successfully',
                note: note
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static getTaskNotes = async (req: Request<{},{},{INote}>, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id }).populate('createdBy')
            res.json({
                notes: notes
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static deleteNote = async (req: Request<NodeParams>, res: Response) => {
        
           
        const { noteId } = req.params
        const note = await Note.findById(noteId)

        if(!note) {
            const error = new Error('Note not found')
            return res.status(404).json({ error: error.message })
        }

        if(note.createdBy.toString() !== req.auth?.id) {
            const error = new Error('Action not allowed')
            return res.status(400).json({ error: error.message })
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())
        
        try {
            Promise.allSettled([note.deleteOne(), req.task.save()])
            res.json({
                message: 'Note deleted successfully'
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

}