import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/views/sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen">{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
