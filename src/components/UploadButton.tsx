"use client"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { DialogContent } from "./ui/dialog"
import Dropzone from 'react-dropzone'
import { Cloud, File, Loader2 } from "lucide-react"
import { Progress } from "./ui/progress"
import { resolve } from "path"
import { useUploadThing } from "@/lib/uploadthing"

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { redirect } from "next/dist/server/api-utils"
import { useRouter } from "next/navigation"
const UploadDropZone=()=>{
    const router = useRouter()
    const [isUploading,setIsUploading] =useState(false)
    const [uploadProgress,setUploadProgress] =useState(0)
    
    const { toast } = useToast()
    const {startUpload}= useUploadThing("pdfUploader")
    const {mutate:startPolling} = trpc.getFile.useMutation({
        onSuccess:(file)=>{
            router.push(`/dashboard/${file.id}`)
        },
        retry:true,
        retryDelay: 500,
    })
    const startSumilateProgress=()=>{
        setUploadProgress(0)
        const interval =setInterval(()=>{
            setUploadProgress((prev)=>{
                if(prev >=95){
                    clearInterval(interval)
                    return prev
                }
                return prev+5
            })
        },500)
        return interval
    }
    return <Dropzone multiple={false} onDrop={
        async (acceptedFile)=>{
            setIsUploading(true)
            const progressInterval= startSumilateProgress()
            //it will upload and add it to db , the logic of adding to db is under core.ts
            const res= await startUpload(acceptedFile)
            if(!res){
               return toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.Try again",
                    
                  })
            }
            const[fileResponse]=res
            const key= fileResponse?.key
            if(!key){
                return toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.Try again",
                    
                  })
            }

            //handle file uploading
            clearInterval(progressInterval)
            setUploadProgress(100)
            startPolling({key})

        }}>
        {({getRootProps,getInputProps,acceptedFiles})=>(
            <div {...getRootProps()} className="border h-72 m-4 border-dashed border-gray-300 rounded-lg">
                <div className="flex items-center justify-center h-full w-full">
                    <input {...getInputProps()} />
                    <label htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-grey-100"
                    >
                        <div className="flex flex-col items-center text-center justify-center pt-5 pb-6">
                            <Cloud className="h-24 w-24  text-sm text-green-400 mb-2"/>
                              <p className="mb-2 text-sm text-black">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                                <p className="text-zinc-600">PDF (UP To 4MB)</p>                                
                              </p>
                        
                        </div>
                        {acceptedFiles && acceptedFiles[0]? (
                            <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 ">
                                <div className="px-3 py-2 h-full grid place-items-center">
                                    <File className="h-4 w-4 text-blue-500"/>
                                </div>
                                <div className="px-3 py-2 h-full text-sm truncate">
                                    {acceptedFiles[0].name}
                                </div>
                            </div>
                        ):null}
                        {isUploading ?(
                            <div className="w-full mt-4 max-w-xs mx-auto">
                                <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200"/>
                                {uploadProgress === 100 ? (
                                  <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                                  <Loader2 className='h-3 h w-3 animate-spin' />
                                         Redirecting...
                                         </div>
                                ) : null}
                            </div>
                        ):null

                        }
                    </label>
                </div>
            </div>
        )}
        
    </Dropzone>
    
}
const UploadButton = () => {
    const [isOpen,setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={(v)=>{
        if(!v){
            setIsOpen(v)
        }
    }}>
        <DialogTrigger onClick={()=>setIsOpen(true)} asChild>
            <Button className="bg-green-600 hover:bg-green-500">Upload PDF</Button>
        </DialogTrigger>
        <DialogContent>
            {/*componnet */}
            <UploadDropZone/>
        </DialogContent>
    </Dialog>
  )
}

export default UploadButton