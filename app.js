const languageMeta = {
  sv: { locale: "sv-SE", selectorTitle: "VÃƒÂ¤lj sprÃƒÂ¥k" },
  en: { locale: "en-US", selectorTitle: "Choose language" },
  da: { locale: "da-DK", selectorTitle: "VÃƒÂ¦lg sprog" },
  no: { locale: "nb-NO", selectorTitle: "Velg sprÃƒÂ¥k" },
  fi: { locale: "fi-FI", selectorTitle: "Valitse kieli" }
};

const translations = {
  sv: {
    navApps: "Appar",
    navAbout: "Om",
    downloadsTitle: "Nedladdningar",
    downloadsCopy: "HÃƒÂ¥ll dina installationsfiler och lÃƒÂ¤nkar uppdaterade i en lista.",
    platformLabel: "Plattform",
    aboutTitle: "Om projekten",
    aboutLead: "Bakgrunden till varfÃƒÂ¶r ApexCore och SÃƒÂ¶mnDagboken byggdes.",
    footerCopy: "Jesper Steens",
    openAppButton: "Ãƒâ€“ppna app",
    noApps: "Inga appar matchar vald plattform ÃƒÂ¤n."
  },
  en: {
    navApps: "Apps",
    navAbout: "About",
    downloadsTitle: "Downloads",
    downloadsCopy: "Keep your install files and links updated in one list.",
    platformLabel: "Platform",
    aboutTitle: "About the projects",
    aboutLead: "The story behind why ApexCore and Sleep Journal were built.",
    footerCopy: "Jesper Steens",
    openAppButton: "Open app",
    noApps: "No apps match this platform yet."
  },
  da: {
    navApps: "Apps",
    navAbout: "Om",
    downloadsTitle: "Downloads",
    downloadsCopy: "Hold dine installationsfiler og links opdateret i en liste.",
    platformLabel: "Platform",
    aboutTitle: "Om projekterne",
    aboutLead: "Historien bag hvorfor ApexCore og SÃƒÂ¸vnDagbogen blev bygget.",
    footerCopy: "Jesper Steens",
    openAppButton: "Ãƒâ€¦bn app",
    noApps: "Ingen apps matcher denne platform endnu."
  },
  no: {
    navApps: "Apper",
    navAbout: "Om",
    downloadsTitle: "Nedlastinger",
    downloadsCopy: "Hold installasjonsfilene og lenkene dine oppdatert i ÃƒÂ©n liste.",
    platformLabel: "Plattform",
    aboutTitle: "Om prosjektene",
    aboutLead: "Bakgrunnen for hvorfor ApexCore og SÃƒÂ¸vnDagboken ble bygget.",
    footerCopy: "Jesper Steens",
    openAppButton: "Ãƒâ€¦pne app",
    noApps: "Ingen apper matcher denne plattformen ennÃƒÂ¥."
  },
  fi: {
    navApps: "Sovellukset",
    navAbout: "Tietoa",
    downloadsTitle: "Lataukset",
    downloadsCopy: "PidÃƒÂ¤ asennustiedostosi ja linkkisi ajan tasalla yhdessÃƒÂ¤ listassa.",
    platformLabel: "Alusta",
    aboutTitle: "Tietoa projekteista",
    aboutLead: "Tarina siitÃƒÂ¤, miksi ApexCore ja Uni pÃƒÂ¤ivÃƒÂ¤kirja rakennettiin.",
    footerCopy: "Jesper Steens",
    openAppButton: "Avaa sovellus",
    noApps: "YksikÃƒÂ¤ÃƒÂ¤n sovellus ei vastaa valittua alustaa vielÃƒÂ¤."
  }
};

const apps = [
  {
    id: 'apexcore',
    title: 'ApexCore',
    subtitle: 'Projektledning och arbetsflÃƒÂ¶de',
    description: 'Ett flexibelt verktyg fÃƒÂ¶r uppgifter, prioritering och arbetsminne.',
    platform: 'Web',
    version: 'v3.0.3',
    url: 'ApexCore_3.0.3_stable/ApexCore_3.0.3_FinalFix.html'
  },
  {
    id: 'sleep-journal',
    title: 'SÃƒÂ¶mnDagbok',
    subtitle: 'SÃƒÂ¶mnspÃƒÂ¥rning',
    description: 'HÃƒÂ¥ll koll pÃƒÂ¥ dina sÃƒÂ¶mnvanor vecka fÃƒÂ¶r vecka.',
    platform: 'Web',
    url: 'sleep-journal-web/'
  }
];

const aboutStory = {
  sv: [
    '<h3>Ã¢â‚¬Â¢ ApexCore Ã¢â‚¬â€œ The Heart of Your Work</h3>',
    '<h4>En berÃƒÂ¤ttelse om funktion, fokus och att hitta rÃƒÂ¤tt verktyg</h4>',
    'Jag byggde ApexCore av en enkel anledning: jag behÃƒÂ¶vde nÃƒÂ¥got som faktiskt fungerade Ã¢â‚¬â€œ fÃƒÂ¶r mig.',
    'Som en person med NPF-diagnoser upptÃƒÂ¤ckte jag snabbt i mitt arbete att fysiska pÃƒÂ¥minnelselappar inte rÃƒÂ¤ckte till. Jag tappade bort dem, glÃƒÂ¶mde bort dem, eller sÃƒÂ¥ gav de helt enkelt inte den visuella pÃƒÂ¥minnelse som jag behÃƒÂ¶vde fÃƒÂ¶r att verkligen komma ihÃƒÂ¥g.',
    'SÃƒÂ¥ jag bÃƒÂ¶rjade leta. Jag letade efter ett digitalt verktyg som kunde gÃƒÂ¶ra det jag behÃƒÂ¶vde Ã¢â‚¬â€œ men jag hittade inget som passade. Antingen saknades viktiga funktioner, eller sÃƒÂ¥ var systemen sÃƒÂ¥ stora och komplexa att jag ÃƒÂ¤ndÃƒÂ¥ tappade bort mig sjÃƒÂ¤lv. Precis som med post-it-lapparna.',
    'Till slut insÃƒÂ¥g jag: VarfÃƒÂ¶r inte bygga nÃƒÂ¥got sjÃƒÂ¤lv?',
    '<h4>FrÃƒÂ¥n idÃƒÂ© till verklighet</h4>',
    'SÃƒÂ¥ bÃƒÂ¶rjade jag. Jag byggde utifrÃƒÂ¥n mina egna behov Ã¢â‚¬â€œ en person med NPF som behÃƒÂ¶ver enkelhet, struktur och ett visuellt sÃƒÂ¤tt att hÃƒÂ¥lla koll pÃƒÂ¥ allt som ska gÃƒÂ¶ras.',
    'Appen bÃƒÂ¶rjade som Ã¢â‚¬Å“Digital Post-it NotesÃ¢â‚¬Â Ã¢â‚¬â€œ ett litet projekt fÃƒÂ¶r att lÃƒÂ¶sa min egen vardag. Men allt eftersom koden vÃƒÂ¤xte, vÃƒÂ¤xte ocksÃƒÂ¥ visionen. Namnet byttes till ApexCore Ã¢â‚¬â€œ fÃƒÂ¶r att spegla vad det faktiskt ÃƒÂ¤r: kÃƒÂ¤rnan av ditt arbete.',
    '<h4>Utvecklad med omsorg</h4>',
    'Jag har arbetat pÃƒÂ¥ ApexCore varje dag under lÃƒÂ¥ng tid. Det har inte bara resulterat i en app Ã¢â‚¬â€œ det har ocksÃƒÂ¥ lÃƒÂ¤rt mig en enorm mÃƒÂ¤ngd om JavaScript, kodstruktur, och fÃƒÂ¶r den delen ÃƒÂ¤ven Python lÃƒÂ¤ngs vÃƒÂ¤gen.',
    'Min drivkraft har hela tiden varit: Ã¢â‚¬Å“Hur gÃƒÂ¶r jag det hÃƒÂ¤r sÃƒÂ¥ enkelt som mÃƒÂ¶jligt fÃƒÂ¶r mig Ã¢â‚¬â€œ och fÃƒÂ¶r andra?Ã¢â‚¬Â',
    '<h4>FrÃƒÂ¥n vÃƒÂ¥rden till vardagen</h4>',
    'Appen bÃƒÂ¶rjade som ett verktyg fÃƒÂ¶r mig sjÃƒÂ¤lv i mitt arbete inom ÃƒÂ¶ppenvÃƒÂ¥rdspsykiatrin. DÃƒÂ¤rfÃƒÂ¶r finns kategorin Patienter Ã¢â‚¬â€œ men jag insÃƒÂ¥g snabbt att det hÃƒÂ¤r ÃƒÂ¤r nÃƒÂ¥got som fler kan ha nytta av. Oavsett om du jobbar i vÃƒÂ¥rden, pluggar, driver ett projekt, eller bara vill ha bÃƒÂ¤ttre koll pÃƒÂ¥ vardagen.',
    '<h4>SÃƒÂ¶mnDagboken Ã¢â‚¬â€œ ett systerprojekt</h4>',
    'Vid sidan av ApexCore har jag ÃƒÂ¤ven skapat SÃƒÂ¶mnDagboken Ã¢â‚¬â€œ ett litet verktyg fÃƒÂ¶r att hÃƒÂ¥lla koll pÃƒÂ¥ sÃƒÂ¶mnen vecka fÃƒÂ¶r vecka. Den ÃƒÂ¤r fortfarande under utveckling (en sÃƒÂ¥ kallad alpha-version), men den gÃƒÂ¥r alldeles utmÃƒÂ¤rkt att anvÃƒÂ¤nda redan nu om du vill testa!',
    '<h4>AnvÃƒÂ¤nd direkt pÃƒÂ¥ webben</h4>',
    'Alla appar ÃƒÂ¤r gratis att anvÃƒÂ¤nda. Jag hoppas att de kan gÃƒÂ¶ra din vardag lite enklare Ã¢â‚¬â€œ precis som de gjort min.',
    '<p><strong>Tack fÃƒÂ¶r att du kikade fÃƒÂ¶rbi!</strong><br>Ha en fortsatt trevlig dag.</p>'
  ],
  en: [
    '<h3>Ã¢â‚¬Â¢ ApexCore Ã¢â‚¬â€œ The Heart of Your Work</h3>',
    '<h4>A story about function, focus, and finding the right tool</h4>',
    'I built ApexCore for one simple reason: I needed something that actually worked Ã¢â‚¬â€œ for me.',
    'As someone with ADHD, I quickly realized that physical reminder notes were not enough. I lost them, forgot them, or they simply did not provide the visual cue I needed to truly remember.',
    'So I started looking. I searched for a digital tool that could do what I needed Ã¢â‚¬â€œ but I could not find one that fit. Either important features were missing, or the systems were too big and complex for me to stay oriented. Just like the sticky notes.',
    'In the end, I realized: Why not build something myself?',
    '<h4>From idea to reality</h4>',
    'So I started. I built it around my own needs Ã¢â‚¬â€œ a person with ADHD who needs simplicity, structure, and a visual way to keep track of everything that needs to be done.',
    'The app started as Ã¢â‚¬Å“Digital Post-it NotesÃ¢â‚¬Â Ã¢â‚¬â€œ a small project to solve my own everyday life. But as the code grew, so did the vision. The name changed to ApexCore Ã¢â‚¬â€œ to reflect what it really is: the core of your work.',
    '<h4>Built with care</h4>',
    'I have worked on ApexCore every day for a long time. It has not only resulted in an app Ã¢â‚¬â€œ it has also taught me a huge amount about JavaScript, code structure, and even Python along the way.',
    'My motivation has always been: Ã¢â‚¬Å“How can I make this as simple as possible for me Ã¢â‚¬â€œ and for others?Ã¢â‚¬Â',
    '<h4>From healthcare to everyday life</h4>',
    'The app started as a tool for myself in my work within outpatient psychiatry. That is why the category Patients exists Ã¢â‚¬â€œ but I quickly realized that this is something others can benefit from too. Whether you work in healthcare, study, run a project, or simply want better control over everyday life.',
    '<h4>Sleep Journal Ã¢â‚¬â€œ a sister project</h4>',
    'Alongside ApexCore, I have also created Sleep Journal Ã¢â‚¬â€œ a small tool to track sleep week by week. It is still under development (an alpha version), but it already works well if you want to try it out!',
    '<h4>Use directly on the web</h4>',
    'All apps are free to use. I hope they can make your everyday life a little easier Ã¢â‚¬â€œ just as they have made mine.',
    '<p><strong>Thank you for stopping by!</strong><br>Have a lovely day.</p>'
  ],
  da: [
    '<h3>Ã¢â‚¬Â¢ ApexCore Ã¢â‚¬â€œ The Heart of Your Work</h3>',
    '<h4>En historie om funktion, fokus og at finde det rette vÃƒÂ¦rktÃƒÂ¸j</h4>',
    'Jeg byggede ApexCore af en enkel grund: jeg havde brug for noget, der faktisk virkede Ã¢â‚¬â€œ for mig.',
    'Som person med NPF-diagnoser opdagede jeg hurtigt i mit arbejde, at fysiske pÃƒÂ¥mindelsesnoter ikke var nok. Jeg mistede dem, glemte dem, eller de gav simpelthen ikke den visuelle pÃƒÂ¥mindelse, jeg havde brug for for virkelig at huske.',
    'SÃƒÂ¥ begyndte jeg at lede. Jeg sÃƒÂ¸gte efter et digitalt vÃƒÂ¦rktÃƒÂ¸j, der kunne gÃƒÂ¸re det, jeg havde brug for Ã¢â‚¬â€œ men jeg fandt ikke noget, der passede. Enten manglede vigtige funktioner, eller systemerne var sÃƒÂ¥ store og komplekse, at jeg stadig mistede mig selv. Ligesom med post-it-lapperne.',
    'Til sidst indsÃƒÂ¥ jeg: Hvorfor ikke bygge noget selv?',
    '<h4>Fra idÃƒÂ© til virkelighed</h4>',
    'SÃƒÂ¥ begyndte jeg. Jeg byggede ud fra mine egne behov Ã¢â‚¬â€œ en person med NPF, der har brug for enkelhed, struktur og en visuel mÃƒÂ¥de at holde styr pÃƒÂ¥ alt, der skal gÃƒÂ¸res.',
    'Appen begyndte som Ã¢â‚¬Å“Digital Post-it NotesÃ¢â‚¬Â Ã¢â‚¬â€œ et lille projekt til at lÃƒÂ¸se min egen hverdag. Men efterhÃƒÂ¥nden som koden voksede, voksede visionen ogsÃƒÂ¥. Navnet blev ÃƒÂ¦ndret til ApexCore Ã¢â‚¬â€œ for at afspejle, hvad det faktisk er: hjertet af dit arbejde.',
    '<h4>Udviklet med omtanke</h4>',
    'Jeg har arbejdet pÃƒÂ¥ ApexCore hver dag i lang tid. Det har ikke kun resulteret i en app Ã¢â‚¬â€œ det har ogsÃƒÂ¥ lÃƒÂ¦rt mig en kÃƒÂ¦mpe mÃƒÂ¦ngde om JavaScript, kodestuktur og endda Python undervejs.',
    'Min drivkraft har hele tiden vÃƒÂ¦ret: Ã¢â‚¬Å“Hvordan gÃƒÂ¸r jeg dette sÃƒÂ¥ enkelt som muligt for mig Ã¢â‚¬â€œ og for andre?Ã¢â‚¬Â',
    '<h4>Fra sundhedsvÃƒÂ¦senet til hverdagen</h4>',
    'Appen begyndte som et vÃƒÂ¦rktÃƒÂ¸j for mig selv i mit arbejde inden for ambulant psykiatri. Derfor findes kategorien Patienter Ã¢â‚¬â€œ men jeg indsÃƒÂ¥ hurtigt, at dette er noget, andre ogsÃƒÂ¥ kan have gavn af. Uanset om du arbejder inden for sundhedsvÃƒÂ¦senet, studerer, driver et projekt eller bare vil have bedre styr pÃƒÂ¥ hverdagen.',
    '<h4>SÃƒÂ¸vnDagbogen Ã¢â‚¬â€œ et sÃƒÂ¸sterprojekt</h4>',
    'SidelÃƒÂ¸bende med ApexCore har jeg ogsÃƒÂ¥ skabt SÃƒÂ¸vnDagbogen Ã¢â‚¬â€œ et lille vÃƒÂ¦rktÃƒÂ¸j til at holde styr pÃƒÂ¥ sÃƒÂ¸vn uge for uge. Den er stadig under udvikling (en sÃƒÂ¥kaldt alpha-version), men den fungerer allerede fint, hvis du vil prÃƒÂ¸ve den!',
    '<h4>Brug direkte pÃƒÂ¥ webben</h4>',
    'Alle apps er gratis at bruge. Jeg hÃƒÂ¥ber, de kan gÃƒÂ¸re din hverdag lidt lettere Ã¢â‚¬â€œ prÃƒÂ¦cis som de har gjort min.',
    '<p><strong>Tak fordi du kiggede forbi!</strong><br>Ha en fortsat dejlig dag.</p>'
  ],
  no: [
    '<h3>Ã¢â‚¬Â¢ ApexCore Ã¢â‚¬â€œ The Heart of Your Work</h3>',
    '<h4>En historie om funksjon, fokus og ÃƒÂ¥ finne riktig verktÃƒÂ¸y</h4>',
    'Jeg bygget ApexCore av en enkel grunn: jeg trengte noe som faktisk fungerte Ã¢â‚¬â€œ for meg.',
    'Som person med NPF-diagnoser oppdaget jeg raskt i arbeidet at fysiske pÃƒÂ¥minnelsesnotater ikke var nok. Jeg mistet dem, glemte dem, eller de ga rett og slett ikke den visuelle pÃƒÂ¥minnelsen jeg trengte for virkelig ÃƒÂ¥ huske.',
    'SÃƒÂ¥ begynte jeg ÃƒÂ¥ lete. Jeg lette etter et digitalt verktÃƒÂ¸y som kunne gjÃƒÂ¸re det jeg trengte Ã¢â‚¬â€œ men jeg fant ingenting som passet. Enten manglet viktige funksjoner, eller systemene var sÃƒÂ¥ store og komplekse at jeg likevel mistet meg selv. Liksom med post-it-lappene.',
    'Til slutt innsÃƒÂ¥ jeg: Hvorfor ikke bygge noe selv?',
    '<h4>Fra idÃƒÂ© til virkelighet</h4>',
    'SÃƒÂ¥ begynte jeg. Jeg bygget ut fra mine egne behov Ã¢â‚¬â€œ en person med NPF som trenger enkelhet, struktur og en visuell mÃƒÂ¥te ÃƒÂ¥ holde styr pÃƒÂ¥ alt som skal gjÃƒÂ¸res.',
    'Appen startet som Ã¢â‚¬Å“Digital Post-it NotesÃ¢â‚¬Â Ã¢â‚¬â€œ et lite prosjekt for ÃƒÂ¥ lÃƒÂ¸se min egen hverdag. Men etter hvert som koden vokste, vokste ogsÃƒÂ¥ visionen. Navnet ble endret til ApexCore Ã¢â‚¬â€œ for ÃƒÂ¥ gjenspeile hva det egentlig er: kjernen i arbeidet ditt.',
    '<h4>Utviklet med omsorg</h4>',
    'Jeg har jobbet med ApexCore hver dag i lang tid. Det har ikke bare resultert i en app Ã¢â‚¬â€œ det har ogsÃƒÂ¥ lÃƒÂ¦rt meg en enorm mengde om JavaScript, kodestruktur og til og med Python underveis.',
    'Motivasjonen min har hele tiden vÃƒÂ¦rt: Ã¢â‚¬Å“Hvordan gjÃƒÂ¸r jeg dette sÃƒÂ¥ enkelt som mulig for meg Ã¢â‚¬â€œ og for andre?Ã¢â‚¬Â',
    '<h4>Fra helsetjenesten til hverdagen</h4>',
    'Appen startet som et verktÃƒÂ¸y for meg selv i mitt arbeid innen ambulant psykiatri. Derfor finnes kategorien Pasienter Ã¢â‚¬â€œ men jeg innsÃƒÂ¥ raskt at dette er noe andre ogsÃƒÂ¥ kan ha nytte av. Enten du jobber i helsetjenesten, studerer, driver et prosjekt eller bare vil ha bedre kontroll over hverdagen.',
    '<h4>SÃƒÂ¸vnDagboken Ã¢â‚¬â€œ et sÃƒÂ¸sterprosjekt</h4>',
    'Ved siden av ApexCore har jeg ogsÃƒÂ¥ skapt SÃƒÂ¸vnDagboken Ã¢â‚¬â€œ et lite verktÃƒÂ¸y for ÃƒÂ¥ holde styr pÃƒÂ¥ sÃƒÂ¸vn uke for uke. Den er fortsatt under utvikling (en sÃƒÂ¥kalt alpha-versjon), men den fungerer allerede veldig godt hvis du vil teste den!',
    '<h4>Bruk direkte pÃƒÂ¥ webben</h4>',
    'Alle apper er gratis ÃƒÂ¥ bruke. Jeg hÃƒÂ¥per de kan gjÃƒÂ¸re hverdagen din litt enklere Ã¢â‚¬â€œ akkurat som de har gjort min.',
    '<p><strong>Takk for at du kikket forbi!</strong><br>Ha en fortsatt fin dag.</p>'
  ],
  fi: [
    '<h3>Ã¢â‚¬Â¢ ApexCore Ã¢â‚¬â€œ The Heart of Your Work</h3>',
    '<h4>Tarina toiminnallisuudesta, keskittymisestÃƒÂ¤ ja oikean tyÃƒÂ¶kalun lÃƒÂ¶ytÃƒÂ¤misestÃƒÂ¤</h4>',
    'Rakensin ApexCoren yhdestÃƒÂ¤ yksinkertaisesta syystÃƒÂ¤: tarvitsin jotain, joka todella toimi Ã¢â‚¬â€œ minulle.',
    'Kuten henkilÃƒÂ¶, jolla on NPF-diagnoosi, huomasin nopeasti tyÃƒÂ¶ssÃƒÂ¤ni, ettÃƒÂ¤ fyysiset muistilapput eivÃƒÂ¤t riittÃƒÂ¤neet. Kadotin ne, unohdin ne, tai ne eivÃƒÂ¤t yksinkertaisesti antaneet sitÃƒÂ¤ visuaalista muistutusta, jota tarvitsin todella muistakseni.',
    'Aloin siis etsiÃƒÂ¤. Etsin digitaalisia tyÃƒÂ¶kaluja, jotka voisivat tehdÃƒÂ¤ sen, mitÃƒÂ¤ tarvitsin Ã¢â‚¬â€œ mutta en lÃƒÂ¶ytÃƒÂ¤nyt sopivaa. Joko tÃƒÂ¤rkeitÃƒÂ¤ ominaisuuksia puuttui, tai jÃƒÂ¤rjestelmÃƒÂ¤t olivat liian suuria ja monimutkaisia, jotta pysyisin orientoituneena. Aivan kuten post-it-lappujen kanssa.',
    'Lopulta tajusin: Miksi en rakentaisi jotain itse?',
    '<h4>Ideasta todellisuuteen</h4>',
    'Sitten aloin. Rakensin omien tarpeideni mukaan Ã¢â‚¬â€œ henkilÃƒÂ¶, jolla on NPF, ja joka tarvitsee yksinkertaisuutta, rakennetta ja visuaalisen tavan pitÃƒÂ¤ÃƒÂ¤ kirjaa kaikesta, mitÃƒÂ¤ pitÃƒÂ¤ÃƒÂ¤ tehdÃƒÂ¤.',
    'Sovellus alkoi nimellÃƒÂ¤ Ã¢â‚¬Å“Digital Post-it NotesÃ¢â‚¬Â Ã¢â‚¬â€œ pienestÃƒÂ¤ projektista, jonka tarkoituksena oli ratkaista oma arkeni. Mutta kun koodi kasvoi, kasvoi myÃƒÂ¶s visio. Nimi muutettiin ApexCoreksi Ã¢â‚¬â€œ heijastamaan, mitÃƒÂ¤ se todella on: tyÃƒÂ¶n ydin.',
    '<h4>Rakennettu huolella</h4>',
    'Olen tyÃƒÂ¶skennellyt ApexCoren parissa joka pÃƒÂ¤ivÃƒÂ¤ pitkÃƒÂ¤ÃƒÂ¤n. Se on tuottanut minulle ei vain sovelluksen Ã¢â‚¬â€œ se on myÃƒÂ¶s opettanut minulle valtavasti JavaScriptistÃƒÂ¤, koodirakenteesta ja jopa Pythonista matkan varrella.',
    'Motivaatiooni on aina ollut: Ã¢â‚¬Å“Kuinka voin tehdÃƒÂ¤ tÃƒÂ¤stÃƒÂ¤ mahdollisimman yksinkertaisen minulle Ã¢â‚¬â€œ ja muille?Ã¢â‚¬Â',
    '<h4>Terveydenhuollosta arkeen</h4>',
    'Sovellus alkoi tyÃƒÂ¶kaluna itselleni avohoitopsykiatrian tyÃƒÂ¶ssÃƒÂ¤. Siksi kategoria Potilaat on olemassa Ã¢â‚¬â€œ mutta huomasin nopeasti, ettÃƒÂ¤ tÃƒÂ¤stÃƒÂ¤ voi olla hyÃƒÂ¶tyÃƒÂ¤ myÃƒÂ¶s muille. Olitpa tyÃƒÂ¶skentelemÃƒÂ¤ssÃƒÂ¤ terveydenhuollossa, opiskelemassa, johtamassa projektia tai haluat vain parempaa kontrollia arkeen.',
    '<h4>Sleep Journal Ã¢â‚¬â€œ sisarprojekti</h4>',
    'ApexCoren rinnalla olen myÃƒÂ¶s luonut Sleep Journalin Ã¢â‚¬â€œ pienen tyÃƒÂ¶kalun, jonka avulla voi seurata unta viikosta toiseen. Se on edelleen kehityksen alla (alpha-versio), mutta se toimii jo hyvin, jos haluat kokeilla sitÃƒÂ¤!',
    '<h4>KÃƒÂ¤ytÃƒÂ¤ suoraan verkossa</h4>',
    'Kaikki sovellukset ovat ilmaisia kÃƒÂ¤yttÃƒÂ¤ÃƒÂ¤. Toivon, ettÃƒÂ¤ ne voivat tehdÃƒÂ¤ arjestasi hieman helpompaa Ã¢â‚¬â€œ aivan kuten ne ovat tehneet minun.',
    '<p><strong>Kiitos, ettÃƒÂ¤ poikkesit!</strong><br>Have a lovely day.</p>'
  ]
};

function getStoredLanguage() {
  return localStorage.getItem('steenforge-lang') || 'sv';
}

function setStoredLanguage(lang) {
  localStorage.setItem('steenforge-lang', lang);
}

function getVisibleApps() {
  const filter = document.getElementById('platformFilter').value;
  return apps.filter((app) => filter === 'all' || app.platform === filter);
}

function renderApps() {
  const container = document.getElementById('appsGrid');
  if (!container) return;

  const visibleApps = getVisibleApps();
  if (!visibleApps.length) {
    container.innerHTML = `<p class="empty-state">${translations[getStoredLanguage()].noApps}</p>`;
    return;
  }

  container.innerHTML = visibleApps.map((app) => `
    <article class="app-card">
      <h3 class="app-title">${app.title}</h3>
      <p class="app-meta">${app.subtitle}</p>
      <p class="app-meta">${app.description}</p>
      <div class="tag-row">
        <span class="tag">${app.platform}</span>
      </div>
      <a class="download-btn" href="${app.url}">${translations[getStoredLanguage()].openAppButton}</a>
    </article>
  `).join('');
}

function renderAbout() {
  const container = document.getElementById('aboutContent');
  if (!container) return;
  const lang = getStoredLanguage();
  container.innerHTML = aboutStory[lang]
    ? aboutStory[lang]
      .map((block) => {
        const trimmed = String(block).trim();
        if (trimmed.startsWith('<h3') || trimmed.startsWith('<h4') || trimmed.startsWith('<p')) {
          return trimmed;
        }
        return `<p>${trimmed}</p>`;
      })
      .join('')
    : '';
}

function applyLanguage(lang = getStoredLanguage()) {
  setStoredLanguage(lang);
  const t = translations[lang] || translations.sv;
  document.documentElement.lang = lang;
  document.title = `SteenForge | ${t.downloadsTitle}`;

  const ids = [
    ['navApps', t.navApps],
    ['navAbout', t.navAbout],
    ['downloadsTitle', t.downloadsTitle],
    ['downloadsCopy', t.downloadsCopy],
    ['platformLabel', t.platformLabel],
    ['aboutTitle', t.aboutTitle],
    ['aboutLead', t.aboutLead],
    ['footerCopy', t.footerCopy]
  ];

  ids.forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  renderApps();
  renderAbout();
}

function initLanguageSelector() {
  const select = document.getElementById('languageSelect');
  if (!select) return;
  select.addEventListener('change', (event) => applyLanguage(event.target.value));
  applyLanguage(getStoredLanguage());
}

window.SteenForge = {
  apps,
  getCurrentLanguage: getStoredLanguage,
  setLanguage: setStoredLanguage,
  updateCommonStaticContent() {
    const lang = getStoredLanguage();
    const t = translations[lang] || translations.sv;
    const navApps = document.getElementById('navApps');
    const navAbout = document.getElementById('navAbout');
    const footerCopy = document.getElementById('footerCopy');

    if (navApps) navApps.textContent = t.navApps;
    if (navAbout) navAbout.textContent = t.navAbout;
    if (footerCopy) footerCopy.textContent = t.footerCopy;
  },
  updateLanguageSelector(select) {
    if (!select) return;
    select.value = getStoredLanguage();
  },
  getLocalizedContent(app) {
    return {
      name: app.title,
      tagline: app.subtitle,
      notes: app.notes || []
    };
  },
  getAppPlatforms(app) {
    return app.platform ? [app.platform] : [];
  },
  buildReleaseNotesMarkup(notes) {
    if (!notes || !notes.length) {
      return '<p>No release notes available.</p>';
    }

    return notes.map((note) => `<p>${note}</p>`).join('');
  },
  formatDate(value) {
    if (!value) return '';
    try {
      return new Date(value).toLocaleDateString(getStoredLanguage());
    } catch (e) {
      return String(value);
    }
  },
  getUI() {
    const lang = getStoredLanguage();
    const openLabel = translations[lang]?.openAppButton || 'Open';
    const downloadLabel = lang === 'sv' ? 'Ladda ner fil' : 'Download file';
    return {
      actionOpenWeb: openLabel,
      actionDownloadFile: downloadLabel
    };
  }
};

window.addEventListener('DOMContentLoaded', initLanguageSelector);
