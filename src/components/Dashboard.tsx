"use client"
import { trpc } from "@/app/_trpc/client"
import UploadButton from "./UploadButton"
import { Ghost, MessageSquare, Plus, Trash } from "lucide-react"
import Skelton from "react-loading-skeleton"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { Toaster } from "./ui/toaster"

const Dashboard = () => {
  const utils =trpc.useContext()

  
  const {data:files,isLoading}= trpc.getUserFiles.useQuery()
  const { toast } = useToast()
  
  const {mutate:deleteFile}=trpc.deleteFile.useMutation({
    onSuccess:()=>{
      toast({
        description: "The file has been deleted successfully",
      })
      utils.getUserFiles.invalidate()
      
    }
  }
  )
  
  return (
    <main className="mx-auto max-w-7xl md:p-10">
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
            <h1 className="mb-3 font-bold text-5xl text-black">My Files</h1>
            <UploadButton/>
        </div>
        {files && files?.length !==0?(
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
              {files.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).map((file)=>(
                <li className="col-span-1 divide-y divide-gray-200 rounded-lg  bg-white shadow transition hover:shadow-lg">
                  <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                    <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
                          </div>
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-2">
                              <h3 className="capitalize truncate text-lg font-medium text-zinc-900">
                                {file.name}
                              </h3>
                            </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4"/>
                        {format(new Date(file.createdAt), "dd/MM/yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4"/>
                      Mocked
                      </div>
                    <Button onClick={()=>{toast({description: "The file has been deleted successfully",}), deleteFile({id:file.id})
                    }} size="sm" className="w-full bg-white hover:bg-white text-red-500">
                      <Trash className="h-4 w-4 text-red-600 hover:text-red-500"/>
                    </Button>
                  </div>
                  <Toaster />
                  
                  
                </li>
              ))

              }
          </ul>
      )
        :isLoading?(<div>
          <Skelton height={100} className="my-2" count={3}/>
        </div>)
        :(<div className="mt-32 flex flex-col items-center gap-2">
            <Ghost className="h-12 w-12 text-black"/>
            <h3 className="font-semibold text-xl"> There are No files </h3>
            <p> lest&apos;s Upload your first File</p>
          
    
    
        </div>)}
    </main>

  )
}

export default Dashboard