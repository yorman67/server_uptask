import { transport } from "../config/nodemailer"


interface IEmail {
    email: string
    token: string
    name: string
}
export class AuthEmail {
    static sendAccountConfirmation = async ( user : IEmail ) => {
        await transport.sendMail({
            from : "Upask <admin@upask.com>",
            to : user.email,
            subject : "Confirm your account",
            text : "Confirm your account by upask",
            html : `
                <h1>Confirm your account</h1>
                <p>Hi ${user.name}</p>
                <p>Please click on the link below to confirm your account</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm my account</a>
                <p>If you did not create an account, please ignore this email</p>
                <p>Tokens valid for 10 minutes <b>${user.token}</b></p>
            `
        })

    }

    static sendPasswordRecovery = async ( user : IEmail ) => {
        await transport.sendMail({
            from : "Upask <admin@upask.com>",
            to : user.email,
            subject : "recover your password",
            text : "recover your password",
            html : `
                <h1>recover your password</h1>
                <p>Hi ${user.name}</p>
                <p>Please click on the link below to recover your password</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">reset my password</a>
                <p>if you dind not request a password recovery, please ignore this email</p>
                <p>Tokens valid for 10 minutes <b>${user.token}</b></p>
            `
        })

    }
}