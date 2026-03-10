
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { decodePlanFromParams } from '@/lib/share-plan';
import { bibleBooks } from '@/data/reading-plan';
import { usePlans } from '@/hooks/use-plans';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const REDIRECT_DELAY_MS = 1500;

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addPlan, isLoaded } = usePlans();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sharedPlan = decodePlanFromParams(searchParams);

  const startIndex = sharedPlan ? bibleBooks.indexOf(sharedPlan.startBook) : -1;
  const endIndex = sharedPlan ? bibleBooks.indexOf(sharedPlan.endBook) : -1;
  const isValidPlan =
    sharedPlan !== null &&
    startIndex !== -1 &&
    endIndex !== -1 &&
    startIndex <= endIndex;

  const handleAccept = () => {
    if (!sharedPlan || !isValidPlan) return;
    addPlan({
      name: sharedPlan.name,
      startBook: sharedPlan.startBook,
      endBook: sharedPlan.endBook,
    });
    setAccepted(true);
    toast({
      title: 'Plano adicionado!',
      description: `O plano "${sharedPlan.name}" foi adicionado aos seus planos de leitura.`,
    });
    setTimeout(() => router.push('/'), REDIRECT_DELAY_MS);
  };

  const handleDecline = () => {
    router.push('/');
  };

  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <BookOpen className="w-12 h-12 mx-auto text-primary" />
            <CardTitle className="font-headline text-2xl">Carregando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isValidPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 mx-auto text-destructive" />
            <CardTitle className="font-headline text-2xl">Convite inválido</CardTitle>
            <CardDescription>
              Este link de convite é inválido ou está incompleto.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Ir para o início</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            <CardTitle className="font-headline text-2xl">Plano adicionado!</CardTitle>
            <CardDescription>
              Redirecionando para seus planos...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-primary" />
          <CardTitle className="font-headline text-2xl">Convite de Plano de Leitura</CardTitle>
          <CardDescription>
            Você foi convidado para participar de um plano de leitura bíblica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Nome do Plano</p>
              <p className="font-semibold text-lg">{sharedPlan.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Intervalo de Leitura</p>
              <p className="text-sm">De <span className="font-medium">{sharedPlan.startBook}</span> a <span className="font-medium">{sharedPlan.endBook}</span></p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleDecline}>
            Recusar
          </Button>
          <Button className="flex-1" onClick={handleAccept}>
            Aceitar Convite
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense>
      <InviteContent />
    </Suspense>
  );
}
