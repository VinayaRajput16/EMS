import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDB(){
    try {
        await prisma.$connect();
        console.log("Database connected")
    } catch (error){
        console.error("Database coonection failed", error);
        process.exit(1);
    }
}

export default prisma;
