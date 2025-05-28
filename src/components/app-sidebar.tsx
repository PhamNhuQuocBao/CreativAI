'use client'

import {
  Home,
  FileSpreadsheet,
  BarChart2,
  LogOut,
  ExternalLink,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants'
import authService from '@/services/auth.service'
import { useRouter } from 'next/navigation'

// Menu items.
const items = [
  {
    title: 'Home',
    url: ROUTES.HOME,
    icon: Home,
  },
  {
    title: 'Blog',
    url: ROUTES.BLOG,
    icon: FileSpreadsheet,
  },
  {
    title: 'Statistics',
    url: ROUTES.STATISTICS,
    icon: BarChart2,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    authService.logout()
    router.push(ROUTES.LOGIN)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        'hover:!bg-black hover:text-white transition-all',
                        pathname.includes(item.url) && 'bg-black text-white'
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/"
                    className="hover:!bg-black hover:text-white transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Go to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="hover:!bg-red-500 hover:text-white transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
