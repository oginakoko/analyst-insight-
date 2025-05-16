import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { HomeIcon, ListOrderedIcon, PlusCircleIcon, SettingsIcon, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-[calc(100vh-4rem)]"> {/* Adjust min-height based on header height */}
        <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <Link href="/admin/posts" className="font-semibold text-lg">
              Admin Panel
            </Link>
            {/* SidebarTrigger might be used if sidebar is collapsible and you want a button inside it */}
             {/* Or, use SidebarRail for the draggable edge if preferred. Default is fine. */}
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="default" size="default" tooltip="View All Posts">
                  <Link href="/admin/posts" className="flex items-center">
                    <ListOrderedIcon className="mr-2 h-5 w-5" />
                    <span>Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="default" size="default" tooltip="Create New Post">
                  <Link href="/admin/posts/new" className="flex items-center">
                    <PlusCircleIcon className="mr-2 h-5 w-5" />
                    <span>New Post</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 p-6 bg-background">
          <div className="md:hidden mb-4"> {/* Mobile trigger, main one usually in Header or here */}
            <SidebarTrigger asChild> 
              <Button variant="outline" size="icon">
                <PanelLeft />
              </Button>
            </SidebarTrigger>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
