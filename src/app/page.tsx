"use client";

import { useState, useMemo, useEffect } from 'react';
import { readingPlan } from '@/data/reading-plan';
import { useProgress } from '@/hooks/use-progress';
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
import { ReadingDayView } from '@/components/reading-day-view';
import { CheckCircle2, Circle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function BibleReadingPlanPage() {
  const [selectedDay, setSelectedDay] = useState(() => readingPlan[0]);
  const { completedDays, toggleDayCompletion, isDayCompleted, isLoaded } = useProgress();

  const handleSelectDay = (day: typeof readingPlan[0]) => {
    setSelectedDay(day);
  };
  
  const handleNavigateDay = (offset: number) => {
    const currentIndex = readingPlan.findIndex(d => d.day === selectedDay.day);
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < readingPlan.length) {
      setSelectedDay(readingPlan[newIndex]);
    }
  };

  const completedCount = useMemo(() => {
    return completedDays.size;
  }, [completedDays]);

  const progressPercentage = useMemo(() => {
    if (readingPlan.length === 0) return 0;
    return Math.round((completedCount / readingPlan.length) * 100);
  }, [completedCount]);
  
  // Effect to scroll the active day into view
  useEffect(() => {
    const element = document.querySelector(`[data-day-id='${selectedDay.day}']`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedDay]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="text-center p-4">
            <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
                    <AvatarFallback className="bg-transparent font-headline font-bold">
                        BRP
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                    <h2 className="font-headline text-lg font-semibold">Reading Plan</h2>
                    <p className="text-sm text-sidebar-foreground/80">Chronological</p>
                </div>
            </div>
            <div className="mt-4 space-y-1">
                {isLoaded ? (
                    <>
                        <Progress value={progressPercentage} className="h-2" />
                        <p className="text-xs text-sidebar-foreground/80">{completedCount} of {readingPlan.length} days completed</p>
                    </>
                ) : (
                    <>
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-3 w-3/4 mx-auto" />
                    </>
                )}
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {readingPlan.map((day) => (
              <SidebarMenuItem key={day.day} data-day-id={day.day}>
                <SidebarMenuButton
                  onClick={() => handleSelectDay(day)}
                  isActive={selectedDay.day === day.day}
                  className="h-auto py-2"
                >
                  {isLoaded ? (
                      isDayCompleted(day.day) ? <CheckCircle2 className="text-green-300" /> : <Circle className="opacity-50"/>
                  ) : <Skeleton className="h-4 w-4 rounded-full" />}
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-semibold">{`Day ${day.day}`}</span>
                    <span className="text-xs text-sidebar-foreground/70 truncate w-full">{day.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between md:justify-center p-4 border-b relative h-16">
            <SidebarTrigger className="md:hidden"/>
            <div className="hidden md:block">
                <h1 className="font-headline text-2xl font-bold text-center truncate">{selectedDay.title}</h1>
            </div>
             <div className="md:hidden flex-1 text-center pr-8">
                 <h1 className="font-headline text-xl font-bold truncate">{selectedDay.title}</h1>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
            <ReadingDayView 
                day={selectedDay}
                isCompleted={isDayCompleted(selectedDay.day)}
                isLoaded={isLoaded}
                onToggleComplete={() => toggleDayCompletion(selectedDay.day)}
                onNavigate={handleNavigateDay}
                isFirstDay={selectedDay.day === 1}
                isLastDay={selectedDay.day === readingPlan.length}
            />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
