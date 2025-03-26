'use client'

import { createDocument } from '@/lib/actions/room.actions'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface AddDocumentBtnProps {
  userId: string;
  email: string;
  className?: string;
}

const AddDocumentBtn = ({ userId, email, className }: AddDocumentBtnProps) => {
  const router = useRouter()

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email })
      if (room) router.push(`/documents/${room.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  return (
    <div className={className}>
      <Button 
        onClick={addDocumentHandler} 
        className="gradient-blue flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <Image 
          src="/assets/icons/add.svg" 
          alt="Add document" 
          width={20} 
          height={20}
          className="filter-white"
        />
        <span className="hidden sm:inline text-white font-medium">
          Start a blank document
        </span>
      </Button>
    </div>
  )
}

export default AddDocumentBtn