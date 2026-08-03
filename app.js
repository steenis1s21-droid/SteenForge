const languageMeta = {
  sv: { locale: "sv-SE", selectorTitle: "VÃ¤lj sprÃ¥k" },
  en: { locale: "en-US", selectorTitle: "Choose language" },
  da: { locale: "da-DK", selectorTitle: "VÃ¦lg sprog" },
  no: { locale: "nb-NO", selectorTitle: "Velg sprÃ¥k" },
  fi: { locale: "fi-FI", selectorTitle: "Valitse kieli" }
};

const translations = {
  sv: {
    navApps: "Appar",
    navAbout: "Om",
    downloadsTitle: "Nedladdningar",
    downloadsCopy: "HÃ¥ll dina installationsfiler och lÃ¤nkar uppdaterade i en lista.",
    platformLabel: "Plattform",
    aboutTitle: "Om projekten",
    aboutLead: "Bakgrunden till varfÃ¶r ApexCore och SÃ¶mndagboken byggdes.",
    footerCopy: "SteenForge-mall. Redigera data i app.js fÃ¶r att publicera dina riktiga appar.",
    openAppButton: "Ã–ppna app",
    noApps: "Inga appar matchar vald plattform Ã¤n."
  },
  en: {
    navApps: "Apps",
    navAbout: "About",
    downloadsTitle: "Downloads",
    downloadsCopy: "Keep your install files and links updated in one list.",
    platformLabel: "Platform",
    aboutTitle: "About the projects",
    aboutLead: "The story behind why ApexCore and Sleep Journal were built.",
    footerCopy: "SteenForge starter template. Edit data in app.js to publish your real apps.",
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
    aboutLead: "Historien bag hvorfor ApexCore og SÃ¸nndagbogen blev bygget.",
    footerCopy: "SteenForge-skabelon. Rediger data i app.js for at udgive dine rigtige apps.",
    openAppButton: "Ã…bn app",
    noApps: "Ingen apps matcher denne platform endnu."
  },
  no: {
    navApps: "Apper",
    navAbout: "Om",
    downloadsTitle: "Nedlastinger",
    downloadsCopy: "Hold installasjonsfilene og lenkene dine oppdatert i Ã©n liste.",
    platformLabel: "Plattform",
    aboutTitle: "Om prosjektene",
    aboutLead: "Bakgrunnen for hvorfor ApexCore og SÃ¸vnDagboken ble bygget.",
    footerCopy: "SteenForge-mal. Rediger data i app.js for Ã¥ publisere appene dine.",
    openAppButton: "Ã…pne app",
    noApps: "Ingen apper matcher denne plattformen ennÃ¥."
  },
  fi: {
    navApps: "Sovellukset",
    navAbout: "Tietoa",
    downloadsTitle: "Lataukset",
    downloadsCopy: "PidÃ¤ asennustiedostosi ja linkkisi ajan tasalla yhdessÃ¤ listassa.",
    platformLabel: "Alusta",
    aboutTitle: "Tietoa projekteista",
    aboutLead: "Tarina siitÃ¤, miksi ApexCore ja Uni pÃ¤ivÃ¤kirja rakennettiin.",
    footerCopy: "SteenForge-pohja. Muokkaa dataa tiedostossa app.js julkaistaksesi oikeat sovelluksesi.",
    openAppButton: "Avaa sovellus",
    noApps: "YksikÃ¤Ã¤n sovellus ei vastaa valittua alustaa vielÃ¤."
  }
};

const apps = [
  {
    id: 'apexcore',
    title: 'ApexCore',
    subtitle: 'Projektledning och arbetsflÃ¶de',
    description: 'Ett flexibelt verktyg fÃ¶r uppgifter, prioritering och arbetsminne.',
    platform: 'Webb',
    version: 'v3.0.3',
    url: 'ApexCore_3.0.3_stable/ApexCore_3.0.3_FinalFix.html'
  },
  {
    id: 'sleep-journal',
    title: 'SÃ¶mndagbok',
    subtitle: 'SÃ¶mnspÃ¥rning',
    description: 'HÃ¥ll koll pÃ¥ dina sÃ¶mnvanor vecka fÃ¶r vecka.',
    platform: 'Webb',
    url: 'sleep-journal-web/'
  }
];

const aboutStory = {
  sv: [
    '<h3>â­• ApexCore â€“ The Heart of Your Work</h3>',
    '<h4>En berÃ¤ttelse om funktion, fokus och att hitta rÃ¤tt verktyg</h4>',
    'Jag byggde ApexCore av en enkel anledning: jag behÃ¶vde nÃ¥got som faktiskt fungerade â€“ fÃ¶r mig.',
    'Som en person med NPF-diagnoser upptÃ¤ckte jag snabbt i mitt arbete att fysiska pÃ¥minnelselappar inte rÃ¤ckte till. Jag tappade bort dem, glÃ¶mde bort dem, eller sÃ¥ gav de helt enkelt inte den visuella pÃ¥minnelse som jag behÃ¶vde fÃ¶r att verkligen komma ihÃ¥g.',
    'SÃ¥ jag bÃ¶rjade leta. Jag letade efter ett digitalt verktyg som kunde gÃ¶ra det jag behÃ¶vde â€“ men jag hittade inget som passade. Antingen saknades viktiga funktioner, eller sÃ¥ var systemen sÃ¥ stora och komplexa att jag Ã¤ndÃ¥ tappade bort mig sjÃ¤lv. Precis som med post-it-lapparna. ðŸ˜…',
    'Till slut insÃ¥g jag: VarfÃ¶r inte bygga nÃ¥got sjÃ¤lv?',
    '<h4>ðŸ’¡ FrÃ¥n idÃ© till verklighet</h4>',
    'SÃ¥ bÃ¶rjade jag. Jag byggde utifrÃ¥n mina egna behov â€“ en person med NPF som behÃ¶ver enkelhet, struktur och ett visuellt sÃ¤tt att hÃ¥lla koll pÃ¥ allt som ska gÃ¶ras.',
    'Appen bÃ¶rjade som â€Digital Post-it Notesâ€ â€“ ett litet projekt fÃ¶r att lÃ¶sa min egen vardag. Men allt eftersom koden vÃ¤xte, vÃ¤xte ocksÃ¥ visionen. Namnet byttes till ApexCore â€“ fÃ¶r att spegla vad det faktiskt Ã¤r: kÃ¤rnan av ditt arbete.',
    '<h4>ðŸ§  Utvecklad med omsorg</h4>',
    'Jag har arbetat pÃ¥ ApexCore varje dag under lÃ¥ng tid. Det har inte bara resulterat i en app â€“ det har ocksÃ¥ lÃ¤rt mig en enorm mÃ¤ngd om JavaScript, kodstruktur, och fÃ¶r den delen Ã¤ven Python lÃ¤ngs vÃ¤gen. ðŸ',
    'Min drivkraft har hela tiden varit: â€Hur gÃ¶r jag det hÃ¤r sÃ¥ enkelt som mÃ¶jligt fÃ¶r mig â€“ och fÃ¶r andra?â€',
    '<h4>ðŸ¥ FrÃ¥n vÃ¥rden till vardagen</h4>',
    'Appen bÃ¶rjade som ett verktyg fÃ¶r mig sjÃ¤lv i mitt arbete inom Ã¶ppenvÃ¥rdspsykiatrin. DÃ¤rfÃ¶r finns kategorin Patienter â€“ men jag insÃ¥g snabbt att det hÃ¤r Ã¤r nÃ¥got som fler kan ha nytta av. Oavsett om du jobbar i vÃ¥rden, pluggar, driver ett projekt, eller bara vill ha bÃ¤ttre koll pÃ¥ vardagen.',
    '<h4>ðŸŒ™ SÃ¶mnDagboken â€“ ett systerprojekt</h4>',
    'Vid sidan av ApexCore har jag Ã¤ven skapat SÃ¶mnDagboken â€“ ett litet verktyg fÃ¶r att hÃ¥lla koll pÃ¥ sÃ¶mnen vecka fÃ¶r vecka. Den Ã¤r fortfarande under utveckling (en sÃ¥ kallad alpha-version), men den gÃ¥r alldeles utmÃ¤rkt att anvÃ¤nda redan nu om du vill testa!',
    '<h4>ðŸ“¦ Ladda ner & testa</h4>',
    'Alla appar Ã¤r gratis att anvÃ¤nda. Jag hoppas att de kan gÃ¶ra din vardag lite enklare â€“ precis som de gjort min.',
    '<p><strong>Tack fÃ¶r att du kikade fÃ¶rbi! ðŸ™Œ</strong><br>Ha en fortsatt trevlig dag.</p>'
  ],
  en: [
    '<h3>â­• ApexCore â€“ The Heart of Your Work</h3>',
    '<h4>A story about function, focus, and finding the right tool</h4>',
    'I built ApexCore for one simple reason: I needed something that actually worked â€“ for me.',
    'As someone with ADHD, I quickly realized that physical reminder notes were not enough. I lost them, forgot them, or they simply did not provide the visual cue I needed to truly remember.',
    'So I started looking. I searched for a digital tool that could do what I needed â€“ but I could not find one that fit. Either important features were missing, or the systems were too big and complex for me to stay oriented. Just like the sticky notes. ðŸ˜…',
    'In the end, I realized: Why not build something myself?',
    '<h4>ðŸ’¡ From idea to reality</h4>',
    'So I started. I built it around my own needs â€“ a person with ADHD who needs simplicity, structure, and a visual way to keep track of everything that needs to be done.',
    'The app started as â€œDigital Post-it Notesâ€ â€“ a small project to solve my own everyday life. But as the code grew, so did the vision. The name changed to ApexCore â€“ to reflect what it really is: the core of your work.',
    '<h4>ðŸ§  Built with care</h4>',
    'I have worked on ApexCore every day for a long time. It has not only resulted in an app â€“ it has also taught me a huge amount about JavaScript, code structure, and even Python along the way. ðŸ',
    'My motivation has always been: â€œHow can I make this as simple as possible for me â€“ and for others?â€',
    '<h4>ðŸ¥ From healthcare to everyday life</h4>',
    'The app started as a tool for myself in my work within outpatient psychiatry. That is why the category Patients exists â€“ but I quickly realized that this is something others can benefit from too. Whether you work in healthcare, study, run a project, or simply want better control over everyday life.',
    '<h4>ðŸŒ™ Sleep Journal â€“ a sister project</h4>',
    'Alongside ApexCore, I have also created Sleep Journal â€“ a small tool to track sleep week by week. It is still under development (an alpha version), but it already works well if you want to try it out!',
    '<h4>ðŸ“¦ Download & test</h4>',
    'All apps are free to use. I hope they can make your everyday life a little easier â€“ just as they have made mine.',
    '<p><strong>Thank you for stopping by! ðŸ™Œ</strong><br>Have a lovely day.</p>'
  ],
  da: [
    '<h3>â­• ApexCore â€“ The Heart of Your Work</h3>',
    '<h4>En historie om funktion, fokus og at finde det rette vÃ¦rktÃ¸j</h4>',
    'Jeg byggede ApexCore af en enkel grund: jeg havde brug for noget, der faktisk virkede â€“ for mig.',
    'Som person med NPF-diagnoser opdagede jeg hurtigt i mit arbejde, at fysiske pÃ¥mindelsesnoter ikke var nok. Jeg mistede dem, glemte dem, eller de gav simpelthen ikke den visuelle pÃ¥mindelse, jeg havde brug for for virkelig at huske.',
    'SÃ¥ begyndte jeg at lede. Jeg sÃ¸gte efter et digitalt vÃ¦rktÃ¸j, der kunne gÃ¸re det, jeg havde brug for â€“ men jeg fandt ikke noget, der passede. Enten manglede vigtige funktioner, eller systemerne var sÃ¥ store og komplekse, at jeg stadig mistede mig selv. Ligesom med post-it-lapperne. ðŸ˜…',
    'Til sidst indsÃ¥ jeg: Hvorfor ikke bygge noget selv?',
    '<h4>ðŸ’¡ Fra idÃ© til virkelighed</h4>',
    'SÃ¥ begyndte jeg. Jeg byggede ud fra mine egne behov â€“ en person med NPF, der har brug for enkelhed, struktur og en visuel mÃ¥de at holde styr pÃ¥ alt, der skal gÃ¸res.',
    'Appen begyndte som â€œDigital Post-it Notesâ€ â€“ et lille projekt til at lÃ¸se min egen hverdag. Men efterhÃ¥nden som koden voksede, voksede visionen ogsÃ¥. Navnet blev Ã¦ndret til ApexCore â€“ for at afspejle, hvad det faktisk er: hjertet af dit arbejde.',
    '<h4>ðŸ§  Udviklet med omtanke</h4>',
    'Jeg har arbejdet pÃ¥ ApexCore hver dag i lang tid. Det har ikke kun resulteret i en app â€“ det har ogsÃ¥ lÃ¦rt mig en kÃ¦mpe mÃ¦ngde om JavaScript, kodestuktur og endda Python undervejs. ðŸ',
    'Min drivkraft har hele tiden vÃ¦ret: â€œHvordan gÃ¸r jeg dette sÃ¥ enkelt som muligt for mig â€“ og for andre?â€',
    '<h4>ðŸ¥ Fra sundhedsvÃ¦senet til hverdagen</h4>',
    'Appen begyndte som et vÃ¦rktÃ¸j for mig selv i mit arbejde inden for ambulant psykiatri. Derfor findes kategorien Patienter â€“ men jeg indsÃ¥ hurtigt, at dette er noget, andre ogsÃ¥ kan have gavn af. Uanset om du arbejder inden for sundhedsvÃ¦senet, studerer, driver et projekt eller bare vil have bedre styr pÃ¥ hverdagen.',
    '<h4>ðŸŒ™ SÃ¸vnDagbogen â€“ et sÃ¸sterprojekt</h4>',
    'SidelÃ¸bende med ApexCore har jeg ogsÃ¥ skabt SÃ¸vnDagbogen â€“ et lille vÃ¦rktÃ¸j til at holde styr pÃ¥ sÃ¸vn uge for uge. Den er stadig under udvikling (en sÃ¥kaldt alpha-version), men den fungerer allerede fint, hvis du vil prÃ¸ve den!',
    '<h4>ðŸ“¦ Download & test</h4>',
    'Alle apps er gratis at bruge. Jeg hÃ¥ber, de kan gÃ¸re din hverdag lidt lettere â€“ prÃ¦cis som de har gjort min.',
    '<p><strong>Tak fordi du kiggede forbi! ðŸ™Œ</strong><br>Ha en fortsat dejlig dag.</p>'
  ],
  no: [
    '<h3>â­• ApexCore â€“ The Heart of Your Work</h3>',
    '<h4>En historie om funksjon, fokus og Ã¥ finne riktig verktÃ¸y</h4>',
    'Jeg bygget ApexCore av en enkel grunn: jeg trengte noe som faktisk fungerte â€“ for meg.',
    'Som person med NPF-diagnoser oppdaget jeg raskt i arbeidet at fysiske pÃ¥minnelsesnotater ikke var nok. Jeg mistet dem, glemte dem, eller de ga rett og slett ikke den visuelle pÃ¥minnelsen jeg trengte for virkelig Ã¥ huske.',
    'SÃ¥ begynte jeg Ã¥ lete. Jeg lette etter et digitalt verktÃ¸y som kunne gjÃ¸re det jeg trengte â€“ men jeg fant ingenting som passet. Enten manglet viktige funksjoner, eller systemene var sÃ¥ store og komplekse at jeg likevel mistet meg selv. Liksom med post-it-lappene. ðŸ˜…',
    'Til slutt innsÃ¥ jeg: Hvorfor ikke bygge noe selv?',
    '<h4>ðŸ’¡ Fra idÃ© til virkelighet</h4>',
    'SÃ¥ begynte jeg. Jeg bygget ut fra mine egne behov â€“ en person med NPF som trenger enkelhet, struktur og en visuell mÃ¥te Ã¥ holde styr pÃ¥ alt som skal gjÃ¸res.',
    'Appen startet som â€œDigital Post-it Notesâ€ â€“ et lite prosjekt for Ã¥ lÃ¸se min egen hverdag. Men etter hvert som koden vokste, vokste ogsÃ¥ visionen. Navnet ble endret til ApexCore â€“ for Ã¥ gjenspeile hva det egentlig er: kjernen i arbeidet ditt.',
    '<h4>ðŸ§  Utviklet med omsorg</h4>',
    'Jeg har jobbet med ApexCore hver dag i lang tid. Det har ikke bare resultert i en app â€“ det har ogsÃ¥ lÃ¦rt meg en enorm mengde om JavaScript, kodestruktur og til og med Python underveis. ðŸ',
    'Motivasjonen min har hele tiden vÃ¦rt: â€œHvordan gjÃ¸r jeg dette sÃ¥ enkelt som mulig for meg â€“ og for andre?â€',
    '<h4>ðŸ¥ Fra helsetjenesten til hverdagen</h4>',
    'Appen startet som et verktÃ¸y for meg selv i mitt arbeid innen ambulant psykiatri. Derfor finnes kategorien Pasienter â€“ men jeg innsÃ¥ raskt at dette er noe andre ogsÃ¥ kan ha nytte av. Enten du jobber i helsetjenesten, studerer, driver et prosjekt eller bare vil ha bedre kontroll over hverdagen.',
    '<h4>ðŸŒ™ SÃ¸vnDagboken â€“ et sÃ¸sterprosjekt</h4>',
    'Ved siden av ApexCore har jeg ogsÃ¥ skapt SÃ¸vnDagboken â€“ et lite verktÃ¸y for Ã¥ holde styr pÃ¥ sÃ¸vn uke for uke. Den er fortsatt under utvikling (en sÃ¥kalt alpha-versjon), men den fungerer allerede veldig godt hvis du vil teste den!',
    '<h4>ðŸ“¦ Last ned & test</h4>',
    'Alle apper er gratis Ã¥ bruke. Jeg hÃ¥per de kan gjÃ¸re hverdagen din litt enklere â€“ akkurat som de har gjort min.',
    '<p><strong>Takk for at du kikket forbi! ðŸ™Œ</strong><br>Ha en fortsatt fin dag.</p>'
  ],
  fi: [
    '<h3>â­• ApexCore â€“ The Heart of Your Work</h3>',
    '<h4>Tarina toiminnallisuudesta, keskittymisestÃ¤ ja oikean tyÃ¶kalun lÃ¶ytÃ¤misestÃ¤</h4>',
    'Rakensin ApexCoren yhdestÃ¤ yksinkertaisesta syystÃ¤: tarvitsin jotain, joka todella toimi â€“ minulle.',
    'Kuten henkilÃ¶, jolla on NPF-diagnoosi, huomasin nopeasti tyÃ¶ssÃ¤ni, ettÃ¤ fyysiset muistilapput eivÃ¤t riittÃ¤neet. Kadotin ne, unohdin ne, tai ne eivÃ¤t yksinkertaisesti antaneet sitÃ¤ visuaalista muistutusta, jota tarvitsin todella muistakseni.',
    'Aloin siis etsiÃ¤. Etsin digitaalisia tyÃ¶kaluja, jotka voisivat tehdÃ¤ sen, mitÃ¤ tarvitsin â€“ mutta en lÃ¶ytÃ¤nyt sopivaa. Joko tÃ¤rkeitÃ¤ ominaisuuksia puuttui, tai jÃ¤rjestelmÃ¤t olivat liian suuria ja monimutkaisia, jotta pysyisin orientoituneena. Aivan kuten post-it-lappujen kanssa. ðŸ˜…',
    'Lopulta tajusin: Miksi en rakentaisi jotain itse?',
    '<h4>ðŸ’¡ Ideasta todellisuuteen</h4>',
    'Sitten aloin. Rakensin omien tarpeideni mukaan â€“ henkilÃ¶, jolla on NPF, ja joka tarvitsee yksinkertaisuutta, rakennetta ja visuaalisen tavan pitÃ¤Ã¤ kirjaa kaikesta, mitÃ¤ pitÃ¤Ã¤ tehdÃ¤.',
    'Sovellus alkoi nimellÃ¤ â€œDigital Post-it Notesâ€ â€“ pienestÃ¤ projektista, jonka tarkoituksena oli ratkaista oma arkeni. Mutta kun koodi kasvoi, kasvoi myÃ¶s visio. Nimi muutettiin ApexCoreksi â€“ heijastamaan, mitÃ¤ se todella on: tyÃ¶n ydin.',
    '<h4>ðŸ§  Rakennettu huolella</h4>',
    'Olen tyÃ¶skennellyt ApexCoren parissa joka pÃ¤ivÃ¤ pitkÃ¤Ã¤n. Se on tuottanut minulle ei vain sovelluksen â€“ se on myÃ¶s opettanut minulle valtavasti JavaScriptistÃ¤, koodirakenteesta ja jopa Pythonista matkan varrella. ðŸ',
    'Motivaatiooni on aina ollut: â€œKuinka voin tehdÃ¤ tÃ¤stÃ¤ mahdollisimman yksinkertaisen minulle â€“ ja muille?â€',
    '<h4>ðŸ¥ Terveydenhuollosta arkeen</h4>',
    'Sovellus alkoi tyÃ¶kaluna itselleni avohoitopsykiatrian tyÃ¶ssÃ¤. Siksi kategoria Potilaat on olemassa â€“ mutta huomasin nopeasti, ettÃ¤ tÃ¤stÃ¤ voi olla hyÃ¶tyÃ¤ myÃ¶s muille. Olitpa tyÃ¶skentelemÃ¤ssÃ¤ terveydenhuollossa, opiskelemassa, johtamassa projektia tai haluat vain parempaa kontrollia arkeen.',
    '<h4>ðŸŒ™ Sleep Journal â€“ sisarprojekti</h4>',
    'ApexCoren rinnalla olen myÃ¶s luonut Sleep Journalin â€“ pienen tyÃ¶kalun, jonka avulla voi seurata unta viikosta toiseen. Se on edelleen kehityksen alla (alpha-versio), mutta se toimii jo hyvin, jos haluat kokeilla sitÃ¤!',
    '<h4>ðŸ“¦ Lataa ja kokeile</h4>',
    'Kaikki sovellukset ovat ilmaisia kÃ¤yttÃ¤Ã¤. Toivon, ettÃ¤ ne voivat tehdÃ¤ arjestasi hieman helpompaa â€“ aivan kuten ne ovat tehneet minun.',
    '<p><strong>Kiitos, ettÃ¤ poikkesit! ðŸ™Œ</strong><br>Have a lovely day.</p>'
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
  container.innerHTML = aboutStory[lang] ? aboutStory[lang].map((paragraph) => `<p>${paragraph}</p>`).join('') : '';
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

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) languageSelect.value = lang;

  renderApps();
  renderAbout();
}

function init() {
  const languageSelect = document.getElementById('languageSelect');
  const platformFilter = document.getElementById('platformFilter');

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => applyLanguage(event.target.value));
  }

  if (platformFilter) {
    platformFilter.addEventListener('change', renderApps);
  }

  applyLanguage();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.SteenForge = apps;