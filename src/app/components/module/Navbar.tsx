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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProfileForm } from './ProfileForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import authService from '@/services/auth.service'

const Navbar = () => {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const user = authService.getCurrentUser()

  const handleOpenProfile = () => {
    setIsDropdownOpen(false) // Close dropdown first
    setIsProfileOpen(true)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
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

            {/* Profile Menu */}
            <div className="relative">
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.avatar || 'https://github.com/shadcn.png'}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer transition-all"
                    onClick={handleOpenProfile}
                  >
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer transition-all"
                    onClick={() => router.push(ROUTES.HOME)}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer transition-all"
                    onClick={() => router.push(ROUTES.BLOG)}
                  >
                    Create post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-black hover:!text-white transition-all"
                    onClick={() => {
                      authService.logout()
                      router.push(ROUTES.LOGIN)
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dialog */}
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4">
                    <ProfileForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
