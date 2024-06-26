import esxpress, { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { ProjectValidation, projectExists, validateId, validateProjectId } from "../middleware/projects";
import { TaskValidation, taskBelongsToProject, taskExists, validateStatus, validateTaskId } from "../middleware/task";
import { authenticate } from "../middleware/auth";

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
    TaskController.updateTask
)
router.delete("/:projectId/tasks/:taskId",
    TaskController.deleteTask
)
router.post("/:projectId/tasks/:taskId/status",
    validateStatus,
    TaskController.updateTaskStatus
)

export default router 