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
  // ... to be continued for all chapters of the Bible
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
... (e assim por diante)`,
  'Gênesis 2': `1 Assim foram concluídos os céus e a terra, e tudo o que neles há.
2 No sétimo dia, Deus já havia concluído a obra que realizara, e nesse dia descansou.
3 Abençoou Deus o sétimo dia e o santificou, porque nele descansou de toda a obra que realizara na criação.
4 Esta é a história das origens dos céus e da terra, no tempo em que foram criados.
5 Quando o Senhor Deus fez a terra e os céus, ainda não tinha brotado nenhum arbusto no campo, e nenhuma planta havia germinado, porque o Senhor Deus ainda não tinha feito chover sobre a terra, e também não havia homem para cultivar o solo.
6 Todavia, brotava da terra um vapor que regava toda a superfície do solo.
7 Então o Senhor Deus formou o homem do pó da terra e soprou em suas narinas o fôlego de vida, e o homem se tornou um ser vivente.
... (e assim por diante)`,
  'Gênesis 3': `1 A serpente era o mais astuto de todos os animais selvagens que o Senhor Deus tinha feito. E ela disse à mulher: "Foi isto mesmo que Deus disse: 'Não comam de nenhum fruto das árvores do jardim'?"
2 Respondeu a mulher à serpente: "Podemos comer do fruto das árvores do jardim,
3 mas Deus disse: 'Não comam do fruto da árvore que está no meio do jardim, nem toquem nele; do contrário, vocês morrerão'."
4 Disse a serpente à mulher: "Certamente não morrerão!
5 Deus sabe que, no dia em que dele comerem, seus olhos se abrirão, e vocês, como Deus, serão conhecedores do bem e do mal".
6 Quando a mulher viu que a árvore parecia agradável ao paladar, era atraente aos olhos e, além disso, desejável para dela se obter discernimento, tomou do seu fruto, comeu-o e o deu a seu marido, que comeu também.
... (e assim por diante)`,
};
