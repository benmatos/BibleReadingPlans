
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { bibleBooks, bibleBookChapters } from '@/data/reading-plan';
import { useProgress } from '@/hooks/use-progress';
import { usePlans, type ReadingPlan } from '@/hooks/use-plans';
import { useLastRead } from '@/hooks/use-last-read';
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

interface Day {
  day: number;
  reading: string;
}

function PageSkeleton() {
  return (
    <div className="flex h-screen w-screen">
      <div className="hidden md:block border-r">
         <div className="w-64 p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="pt-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
         </div>
      </div>
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <header className="flex items-center justify-between md:justify-center p-4 border-b relative h-16 mb-4">
            <Skeleton className="h-8 w-8 md:hidden" />
            <Skeleton className="h-8 w-48" />
        </header>
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
      </div>
    </div>
  )
}


export default function BibleReadingPlanPage() {
  const [isClient, setIsClient] = useState(false);
  const { plans, isLoaded: plansLoaded } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [readingPlan, setReadingPlan] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const { completedDays, toggleDayCompletion, isDayCompleted, isLoaded: progressLoaded } = useProgress(selectedPlan?.id);
  const { getLastReadDay, setLastReadDay, isLoaded: lastReadLoaded } = useLastRead();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoaded = plansLoaded && progressLoaded && lastReadLoaded;

  const generatePlan = useCallback((plan: ReadingPlan | null): Day[] => {
    if (!plan) return [];

    const startBookIndex = bibleBooks.indexOf(plan.startBook);
    const endBookIndex = bibleBooks.indexOf(plan.endBook);

    if (startBookIndex === -1 || endBookIndex === -1 || startBookIndex > endBookIndex) {
      return [];
    }

    const planBooks = bibleBooks.slice(startBookIndex, endBookIndex + 1);
    let dayCounter = 1;
    const newPlan: Day[] = [];

    planBooks.forEach(book => {
      const chapters = bibleBookChapters[book] || 1;
      for (let chapter = 1; chapter <= chapters; chapter++) {
        newPlan.push({
          day: dayCounter++,
          reading: `${book} ${chapter}`
        });
      }
    });
    return newPlan;
  }, []);

  // Effect to initialize the plan and select the last read day
  useEffect(() => {
    if (!isLoaded || !isClient) return;

    let currentPlan = selectedPlan;
    if (!currentPlan && plans.length > 0) {
      currentPlan = plans[0];
      setSelectedPlan(currentPlan);
    }
    
    if (currentPlan) {
      const newPlan = generatePlan(currentPlan);
      setReadingPlan(newPlan);
      
      if (newPlan.length > 0) {
        const lastReadDayNumber = getLastReadDay(currentPlan.id) ?? 1;
        const dayToSelect = newPlan.find(d => d.day === lastReadDayNumber) || newPlan[0];
        setSelectedDay(dayToSelect);
      } else {
        setSelectedDay(null);
      }
    } else {
      setReadingPlan([]);
      setSelectedDay(null);
    }
  }, [selectedPlan, plans, isLoaded, isClient, getLastReadDay, generatePlan]);

  // Persist the last read day when selectedDay changes
  useEffect(() => {
    if (selectedPlan?.id && selectedDay?.day) {
        setLastReadDay(selectedPlan.id, selectedDay.day);
    }
  }, [selectedDay, selectedPlan?.id, setLastReadDay]);
  
  // Effect to scroll the active plan into view
  useEffect(() => {
    if (selectedPlan?.id) {
        const element = document.querySelector(`[data-plan-id='${selectedPlan.id}']`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [selectedPlan?.id]);
  
  const handleSelectDay = (day: Day) => {
    setSelectedDay(day);
  };
  
  const handleNavigateDay = (offset: number) => {
    if (!selectedDay) return;
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
  
  if (!isClient) {
    return <PageSkeleton />;
  }

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
                    <Link href="/plans">
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
          ) : !selectedPlan ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <BookOpen className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold font-headline">Bem-vindo!</h2>
                <p>Selecione um plano de leitura na barra lateral para começar.</p>
                <p className="mt-2 text-sm">Não tem um plano? <Link href="/plans" className="text-primary underline">Crie um agora!</Link></p>
            </div>
          ) : !selectedDay ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <BookOpen className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold font-headline">Carregando plano...</h2>
                <p>Aguarde um momento enquanto preparamos seu plano de leitura.</p>
            </div>
          ) : (
            <ReadingDayView 
                day={selectedDay}
                isCompleted={isDayCompleted(selectedDay.day)}
                isLoaded={isLoaded}
                onToggleComplete={() => toggleDayCompletion(selectedDay.day)}
                onNavigate={handleNavigateDay}
                isFirstDay={selectedDay.day === 1}
                isLastDay={selectedDay.day === readingPlan.length}
            />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
