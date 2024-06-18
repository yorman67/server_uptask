import esxpress, { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { ProjectValidation, projectExists, validateId, validateProjectId } from "../middleware/projects";
import { TaskValidation, taskExists, validateStatus, validateTaskId } from "../middleware/task";

const router = esxpress.Router();

/** routes for projects */
router.post("/",
    ProjectValidation,
    ProjectController.createProject,
)
router.get("/", 
    ProjectController.getAllProjects
)
router.get("/:id", 
    validateId,
    ProjectController.getProjectById
)
router.put("/:id", 
    validateId,
    ProjectValidation,
    ProjectController.updateProject
)
router.delete("/:id", 
    validateId,
    ProjectController.deleteProject
)

/** routes for tasks */

router.post("/:projectId/tasks",
    TaskValidation,
    TaskController.createTask
)
router.get("/:projectId/tasks",
    validateProjectId,
    projectExists,
    TaskController.getProjectTasks
)
router.get("/:projectId/tasks/:taskId",
    validateProjectId,
    projectExists,
    validateTaskId,
    taskExists,
    TaskController.gettaskById
)
router.put("/:projectId/tasks/:taskId",
    validateProjectId,
    projectExists,
    validateTaskId,
    TaskValidation,
    taskExists,
    TaskController.updateTask
)
router.delete("/:projectId/tasks/:taskId",
    validateProjectId,
    projectExists,
    validateTaskId,
    taskExists,
    TaskController.deleteTask
)
router.post("/:projectId/tasks/:taskId/status",
    validateProjectId,
    projectExists,
    validateTaskId,
    taskExists,
    validateStatus,
    TaskController.updateTaskStatus
)

export default router 