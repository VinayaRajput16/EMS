// src/server.js

import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";

async function startServer(){
    
    try{
        await connectDB();

        app.listen(env.port, ()=> {
            console.log(`EMS backend running on port ${env.port}`);
        });
    } catch (error){
        console.error("Failed to start sever", error);
        process.exit(1);
    }

}

startServer();