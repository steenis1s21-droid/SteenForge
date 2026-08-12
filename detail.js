const appData = window.SteenForge;

function getAppIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("app");
}

function getDetailTextBundle() {
  const language = appData.getCurrentLanguage ? appData.getCurrentLanguage() : "en";

  const bundles = {
    sv: {
      back: "Tillbaka till apparna",
      downloadsTitle: "Tillgängligt just nu",
      releaseTitle: "Senaste nytt",
      notFoundTitle: "Appen kunde inte hittas.",
      notFoundCopy: "Gå tillbaka till startsidan och välj en app från listan.",
      noFiles: "Installationsfiler publiceras här när de är klara."
    },
    en: {
      back: "Back to apps",
      downloadsTitle: "Available right now",
      releaseTitle: "Latest notes",
      notFoundTitle: "App could not be found.",
      notFoundCopy: "Go back to the homepage and choose an app from the list.",
      noFiles: "Installer files will be published here when they are ready."
    },
    da: {
      back: "Tilbage til apps",
      downloadsTitle: "Tilgængeligt lige nu",
      releaseTitle: "Seneste nyt",
      notFoundTitle: "Appen kunne ikke findes.",
      notFoundCopy: "Gå tilbage til forsiden og vælg en app fra listen.",
      noFiles: "Installationsfiler udgives her, når de er klar."
    },
    no: {
      back: "Tilbake til appene",
      downloadsTitle: "Tilgjengelig nå",
      releaseTitle: "Siste nytt",
      notFoundTitle: "Appen kunne ikke finnes.",
      notFoundCopy: "Gå tilbake til startsiden og velg en app fra listen.",
      noFiles: "Installasjonsfiler publiseres her når de er klare."
    },
    fi: {
      back: "Takaisin sovelluksiin",
      downloadsTitle: "Saatavilla juuri nyt",
      releaseTitle: "Viimeisimmät päivitykset",
      notFoundTitle: "Sovellusta ei löytynyt.",
      notFoundCopy: "Palaa etusivulle ja valitse sovellus listasta.",
      noFiles: "Asennustiedostot julkaistaan tänne, kun ne ovat valmiit."
    }
  };

  return bundles[language] || bundles.en;
}

function getDownloadSectionCopy(app) {
  const language = appData.getCurrentLanguage ? appData.getCurrentLanguage() : "en";
  const downloads = app.downloads || [];
  const hasWebVersion = downloads.some((file) => file.kind === "web" && file.url && file.url !== "#");
  const hasInstaller = downloads.some(
    (file) => file.kind !== "web" && file.url && file.url !== "#"
  );

  const copyByLanguage = {
    sv: {
      filesAndWeb: "Det som är redo finns här nedan. Installationsfiler publiceras så snart de är klara.",
      webOnly: "Webbversionen finns här nedan. Installationsfiler publiceras när de är klara.",
      filesOnly: "Här hittar du de versioner som är redo att användas just nu.",
      none: "Installationsfiler publiceras här när de är klara."
    },
    en: {
      filesAndWeb: "Everything ready right now is listed below. Installer files will be published as soon as they are ready.",
      webOnly: "The web version is available below. Installer files will be published when they are ready.",
      filesOnly: "The versions ready to use right now are listed below.",
      none: "Installer files will be published here when they are ready."
    },
    da: {
      filesAndWeb: "Det der er klar nu, findes herunder. Installationsfiler udgives så snart de er klar.",
      webOnly: "Webversionen findes herunder. Installationsfiler udgives, når de er klar.",
      filesOnly: "De versioner, der er klar til brug nu, findes herunder.",
      none: "Installationsfiler udgives her, når de er klar."
    },
    no: {
      filesAndWeb: "Det som er klart nå, finner du nedenfor. Installasjonsfiler publiseres så snart de er klare.",
      webOnly: "Webversjonen finnes nedenfor. Installasjonsfiler publiseres når de er klare.",
      filesOnly: "Versjonene som er klare til bruk nå, finner du nedenfor.",
      none: "Installasjonsfiler publiseres her når de er klare."
    },
    fi: {
      filesAndWeb: "Kaikki juuri nyt valmiit versiot löytyvät alta. Asennustiedostot julkaistaan heti kun ne ovat valmiit.",
      webOnly: "Web-versio löytyy alta. Asennustiedostot julkaistaan, kun ne ovat valmiit.",
      filesOnly: "Juuri nyt valmiit versiot löytyvät alta.",
      none: "Asennustiedostot julkaistaan tänne, kun ne ovat valmiit."
    }
  };

  const copy = copyByLanguage[language] || copyByLanguage.en;

  if (hasInstaller && hasWebVersion) {
    return copy.filesAndWeb;
  }

  if (hasWebVersion) {
    return copy.webOnly;
  }

  if (hasInstaller) {
    return copy.filesOnly;
  }

  return copy.none;
}

function getPendingDownloadLabel() {
  const language = appData.getCurrentLanguage ? appData.getCurrentLanguage() : "en";

  const labels = {
    sv: "Installationsfil kommer snart",
    en: "Installer coming soon",
    da: "Installationsfil kommer snart",
    no: "Installasjonsfil kommer snart",
    fi: "Asennustiedosto tulossa pian"
  };

  return labels[language] || labels.en;
}

function renderDownloadFiles(app, ui, container) {
  const text = getDetailTextBundle();

  if (!app.downloads || app.downloads.length === 0) {
    container.innerHTML = `<p>${text.noFiles}</p>`;
    return;
  }

  container.innerHTML = app.downloads
    .map(
      (file) => {
        const isAvailable = Boolean(file.url && file.url !== "#");
        const actionLabel = file.kind === "web" ? ui.actionOpenWeb : ui.actionDownloadFile;
        const actionMarkup = isAvailable
          ? `<a class="download-btn" href="${file.url}" target="_blank" rel="noreferrer">${actionLabel}</a>`
          : `<span class="download-status">${getPendingDownloadLabel()}</span>`;

        return `
        <article class="download-file-item">
          <p class="download-file-title">${file.label}</p>
          <p class="download-file-meta">${file.platform}</p>
          ${actionMarkup}
        </article>
      `;
      }
    )
    .join("");
}

function renderReleaseNotes(app, localized, container) {
  const notesMarkup = appData.buildReleaseNotesMarkup(localized.notes);

  container.innerHTML = `
    <article class="note-item">
      <h3>${localized.name} ${app.version}</h3>
      <p>${appData.formatDate(app.released)} - ${app.platform}</p>
      ${notesMarkup}
    </article>
  `;
}

function updateDetailStaticTexts() {
  const text = getDetailTextBundle();
  const backToHome = document.getElementById("backToHome");
  const detailsDownloadsTitle = document.getElementById("detailsDownloadsTitle");
  const detailsReleaseTitle = document.getElementById("detailsReleaseTitle");
  const notFoundTitle = document.getElementById("notFoundTitle");
  const notFoundCopy = document.getElementById("notFoundCopy");

  backToHome.textContent = text.back;
  detailsDownloadsTitle.textContent = text.downloadsTitle;
  detailsReleaseTitle.textContent = text.releaseTitle;
  notFoundTitle.textContent = text.notFoundTitle;
  notFoundCopy.textContent = text.notFoundCopy;
}

function renderDetailPage() {
  const appId = getAppIdFromUrl();
  const app = appData.apps.find((item) => item.id === appId);
  const ui = appData.getUI();

  appData.updateCommonStaticContent();

  const languageSelect = document.getElementById("languageSelect");
  appData.updateLanguageSelector(languageSelect);
  updateDetailStaticTexts();

  const detailNotFound = document.getElementById("detailNotFound");
  const detailIntro = document.querySelector(".detail-intro");
  const downloadsPanel = document.getElementById("downloadFilesList").closest(".panel");
  const notesPanel = document.getElementById("detailReleaseNotes").closest(".panel");

  if (!app) {
    detailIntro.classList.add("hidden");
    downloadsPanel.classList.add("hidden");
    notesPanel.classList.add("hidden");
    detailNotFound.classList.remove("hidden");
    return;
  }

  detailNotFound.classList.add("hidden");
  detailIntro.classList.remove("hidden");
  downloadsPanel.classList.remove("hidden");
  notesPanel.classList.remove("hidden");

  const localized = appData.getLocalizedContent(app);
  const platforms = appData.getAppPlatforms(app).join(", ");

  document.getElementById("detailAppPlatform").textContent = `${platforms} ${app.version}`;
  document.getElementById("detailAppName").textContent = localized.name;
  document.getElementById("detailAppTagline").textContent = localized.tagline;
  document.getElementById("detailsDownloadsCopy").textContent = getDownloadSectionCopy(app);

  renderDownloadFiles(app, ui, document.getElementById("downloadFilesList"));
  renderReleaseNotes(app, localized, document.getElementById("detailReleaseNotes"));
}

document.getElementById("languageSelect").addEventListener("change", (event) => {
  appData.setLanguage(event.target.value);
  renderDetailPage();
});

renderDetailPage();
