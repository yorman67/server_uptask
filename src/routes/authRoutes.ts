import esxpress, { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { accountValidation, emailValidation, loginValidation, authenticate, validateRecoverPassword, validateToken } from "../middleware/auth";


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

router.post("/recover-password",
    emailValidation,
    AuthController.recoverPassword
)

router.post("/valide-token-recover-password",
    validateToken,
    AuthController.valideTokenRecoverPassword 
) 


router.post("/update-password/:token",
    validateRecoverPassword,
    AuthController.changePassword
)

router.get("/get-user",
    authenticate,
    AuthController.user
)

export default router