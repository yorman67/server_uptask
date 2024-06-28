import esxpress, { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { ProjectValidation, projectExists, userId, validateContentNote, validateEmail, validateId, validateNoteId, validateProjectId } from "../middleware/projects";
import { TaskValidation, hasAuthorization, taskBelongsToProject, taskExists, validateStatus, validateTaskId } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = esxpress.Router();

/** routes for projects */
router.param("id", validateId)
router.use(authenticate)

router.post("/",
    ProjectValidation,
    ProjectController.createProject,
)
router.get("/",
    ProjectController.getAllProjects
)
router.get("/:id",
    ProjectController.getProjectById
)
router.put("/:id",
    ProjectValidation,
    ProjectController.updateProject
)
router.delete("/:id",
    ProjectController.deleteProject
)

/** routes for tasks */
router.param("projectId", validateProjectId)
router.param("projectId", projectExists)

router.param("taskId", validateTaskId)
router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)

router.post("/:projectId/tasks",
    TaskValidation,
    hasAuthorization,
    TaskController.createTask
)
router.get("/:projectId/tasks",
    TaskController.getProjectTasks
)
router.get("/:projectId/tasks/:taskId",
    TaskController.gettaskById
)
router.put("/:projectId/tasks/:taskId",
    TaskValidation,
    hasAuthorization,
    TaskController.updateTask
)
router.delete("/:projectId/tasks/:taskId",
    hasAuthorization,
    TaskController.deleteTask
)
router.post("/:projectId/tasks/:taskId/status",
    validateStatus,
    TaskController.updateTaskStatus
)

/** routes for teams */
router.post("/:projectId/team/find",
    validateEmail,
    TeamController.findMemberbyEmail
)

router.post("/:projectId/team",
    validateId,
    TeamController.addMemberbyId
)

router.get("/:projectId/team",
    TeamController.getTeamProject
)

router.delete("/:projectId/team/:userId",
    userId,
    TeamController.removeMember
)

/** routes for notes */
router.post("/:projectId/tasks/:taskId/notes",
    validateContentNote,
    NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes",
    NoteController.getTaskNotes
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
    validateNoteId,
    NoteController.deleteNote
)

export default router 