import React from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
interface ChatInputProps{
  isDisabled:boolean
}
const ChatInput = ({isDisabled}:ChatInputProps) => {
  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow p-4'>
            <div className='relative'>
                <Textarea rows={1} autoFocus className= 'resize-none pr-12 text-base py-3  scrollbar-thumb-rounded ' maxRows={4} aria-label='Enter your question ...' className=''/>
                <Button className='absolute h-9 bottom-[1.3px] right-[2px]'>
                  <Send className='h-4 w-4' />
                </Button>
              </div>
          </div>
        </div>

        </div>
    </div>
  )
}

export default ChatInput