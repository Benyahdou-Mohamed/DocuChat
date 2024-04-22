'use client'
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();
interface PdfRendererProps{
  url:string
}

const PdfRenderer = ({url}:PdfRendererProps) => {
  const { toast } = useToast()
  const [numPages,setNumPages] = useState(0)
  const [currPage,SetCurrPage]= useState(1)


  const pageToast=()=>{
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.Try again",
      
    })
  }
  //it takes the width of the div and a useResizeDetector hook (responsive) so that we use width in pages componnent 
  const {width,ref}= useResizeDetector()
  return (
   <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
        <div className="h-14 w-full border-b border-zinc-200 items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
                <Button onClick={()=>{
                    SetCurrPage((prev)=>(
                      prev-1>1?(prev-1):(1)
                    ))
                }} variant='ghost' aria-label='previous page'>
                  <ChevronDown className='h-4 w-4'/>
                </Button>
                <div className="flex items-center gap-1.5">
                  <Input className='h-6 w-8 text-sm'/>
                  <p className='text-zinc-700 text-sm space-x-1'>
                    <span>/</span>
                    <span>{numPages}</span>
                  </p>
                </div>
                <Button onClick={()=>{
                    SetCurrPage((prev)=>(
                      prev+1<=numPages?(prev+1):(prev)
                    ))
                }} variant='ghost' aria-label='previous page'>
                  <ChevronUp className='h-4 w-4'/>
                </Button>
            </div>

        </div>
        <div className="flex-1 w-full max-h-screen">
          <div ref={ref} className="">
            <Document onLoadError={()=> {toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.Try again",
                    
                  })}}
                  onLoadSuccess={({numPages})=>{
                    setNumPages(numPages)
                  }}
              loading={
              <div className='flex justify-center'>
                <Loader2 className='my-24 h-26 w-6 animate-spin'/>
              </div>
            } file={url} className="max-h-full">
                <Page width={width? width :1 } pageNumber={currPage} />
            </Document>
            
          </div>
        </div>

   </div>
  )
}

export default PdfRenderer