import esxpress, { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { accountValidation, loginValidation, validateToken } from "../middleware/auth";


const router = esxpress.Router();

router.post("/create-account",
    accountValidation,
    AuthController.createAccount
)

router.post("/confirm-account",
    validateToken,
    AuthController.confirmAccount
)

router.post("/resend-token",
    AuthController.resedToken
)

router.post("/login",
    loginValidation,
    AuthController.login
)

export default router