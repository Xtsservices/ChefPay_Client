import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpScreen } from "@/common/HelpScreen";
import { useNavigate } from "react-router-dom";
export function AppHeader() {
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
    //navigate to /
    navigate('/');
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-end h-full px-6 gap-4">
          <SidebarTrigger className="lg:hidden" />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setHelpOpen(true)}>
                  Help
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Help Dialog */}
      <HelpScreen open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
