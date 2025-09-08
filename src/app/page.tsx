"use client";

import { useState, useMemo, useEffect } from 'react';
import { readingPlan as defaultReadingPlan } from '@/data/reading-plan';
import { useProgress } from '@/hooks/use-progress';
import { usePlans, type ReadingPlan } from '@/hooks/use-plans';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ReadingDayView } from '@/components/reading-day-view';
import { Settings, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function BibleReadingPlanPage() {
  const { plans, isLoaded: plansLoaded } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(() => defaultReadingPlan[0]);
  const { completedDays, toggleDayCompletion, isDayCompleted, isLoaded: progressLoaded } = useProgress(selectedPlan?.id);

  const readingPlan = defaultReadingPlan; // For now, we only have one reading plan data.
  const isLoaded = plansLoaded && progressLoaded;

  useEffect(() => {
    if (selectedPlan && plans.length > 0 && plansLoaded) {
      const currentPlan = plans.find(p => p.id === selectedPlan.id);
      if (!currentPlan) {
        setSelectedPlan(null);
        setSelectedDay(readingPlan[0]);
      }
    }
  }, [plans, selectedPlan, readingPlan, plansLoaded]);
  
  // Effect to scroll the active day into view
  useEffect(() => {
    if (selectedPlan && isLoaded) {
        const element = document.querySelector(`[data-plan-id='${selectedPlan.id}']`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [selectedPlan, isLoaded]);

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
  }, [completedCount, readingPlan.length]);
  

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
                    <h2 className="font-headline text-lg font-semibold">Planos de Leitura</h2>
                    <p className="text-sm text-sidebar-foreground/80">Selecione um plano</p>
                </div>
            </div>
             {selectedPlan && (
                <div className="mt-4 space-y-1">
                    {isLoaded ? (
                        <>
                            <Progress value={progressPercentage} className="h-2" />
                            <p className="text-xs text-sidebar-foreground/80">{completedCount} de {readingPlan.length} dias completos</p>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-3 w-3/4 mx-auto mt-1" />
                        </>
                    )}
                </div>
            )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {!isLoaded && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            {isLoaded && plans.map((plan) => (
              <SidebarMenuItem key={plan.id} data-plan-id={plan.id}>
                <SidebarMenuButton
                  onClick={() => setSelectedPlan(plan)}
                  isActive={selectedPlan?.id === plan.id}
                  className="h-auto py-2"
                >
                  <BookOpen />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-semibold">{plan.name}</span>
                    <span className="text-xs text-sidebar-foreground/70 truncate w-full">{plan.startBook} a {plan.endBook}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             {isLoaded && plans.length === 0 && (
                <div className="p-4 text-center text-sm text-sidebar-foreground/70">
                    Nenhum plano encontrado. Crie um em "Gerenciar Planos".
                </div>
             )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/plans" passHref>
                        <SidebarMenuButton>
                            <Settings />
                            Gerenciar Planos
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between md:justify-center p-4 border-b relative h-16">
            <SidebarTrigger className="md:hidden"/>
            <div className="hidden md:block">
                <h1 className="font-headline text-2xl font-bold text-center truncate">{selectedPlan?.name || 'Selecione um Plano'}</h1>
            </div>
             <div className="md:hidden flex-1 text-center pr-8">
                 <h1 className="font-headline text-xl font-bold truncate">{selectedPlan?.name || 'Selecione um Plano'}</h1>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
          {!isLoaded ? (
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <div>
                          <Skeleton className="h-8 w-24 mb-2" />
                          <Skeleton className="h-5 w-32" />
                       </div>
                       <Skeleton className="h-10 w-32 rounded-lg" />
                    </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-5/6" />
                        </div>
                     </div>
                  </CardContent>
                </Card>
              </div>
          ) : selectedPlan ? (
            <ReadingDayView 
                day={selectedDay}
                isCompleted={isDayCompleted(selectedDay.day)}
                isLoaded={isLoaded}
                onToggleComplete={() => toggleDayCompletion(selectedDay.day)}
                onNavigate={handleNavigateDay}
                isFirstDay={selectedDay.day === 1}
                isLastDay={selectedDay.day === readingPlan.length}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <BookOpen className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold font-headline">Bem-vindo!</h2>
                <p>Selecione um plano de leitura na barra lateral para começar.</p>
                <p className="mt-2 text-sm">Não tem um plano? <Link href="/plans" className="text-primary underline">Crie um agora!</Link></p>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
