import { CorsOptions } from "cors";
import { config } from "dotenv";
config()


export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]
        if(whiteList.includes(origin)){
            callback(null, true);
        } else {
            console.log(whiteList)
            callback(new Error("Not allowed by CORS"));
        }
    }
}