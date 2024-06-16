import esxpress from "express";
import { ProjectController } from "../controllers/ProjectController";
import { newProjectValidation, validateId } from "../middleware/ProjectsValdiation";

const router = esxpress.Router();

router.post("/",newProjectValidation,ProjectController.createProject,)
router.get("/", ProjectController.getAllProjects)
router.get("/:id", validateId,ProjectController.getProjectById)
router.put("/:id", validateId,newProjectValidation,ProjectController.updateProject)
router.delete("/:id", validateId,ProjectController.deleteProject)

export default router 