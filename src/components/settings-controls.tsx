
"use client";

import { useSettings } from "@/hooks/use-settings";
import { Book, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";

const BIBLE_VERSIONS = {
    'almeida': 'Almeida',
    'nvi': 'NVI'
} as const;

export function SettingsControls() {
  const { settings, setTheme, setBibleVersion } = useSettings();

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
            <Label className="text-sm text-sidebar-foreground">Versão</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sidebar-foreground h-8 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Book className="mr-2 h-4 w-4" />
                    <span>{BIBLE_VERSIONS[settings.bibleVersion as keyof typeof BIBLE_VERSIONS] || 'Almeida'}</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setBibleVersion("almeida")}>
                    Almeida
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBibleVersion("nvi")}>
                    NVI
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );
}
