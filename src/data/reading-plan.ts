
export const readingPlan = [
  { day: 1, reading: 'Gênesis 1' },
  { day: 2, reading: 'Gênesis 2' },
  { day: 3, reading: 'Gênesis 3' },
  { day: 4, reading: 'Gênesis 4' },
  { day: 5, reading: 'Gênesis 5' },
  { day: 6, reading: 'Gênesis 6' },
  { day: 7, reading: 'Gênesis 7' },
  { day: 8, reading: 'Gênesis 8' },
  { day: 9, reading: 'Gênesis 9' },
  { day: 10, reading: 'Gênesis 10' },
];

export const bibleBooks = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cantares', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias', 'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse'
];

// Mock scripture texts for the AI summarizer feature.
// In a real app, you would fetch this from a Bible API.
export const mockScriptureTexts: Record<string, string> = {
  'Gênesis 1': `1 No princípio, criou Deus os céus e a terra.
2 A terra era sem forma e vazia; e havia trevas sobre a face do abismo, mas o Espírito de Deus pairava sobre a face das águas.
3 Disse Deus: "Haja luz"; e houve luz.
4 E Deus viu que a luz era boa; e fez separação entre a luz e as trevas.
5 E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.
6 E disse Deus: "Haja um firmamento no meio das águas, e haja separação entre águas e águas."
7 E fez Deus o firmamento, e fez separação entre as águas que estavam debaixo do firmamento e as águas que estavam sobre o firmamento. E assim foi.
8 E chamou Deus ao firmamento Céus. E foi a tarde e a manhã, o dia segundo.
9 E disse Deus: "Ajuntem-se as águas debaixo dos céus num lugar; e apareça a porção seca." E assim foi.
10 E chamou Deus à porção seca Terra; e ao ajuntamento das águas chamou Mares. E viu Deus que isso era bom.
11 E disse Deus: "Produza a terra relva, ervas que deem semente, e árvores frutíferas que deem fruto segundo a sua espécie, cuja semente esteja nele sobre a terra." E assim foi.
12 E a terra produziu relva, ervas que davam semente segundo a sua espécie, e árvores que davam fruto, cuja semente estava nele, conforme a sua espécie. E viu Deus que isso era bom.
13 E foi a tarde e a manhã, o dia terceiro.
14 E disse Deus: "Haja luminares no firmamento dos céus, para fazerem separação entre o dia e a noite; e sejam eles para sinais e para tempos determinados e para dias e anos."
15 E sejam para luminares no firmamento dos céus, para alumiar a terra. E assim foi.
16 E fez Deus os dois grandes luminares: o luminar maior para governar o dia, e o luminar menor para governar a noite; e fez também as estrelas.
17 E Deus os pôs no firmamento dos céus para alumiar a terra,
18 E para governar o dia e a noite, e para fazer separação entre a luz e as trevas. E viu Deus que isso era bom.
19 E foi a tarde e a manhã, o dia quarto.
20 E disse Deus: "Produzam as águas abundantemente répteis de alma vivente; e voem as aves sobre a face do firmamento dos céus."
21 E Deus criou as grandes baleias, e todo o réptil de alma vivente que as águas abundantemente produziram conforme as suas espécies; e toda a ave de asas conforme a sua espécie. E viu Deus que isso era bom.
22 E Deus os abençoou, dizendo: "Frutificai, e multiplicai-vos, e enchei as águas nos mares; e as aves se multipliquem na terra."
23 E foi a tarde e a manhã, o dia quinto.
24 E disse Deus: "Produza a terra alma vivente conforme a sua espécie; gado, e répteis, e bestas-feras da terra conforme a sua espécie." E assim foi.
25 E fez Deus as bestas-feras da terra conforme a sua espécie, e o gado conforme a sua espécie, e todo o réptil da terra conforme a sua espécie. E viu Deus que isso era bom.
26 E disse Deus: "Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra, e sobre todo o réptil que se move sobre a terra."
27 E criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.
28 E Deus os abençoou, e Deus lhes disse: "Frutificai, e multiplicai-vos, e enchei a terra, e sujeitai-a; e dominai sobre os peixes do mar e sobre as aves dos céus, e sobre todo o animal que se move sobre a terra."
29 E disse Deus: "Eis que vos tenho dado toda a erva que dá semente, que está sobre a face de toda a terra; e toda a árvore, em que há fruto de árvore que dá semente, ser-vos-á para mantimento."
30 E a todo o animal da terra, e a toda a ave dos céus, e a todo o réptil da terra, em que há alma vivente, toda a erva verde será para mantimento. E assim foi.
31 E viu Deus tudo quanto tinha feito, e eis que era muito bom. E foi a tarde e a manhã, o dia sexto.`,
  'Gênesis 2': `1 Assim foram concluídos os céus e a terra, e tudo o que neles há.
2 No sétimo dia, Deus já havia concluído a obra que realizara, e nesse dia descansou.
3 Abençoou Deus o sétimo dia e o santificou, porque nele descansou de toda a obra que realizara na criação.
4 Esta é a história das origens dos céus e da terra, no tempo em que foram criados.
5 Quando o Senhor Deus fez a terra e os céus, ainda não tinha brotado nenhum arbusto no campo, e nenhuma planta havia germinado, porque o Senhor Deus ainda não tinha feito chover sobre a terra, e também não havia homem para cultivar o solo.
6 Todavia, brotava da terra um vapor que regava toda a superfície do solo.
7 Então o Senhor Deus formou o homem do pó da terra e soprou em suas narinas o fôlego de vida, e o homem se tornou um ser vivente.
8 Ora, o Senhor Deus tinha plantado um jardim no Éden, para os lados do leste; e ali colocou o homem que formara.
9 E o Senhor Deus fez brotar da terra toda a árvore agradável à vista, e boa para comida; e a árvore da vida no meio do jardim, e a árvore do conhecimento do bem e do mal.
10 E saía um rio do Éden para regar o jardim; e dali se dividia e se tornava em quatro braços.
11 O nome do primeiro é Pisom; este é o que rodeia toda a terra de Havilá, onde há ouro.
12 E o ouro dessa terra é bom; ali há o bdélio, e a pedra sardônica.
13 E o nome do segundo rio é Giom; este é o que rodeia toda a terra de Cuxe.
14 E o nome do terceiro rio é Tigre; este é o que vai para o lado oriental da Assíria. E o quarto rio é o Eufrates.
15 E tomou o Senhor Deus o homem, e o pôs no jardim do Éden para o lavrar e o guardar.
16 E ordenou o Senhor Deus ao homem, dizendo: "De toda a árvore do jardim comerás livremente,
17 mas da árvore do conhecimento do bem e do mal, dela não comerás; porque no dia em que dela comeres, certamente morrerás."
18 E disse o Senhor Deus: "Não é bom que o homem esteja só; far-lhe-ei uma ajudadora idônea para ele."
19 Havendo, pois, o Senhor Deus formado da terra todo o animal do campo, e toda a ave dos céus, os trouxe a Adão, para ver como lhes chamaria; e tudo o que Adão chamou a toda a alma vivente, isso foi o seu nome.`,
  'Gênesis 3': `1 A serpente era o mais astuto de todos os animais selvagens que o Senhor Deus tinha feito. E ela disse à mulher: "Foi isto mesmo que Deus disse: 'Não comam de nenhum fruto das árvores do jardim'?"
2 Respondeu a mulher à serpente: "Podemos comer do fruto das árvores do jardim,
3 mas Deus disse: 'Não comam do fruto da árvore que está no meio do jardim, nem toquem nele; do contrário, vocês morrerão'."
4 Disse a serpente à mulher: "Certamente não morrerão!
5 Deus sabe que, no dia em que dele comerem, seus olhos se abrirão, e vocês, como Deus, serão conhecedores do bem e do mal".
6 Quando a mulher viu que a árvore parecia agradável ao paladar, era atraente aos olhos e, além disso, desejável para dela se obter discernimento, tomou do seu fruto, comeu-o e o deu a seu marido, que comeu também.`,
  'Gênesis 4': `1 E conheceu Adão a Eva, sua mulher, e ela concebeu e deu à luz a Caim, e disse: Alcancei do Senhor um homem.
2 E deu à luz mais a seu irmão Abel; e Abel foi pastor de ovelhas, e Caim foi lavrador da terra.
3 E aconteceu ao cabo de dias que Caim trouxe do fruto da terra uma oferta ao Senhor.
4 E Abel também trouxe dos primogênitos das suas ovelhas, e da sua gordura; e atentou o Senhor para Abel e para a sua oferta.
5 Mas para Caim e para a sua oferta não atentou. E irou-se Caim fortemente, e descaiu-lhe o seu semblante.
6 E o Senhor disse a Caim: Por que te iraste? E por que descaiu o teu semblante?
7 Se bem fizeres, não é certo que serás aceito? E se não fizeres bem, o pecado jaz à porta, e sobre ti será o seu desejo, mas sobre ele deves dominar.
8 E falou Caim com o seu irmão Abel; e sucedeu que, estando eles no campo, se levantou Caim contra o seu irmão Abel, e o matou.`,
  'Gênesis 5': `1 Este é o livro das gerações de Adão. No dia em que Deus criou o homem, à semelhança de Deus o fez.
2 Homem e mulher os criou; e os abençoou e chamou o seu nome Adão, no dia em que foram criados.
3 E Adão viveu cento e trinta anos, e gerou um filho à sua semelhança, conforme a sua imagem, e pôs-lhe o nome de Sete.
4 E foram os dias de Adão, depois que gerou a Sete, oitocentos anos, e gerou filhos e filhas.
5 E foram todos os dias que Adão viveu, novecentos e trinta anos, e morreu.`,
  'Gênesis 6': `1 E sucedeu que, como os homens começaram a multiplicar-se sobre a terra, e lhes nasceram filhas,
2 Viram os filhos de Deus que as filhas dos homens eram formosas; e tomaram para si mulheres de todas as que escolheram.
3 Então disse o Senhor: Não contenderá o meu Espírito para sempre com o homem; porque ele também é carne; porém os seus dias serão de cento e vinte anos.
4 Havia naqueles dias gigantes na terra; e também depois, quando os filhos de Deus entraram às filhas dos homens e delas geraram filhos; estes eram os valentes que houve na antiguidade, os homens de fama.
5 E viu o Senhor que a maldade do homem se multiplicara sobre a terra e que toda a imaginação dos pensamentos de seu coração era só má continuamente.
6 Então arrependeu-se o Senhor de haver feito o homem sobre a terra e pesou-lhe em seu coração.`,
  'Gênesis 7': `1 Depois disse o Senhor a Noé: Entra tu e toda a tua casa na arca, porque tenho visto que és justo diante de mim nesta geração.
2 De todos os animais limpos levarás contigo sete e sete, o macho e sua fêmea; mas dos animais que não são limpos, dois, o macho e sua fêmea.
3 Também das aves dos céus sete e sete, macho e fêmea, para se conservar em vida a semente sobre a face de toda a terra.
4 Porque, passados ainda sete dias, farei chover sobre a terra quarenta dias e quarenta noites; e desfarei de sobre a face da terra toda a substância que fiz.
5 E fez Noé conforme a tudo o que o Senhor lhe ordenara.`,
  'Gênesis 8': `1 E lembrou-se Deus de Noé, e de todos os seres viventes, e de todo o gado que com ele estava na arca; e Deus fez passar um vento sobre a terra, e aquietaram-se as águas.
2 Cerraram-se também as fontes do abismo e as janelas dos céus, e a chuva dos céus deteve-se.
3 E as águas iam-se escoando continuamente de sobre a terra, e ao cabo de cento e cinquenta dias minguaram.
4 E a arca repousou no sétimo mês, no dia dezessete do mês, sobre os montes de Ararate.`,
  'Gênesis 9': `1 E abençoou Deus a Noé e a seus filhos, e disse-lhes: Frutificai e multiplicai-vos e enchei a terra.
2 E o temor de vós e o pavor de vós virão sobre todo o animal da terra, e sobre toda a ave dos céus; tudo o que se move sobre a terra, e todos os peixes do mar, nas vossas mãos são entregues.
3 Tudo quanto se move, que é vivente, será para vosso mantimento; tudo vos tenho dado como a erva verde.
4 A carne, porém, com sua vida, isto é, com seu sangue, não comereis.`,
  'Gênesis 10': `1 Estas, pois, são as gerações dos filhos de Noé: Sem, Cão e Jafé; e nasceram-lhes filhos depois do dilúvio.
2 Os filhos de Jafé são: Gomer, e Magogue, e Madai, e Javã, e Tubal, e Meseque, e Tiras.
3 E os filhos de Gomer: Asquenaz, e Rifate, e Togarma.
4 E os filhos de Javã: Elisá, e Társis, Quitim, e Dodanim.`
};
