import Dashboard from '@/components/Dashboard'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const {getUser}=getKindeServerSession()
  const user = await getUser()
  if(!user || !user.id){
    redirect('/auth-callback?origin=dashboard')
  }
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  })
  console.log("dbuser",dbUser)
  if(!dbUser){redirect('/auth-callback?origin=dashboard')}
  
  return (
    <div><Dashboard/></div>
  )
}

export default page