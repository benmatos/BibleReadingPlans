
"use client";

import { useSettings } from "@/hooks/use-settings";
import { Moon, Sun, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";

export function SettingsControls() {
  const { theme, setTheme, fontSize, increaseFontSize, decreaseFontSize } = useSettings();

  return (
    <div className="p-2 space-y-2">
        <Separator className="bg-sidebar-border" />
        <div className="flex items-center justify-between">
            <Label className="text-sm text-sidebar-foreground">Tema</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-sidebar-foreground h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    Sistema
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="flex items-center justify-between">
            <Label className="text-sm text-sidebar-foreground">Fonte</Label>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={decreaseFontSize} className="text-sidebar-foreground h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Diminuir fonte</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={increaseFontSize} className="text-sidebar-foreground h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Aumentar fonte</span>
                </Button>
            </div>
        </div>
    </div>
  );
}

    