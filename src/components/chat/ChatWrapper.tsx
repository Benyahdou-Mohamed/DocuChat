"use client"
import { trpc } from "@/app/_trpc/client"
import Messages from "./Messages"
import ChatInput from "./ChatInput"
import { ChevronLeft, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "../ui/button"

interface ChatWrapperProps{
  fileId:string
}
const ChatWrapper = ({fileId}:ChatWrapperProps) => {
  
  const{data,isLoading}=trpc.getFileUploadStatus.useQuery({
    fileId  
  },{ 
    refetchInterval:(data)=>
      data?.status==="SUCCESS" || 
      data?.status ==="FAILED"? false : 500
  }
  
)
//data?.status ==="PROCESSING" 
  if(isLoading){
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 mt-24 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col align-center items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Loading...
            </h3>
            <p className='text-zinc-500 text-sm'>
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled/>
      </div>
    )
  }
  if(data?.status ==="PROCESSING" ){
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 mt-24 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col align-center items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Processing your PDF...
            </h3>
            <p className='text-zinc-500 text-sm'>
              This wont&apos;s take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled/>
      </div>
    )
  }
  if(data?.status ==="FAILED" ){
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 mt-24 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col align-center items-center gap-2'>
            <XCircle className='h-8 w-8 text-red-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Your PDF containe too many pages ...
            </h3>
            <p className='text-zinc-500 text-sm'>
              Upgride your Account to unlock the chat
            </p>
            <Link href='/dashboard' className={buttonVariants({variant:"secondary",className:"mt-4"})}>
              <ChevronLeft className="h-3 mr-1.5"/>
              Back to dashbord
              </Link>
          </div>
        </div>

        <ChatInput isDisabled/>
      </div>
    )
  }
  return (
    <div className="relative min-h-full bg-zinc-50  justify-between flex-col
     gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages/>
      </div>
      <ChatInput isDisabled/>
    </div>
  )
}

export default ChatWrapper