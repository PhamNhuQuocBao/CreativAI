'use client'

import React from 'react'
import Logo from '../common/Logo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'

const Navbar = () => {
  const router = useRouter()
  return (
    <div className=" fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-2 py-3 container">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 w-full">
            <Link href="/home">
              <Logo />
            </Link>
            <Input className="w-full max-w-[700px]" placeholder="Search..." />
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push(ROUTES.BLOG)}>
              Create post
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Create post</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
