const languageMeta = {
  sv: { locale: "sv-SE", selectorTitle: "Välj språk" },
  en: { locale: "en-US", selectorTitle: "Choose language" },
  da: { locale: "da-DK", selectorTitle: "Vælg sprog" },
  no: { locale: "nb-NO", selectorTitle: "Velg språk" },
  fi: { locale: "fi-FI", selectorTitle: "Valitse kieli" }
};

const translations = {
  sv: {
    navApps: "Appar",
    navAbout: "Om",
    downloadsTitle: "Nedladdningar",
    downloadsCopy: "Håll dina installationsfiler och länkar uppdaterade i en lista.",
    platformLabel: "Plattform",
    aboutTitle: "Om projekten",
    aboutLead: "Bakgrunden till varför ApexCore och Sömndagboken byggdes.",
    footerCopy: "SteenForge-mall. Redigera data i app.js för att publicera dina riktiga appar.",
    openAppButton: "Öppna app",
    noApps: "Inga appar matchar vald plattform än."
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
    aboutLead: "Historien bag hvorfor ApexCore og Sønndagbogen blev bygget.",
    footerCopy: "SteenForge-skabelon. Rediger data i app.js for at udgive dine rigtige apps.",
    openAppButton: "Åbn app",
    noApps: "Ingen apps matcher denne platform endnu."
  },
  no: {
    navApps: "Apper",
    navAbout: "Om",
    downloadsTitle: "Nedlastinger",
    downloadsCopy: "Hold installasjonsfilene og lenkene dine oppdatert i én liste.",
    platformLabel: "Plattform",
    aboutTitle: "Om prosjektene",
    aboutLead: "Bakgrunnen for hvorfor ApexCore og SøvnDagboken ble bygget.",
    footerCopy: "SteenForge-mal. Rediger data i app.js for å publisere appene dine.",
    openAppButton: "Åpne app",
    noApps: "Ingen apper matcher denne plattformen ennå."
  },
  fi: {
    navApps: "Sovellukset",
    navAbout: "Tietoa",
    downloadsTitle: "Lataukset",
    downloadsCopy: "Pidä asennustiedostosi ja linkkisi ajan tasalla yhdessä listassa.",
    platformLabel: "Alusta",
    aboutTitle: "Tietoa projekteista",
    aboutLead: "Tarina siitä, miksi ApexCore ja Uni päiväkirja rakennettiin.",
    footerCopy: "SteenForge-pohja. Muokkaa dataa tiedostossa app.js julkaistaksesi oikeat sovelluksesi.",
    openAppButton: "Avaa sovellus",
    noApps: "Yksikään sovellus ei vastaa valittua alustaa vielä."
  }
};

const apps = [
  {
    id: 'apexcore',
    title: 'ApexCore',
    subtitle: 'Projektledning och arbetsflöde',
    description: 'Ett flexibelt verktyg för uppgifter, prioritering och arbetsminne.',
    platform: 'Web',
    version: 'v3.0.3',
    url: 'ApexCore_3.0.3_stable/ApexCore_3.0.3_FinalFix.html'
  },
  {
    id: 'sleep-journal',
    title: 'Sömndagbok',
    subtitle: 'Sömnspårning',
    description: 'Håll koll på dina sömnvanor vecka för vecka.',
    platform: 'Web',
    url: 'sleep-journal-web/'
  }
];

const aboutStory = {
  sv: [
    '<h3>⭕ ApexCore – The Heart of Your Work</h3>',
    '<h4>En berättelse om funktion, fokus och att hitta rätt verktyg</h4>',
    'Jag byggde ApexCore av en enkel anledning: jag behövde något som faktiskt fungerade – för mig.',
    'Som en person med NPF-diagnoser upptäckte jag snabbt i mitt arbete att fysiska påminnelselappar inte räckte till. Jag tappade bort dem, glömde bort dem, eller så gav de helt enkelt inte den visuella påminnelse som jag behövde för att verkligen komma ihåg.',
    'Så jag började leta. Jag letade efter ett digitalt verktyg som kunde göra det jag behövde – men jag hittade inget som passade. Antingen saknades viktiga funktioner, eller så var systemen så stora och komplexa att jag ändå tappade bort mig själv. Precis som med post-it-lapparna. 😅',
    'Till slut insåg jag: Varför inte bygga något själv?',
    '<h4>💡 Från idé till verklighet</h4>',
    'Så började jag. Jag byggde utifrån mina egna behov – en person med NPF som behöver enkelhet, struktur och ett visuellt sätt att hålla koll på allt som ska göras.',
    'Appen började som “Digital Post-it Notes” – ett litet projekt för att lösa min egen vardag. Men allt eftersom koden växte, växte också visionen. Namnet byttes till ApexCore – för att spegla vad det faktiskt är: kärnan av ditt arbete.',
    '<h4>🧠 Utvecklad med omsorg</h4>',
    'Jag har arbetat på ApexCore varje dag under lång tid. Det har inte bara resulterat i en app – det har också lärt mig en enorm mängd om JavaScript, kodstruktur, och för den delen även Python längs vägen. 🐍',
    'Min drivkraft har hela tiden varit: “Hur gör jag det här så enkelt som möjligt för mig – och för andra?”',
    '<h4>🏥 Från vården till vardagen</h4>',
    'Appen började som ett verktyg för mig själv i mitt arbete inom öppenvårdspsykiatrin. Därför finns kategorin Patienter – men jag insåg snabbt att det här är något som fler kan ha nytta av. Oavsett om du jobbar i vården, pluggar, driver ett projekt, eller bara vill ha bättre koll på vardagen.',
    '<h4>🌙 SömnDagboken – ett systerprojekt</h4>',
    'Vid sidan av ApexCore har jag även skapat SömnDagboken – ett litet verktyg för att hålla koll på sömnen vecka för vecka. Den är fortfarande under utveckling (en så kallad alpha-version), men den går alldeles utmärkt att använda redan nu om du vill testa!',
    '<h4>📦 Ladda ner & testa</h4>',
    'Alla appar är gratis att använda. Jag hoppas att de kan göra din vardag lite enklare – precis som de gjort min.',
    '<p><strong>Tack för att du kikade förbi! 🙌</strong><br>Ha en fortsatt trevlig dag.</p>'
  ],
  en: [
    '<h3>⭕ ApexCore – The Heart of Your Work</h3>',
    '<h4>A story about function, focus, and finding the right tool</h4>',
    'I built ApexCore for one simple reason: I needed something that actually worked – for me.',
    'As someone with ADHD, I quickly realized that physical reminder notes were not enough. I lost them, forgot them, or they simply did not provide the visual cue I needed to truly remember.',
    'So I started looking. I searched for a digital tool that could do what I needed – but I could not find one that fit. Either important features were missing, or the systems were too big and complex for me to stay oriented. Just like the sticky notes. 😅',
    'In the end, I realized: Why not build something myself?',
    '<h4>💡 From idea to reality</h4>',
    'So I started. I built it around my own needs – a person with ADHD who needs simplicity, structure, and a visual way to keep track of everything that needs to be done.',
    'The app started as “Digital Post-it Notes” – a small project to solve my own everyday life. But as the code grew, so did the vision. The name changed to ApexCore – to reflect what it really is: the core of your work.',
    '<h4>🧠 Built with care</h4>',
    'I have worked on ApexCore every day for a long time. It has not only resulted in an app – it has also taught me a huge amount about JavaScript, code structure, and even Python along the way. 🐍',
    'My motivation has always been: “How can I make this as simple as possible for me – and for others?”',
    '<h4>🏥 From healthcare to everyday life</h4>',
    'The app started as a tool for myself in my work within outpatient psychiatry. That is why the category Patients exists – but I quickly realized that this is something others can benefit from too. Whether you work in healthcare, study, run a project, or simply want better control over everyday life.',
    '<h4>🌙 Sleep Journal – a sister project</h4>',
    'Alongside ApexCore, I have also created Sleep Journal – a small tool to track sleep week by week. It is still under development (an alpha version), but it already works well if you want to try it out!',
    '<h4>📦 Download & test</h4>',
    'All apps are free to use. I hope they can make your everyday life a little easier – just as they have made mine.',
    '<p><strong>Thank you for stopping by! 🙌</strong><br>Have a lovely day.</p>'
  ],
  da: [
    '<h3>⭕ ApexCore – The Heart of Your Work</h3>',
    '<h4>En historie om funktion, fokus og at finde det rette værktøj</h4>',
    'Jeg byggede ApexCore af en enkel grund: jeg havde brug for noget, der faktisk virkede – for mig.',
    'Som person med NPF-diagnoser opdagede jeg hurtigt i mit arbejde, at fysiske påmindelsesnoter ikke var nok. Jeg mistede dem, glemte dem, eller de gav simpelthen ikke den visuelle påmindelse, jeg havde brug for for virkelig at huske.',
    'Så begyndte jeg at lede. Jeg søgte efter et digitalt værktøj, der kunne gøre det, jeg havde brug for – men jeg fandt ikke noget, der passede. Enten manglede vigtige funktioner, eller systemerne var så store og komplekse, at jeg stadig mistede mig selv. Ligesom med post-it-lapperne. 😅',
    'Til sidst indså jeg: Hvorfor ikke bygge noget selv?',
    '<h4>💡 Fra idé til virkelighed</h4>',
    'Så begyndte jeg. Jeg byggede ud fra mine egne behov – en person med NPF, der har brug for enkelhed, struktur og en visuel måde at holde styr på alt, der skal gøres.',
    'Appen begyndte som “Digital Post-it Notes” – et lille projekt til at løse min egen hverdag. Men efterhånden som koden voksede, voksede visionen også. Navnet blev ændret til ApexCore – for at afspejle, hvad det faktisk er: hjertet af dit arbejde.',
    '<h4>🧠 Udviklet med omtanke</h4>',
    'Jeg har arbejdet på ApexCore hver dag i lang tid. Det har ikke kun resulteret i en app – det har også lært mig en kæmpe mængde om JavaScript, kodestuktur og endda Python undervejs. 🐍',
    'Min drivkraft har hele tiden været: “Hvordan gør jeg dette så enkelt som muligt for mig – og for andre?”',
    '<h4>🏥 Fra sundhedsvæsenet til hverdagen</h4>',
    'Appen begyndte som et værktøj for mig selv i mit arbejde inden for ambulant psykiatri. Derfor findes kategorien Patienter – men jeg indså hurtigt, at dette er noget, andre også kan have gavn af. Uanset om du arbejder inden for sundhedsvæsenet, studerer, driver et projekt eller bare vil have bedre styr på hverdagen.',
    '<h4>🌙 SøvnDagbogen – et søsterprojekt</h4>',
    'Sideløbende med ApexCore har jeg også skabt SøvnDagbogen – et lille værktøj til at holde styr på søvn uge for uge. Den er stadig under udvikling (en såkaldt alpha-version), men den fungerer allerede fint, hvis du vil prøve den!',
    '<h4>📦 Download & test</h4>',
    'Alle apps er gratis at bruge. Jeg håber, de kan gøre din hverdag lidt lettere – præcis som de har gjort min.',
    '<p><strong>Tak fordi du kiggede forbi! 🙌</strong><br>Ha en fortsat dejlig dag.</p>'
  ],
  no: [
    '<h3>⭕ ApexCore – The Heart of Your Work</h3>',
    '<h4>En historie om funksjon, fokus og å finne riktig verktøy</h4>',
    'Jeg bygget ApexCore av en enkel grunn: jeg trengte noe som faktisk fungerte – for meg.',
    'Som person med NPF-diagnoser oppdaget jeg raskt i arbeidet at fysiske påminnelsesnotater ikke var nok. Jeg mistet dem, glemte dem, eller de ga rett og slett ikke den visuelle påminnelsen jeg trengte for virkelig å huske.',
    'Så begynte jeg å lete. Jeg lette etter et digitalt verktøy som kunne gjøre det jeg trengte – men jeg fant ingenting som passet. Enten manglet viktige funksjoner, eller systemene var så store og komplekse at jeg likevel mistet meg selv. Liksom med post-it-lappene. 😅',
    'Til slutt innså jeg: Hvorfor ikke bygge noe selv?',
    '<h4>💡 Fra idé til virkelighet</h4>',
    'Så begynte jeg. Jeg bygget ut fra mine egne behov – en person med NPF som trenger enkelhet, struktur og en visuell måte å holde styr på alt som skal gjøres.',
    'Appen startet som “Digital Post-it Notes” – et lite prosjekt for å løse min egen hverdag. Men etter hvert som koden vokste, vokste også visionen. Navnet ble endret til ApexCore – for å gjenspeile hva det egentlig er: kjernen i arbeidet ditt.',
    '<h4>🧠 Utviklet med omsorg</h4>',
    'Jeg har jobbet med ApexCore hver dag i lang tid. Det har ikke bare resultert i en app – det har også lært meg en enorm mengde om JavaScript, kodestruktur og til og med Python underveis. 🐍',
    'Motivasjonen min har hele tiden vært: “Hvordan gjør jeg dette så enkelt som mulig for meg – og for andre?”',
    '<h4>🏥 Fra helsetjenesten til hverdagen</h4>',
    'Appen startet som et verktøy for meg selv i mitt arbeid innen ambulant psykiatri. Derfor finnes kategorien Pasienter – men jeg innså raskt at dette er noe andre også kan ha nytte av. Enten du jobber i helsetjenesten, studerer, driver et prosjekt eller bare vil ha bedre kontroll over hverdagen.',
    '<h4>🌙 SøvnDagboken – et søsterprosjekt</h4>',
    'Ved siden av ApexCore har jeg også skapt SøvnDagboken – et lite verktøy for å holde styr på søvn uke for uke. Den er fortsatt under utvikling (en såkalt alpha-versjon), men den fungerer allerede veldig godt hvis du vil teste den!',
    '<h4>📦 Last ned & test</h4>',
    'Alle apper er gratis å bruke. Jeg håper de kan gjøre hverdagen din litt enklere – akkurat som de har gjort min.',
    '<p><strong>Takk for at du kikket forbi! 🙌</strong><br>Ha en fortsatt fin dag.</p>'
  ],
  fi: [
    '<h3>⭕ ApexCore – The Heart of Your Work</h3>',
    '<h4>Tarina toiminnallisuudesta, keskittymisestä ja oikean työkalun löytämisestä</h4>',
    'Rakensin ApexCoren yhdestä yksinkertaisesta syystä: tarvitsin jotain, joka todella toimi – minulle.',
    'Kuten henkilö, jolla on NPF-diagnoosi, huomasin nopeasti työssäni, että fyysiset muistilapput eivät riittäneet. Kadotin ne, unohdin ne, tai ne eivät yksinkertaisesti antaneet sitä visuaalista muistutusta, jota tarvitsin todella muistakseni.',
    'Aloin siis etsiä. Etsin digitaalisia työkaluja, jotka voisivat tehdä sen, mitä tarvitsin – mutta en löytänyt sopivaa. Joko tärkeitä ominaisuuksia puuttui, tai järjestelmät olivat liian suuria ja monimutkaisia, jotta pysyisin orientoituneena. Aivan kuten post-it-lappujen kanssa. 😅',
    'Lopulta tajusin: Miksi en rakentaisi jotain itse?',
    '<h4>💡 Ideasta todellisuuteen</h4>',
    'Sitten aloin. Rakensin omien tarpeideni mukaan – henkilö, jolla on NPF, ja joka tarvitsee yksinkertaisuutta, rakennetta ja visuaalisen tavan pitää kirjaa kaikesta, mitä pitää tehdä.',
    'Sovellus alkoi nimellä “Digital Post-it Notes” – pienestä projektista, jonka tarkoituksena oli ratkaista oma arkeni. Mutta kun koodi kasvoi, kasvoi myös visio. Nimi muutettiin ApexCoreksi – heijastamaan, mitä se todella on: työn ydin.',
    '<h4>🧠 Rakennettu huolella</h4>',
    'Olen työskennellyt ApexCoren parissa joka päivä pitkään. Se on tuottanut minulle ei vain sovelluksen – se on myös opettanut minulle valtavasti JavaScriptistä, koodirakenteesta ja jopa Pythonista matkan varrella. 🐍',
    'Motivaatiooni on aina ollut: “Kuinka voin tehdä tästä mahdollisimman yksinkertaisen minulle – ja muille?”',
    '<h4>🏥 Terveydenhuollosta arkeen</h4>',
    'Sovellus alkoi työkaluna itselleni avohoitopsykiatrian työssä. Siksi kategoria Potilaat on olemassa – mutta huomasin nopeasti, että tästä voi olla hyötyä myös muille. Olitpa työskentelemässä terveydenhuollossa, opiskelemassa, johtamassa projektia tai haluat vain parempaa kontrollia arkeen.',
    '<h4>🌙 Sleep Journal – sisarprojekti</h4>',
    'ApexCoren rinnalla olen myös luonut Sleep Journalin – pienen työkalun, jonka avulla voi seurata unta viikosta toiseen. Se on edelleen kehityksen alla (alpha-versio), mutta se toimii jo hyvin, jos haluat kokeilla sitä!',
    '<h4>📦 Lataa ja kokeile</h4>',
    'Kaikki sovellukset ovat ilmaisia käyttää. Toivon, että ne voivat tehdä arjestasi hieman helpompaa – aivan kuten ne ovat tehneet minun.',
    '<p><strong>Kiitos, että poikkesit! 🙌</strong><br>Have a lovely day.</p>'
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