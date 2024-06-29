import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]
        console.log(whiteList)
        if(whiteList.includes(origin)){
            callback(null, true);
        } else {
            console.log("daskjkldasjdklasjdaklñsdjñjdñk------------------------------------------")
            console.log(whiteList)
            callback(new Error("Not allowed by CORS"));
        }
    }
}