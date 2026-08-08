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
    aboutLead: "Bakgrunden till varför ApexCore och SömnDagboken byggdes.",
    footerCopy: "Jesper Steens",
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
    aboutLead: "Historien bag hvorfor ApexCore og Sønndagbogen blev bygget.",
    footerCopy: "Jesper Steens",
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
    footerCopy: "Jesper Steens",
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
    footerCopy: "Jesper Steens",
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
    'ApexCore är ett verktyg för att hålla ordning i arbete, projekt och vardag.',
    'Sömndagboken hjälper dig att följa sömnmonster och bygga vanor över tid.'
  ],
  en: [
    'ApexCore is a tool for keeping work, projects and daily life in order.',
    'Sleep Journal helps you track sleep patterns and build habits over time.'
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