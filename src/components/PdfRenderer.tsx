import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const PdfRenderer = () => {
  
  return (
   <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
        <div className="h-14 w-full border-b border-zinc-200 items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
                top bar
            </div>

        </div>

   </div>
  )
}

export default PdfRenderer