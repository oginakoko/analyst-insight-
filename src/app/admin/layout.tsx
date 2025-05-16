
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
import { HomeIcon, ListOrderedIcon, PlusCircleIcon, SettingsIcon, PanelLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login?redirect=/admin/posts');
      } else if (!isAdmin) {
        router.replace('/'); // Or a dedicated 'access-denied' page
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading or checking authorization...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-[calc(100vh-4rem)]"> {/* Adjust min-height based on header height */}
        <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <Link href="/admin/posts" className="font-semibold text-lg">
              Admin Panel
            </Link>
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
               {/* Example of a settings link, can be uncommented if needed
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="default" size="default" tooltip="Settings">
                  <Link href="/admin/settings" className="flex items-center">
                    <SettingsIcon className="mr-2 h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              */}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 p-6 bg-background">
          <div className="md:hidden mb-4"> {/* Mobile trigger */}
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
