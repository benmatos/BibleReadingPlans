
'use client';

import { usePlans, type ReadingPlan } from '@/hooks/use-plans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bibleBooks } from '@/data/reading-plan';
import { useState, useEffect } from 'react';
import { Trash2, Edit, PlusCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ManagePlansPage() {
  const [isClient, setIsClient] = useState(false);
  const { plans, addPlan, updatePlan, deletePlan, isLoaded } = usePlans();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<ReadingPlan> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = () => {
    if (currentPlan && currentPlan.name && currentPlan.startBook && currentPlan.endBook) {
      if (currentPlan.id) {
        updatePlan(currentPlan as ReadingPlan);
      } else {
        addPlan({
          name: currentPlan.name,
          startBook: currentPlan.startBook,
          endBook: currentPlan.endBook,
        });
      }
      setIsDialogOpen(false);
      setCurrentPlan(null);
    }
  };
  
  const openDialog = (plan?: ReadingPlan) => {
      setCurrentPlan(plan || { name: '', startBook: 'Gênesis', endBook: 'Apocalipse' });
      setIsDialogOpen(true);
  }

  const closeDialog = () => {
      setIsDialogOpen(false);
      setCurrentPlan(null);
  }

  if (!isClient) {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <header className="p-4 border-b flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-8 w-64" />
            </header>
            <main className="max-w-4xl mx-auto mt-4">
                 <div className="flex justify-end mb-4">
                     <Skeleton className="h-10 w-32 rounded-md" />
                 </div>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                 </div>
            </main>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
              <ArrowLeft />
              <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="font-headline text-2xl font-bold">Gerenciar Planos de Leitura</h1>
      </header>

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog()}>
                  <PlusCircle className="mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentPlan?.id ? 'Editar Plano' : 'Novo Plano de Leitura'}</DialogTitle>
                  <DialogDescription>
                    {currentPlan?.id ? 'Edite os detalhes do seu plano.' : 'Crie um novo plano para acompanhar sua leitura da Bíblia.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={currentPlan?.name || ''}
                      onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Ex: Plano Cronológico"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startBook" className="text-right">
                      Livro Inicial
                    </Label>
                    <Select
                      value={currentPlan?.startBook}
                      onValueChange={(value) => setCurrentPlan({ ...currentPlan, startBook: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o livro inicial" />
                      </SelectTrigger>
                      <SelectContent>
                        {bibleBooks.map((book) => (
                          <SelectItem key={book} value={book}>
                            {book}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endBook" className="text-right">
                      Livro Final
                    </Label>
                     <Select
                        value={currentPlan?.endBook}
                        onValueChange={(value) => setCurrentPlan({ ...currentPlan, endBook: value })}
                      >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o livro final" />
                      </SelectTrigger>
                      <SelectContent>
                        {bibleBooks.map((book) => (
                          <SelectItem key={book} value={book}>
                            {book}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={closeDialog} variant="outline">Cancelar</Button>
                  <Button type="button" onClick={handleSave}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {!isLoaded ? (
                Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
            ) : plans.length === 0 ? (
                <div className="col-span-full text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                        Nenhum plano de leitura encontrado.
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        Crie um para começar a acompanhar seu progresso.
                    </p>
                </div>
            ) : (
                plans.map((plan) => (
                <Card key={plan.id} className="shadow-lg">
                    <CardHeader>
                    <CardTitle className="font-headline text-xl">{plan.name}</CardTitle>
                    <CardDescription>De {plan.startBook} a {plan.endBook}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    {/* Future content can go here, like progress */}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(plan)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                    </Button>
                    </CardFooter>
                </Card>
                ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
