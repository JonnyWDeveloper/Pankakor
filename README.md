Figma designprogram verkar rendera teckensnitt annorlunda an t.ex. MS Edge webbläsaren?

Ja, det stämmer precis och det är ett väldigt välkänt problem för både designers och utvecklare. 
Figma och Microsoft Edge använder helt olika tekniker för att rita upp text på skärmen, 
vilket gör att samma teckensnitt och kod kan se tjockare, tunnare eller mer utsträckt ut i webbläsaren.

Här är de tre viktigaste orsakerna till att det skiljer sig:

1. Grafikmotor vs Operativsystem (Skia vs DirectWrite)

• Figma är i grunden ett grafikprogram som körs på en motor som heter Skia. 
Figma struntar i hur din dators skärm hanterar text i vanliga fall – den ritar upp texten som ren vektorgrafik. 
Det gör att texten ser extremt mjuk, perfekt och likadan ut oavsett om du använder Mac eller Windows.

• MS Edge använder webbläsarmotorn Chromium, men när den ska visa text på Windows samarbetar den med systemets egna textmotor DirectWrite.
Edge prioriterar maximal läsbarhet och prestanda framför perfekt grafik. Den använder något som kallas Font Hinting, 
vilket innebär att den tvingar bokstävernas linjer att anpassa sig efter skärmens fysiska pixlar. 
Det gör ofta att texten i Edge ser tunnare och skarpare ut än i Figma.

2. Hantering av radavstånd (line-height)

Detta är den vanligaste anledningen till att layouten "hoppar" när design blir till kod:

• I Figma skapas en textruta runt bokstäverna, och radavståndet beräknas ofta väldigt jämnt utifrån fontfilens inbyggda värden.
• I MS Edge/CSS fördelas radavståndet som "halvt ledande" (half-leading) på både över- och undersidan av varje enskild textrad. 

Om ett teckensnitt har stora osynliga marginaler i sin kod, kan texten i webbläsaren hamna några pixlar högre upp eller lägre ner än i din Figma-skiss.

3. Kantutjämning (Antialiasing)

Webbläsare applicerar automatiskt olika filter för att runda av kanterna på bokstäver, och Windows-användare har ofta ett system som heter ClearType aktiverat. 
Detta filter justerar subpixlar (rött, grönt, blått) för att göra texten skarpare att läsa, vilket ändrar upplevelsen helt jämfört med Figmas neutrala rendering.

Så minskar du skillnaderna i koden

Om du vill att koden i Edge ska efterlikna Figmas fylligare rendering så nära som möjligt, kan du lägga till dessa rader i din CSS:

css
body {
  /* Gör texten i webbläsaren lite mjukare och mer lik Figmas rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

Tänk också på att alltid använda procent eller enhetslösa värden för line-height i Figma 
(t.ex. 140% eller 1.4 istället for fasta pixelvärden som 24px). 
Det översätts mycket mer exakt till webben.
