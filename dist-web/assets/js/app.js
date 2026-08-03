const languageMeta = {
  sv: { locale: "sv-SE", selectorTitle: "VÃ¤lj sprÃ¥k" },
  en: { locale: "en-US", selectorTitle: "Choose language" },
  da: { locale: "da-DK", selectorTitle: "VÃ¦lg sprog" },
  no: { locale: "nb-NO", selectorTitle: "Velg sprÃ¥k" },
  fi: { locale: "fi-FI", selectorTitle: "Valitse kieli" }
};

const translations = {
  sv: {
    title: "SteenForge | Dina appar pÃ¥ ett stÃ¤lle",
    description: "Ladda ner dina appar, lÃ¤s release notes och hÃ¥ll koll pÃ¥ nyheter.",
    navApps: "Appar",
    navAbout: "Om",
    heroEyebrow: "Bygg. Leverera. FÃ¶rbÃ¤ttra.",
    heroTitle: "Din apphub, redo fÃ¶r nedladdningar och uppdateringar.",
    heroCopy: "Ge anvÃ¤ndare en plats att upptÃ¤cka dina appar, ladda ner senaste versionerna och lÃ¤sa exakt vad som Ã¤ndrats i varje release.",
    heroCta: "Visa appar",
    downloadsTitle: "Nedladdningar",
    downloadsCopy: "VÃ¤lj en app fÃ¶r att Ã¶ppna dess egna sida med filer och release notes.",
    aboutTitle: "Om projekten",
    aboutLead: "Bakgrunden till varfÃ¶r ApexCore och SÃ¶mnDagboken byggdes.",
    platformLabel: "Plattform",
    footerCopy: "SteenForge-mall. Redigera data i app.js fÃ¶r att publicera dina riktiga appar.",
    platformOptions: { all: "Alla", Windows: "Windows", Android: "Android", Web: "Webb", macOS: "macOS" },
    openAppButton: "Ã–ppna app",
    noApps: "Inga appar matchar vald plattform Ã¤n.",
    detailsBack: "Tillbaka till startsidan",
    detailsDownloadsTitle: "Nedladdningsfiler",
    detailsDownloadsCopy: "Ladda ner senaste versionen hÃ¤r.",
    detailsReleaseTitle: "Release Notes",
    actionOpenWeb: "Ã–ppna webbversion",
    actionDownloadFile: "Ladda ner fil",
    detailsNoFiles: "Nedladdning lÃ¤ggs till snart.",
    detailsNotFound: "Appen hittades inte.",
    detailsNotFoundHelp: "GÃ¥ tillbaka till startsidan och vÃ¤lj en app frÃ¥n listan."
  },
  en: {
    title: "SteenForge | Your Apps in One Place",
    description: "Download your apps, read release notes, and keep up with what is new.",
    navApps: "Apps",
    navAbout: "About",
    heroEyebrow: "Build. Ship. Improve.",
    heroTitle: "Your app hub, ready for downloads and updates.",
    heroCopy: "Give users one place to discover your apps, download the latest versions, and read exactly what changed in every release.",
    heroCta: "Browse Apps",
    downloadsTitle: "Downloads",
    downloadsCopy: "Choose an app to open its own page with files and release notes.",
    aboutTitle: "About the projects",
    aboutLead: "The story behind why ApexCore and Sleep Journal were built.",
    platformLabel: "Platform",
    footerCopy: "SteenForge starter template. Edit data in app.js to publish your real apps.",
    platformOptions: { all: "All", Windows: "Windows", Android: "Android", Web: "Web", macOS: "macOS" },
    openAppButton: "Open App",
    noApps: "No apps match this platform yet.",
    detailsBack: "Back to homepage",
    detailsDownloadsTitle: "Download Files",
    detailsDownloadsCopy: "Download the latest version here.",
    detailsReleaseTitle: "Release Notes",
    actionOpenWeb: "Open Web Version",
    actionDownloadFile: "Download File",
    detailsNoFiles: "Download will be added soon.",
    detailsNotFound: "App not found.",
    detailsNotFoundHelp: "Go back to the homepage and pick an app from the list."
  },
  da: {
    title: "SteenForge | Dine apps samlet",
    description: "Download dine apps, lÃ¦s release notes og fÃ¸lg med i nyheder.",
    navApps: "Apps",
    navAbout: "Om",
    heroEyebrow: "Byg. Udgiv. Forbedr.",
    heroTitle: "Dit app-hub, klar til downloads og opdateringer.",
    heroCopy: "Giv brugere et sted at opdage dine apps, hente de nyeste versioner og lÃ¦se prÃ¦cist hvad der blev Ã¦ndret i hver release.",
    heroCta: "Se apps",
    downloadsTitle: "Downloads",
    downloadsCopy: "VÃ¦lg en app for at Ã¥bne dens egen side med filer og release notes.",
    aboutTitle: "Om projekterne",
    aboutLead: "Historien bag hvorfor ApexCore og SÃ¸vnDagbogen blev bygget.",
    platformLabel: "Platform",
    footerCopy: "SteenForge-skabelon. Rediger data i app.js for at udgive dine rigtige apps.",
    platformOptions: { all: "Alle", Windows: "Windows", Android: "Android", Web: "Web", macOS: "macOS" },
    openAppButton: "Ã…bn app",
    noApps: "Ingen apps matcher denne platform endnu.",
    detailsBack: "Tilbage til forsiden",
    detailsDownloadsTitle: "Downloadfiler",
    detailsDownloadsCopy: "Hent den nyeste version her.",
    detailsReleaseTitle: "Release Notes",
    actionOpenWeb: "Ã…bn webversion",
    actionDownloadFile: "Download fil",
    detailsNoFiles: "Download tilfÃ¸jes snart.",
    detailsNotFound: "App blev ikke fundet.",
    detailsNotFoundHelp: "GÃ¥ tilbage til forsiden og vÃ¦lg en app fra listen."
  },
  no: {
    title: "SteenForge | Appene dine pÃ¥ ett sted",
    description: "Last ned appene dine, les release notes og hold deg oppdatert.",
    navApps: "Apper",
    navAbout: "Om",
    heroEyebrow: "Bygg. Lever. Forbedre.",
    heroTitle: "Din apphub, klar for nedlastinger og oppdateringer.",
    heroCopy: "Gi brukere ett sted for Ã¥ oppdage appene dine, laste ned siste versjon og lese akkurat hva som ble endret i hver release.",
    heroCta: "Se apper",
    downloadsTitle: "Nedlastinger",
    downloadsCopy: "Velg en app for Ã¥ Ã¥pne dens egen side med filer og release notes.",
    aboutTitle: "Om prosjektene",
    aboutLead: "Bakgrunnen for hvorfor ApexCore og SÃ¸vnDagboken ble bygget.",
    platformLabel: "Plattform",
    footerCopy: "SteenForge-mal. Rediger data i app.js for Ã¥ publisere appene dine.",
    platformOptions: { all: "Alle", Windows: "Windows", Android: "Android", Web: "Web", macOS: "macOS" },
    openAppButton: "Ã…pne app",
    noApps: "Ingen apper matcher denne plattformen ennÃ¥.",
    detailsBack: "Tilbake til startsiden",
    detailsDownloadsTitle: "Nedlastingsfiler",
    detailsDownloadsCopy: "Last ned siste versjon her.",
    detailsReleaseTitle: "Release Notes",
    actionOpenWeb: "Ã…pne webversjon",
    actionDownloadFile: "Last ned fil",
    detailsNoFiles: "Nedlasting legges til snart.",
    detailsNotFound: "Appen ble ikke funnet.",
    detailsNotFoundHelp: "GÃ¥ tilbake til startsiden og velg en app fra listen."
  },
  fi: {
    title: "SteenForge | Sovelluksesi yhdessÃ¤ paikassa",
    description: "Lataa sovelluksesi, lue release notes ja pysy ajan tasalla.",
    navApps: "Sovellukset",
    navAbout: "Tietoa",
    heroEyebrow: "Rakenna. Julkaise. Paranna.",
    heroTitle: "Sovelluskeskuksesi latauksiin ja pÃ¤ivityksiin.",
    heroCopy: "Tarjoa kÃ¤yttÃ¤jille yksi paikka lÃ¶ytÃ¤Ã¤ sovelluksesi, ladata uusimmat versiot ja lukea tarkasti mitÃ¤ kussakin julkaisussa muuttui.",
    heroCta: "Selaa sovelluksia",
    downloadsTitle: "Lataukset",
    downloadsCopy: "Valitse sovellus avataksesi sen oman sivun tiedostoilla ja release notes -sisÃ¤llÃ¶llÃ¤.",
    aboutTitle: "Tietoa projekteista",
    aboutLead: "Tarina siitÃ¤, miksi ApexCore ja UnipÃ¤ivÃ¤kirja rakennettiin.",
    platformLabel: "Alusta",
    footerCopy: "SteenForge-pohja. Muokkaa dataa tiedostossa app.js julkaistaksesi oikeat sovelluksesi.",
    platformOptions: { all: "Kaikki", Windows: "Windows", Android: "Android", Web: "Web", macOS: "macOS" },
    openAppButton: "Avaa sovellus",
    noApps: "YksikÃ¤Ã¤n sovellus ei vastaa valittua alustaa vielÃ¤.",
    detailsBack: "Takaisin etusivulle",
    detailsDownloadsTitle: "Lataustiedostot",
    detailsDownloadsCopy: "Lataa uusin versio tÃ¤stÃ¤.",
    detailsReleaseTitle: "Release Notes",
    actionOpenWeb: "Avaa web-versio",
    actionDownloadFile: "Lataa tiedosto",
    detailsNoFiles: "Lataus lisÃ¤tÃ¤Ã¤n pian.",
    detailsNotFound: "Sovellusta ei lÃ¶ytynyt.",
    detailsNotFoundHelp: "Palaa etusivulle ja valitse sovellus listasta."
  }
};

const aboutStories = {
  sv: {
    mainTitle: "â€¢ ApexCore â€œ HjÃ¤rtat i ditt arbete",
    subtitle: "En berÃ¤ttelse om funktion, fokus och att hitta rÃ¤tt verktyg",
    intro: [
      "Jag byggde ApexCore av en enkel anledning: jag behÃ¶vde nÃ¥got som faktiskt fungerade fÃ¶r mig.",
      "Som person med NPF-diagnoser upptÃ¤ckte jag snabbt att fysiska pÃ¥minnelselappar inte rÃ¤ckte till.",
      "Jag tappade bort dem, glÃ¶mde dem eller fick inte den visuella pÃ¥minnelsen jag behÃ¶vde fÃ¶r att verkligen komma ihÃ¥g.",
      "Jag letade efter ett digitalt verktyg som kunde gÃ¶ra det jag behÃ¶vde, men hittade inget som passade. Till slut insÃ¥g jag: varfÃ¶r inte bygga nÃ¥got sjÃ¤lv?"
    ],
    sections: [
      {
        title: "FrÃ¥n idÃ© till verklighet",
        paragraphs: [
          "Jag bÃ¶rjade bygga utifrÃ¥n mina egna behov: enkelhet, struktur och ett visuellt sÃ¤tt att hÃ¥lla koll pÃ¥ allt som ska gÃ¶ras.",
          "Appen bÃ¶rjade som Digital Post-it Notes fÃ¶r att lÃ¶sa min egen vardag. NÃ¤r koden vÃ¤xte, vÃ¤xte ocksÃ¥ visionen.",
          "Namnet byttes till ApexCore fÃ¶r att spegla vad det faktiskt Ã¤r: kÃ¤rnan i ditt arbete."
        ]
      },
      {
        title: "Byggd med omsorg",
        paragraphs: [
          "Jag har arbetat pÃ¥ ApexCore varje dag under lÃ¥ng tid. Det har inte bara gett en app, utan ocksÃ¥ lÃ¤rt mig mycket om JavaScript, kodstruktur och Python.",
          "Min drivkraft har alltid varit: hur gÃ¶r jag detta sÃ¥ enkelt som mÃ¶jligt fÃ¶r mig och fÃ¶r andra?"
        ]
      },
      {
        title: "FrÃ¥n vÃ¥rden till vardagen",
        paragraphs: [
          "Appen bÃ¶rjade som ett verktyg fÃ¶r mig i mitt arbete inom Ã¶ppenvÃ¥rdspsykiatrin, dÃ¤rfÃ¶r finns kategorin Patienter.",
          "Men jag insÃ¥g snabbt att det hÃ¤r kan hjÃ¤lpa fler, oavsett om du jobbar i vÃ¥rden, studerar eller driver ett projekt."
        ]
      },
      {
        title: "SÃ¶mnDagboken â€“ ett systerprojekt",
        paragraphs: [
          "Vid sidan av ApexCore har jag ocksÃ¥ skapat SÃ¶mnDagboken, ett litet verktyg fÃ¶r att fÃ¶lja sÃ¶mnen vecka fÃ¶r vecka.",
          "Den Ã¤r fortfarande under utveckling i alpha, men gÃ¥r utmÃ¤rkt att anvÃ¤nda redan nu."
        ]
      }
    ]
  },
  en: {
    mainTitle: "â€¢ ApexCore â€œ The Heart of Your Work",
    subtitle: "A story about function, focus, and finding the right tools",
    intro: [
      "I built ApexCore for one simple reason: I needed something that actually worked for me.",
      "As someone with neurodevelopmental differences, I quickly realized that physical reminder notes were not enough.",
      "I lost them, forgot them, or they did not give me the visual cue I needed to truly remember.",
      "I searched for a digital tool that could do what I needed, but I could not find one that fit. In the end I realized: why not build it myself?"
    ],
    sections: [
      {
        title: "From idea to reality",
        paragraphs: [
          "I started from my own needs: simplicity, structure, and a visual way to track everything that needed to be done.",
          "The app began as Digital Post-it Notes to solve my own everyday workflow. As the code grew, so did the vision.",
          "The name changed to ApexCore to reflect what it really is: the core of your work."
        ]
      },
      {
        title: "Built with care",
        paragraphs: [
          "I have worked on ApexCore every day for a long time. It has not only resulted in an app, but also taught me a great deal about JavaScript, code structure, and Python.",
          "My guiding question has always been: how can I make this as simple as possible for myself and others?"
        ]
      },
      {
        title: "From healthcare to everyday life",
        paragraphs: [
          "The app started as a tool for myself in outpatient psychiatry, which is why the Patients category exists.",
          "But I quickly realized that this can help many more people, whether you work in healthcare, study, or run a project."
        ]
      },
      {
        title: "Sleep Journal â€“ a sister project",
        paragraphs: [
          "Alongside ApexCore, I also created Sleep Journal, a small tool for tracking sleep week by week.",
          "It is still under development in alpha, but it already works well if you want to try it."
        ]
      }
    ]
  }
};

const apps = [
  {
    id: "apexcore",
    platform: "Web",
    version: "v3.0.3",
    size: "Browser",
    released: "2026-07-31",
    downloads: [{ platform: "Web", label: "ApexCore Web", kind: "web", url: "dist-web/index.html" }],
    content: {
      sv: { name: "ApexCore", tagline: "Kom ihÃ¥g det viktiga utan fysiska post-it-lappar.", notes: [{ date: "2026-07-31", type: "Nytt", title: "FÃ¶rsta publicering", description: "ApexCore finns nu tillgÃ¤ngligt som webapp." }] },
      en: { name: "ApexCore", tagline: "Remember what matters without physical post-it notes.", notes: [{ date: "2026-07-31", type: "New", title: "First release", description: "ApexCore is now available as a web app." }] },
      da: { name: "ApexCore", tagline: "Husk det vigtige uden fysiske post-it-lapper.", notes: [{ date: "2026-07-31", type: "Nyt", title: "FÃ¸rste udgivelse", description: "ApexCore er nu tilgÃ¦ngelig som webapp." }] },
      no: { name: "ApexCore", tagline: "Husk det viktige uten fysiske post-it-lapper.", notes: [{ date: "2026-07-31", type: "Nytt", title: "FÃ¸rste utgivelse", description: "ApexCore er nÃ¥ tilgjengelig som webapp." }] },
      fi: { name: "ApexCore", tagline: "Muista tÃ¤rkeÃ¤t asiat ilman fyysisiÃ¤ post-it-lappuja.", notes: [{ date: "2026-07-31", type: "Uutta", title: "EnsimmÃ¤inen julkaisu", description: "ApexCore on nyt saatavilla web-sovelluksena." }] }
    }
  },
  {
    id: "sleep-journal",
    platform: "Web",
    version: "Î±",
    size: "Browser",
    released: "2026-07-31",
    downloads: [{ platform: "Web", label: "Sleep Journal Web", kind: "web", url: "sleep-journal-web/index.html" }],
    content: {
      sv: { name: "SÃ¶mnDagboken", tagline: "Logga din sÃ¶mn varje natt och fÃ¶lj ditt veckovisa sÃ¶mnmÃ¶nster.", notes: [{ date: "2026-07-31", type: "Nytt", title: "FÃ¶rsta version", description: "En enkel nattlig sÃ¶mnloggning Ã¤r nu tillgÃ¤nglig." }] },
      en: { name: "Sleep Journal", tagline: "Log your sleep every night and follow your weekly sleep pattern.", notes: [{ date: "2026-07-31", type: "New", title: "First version", description: "A simple nightly sleep log is now available." }] },
      da: { name: "SÃ¸vnDagbogen", tagline: "Log din sÃ¸vn hver nat og fÃ¸lg dit ugentlige sÃ¸vnmÃ¸nster.", notes: [{ date: "2026-07-31", type: "Nyt", title: "FÃ¸rste version", description: "En enkel natlig sÃ¸vnlog er nu tilgÃ¦ngelig." }] },
      no: { name: "SÃ¸vnDagboken", tagline: "Logg sÃ¸vnen din hver natt og fÃ¸lg ditt ukentlige sÃ¸vnmÃ¸nster.", notes: [{ date: "2026-07-31", type: "Nytt", title: "FÃ¸rste versjon", description: "En enkel nattlig sÃ¸vnlogg er nÃ¥ tilgjengelig." }] },
      fi: { name: "UnipÃ¤ivÃ¤kirja", tagline: "Kirjaa unesi joka yÃ¶ ja seuraa viikoittaista unirytmiÃ¤si.", notes: [{ date: "2026-07-31", type: "Uutta", title: "EnsimmÃ¤inen versio", description: "Yksinkertainen yÃ¶kohtainen uniloki on nyt saatavilla." }] }
    }
  }
];

let currentLanguage = localStorage.getItem("siteLanguage") || "sv";
if (!translations[currentLanguage]) {
  currentLanguage = "sv";
}

function getUI() {
  return translations[currentLanguage] || translations.en;
}

function setLanguage(newLanguage) {
  if (!translations[newLanguage]) {
    return;
  }

  currentLanguage = newLanguage;
  localStorage.setItem("siteLanguage", currentLanguage);
}

function getCurrentLanguage() {
  return currentLanguage;
}

function getLocalizedContent(app) {
  return app.content[currentLanguage] || app.content.en;
}

function formatDate(value) {
  const locale = (languageMeta[currentLanguage] || languageMeta.en).locale;
  return new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function buildReleaseNotesMarkup(notes) {
  if (!Array.isArray(notes) || notes.length === 0) {
    return "";
  }

  const isStructured = notes.length > 0 && typeof notes[0] === "object";

  if (!isStructured) {
    return `<ul>${notes.map((note) => `<li>${note}</li>`).join("")}</ul>`;
  }

  const groupedByDate = notes.reduce((groups, note) => {
    if (!groups[note.date]) {
      groups[note.date] = [];
    }
    groups[note.date].push(note);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return sortedDates
    .map((date) => {
      const items = groupedByDate[date]
        .map(
          (note) => `
            <li class="release-entry">
              <p class="release-entry-type">${note.type}</p>
              <p class="release-entry-title">${note.title}</p>
              <p class="release-entry-copy">${note.description}</p>
            </li>
          `
        )
        .join("");

      return `
        <section class="release-date-group">
          <h4 class="release-date-title">${formatDate(date)}</h4>
          <ul class="release-entry-list">${items}</ul>
        </section>
      `;
    })
    .join("");
}

function getAppPlatforms(app) {
  const downloadPlatforms = (app.downloads || []).map((download) => download.platform);
  return [...new Set([app.platform, ...downloadPlatforms].filter(Boolean))];
}

function appCardTemplate(app) {
  const ui = getUI();
  const localized = getLocalizedContent(app);
  const platforms = getAppPlatforms(app);
  const platformTags = platforms.map((platform) => `<span class="tag">${platform}</span>`).join("");

  return `
    <article class="app-card">
      <h3 class="app-title">${localized.name}</h3>
      <p class="app-meta">${localized.tagline}</p>
      <div class="tag-row">
        ${platformTags}
        <span class="tag">${app.version}</span>
        <span class="tag">${app.size}</span>
      </div>
      <a class="download-btn" href="app-detail.html?app=${app.id}">${ui.openAppButton}</a>
    </article>
  `;
}

function renderIndexApps(filteredApps, appsGridElement) {
  const ui = getUI();

  if (!filteredApps.length) {
    appsGridElement.innerHTML = `<p>${ui.noApps}</p>`;
    return;
  }

  appsGridElement.innerHTML = filteredApps.map(appCardTemplate).join("");
}

function getFilteredApps(platformValue) {
  if (platformValue === "all") {
    return apps;
  }

  return apps.filter((app) => getAppPlatforms(app).includes(platformValue));
}

function updatePlatformOptions(platformFilterElement) {
  const ui = getUI();
  const selected = platformFilterElement.value;
  const order = ["all", "Windows", "Android", "Web", "macOS"];

  platformFilterElement.innerHTML = order
    .map((value) => `<option value="${value}">${ui.platformOptions[value]}</option>`)
    .join("");

  platformFilterElement.value = order.includes(selected) ? selected : "all";
}

function updateLanguageSelector(languageSelectElement) {
  const language = languageMeta[currentLanguage] || languageMeta.en;

  if (!languageSelectElement) {
    return;
  }

  languageSelectElement.value = currentLanguage;
  languageSelectElement.title = language.selectorTitle;
}

function renderAboutContent() {
  const container = document.getElementById("aboutContent");

  if (!container) {
    return;
  }

  const story = aboutStories[currentLanguage] || aboutStories.en;
  const introMarkup = story.intro.map((paragraph) => `<p>${paragraph}</p>`).join("");
  const sectionMarkup = story.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
      return `<section class="about-section"><h4>${section.title}</h4>${paragraphs}</section>`;
    })
    .join("");

  container.innerHTML = `
    <article class="about-block">
      <h3 class="about-main-title">${story.mainTitle}</h3>
      <p class="about-subtitle">${story.subtitle}</p>
      ${introMarkup}
      ${sectionMarkup}
    </article>
  `;
}

function updateCommonStaticContent() {
  const ui = getUI();
  const titleTag = document.querySelector("title");
  const metaDescription = document.querySelector('meta[name="description"]');
  const navApps = document.getElementById("navApps");
  const navAbout = document.getElementById("navAbout");
  const heroEyebrow = document.getElementById("heroEyebrow");
  const heroTitle = document.getElementById("heroTitle");
  const heroCopy = document.getElementById("heroCopy");
  const heroCta = document.getElementById("heroCta");
  const downloadsTitle = document.getElementById("downloadsTitle");
  const downloadsCopy = document.getElementById("downloadsCopy");
  const aboutTitle = document.getElementById("aboutTitle");
  const aboutLead = document.getElementById("aboutLead");
  const platformLabel = document.getElementById("platformLabel");
  const footerCopy = document.getElementById("footerCopy");

  document.documentElement.lang = currentLanguage;

  if (titleTag) {
    titleTag.textContent = ui.title;
  }

  if (metaDescription) {
    metaDescription.setAttribute("content", ui.description);
  }

  if (navApps) navApps.textContent = ui.navApps;
  if (navAbout) navAbout.textContent = ui.navAbout;
  if (heroEyebrow) heroEyebrow.textContent = ui.heroEyebrow;
  if (heroTitle) heroTitle.textContent = ui.heroTitle;
  if (heroCopy) heroCopy.textContent = ui.heroCopy;
  if (heroCta) heroCta.textContent = ui.heroCta;
  if (downloadsTitle) downloadsTitle.textContent = ui.downloadsTitle;
  if (downloadsCopy) downloadsCopy.textContent = ui.downloadsCopy;
  if (aboutTitle) aboutTitle.textContent = ui.aboutTitle;
  if (aboutLead) aboutLead.textContent = ui.aboutLead;
  if (platformLabel) platformLabel.textContent = ui.platformLabel;
  if (footerCopy) footerCopy.textContent = ui.footerCopy;

  renderAboutContent();
}

function initIndexPage() {
  const appsGridElement = document.getElementById("appsGrid");
  const platformFilterElement = document.getElementById("platformFilter");
  const languageSelectElement = document.getElementById("languageSelect");

  if (!appsGridElement || !platformFilterElement || !languageSelectElement) {
    return;
  }

  function refresh() {
    updateCommonStaticContent();
    updatePlatformOptions(platformFilterElement);
    updateLanguageSelector(languageSelectElement);
    renderIndexApps(getFilteredApps(platformFilterElement.value), appsGridElement);
  }

  platformFilterElement.addEventListener("change", () => {
    renderIndexApps(getFilteredApps(platformFilterElement.value), appsGridElement);
  });

  languageSelectElement.addEventListener("change", (event) => {
    setLanguage(event.target.value);
    refresh();
  });

  refresh();
}

window.SteenForge = {
  languageMeta,
  translations,
  apps,
  getCurrentLanguage,
  setLanguage,
  getUI,
  getLocalizedContent,
  getAppPlatforms,
  formatDate,
  buildReleaseNotesMarkup,
  updateLanguageSelector,
  updateCommonStaticContent
};

initIndexPage();
