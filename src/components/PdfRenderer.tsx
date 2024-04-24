'use client'
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import {useForm} from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import PdfFullScreen from './PdfFullScreen';
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
  const [scale,SetScale]= useState(1)
  const [rotation,setRotation] = useState(0)
  //fix display slownnes when scaling pdf
  const [renderedScale, setRenderedScale] = useState<number | null>(null)
  const isLoading = renderedScale !== scale
  const CustomPageValidator = z.object({
    page: z.string().refine((num)=>Number(num)>0 && Number(num)<=numPages!) 
  })
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>
  
  const {register,handleSubmit,formState:{errors},setValue}= useForm<TCustomPageValidator>({
    defaultValues:{
      page:"1"
    },
    resolver:zodResolver(CustomPageValidator)
  })


  const handlePageSubmit=({page}:TCustomPageValidator)=>{
    SetCurrPage(Number(page))
    setValue('page',String(page))
  }
  //it takes the width of the div and a useResizeDetector hook (responsive) so that we use width in pages componnent 
  const {width,ref}= useResizeDetector()
  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
        <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
             <div className='flex items-center gap-1.5'>
                <Button onClick={()=>{
                    SetCurrPage((prev)=>(
                      prev-1>0?(prev-1):(1)
                    ))
                    setValue('page',String(currPage-1))
                }} variant='ghost' aria-label='previous page'>
                  <ChevronDown className='h-4 w-4'/>
                </Button>
                <div className="flex items-center gap-1.5">
                  <Input {...register('page')} 
                  className={cn(' h-8 w-12 text-sm',errors.page && "focus-visible:ring-red-500")}
                  onKeyDown={(e)=>{if(e.key==="Enter"){
                    handleSubmit(handlePageSubmit)()
                  }}}
                  />
                  <p className='text-zinc-700 text-sm space-x-1'>
                    <span>/</span>
                    <span>{numPages}</span>
                  </p>
                </div>
                <Button onClick={()=>{
                    SetCurrPage((prev)=>(
                      prev+1<=numPages?(prev+1):(prev)
                    ))
                    setValue('page',String(currPage+1))
                }} variant='ghost' aria-label='previous page'>
                  <ChevronUp className='h-4 w-4'/>
                </Button>
                
            
            </div>
            
            <div className="space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='gap-1.5' aria-label='zoon' variant='ghost'>
                    <Search className='h-4 w-4'/>
                    {scale*100}%
                    <ChevronDown className='h-4 w-4 opacity-60'/>
                  </Button>
                  
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={()=>SetScale(1)}>
                    100%
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={()=>SetScale(1.5)}>
                    150%
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={()=>SetScale(2)}>
                    200%
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

                <Button
                  onClick={()=>setRotation((prev)=>prev+90)} 
                  variant={'ghost'} aria-label='Rotate 90 Degree'> 
                  <RotateCw className='h-4 w-4'/>
                </Button>
                
                <PdfFullScreen url={url}/>
            </div>
        </div>
        <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]' >
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
              
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoading ? 'hidden' : '')}
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={'@' + scale}
                loading={
                  <div className='flex justify-center'>
                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                  </div>
                }
                onRenderSuccess={() =>
                  setRenderedScale(scale)
                }
              />
            </Document>
            
              
          
          </div>
          </SimpleBar>
          
        </div>
            
   </div>
  )
}

export default PdfRenderer