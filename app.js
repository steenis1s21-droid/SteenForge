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
    platform: 'Webb',
    url: 'ApexCore_3.0.3_stable/ApexCore_3.0.3_FinalFix.html'
  },
  {
    id: 'sleep-journal',
    title: 'Sömndagbok',
    subtitle: 'Sömnspårning',
    description: 'Håll koll på dina sömnvanor vecka för vecka.',
    platform: 'Webb',
    url: 'sleep-journal-web/'
  }
];

const aboutStory = {
  sv: [
    'ApexCore byggdes för att ge ordning i det som annars lätt blir ett kaos: projekt, uppgifter, prioriteringar och arbetsminne. Det började som ett eget behov av ett verktyg som gjorde det enklare att hålla koll på det viktigaste utan att behöva hoppa mellan flera olika appar.',
    'Sömndagboken byggdes för att göra det lättare att förstå hur sömn, rutin och vardag påverkar energi och välmående. Syftet var att skapa något enkelt, personligt och praktiskt som hjälper dig att bygga hälsosammare vanor över tid.'
  ],
  en: [
    'ApexCore was built to bring order to what can otherwise become chaos: projects, tasks, priorities, and daily workflow. It started as a personal need for a tool that made it easier to keep track of what matters without switching between many different apps.',
    'Sleep Journal was built to make it easier to understand how sleep, routines, and everyday life affect energy and wellbeing. The goal was to create something simple, personal, and practical that helps build healthier habits over time.'
  ],
  da: [
    'ApexCore blev bygget for at bringe orden ind i det, der ellers let kan blive kaos: projekter, opgaver, prioriteringer og daglig workflow. Det begyndte som et personligt behov for et værktøj, der gjorde det lettere at holde styr på det vigtigste uden at skulle skifte mellem mange forskellige apps.',
    'Søvnjournalen blev bygget for at gøre det lettere at forstå, hvordan søvn, rutiner og dagligdagen påvirker energi og trivsel. Målet var at skabe noget simpelt, personligt og praktisk, der hjælper med at bygge sundere vaner over tid.'
  ],
  no: [
    'ApexCore ble bygget for å gi orden til det som ellers lett kan bli kaos: prosjekter, oppgaver, prioriteringer og daglig arbeidsflyt. Det startet som et personlig behov for et verktøy som gjorde det lettere å holde styr på det viktigste uten å måtte bytte mellom mange ulike apper.',
    'Søvnjournalen ble bygget for å gjøre det lettere å forstå hvordan søvn, rutiner og hverdagen påvirker energi og velvære. Målet var å skape noe enkelt, personlig og praktisk som hjelper deg å bygge sunnere vaner over tid.'
  ],
  fi: [
    'ApexCore rakennettiin tuomaan järjestystä siihen, mikä muuten voi helposti muuttua kaaokseksi: projekteihin, tehtäviin, prioriteetteihin ja arjen työskentelyyn. Se alkoi omasta tarpeesta työkalulle, joka helpottaisi keskittyä oleelliseen ilman, että täytyy vaihtaa useiden eri sovellusten välillä.',
    'Unipäiväkirja rakennettiin helpottamaan sen ymmärtämistä, miten uni, rutiinit ja arki vaikuttavat energiaan ja hyvinvointiin. Tavoitteena oli luoda jotain yksinkertaista, henkilökohtaista ja käytännöllistä, joka auttaa rakentamaan terveellisempiä tapoja ajan myötä.'
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