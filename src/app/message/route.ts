import { db } from "@/db";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST =async(req:NextRequest)=>{
    //endpoint of assking pdf
    const body = await req.json()
    const {getUser}=getKindeServerSession()
    const user =await getUser()
    if(!user){
        return new Response('UNAUTHORIZED',{status:401})
    }
    //sendMessageValidator is a function i create in lib folder to validate that the data sended in body is valide using ZOD
    const {fileId,message}= sendMessageValidator.parse(body)

    const file =await db.file.findFirst({
        where:{
            id:fileId,
            userId:user.id
        }
    })
    if(!file){
        return new Response('File Not Found',{status:404})
    }
   
    await db.message.create({
        data:{
            text:message,
            isUserMessage:true,
            userId:user.id,
            fileId
        },
    })
    //
}