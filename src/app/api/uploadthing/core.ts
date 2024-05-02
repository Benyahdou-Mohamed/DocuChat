import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
const f = createUploadthing();
 

 
export const ourFileRouter = {
 
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
   
    .middleware(async ({ req }) => {
        const {getUser}=getKindeServerSession()
        const user =await getUser()
        if(!user || !user.id){
            throw new Error('Unauthorized')
        }
        return{userId:user.id}
     
 
     
      return { };
    })
    .onUploadComplete(async ({ metadata, file }) => {
     
      const createdFile=await  db.file.create({
        data: {
            key:file.key,
            name:file.name,
            userId:metadata.userId,
            url: `https://utfs.io/f/${file.key}`,
            uploadStatus: 'PROCESSING',
            
          }
      }) 
      try {
        const response = await fetch(`https://utfs.io/f/${file.key}`)
        
        const blob= await response.blob()
        const loader=new PDFLoader(blob)
        //page level text
        const pageLevelDocs = await loader.load()
        //number of pages
        const pagesAmt = pageLevelDocs.length
        // vectorize and index entire document
        const pinecone = new Pinecone();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
        

         const embeddings = new OpenAIEmbeddings({
             openAIApiKey: "sk-proj-rDeq52uCoWPGdT5iN937T3BlbkFJehzuMFPSyZprebItv2Qt",
         })

         await PineconeStore.fromDocuments(
           pageLevelDocs,
           embeddings,
           {
            pineconeIndex,
           namespace: createdFile.id,
           }
           )

          await db.file.update({
           data: {
         uploadStatus: 'SUCCESS',
          },
           where: {
             id: createdFile.id,
           },
           })
      } catch (error) {
        console.log("durring indexin",error)
        await db.file.update({
          data:{
            uploadStatus:'FAILED'
          },where:{
            id:createdFile.id
          }
        })
      } 
      // console.log("Upload complete for userId:", metadata.userId);
 
      // console.log("file url", file.url);
 
      
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;