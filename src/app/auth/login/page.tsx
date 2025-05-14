'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants'

const Page = () => {
  const router = useRouter()

  return (
    <div className="max-w-[440px] w-full">
      <div className="space-y-4">
        <Input className="w-full" placeholder="Email" />

        <Input className="w-full" placeholder="Password" />

        <Button className="w-full" onClick={() => router.push(ROUTES.INDEX)}>
          Login
        </Button>

        <div className="flex justify-between w-full">
          <p className="flex-1">{`Don't have an account?`}</p>
          <Link href="/auth/register" className="text-blue-500 underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
