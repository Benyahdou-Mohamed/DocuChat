"use client"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { DialogContent } from "./ui/dialog"


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
            Example contet
        </DialogContent>
    </Dialog>
  )
}

export default UploadButton