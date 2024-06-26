import type { Request, Response } from "express";
import Auth from "../models/Auth";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {

    static createAccount = async function (req: Request, res: Response) {
        try {

            
            const { password, email } = req.body
            // prevent duplicate emails
            const userExists = await Auth.findOne({ email })
            

            if (userExists) {
                const error = new Error('user already exists')
                return res.status(409).json({ error: error.message })
            }

            // create user
            const user = new Auth(req.body)

            // Hash password
            user.password = await hashPassword(password)

            //generate token{
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // send email
            await AuthEmail.sendAccountConfirmation({
                email: user.email,
                token: token.token,
                name: user.name
            })

            await Promise.allSettled([user.save(), token.save()])

            res.json({
                message: "account created, check your email to confirm your account",
                user: user
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static confirmAccount = async function (req: Request, res: Response) {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })

            // check if token already exists
            if (!tokenExists) {
                const error = new Error('Invalid token')
                return res.status(401).json({ error: error.message })
            }

            // check if user already exists
            const userId = tokenExists.user
            const user = await Auth.findById(userId)
            if (!user) {
                const error = new Error('user not found')
                return res.status(404).json({ error: error.message })
            }
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.json({
                message: 'Account confirmed',
                user: user
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static resedToken  = async function(req: Request, res: Response) {
        try {
            const { email } = req.body
            const user = await Auth.findOne({ email })

            if (!user ) {
                const error = new Error('user not found')
                return res.status(404).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('user already confirmed')
                return res.status(400).json({ error: error.message })
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()
            await AuthEmail.sendAccountConfirmation({
                email: user.email,
                token: token.token,
                name: user.name
            })
            res.json({
                message: "token sent to your email",
                user: user
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static login = async function (req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await Auth.findOne({ email })
            if (!user) {
                const error = new Error('user not found')
                return res.status(404).json({ error: error.message })
            }

            if (!user.confirmed) {
                const token = new Token()
                token.token = generateToken()
                token.user = user.id

                await token.save()

                await AuthEmail.sendAccountConfirmation({
                    email: user.email,
                    token: token.token,
                    name: user.name
                })

                return res.json({ message: 'we have sent a token to your email ', token })
            }

            const validPassword = await checkPassword(password, user.password) 

            if (!validPassword) {
                const error = new Error('email or password incorrect')
                return res.status(401).json({ error: error.message })
            }

            const token = generateJWT({ id: user.id })
    
            res.json({
                message: 'user logged in',
                token,
            })

        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static recoverPassword = async function (req: Request, res: Response) {
        try {
            const { email } = req.body
            const user = await Auth.findOne({ email })

            if (!user ) {
                const error = new Error('user not found')
                return res.status(404).json({ error: error.message })
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            await AuthEmail.sendPasswordRecovery({
                email: user.email,
                token: token.token,
                name: user.name
            })
            
            res.json({
                message: "check your email to recover your password",
                user: user
            })

        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static valideTokenRecoverPassword = async function (req: Request, res: Response) {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid token')
                return res.status(401).json({ error: error.message })
            }

            res.json({
                message: 'token valid'
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static changePassword = async function (req: Request, res: Response) {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            
            if (!tokenExists) {
                const error = new Error('Invalid token')
                return res.status(401).json({ error: error.message })
            }

            const user = await Auth.findById(tokenExists.user)
            if (!user) {
                const error = new Error('user not found')
                return res.status(404).json({ error: error.message })
            }
            user.password = await hashPassword(password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.json({
                message: 'password changed'
            })  
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static user = async function (req: Request, res: Response) {
        try {
            
            res.json({
                user: req.auth
            })
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }

}       