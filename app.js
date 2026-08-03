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
    heroCopy:
      "Ge anvÃ¤ndare en plats att upptÃ¤cka dina appar, ladda ner senaste versionerna och lÃ¤sa exakt vad som Ã¤ndrats i varje release.",
    heroCta: "Visa appar",
    downloadsTitle: "Nedladdningar",
    downloadsCopy: "VÃ¤lj en app fÃ¶r att Ã¶ppna dess egna sida med filer och release notes.",
    aboutTitle: "Om Projekten",
    aboutLead: "Bakgrunden till varfÃ¶r ApexCore och SÃ¶mnDagboken byggdes.",
    platformLabel: "Plattform",
    footerCopy: "SteenForge-mall. Redigera data i app.js fÃ¶r att publicera dina riktiga appar.",
    platformOptions: {
      all: "Alla",
      Windows: "Windows",
      Android: "Android",
      Web: "Webb",
      macOS: "macOS"
    },
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
    heroCopy:
      "Give users one place to discover your apps, download the latest versions, and read exactly what changed in every release.",
    heroCta: "Browse Apps",
    downloadsTitle: "Downloads",
    downloadsCopy: "Choose an app to open its own page with files and release notes.",
    aboutTitle: "About the Projects",
    aboutLead: "The story behind why ApexCore and Sleep Journal were built.",
    platformLabel: "Platform",
    footerCopy: "SteenForge starter template. Edit data in app.js to publish your real apps.",
    platformOptions: {
      all: "All",
      Windows: "Windows",
      Android: "Android",
      Web: "Web",
      macOS: "macOS"
    },
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
    heroCopy:
      "Giv brugere et sted at opdage dine apps, hente de nyeste versioner og lÃ¦se prÃ¦cist hvad der blev Ã¦ndret i hver release.",
    heroCta: "Se apps",
    downloadsTitle: "Downloads",
    downloadsCopy: "VÃ¦lg en app for at Ã¥bne dens egen side med filer og release notes.",
    aboutTitle: "Om Projekterne",
    aboutLead: "Historien bag hvorfor ApexCore og SÃ¸vnDagbogen blev bygget.",
    platformLabel: "Platform",
    footerCopy: "SteenForge-skabelon. Rediger data i app.js for at udgive dine rigtige apps.",
    platformOptions: {
      all: "Alle",
      Windows: "Windows",
      Android: "Android",
      Web: "Web",
      macOS: "macOS"
    },
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
    heroCopy:
      "Gi brukere ett sted for Ã¥ oppdage appene dine, laste ned siste versjon og lese akkurat hva som ble endret i hver release.",
    heroCta: "Se apper",
    downloadsTitle: "Nedlastinger",
    downloadsCopy: "Velg en app for Ã¥ Ã¥pne dens egen side med filer og release notes.",
    aboutTitle: "Om Prosjektene",
    aboutLead: "Bakgrunnen for hvorfor ApexCore og SÃ¸vnDagboken ble bygget.",
    platformLabel: "Plattform",
    footerCopy: "SteenForge-mal. Rediger data i app.js for Ã¥ publisere appene dine.",
    platformOptions: {
      all: "Alle",
      Windows: "Windows",
      Android: "Android",
      Web: "Web",
      macOS: "macOS"
    },
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
    heroCopy:
      "Tarjoa kÃ¤yttÃ¤jille yksi paikka lÃ¶ytÃ¤Ã¤ sovelluksesi, ladata uusimmat versiot ja lukea tarkasti mitÃ¤ kussakin julkaisussa muuttui.",
    heroCta: "Selaa sovelluksia",
    downloadsTitle: "Lataukset",
    downloadsCopy: "Valitse sovellus avataksesi sen oman sivun tiedostoilla ja release notes -sisÃ¤llÃ¶llÃ¤.",
    aboutTitle: "Tietoa Projekteista",
    aboutLead: "Tarina siitÃ¤, miksi ApexCore ja UnipÃ¤ivÃ¤kirja rakennettiin.",
    platformLabel: "Alusta",
    footerCopy: "SteenForge-pohja. Muokkaa dataa tiedostossa app.js julkaistaksesi oikeat sovelluksesi.",
    platformOptions: {
      all: "Kaikki",
      Windows: "Windows",
      Android: "Android",
      Web: "Web",
      macOS: "macOS"
    },
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
      "Som en person med NPF-diagnoser upptÃ¤ckte jag snabbt i mitt arbete att fysiska pÃ¥minnelselappar inte rÃ¤ckte till.",
      "Jag tappade bort dem, glÃ¶mde bort dem, eller sÃ¥ gav de inte den visuella pÃ¥minnelse som jag behÃ¶vde fÃ¶r att verkligen komma ihÃ¥g.",
      "Jag letade efter ett digitalt verktyg som kunde gÃ¶ra det jag behÃ¶vde, men hittade inget som passade. Antingen saknades viktiga funktioner, eller sÃ¥ var systemen sÃ¥ stora och komplexa att jag Ã¤ndÃ¥ tappade bort mig sjÃ¤lv. Till slut insÃ¥g jag: varfÃ¶r inte bygga nÃ¥got sjÃ¤lv?"
    ],
    sections: [
      {
        title: "FrÃ¥n idÃ© till verklighet",
        paragraphs: [
          "Jag bÃ¶rjade bygga utifrÃ¥n mina egna behov: en person med NPF som behÃ¶ver enkelhet, struktur och ett visuellt sÃ¤tt att hÃ¥lla koll pÃ¥ allt som ska gÃ¶ras.",
          "Appen bÃ¶rjade som Digital Post-it Notes, ett litet projekt fÃ¶r att lÃ¶sa min egen vardag. NÃ¤r koden vÃ¤xte, vÃ¤xte ocksÃ¥ visionen.",
          "Namnet byttes till ApexCore fÃ¶r att spegla vad det faktiskt Ã¤r: kÃ¤rnan av ditt arbete."
        ]
      },
      {
        title: "Utvecklad med omsorg",
        paragraphs: [
          "Jag har arbetat pÃ¥ ApexCore varje dag under lÃ¥ng tid. Det har inte bara resulterat i en app, utan ocksÃ¥ lÃ¤rt mig enormt mycket om JavaScript, kodstruktur och Ã¤ven Python lÃ¤ngs vÃ¤gen.",
          "Min drivkraft har hela tiden varit: Hur gÃ¶r jag det hÃ¤r sÃ¥ enkelt som mÃ¶jligt fÃ¶r mig och fÃ¶r andra?"
        ]
      },
      {
        title: "FrÃ¥n vÃ¥rden till vardagen",
        paragraphs: [
          "Appen bÃ¶rjade som ett verktyg fÃ¶r mig sjÃ¤lv i mitt arbete inom Ã¶ppenvÃ¥rdspsykiatrin, dÃ¤rfÃ¶r finns kategorin Patienter.",
          "Men jag insÃ¥g snabbt att det hÃ¤r Ã¤r nÃ¥got fler kan ha nytta av, oavsett om du jobbar i vÃ¥rden, pluggar, driver ett projekt eller bara vill ha bÃ¤ttre koll pÃ¥ vardagen."
        ]
      },
      {
        title: "SÃ¶mnDagboken â€œ ett systerprojekt",
        paragraphs: [
          "Vid sidan av ApexCore har jag Ã¤ven skapat SÃ¶mnDagboken, ett litet verktyg fÃ¶r att hÃ¥lla koll pÃ¥ sÃ¶mnen vecka fÃ¶r vecka.",
          "Den Ã¤r fortfarande under utveckling i alpha-version, men gÃ¥r utmÃ¤rkt att anvÃ¤nda redan nu om du vill testa."
        ]
      }
    ]
  },
  en: {
    mainTitle: "â€¢ ApexCore â€œ The Heart of Your Work",
    subtitle: "A story about function, focus, and finding the right tools",
    intro: [
      "I built ApexCore for one simple reason: I needed something that actually worked for me.",
      "As someone with neurodevelopmental differences, I quickly discovered in my work that physical reminder notes were not enough.",
      "I lost them, forgot them, or they simply did not provide the visual cue I needed to truly remember.",
      "I searched for a digital tool that could do what I needed, but I could not find one that fit. Either key features were missing, or the systems were so large and complex that I got lost in them anyway. In the end I realized: why not build it myself?"
    ],
    sections: [
      {
        title: "From idea to reality",
        paragraphs: [
          "That is how I started: building from my own needs as a person who needs simplicity, structure, and a visual way to track what must be done.",
          "The app began as Digital Post-it Notes, a small project to solve my own everyday workflow. As the code grew, the vision grew too.",
          "The name was changed to ApexCore to reflect what it truly is: the core of your work."
        ]
      },
      {
        title: "Built with care",
        paragraphs: [
          "I have worked on ApexCore every day for a long time. It has not only resulted in an app, it has also taught me a huge amount about JavaScript, code structure, and even Python along the way.",
          "My driving question has always been: How can I make this as simple as possible for myself and for others?"
        ]
      },
      {
        title: "From healthcare to everyday life",
        paragraphs: [
          "The app started as a tool for myself in outpatient psychiatry, which is why the Patients category exists.",
          "But I quickly realized this can help many more people, whether you work in healthcare, study, run a project, or just want better control over daily life."
        ]
      },
      {
        title: "Sleep Journal â€œ a sister project",
        paragraphs: [
          "Alongside ApexCore, I also created Sleep Journal, a small tool for tracking sleep week by week.",
          "It is still under development in alpha, but it is already very usable if you want to try it."
        ]
      }
    ]
  },
  da: {
    mainTitle: "â€¢ ApexCore â€œ Hjertet i dit arbejde",
    subtitle: "En fortÃ¦lling om funktion, fokus og at finde de rigtige vÃ¦rktÃ¸jer",
    intro: [
      "Jeg byggede ApexCore af en enkel grund: jeg havde brug for noget, der faktisk virkede for mig.",
      "Som person med NPF-diagnoser opdagede jeg hurtigt i mit arbejde, at fysiske pÃ¥mindelsessedler ikke var nok.",
      "Jeg mistede dem, glemte dem, eller de gav ikke den visuelle pÃ¥mindelse, jeg havde brug for, for virkelig at huske.",
      "Jeg ledte efter et digitalt vÃ¦rktÃ¸j, der kunne det, jeg havde brug for, men fandt intet der passede. Enten manglede vigtige funktioner, eller ogsÃ¥ var systemerne sÃ¥ store og komplekse, at jeg alligevel mistede overblikket. Til sidst indsÃ¥ jeg: hvorfor ikke bygge noget selv?"
    ],
    sections: [
      {
        title: "Fra idÃ© til virkelighed",
        paragraphs: [
          "SÃ¥dan begyndte jeg. Jeg byggede ud fra mine egne behov: enkelhed, struktur og en visuel mÃ¥de at holde styr pÃ¥ det, der skal gÃ¸res.",
          "Appen startede som Digital Post-it Notes, et lille projekt for at lÃ¸se min egen hverdag. EfterhÃ¥nden som koden voksede, voksede visionen ogsÃ¥.",
          "Navnet blev Ã¦ndret til ApexCore for at afspejle, hvad det faktisk er: kernen i dit arbejde."
        ]
      },
      {
        title: "Udviklet med omtanke",
        paragraphs: [
          "Jeg har arbejdet pÃ¥ ApexCore hver dag i lang tid. Det har ikke kun resulteret i en app, men ogsÃ¥ lÃ¦rt mig enormt meget om JavaScript, kodestruktur og ogsÃ¥ Python undervejs.",
          "Min drivkraft har hele tiden vÃ¦ret: Hvordan gÃ¸r jeg det her sÃ¥ enkelt som muligt for mig selv og for andre?"
        ]
      },
      {
        title: "Fra sundhedsvÃ¦sen til hverdagsliv",
        paragraphs: [
          "Appen begyndte som et vÃ¦rktÃ¸j til mig selv i arbejdet inden for ambulant psykiatri, derfor findes kategorien Patienter.",
          "Men jeg indsÃ¥ hurtigt, at flere kan fÃ¥ gavn af det, uanset om du arbejder i sundhedsvÃ¦senet, studerer, driver et projekt eller bare vil have bedre overblik i hverdagen."
        ]
      },
      {
        title: "SÃ¸vnDagbogen â€œ et sÃ¸sterprojekt",
        paragraphs: [
          "Ved siden af ApexCore har jeg ogsÃ¥ skabt SÃ¸vnDagbogen, et lille vÃ¦rktÃ¸j til at fÃ¸lge sÃ¸vn uge for uge.",
          "Den er stadig under udvikling i alpha, men kan allerede nu bruges fint, hvis du vil teste den."
        ]
      }
    ]
  },
  no: {
    mainTitle: "â€¢ ApexCore â€œ Hjertet i arbeidet ditt",
    subtitle: "En historie om funksjon, fokus og Ã¥ finne riktige verktÃ¸y",
    intro: [
      "Jeg bygget ApexCore av Ã©n enkel grunn: jeg trengte noe som faktisk fungerte for meg.",
      "Som en person med NPF-diagnoser oppdaget jeg raskt i jobben min at fysiske pÃ¥minnelseslapper ikke var nok.",
      "Jeg mistet dem, glemte dem, eller de ga ikke den visuelle pÃ¥minnelsen jeg trengte for Ã¥ faktisk huske.",
      "Jeg lette etter et digitalt verktÃ¸y som kunne gjÃ¸re det jeg trengte, men fant ingenting som passet. Enten manglet viktige funksjoner, eller sÃ¥ var systemene sÃ¥ store og komplekse at jeg likevel mistet oversikten. Til slutt innsÃ¥ jeg: hvorfor ikke bygge noe selv?"
    ],
    sections: [
      {
        title: "Fra idÃ© til virkelighet",
        paragraphs: [
          "Slik startet det. Jeg bygget ut fra egne behov: enkelhet, struktur og en visuell mÃ¥te Ã¥ holde oversikt over alt som skal gjÃ¸res.",
          "Appen startet som Digital Post-it Notes, et lite prosjekt for Ã¥ lÃ¸se hverdagen min. Etter hvert som koden vokste, vokste ogsÃ¥ visjonen.",
          "Navnet ble endret til ApexCore for Ã¥ speile hva den faktisk er: kjernen i arbeidet ditt."
        ]
      },
      {
        title: "Utviklet med omtanke",
        paragraphs: [
          "Jeg har jobbet med ApexCore hver dag i lang tid. Det har ikke bare blitt en app, men har ogsÃ¥ lÃ¦rt meg veldig mye om JavaScript, kodestruktur og ogsÃ¥ Python underveis.",
          "Drivkraften min har hele tiden vÃ¦rt: Hvordan gjÃ¸r jeg dette sÃ¥ enkelt som mulig for meg selv og for andre?"
        ]
      },
      {
        title: "Fra helsevesen til hverdagsliv",
        paragraphs: [
          "Appen startet som et verktÃ¸y for meg selv i arbeid innen poliklinisk psykiatri, derfor finnes kategorien Pasienter.",
          "Men jeg innsÃ¥ raskt at flere kan ha nytte av dette, enten du jobber i helsevesenet, studerer, driver et prosjekt eller bare vil ha bedre oversikt i hverdagen."
        ]
      },
      {
        title: "SÃ¸vnDagboken â€œ et sÃ¸sterprosjekt",
        paragraphs: [
          "Ved siden av ApexCore har jeg ogsÃ¥ laget SÃ¸vnDagboken, et lite verktÃ¸y for Ã¥ fÃ¸lge sÃ¸vnen uke for uke.",
          "Den er fortsatt under utvikling i alpha, men fungerer allerede fint hvis du vil teste den."
        ]
      }
    ]
  },
  fi: {
    mainTitle: "â€¢ ApexCore â€œ TyÃ¶si sydÃ¤n",
    subtitle: "Tarina toiminnallisuudesta, keskittymisestÃ¤ ja oikeiden tyÃ¶kalujen lÃ¶ytÃ¤misestÃ¤",
    intro: [
      "Rakensin ApexCoren yksinkertaisesta syystÃ¤: tarvitsin jotain, joka todella toimii minulle.",
      "NPF-diagnoosien kanssa huomasin tyÃ¶ssÃ¤ni nopeasti, etteivÃ¤t fyysiset muistilaput riittÃ¤neet.",
      "Kadotin niitÃ¤, unohdin niitÃ¤, tai ne eivÃ¤t antaneet tarvittavaa visuaalista muistutusta, jotta todella muistaisin.",
      "Etsin digitaalista tyÃ¶kalua, joka tekisi sen mitÃ¤ tarvitsin, mutta en lÃ¶ytÃ¤nyt sopivaa. Joko tÃ¤rkeitÃ¤ ominaisuuksia puuttui tai jÃ¤rjestelmÃ¤t olivat niin suuria ja monimutkaisia, ettÃ¤ kadotin itseni niihin. Lopulta tajusin: miksi en rakentaisi sitÃ¤ itse?"
    ],
    sections: [
      {
        title: "Ideasta todellisuudeksi",
        paragraphs: [
          "Niin aloitin. Rakensin omista tarpeistani: yksinkertaisuutta, rakennetta ja visuaalista tapaa seurata kaikkea, mitÃ¤ pitÃ¤Ã¤ tehdÃ¤.",
          "Sovellus alkoi nimellÃ¤ Digital Post-it Notes, pienenÃ¤ projektina oman arkeni tueksi. Koodin kasvaessa myÃ¶s visio kasvoi.",
          "Nimi vaihdettiin ApexCoreksi, jotta se kuvaisi sitÃ¤ mitÃ¤ se on: tyÃ¶si ydin."
        ]
      },
      {
        title: "Huolella kehitetty",
        paragraphs: [
          "Olen tyÃ¶skennellyt ApexCoren parissa pitkÃ¤Ã¤n joka pÃ¤ivÃ¤. Se ei ole tuottanut vain sovellusta, vaan opettanut minulle valtavasti JavaScriptistÃ¤, koodin rakenteesta ja myÃ¶s Pythonista matkan varrella.",
          "Motivaationi on ollut koko ajan sama: Miten teen tÃ¤stÃ¤ mahdollisimman yksinkertaisen minulle ja muille?"
        ]
      },
      {
        title: "Terveydenhuollosta arkeen",
        paragraphs: [
          "Sovellus alkoi tyÃ¶kaluna itselleni avohoidon psykiatrisessa tyÃ¶ssÃ¤, siksi mukana on Potilaat-kategoria.",
          "Mutta huomasin nopeasti, ettÃ¤ tÃ¤stÃ¤ voi olla hyÃ¶tyÃ¤ monille muillekin, tyÃ¶skenteletpÃ¤ terveydenhuollossa, opiskelet, vedÃ¤t projektia tai haluat vain parempaa arjen hallintaa."
        ]
      },
      {
        title: "UnipÃ¤ivÃ¤kirja â€œ sisarprojekti",
        paragraphs: [
          "ApexCoren rinnalla olen tehnyt myÃ¶s UnipÃ¤ivÃ¤kirjan, pienen tyÃ¶kalun unen seuraamiseen viikko viikolta.",
          "Se on edelleen alpha-vaiheen kehityksessÃ¤, mutta toimii jo nyt hyvin, jos haluat kokeilla sitÃ¤."
        ]
      }
    ]
  }
};

const apps = [
  {
    id: "apexcore",
    platform: "Windows",
    version: "v3.0.3",
    size: "52 MB",
    released: "2026-08-01",
    downloads: [
      { platform: "Windows", label: "ApexCore Installer (.exe)", kind: "file", url: "#" },
      { platform: "Web", label: "ApexCore Web", kind: "web", url: "dist-web/index.html" }
    ],
    content: {
      sv: {
        name: "ApexCore",
        tagline: "Kom ihÃ¥g det viktiga utan fysiska post-it-lappar.",
        notes: [
          { date: "2026-07-30", title: "Exportera arkivet till en vault-fil", type: "Nytt", description: "Du kan flytta arkiverade poster till en krypterad vault-fil. NÃ¤r filen har skapats tÃ¶ms arkivet automatiskt." },
          { date: "2026-07-30", title: "Ã…terstÃ¤ll vault-poster till Active", type: "Nytt", description: "En vault-fil kan importeras senare och dess arkiverade poster lÃ¤ggs dÃ¥ i Active sÃ¥ att de gÃ¥r att sÃ¶ka fram och anvÃ¤nda igen." },
          { date: "2026-07-30", title: "Spara och Ã¥terstÃ¤ll info-panelen", type: "Nytt", description: "Info-panelen kan exporteras som en egen fil, importeras igen senare och fÃ¶ljer ocksÃ¥ automatiskt med i vault-exporter." },
          { date: "2026-07-31", title: "Kategorier i Active", type: "Nytt", description: "Aktiva poster kan nu grupperas i kollapsbara kategorier: Patienter, Administration, Privat och Ã–vrigt." },
          { date: "2026-07-30", title: "VÃ¤lj egna namn pÃ¥ exportfiler", type: "Uppdaterat", description: "NÃ¤r du exporterar backuper, CSV-filer, krypterade filer, infofiler eller vault-filer kan du nu sjÃ¤lv vÃ¤lja filnamnet." },
          { date: "2026-07-30", title: "Renare knappstil", type: "Uppdaterat", description: "Knappar som tidigare stack ut med starkare accentfÃ¤rger anvÃ¤nder nu en mer neutral stil som passar bÃ¤ttre ihop med resten av appen." },
          { date: "2026-07-31", title: "HÃ¶g prioritet alltid Ã¶verst", type: "Uppdaterat", description: "Poster med hÃ¶g prioritet Ã¶verstyr nu kategorier och visas alltid fÃ¶rst i Active fÃ¶r bÃ¤ttre synlighet." },
          { date: "2026-07-31", title: "Klicka utanfÃ¶r fÃ¶r att stÃ¤nga Redigera", type: "Uppdaterat", description: "Redigeringspanelen stÃ¤ngs nu nÃ¤r du klickar utanfÃ¶r den, sÃ¥ det gÃ¥r snabbare att Ã¥terhÃ¤mta sig frÃ¥n felklick." },
          { date: "2026-07-31", title: "HÃ¶g prioritet flyttad till Kategori", type: "Uppdaterat", description: "HÃ¶g prioritet kan nu vÃ¤ljas direkt i kategorilistan, sÃ¥ en och samma vÃ¤ljare hanterar bÃ¥de gruppering och prioriterad placering." },
          { date: "2026-07-30", title: "Dubblettskydd vid info-import", type: "Buggfixar", description: "Importerade poster i info-panelen kontrolleras nu fÃ¶r dubbletter sÃ¥ att samma inbyggda eller importerade uppdatering inte lÃ¤ggs till mer Ã¤n en gÃ¥ng." },
          { date: "2026-07-31", title: "Tomma anteckningar dÃ¶ljs", type: "Buggfixar", description: "Om en post saknar anteckningar visas inte lÃ¤ngre Notes-raden i Active, vilket gÃ¶r korten renare." }
        ]
      },
      en: {
        name: "ApexCore",
        tagline: "Remember what matters without physical post-it notes.",
        notes: [
          { date: "2026-07-30", title: "Export archive to a vault file", type: "New", description: "You can move archived entries to an encrypted vault file. When the file is created, the archive is automatically cleared." },
          { date: "2026-07-30", title: "Restore vault entries to Active", type: "New", description: "A vault file can be imported later and its archived entries are added to Active so they can be searched and used again." },
          { date: "2026-07-30", title: "Save and restore the info panel", type: "New", description: "The info panel can be exported as a separate file, imported again later, and is also automatically included in vault exports." },
          { date: "2026-07-31", title: "Categories in Active", type: "New", description: "Active entries can now be grouped into collapsible categories: Patients, Administration, Private, and Other." },
          { date: "2026-07-30", title: "Choose custom export filenames", type: "Updated", description: "When exporting backups, CSV files, encrypted files, info files, or vault files, you can now choose the filename yourself." },
          { date: "2026-07-30", title: "Cleaner button style", type: "Updated", description: "Buttons that previously stood out with stronger accent colors now use a more neutral style that fits better with the rest of the app." },
          { date: "2026-07-31", title: "High priority always on top", type: "Updated", description: "High-priority entries now override categories and are always shown first in Active for better visibility." },
          { date: "2026-07-31", title: "Click outside to close Edit", type: "Updated", description: "The edit panel now closes when you click outside it, making it faster to recover from misclicks." },
          { date: "2026-07-31", title: "High priority moved to Category", type: "Updated", description: "High priority can now be selected directly in the category list, so one selector handles both grouping and prioritized placement." },
          { date: "2026-07-30", title: "Duplicate protection on info import", type: "Bug fixes", description: "Imported entries in the info panel are now checked for duplicates so the same built-in or imported update is not added more than once." },
          { date: "2026-07-31", title: "Empty notes are hidden", type: "Bug fixes", description: "If an entry has no notes, the Notes row is no longer shown in Active, making cards cleaner." }
        ]
      },
      da: {
        name: "ApexCore",
        tagline: "Husk det vigtige uden fysiske post-it sedler.",
        notes: [
          { date: "2026-07-30", title: "Eksporter arkivet til en vault-fil", type: "Nyt", description: "Du kan flytte arkiverede poster til en krypteret vault-fil. NÃ¥r filen er oprettet, tÃ¸mmes arkivet automatisk." },
          { date: "2026-07-30", title: "Gendan vault-poster til Active", type: "Nyt", description: "En vault-fil kan importeres senere, og dens arkiverede poster lÃ¦gges i Active, sÃ¥ de kan sÃ¸ges frem og bruges igen." },
          { date: "2026-07-30", title: "Gem og gendan info-panelet", type: "Nyt", description: "Info-panelet kan eksporteres som en separat fil, importeres igen senere og fÃ¸lger ogsÃ¥ automatisk med i vault-eksporter." },
          { date: "2026-07-31", title: "Kategorier i Active", type: "Nyt", description: "Aktive poster kan nu grupperes i sammenklappelige kategorier: Patienter, Administration, Privat og Ã˜vrigt." },
          { date: "2026-07-30", title: "VÃ¦lg egne navne pÃ¥ eksportfiler", type: "Opdateret", description: "NÃ¥r du eksporterer backups, CSV-filer, krypterede filer, infofiler eller vault-filer, kan du nu selv vÃ¦lge filnavnet." },
          { date: "2026-07-30", title: "Renere knapstil", type: "Opdateret", description: "Knapper, der tidligere skilte sig ud med stÃ¦rkere accentfarver, bruger nu en mere neutral stil, som passer bedre til resten af appen." },
          { date: "2026-07-31", title: "HÃ¸j prioritet altid Ã¸verst", type: "Opdateret", description: "Poster med hÃ¸j prioritet overstyrer nu kategorier og vises altid fÃ¸rst i Active for bedre synlighed." },
          { date: "2026-07-31", title: "Klik udenfor for at lukke RedigÃ©r", type: "Opdateret", description: "Redigeringspanelet lukkes nu, nÃ¥r du klikker udenfor det, sÃ¥ det er hurtigere at komme sig efter fejlklik." },
          { date: "2026-07-31", title: "HÃ¸j prioritet flyttet til Kategori", type: "Opdateret", description: "HÃ¸j prioritet kan nu vÃ¦lges direkte i kategorilisten, sÃ¥ Ã©n vÃ¦lger hÃ¥ndterer bÃ¥de gruppering og prioriteret placering." },
          { date: "2026-07-30", title: "Dobbeltbeskyttelse ved info-import", type: "Fejlrettelser", description: "Importerede poster i info-panelet kontrolleres nu for dubletter, sÃ¥ den samme indbyggede eller importerede opdatering ikke tilfÃ¸jes mere end Ã©n gang." },
          { date: "2026-07-31", title: "Tomme noter skjules", type: "Fejlrettelser", description: "Hvis en post mangler noter, vises Notes-rÃ¦kken ikke lÃ¦ngere i Active, hvilket gÃ¸r kortene renere." }
        ]
      },
      no: {
        name: "ApexCore",
        tagline: "Husk det viktige uten fysiske post-it-lapper.",
        notes: [
          { date: "2026-07-30", title: "Eksporter arkivet til en vault-fil", type: "Nytt", description: "Du kan flytte arkiverte poster til en kryptert vault-fil. NÃ¥r filen er opprettet, tÃ¸mmes arkivet automatisk." },
          { date: "2026-07-30", title: "Gjenopprett vault-poster til Active", type: "Nytt", description: "En vault-fil kan importeres senere, og de arkiverte postene legges da i Active slik at de kan sÃ¸kes opp og brukes igjen." },
          { date: "2026-07-30", title: "Lagre og gjenopprett info-panelet", type: "Nytt", description: "Info-panelet kan eksporteres som en egen fil, importeres igjen senere og fÃ¸lger ogsÃ¥ automatisk med i vault-eksporter." },
          { date: "2026-07-31", title: "Kategorier i Active", type: "Nytt", description: "Aktive poster kan nÃ¥ grupperes i kollapsbare kategorier: Pasienter, Administrasjon, Privat og Ã˜vrig." },
          { date: "2026-07-30", title: "Velg egne navn pÃ¥ eksportfiler", type: "Oppdatert", description: "NÃ¥r du eksporterer sikkerhetskopier, CSV-filer, krypterte filer, infofiler eller vault-filer, kan du nÃ¥ velge filnavnet selv." },
          { date: "2026-07-30", title: "Renere knappestil", type: "Oppdatert", description: "Knapper som tidligere skilte seg ut med sterkere aksentfarger bruker nÃ¥ en mer nÃ¸ytral stil som passer bedre sammen med resten av appen." },
          { date: "2026-07-31", title: "HÃ¸y prioritet alltid Ã¸verst", type: "Oppdatert", description: "Poster med hÃ¸y prioritet overstyrer nÃ¥ kategorier og vises alltid fÃ¸rst i Active for bedre synlighet." },
          { date: "2026-07-31", title: "Klikk utenfor for Ã¥ lukke Rediger", type: "Oppdatert", description: "Redigeringspanelet lukkes nÃ¥ nÃ¥r du klikker utenfor det, sÃ¥ det gÃ¥r raskere Ã¥ hente seg inn etter feilklikk." },
          { date: "2026-07-31", title: "HÃ¸y prioritet flyttet til Kategori", type: "Oppdatert", description: "HÃ¸y prioritet kan nÃ¥ velges direkte i kategorilisten, slik at Ã©n og samme velger hÃ¥ndterer bÃ¥de gruppering og prioritert plassering." },
          { date: "2026-07-30", title: "Dobbeltbeskyttelse ved info-import", type: "Feilrettinger", description: "Importerte poster i info-panelet kontrolleres nÃ¥ for duplikater slik at samme innebygde eller importerte oppdatering ikke legges til mer enn Ã©n gang." },
          { date: "2026-07-31", title: "Tomme notater skjules", type: "Feilrettinger", description: "Hvis en post mangler notater, vises ikke lenger Notes-raden i Active, noe som gjÃ¸r kortene renere." }
        ]
      },
      fi: {
        name: "ApexCore",
        tagline: "Muista tÃ¤rkeÃ¤t asiat ilman fyysisiÃ¤ post-it-lappuja.",
        notes: [
          { date: "2026-07-30", title: "Vie arkisto vault-tiedostoon", type: "Uutta", description: "Voit siirtÃ¤Ã¤ arkistoidut merkinnÃ¤t salattuun vault-tiedostoon. Kun tiedosto on luotu, arkisto tyhjennetÃ¤Ã¤n automaattisesti." },
          { date: "2026-07-30", title: "Palauta vault-merkinnÃ¤t Activeen", type: "Uutta", description: "Vault-tiedosto voidaan tuoda myÃ¶hemmin, ja sen arkistoidut merkinnÃ¤t lisÃ¤tÃ¤Ã¤n Activeen, jotta niitÃ¤ voi hakea ja kÃ¤yttÃ¤Ã¤ uudelleen." },
          { date: "2026-07-30", title: "Tallenna ja palauta info-paneeli", type: "Uutta", description: "Info-paneeli voidaan viedÃ¤ omana tiedostonaan, tuoda takaisin myÃ¶hemmin, ja se sisÃ¤ltyy myÃ¶s automaattisesti vault-vienteihin." },
          { date: "2026-07-31", title: "Kategoriat Activessa", type: "Uutta", description: "Aktiiviset merkinnÃ¤t voidaan nyt ryhmitellÃ¤ avattaviin kategorioihin: Potilaat, Hallinto, Yksityinen ja Muut." },
          { date: "2026-07-30", title: "Valitse omat nimet vientitiedostoille", type: "PÃ¤ivitetty", description: "Kun viet varmuuskopioita, CSV-tiedostoja, salattuja tiedostoja, infotiedostoja tai vault-tiedostoja, voit nyt valita tiedostonimen itse." },
          { date: "2026-07-30", title: "SelkeÃ¤mpi painiketyyli", type: "PÃ¤ivitetty", description: "Painikkeet, jotka aiemmin erottuivat vahvemmilla korostusvÃ¤reillÃ¤, kÃ¤yttÃ¤vÃ¤t nyt neutraalimpaa tyyliÃ¤, joka sopii paremmin muun sovelluksen ilmeeseen." },
          { date: "2026-07-31", title: "Korkea prioriteetti aina ylimpÃ¤nÃ¤", type: "PÃ¤ivitetty", description: "Korkean prioriteetin merkinnÃ¤t ohittavat nyt kategoriat ja nÃ¤kyvÃ¤t aina ensimmÃ¤isinÃ¤ Activessa paremman nÃ¤kyvyyden vuoksi." },
          { date: "2026-07-31", title: "Sulje Muokkaa klikkaamalla ulkopuolelle", type: "PÃ¤ivitetty", description: "Muokkauspaneeli sulkeutuu nyt, kun klikkaat sen ulkopuolelle, joten virheklikkauksista palautuminen on nopeampaa." },
          { date: "2026-07-31", title: "Korkea prioriteetti siirretty Kategoriaan", type: "PÃ¤ivitetty", description: "Korkea prioriteetti voidaan nyt valita suoraan kategorialistasta, joten sama valitsin hoitaa sekÃ¤ ryhmittelyn ettÃ¤ priorisoidun sijoittelun." },
          { date: "2026-07-30", title: "Kaksoiskappalesuoja info-tuonnissa", type: "Bugikorjaukset", description: "Info-paneeliin tuodut merkinnÃ¤t tarkistetaan nyt kaksoiskappaleiden varalta, jotta samaa sisÃ¤Ã¤nrakennettua tai tuotua pÃ¤ivitystÃ¤ ei lisÃ¤tÃ¤ useammin kuin kerran." },
          { date: "2026-07-31", title: "TyhjÃ¤t muistiinpanot piilotetaan", type: "Bugikorjaukset", description: "Jos merkinnÃ¤llÃ¤ ei ole muistiinpanoja, Notes-riviÃ¤ ei enÃ¤Ã¤ nÃ¤ytetÃ¤ Activessa, mikÃ¤ tekee korteista siistimpiÃ¤." }
        ]
      }
    }
  },
  {
    id: "somndagboken",
    platform: "Android",
    version: "Alpha",
    size: "29 MB",
    released: "2026-08-01",
    downloads: [
      { platform: "Android", label: "S\u00f6mndagboken (.apk)", url: "#" },
      { platform: "Web", label: "Sleep Journal Web", kind: "web", url: "sleep-journal-web/index.html" }
    ],
    content: {
      sv: {
        name: "SÃ¶mndagboken",
        tagline: "Logga din sÃ¶mn varje natt och fÃ¶lj din veckovisa sÃ¶mnrytm.",
        notes: [
          "Lade till enkel nattlig sÃ¶mnloggning.",
          "Ny veckovis sammanfattning fÃ¶r att se trender.",
          "FÃ¶rbÃ¤ttrad tidslinje fÃ¶r tydligare sÃ¶mnuppfÃ¶ljning."
        ]
      },
      en: {
        name: "Sleep Journal",
        tagline: "Log your sleep every night and track weekly sleep patterns.",
        notes: [
          "Added nightly sleep logging with simple controls.",
          "Introduced weekly summaries to spot sleep trends.",
          "Improved timeline readability for better sleep tracking."
        ]
      },
      da: {
        name: "SÃ¸vndagbogen",
        tagline: "Log din sÃ¸vn hver nat og fÃ¸lg dit ugentlige sÃ¸vnmÃ¸nster.",
        notes: [
          "TilfÃ¸jet enkel natlig sÃ¸vnregistrering.",
          "Nye ugentlige oversigter for at se sÃ¸vntrends.",
          "Forbedret tidslinje for tydeligere sÃ¸vnsporing."
        ]
      },
      no: {
        name: "SÃ¸vndagboken",
        tagline: "Logg sÃ¸vnen hver natt og fÃ¸lg sÃ¸vnmÃ¸nsteret uke for uke.",
        notes: [
          "La til enkel nattlig sÃ¸vnlogging.",
          "Nye ukesoppsummeringer for Ã¥ se sÃ¸vntrender.",
          "Forbedret tidslinje for tydeligere sÃ¸vnoppfÃ¸lging."
        ]
      },
      fi: {
        name: "UnipÃ¤ivÃ¤kirja",
        tagline: "Kirjaa unesi joka yÃ¶ ja seuraa viikoittaista unirytmiÃ¤si.",
        notes: [
          "LisÃ¤tty helppo yÃ¶kohtainen uniloki.",
          "Uudet viikkoyhteenvedot unitrendien seuraamiseen.",
          "Parannettu aikajana selkeÃ¤mpÃ¤Ã¤ unen seurantaa varten."
        ]
      }
    }
  },
  {
    id: "coming-soon",
    platform: "Web",
    version: "TBA",
    size: "Browser",
    released: "2026-08-01",
    downloads: [],
    content: {
      sv: { name: "Mer information kommer snart", tagline: "En ny app Ã¤r under utveckling. Fler detaljer kommer snart.", notes: ["Mer information kommer snart.", "Tidslinje publiceras nÃ¤r den Ã¤r faststÃ¤lld.", "FunktionsÃ¶versikt kommer i kommande uppdateringar."] },
      en: { name: "More Information Coming Soon", tagline: "A new app is in development. Details will be published soon.", notes: ["More information coming soon.", "Release timeline will be shared when finalized.", "Feature overview will be posted in upcoming updates."] },
      da: { name: "Mere information kommer snart", tagline: "En ny app er under udvikling. Flere detaljer kommer snart.", notes: ["Mere information kommer snart.", "Tidsplan deles nÃ¥r den er fastlagt.", "Funktionsoversigt publiceres i kommende opdateringer."] },
      no: { name: "Mer informasjon kommer snart", tagline: "En ny app er under utvikling. Flere detaljer kommer snart.", notes: ["Mer informasjon kommer snart.", "Tidslinje deles nÃ¥r den er fastsatt.", "Funksjonsoversikt publiseres i kommende oppdateringer."] },
      fi: { name: "LisÃ¤Ã¤ tietoa tulossa pian", tagline: "Uusi sovellus on kehityksessÃ¤. LisÃ¤tiedot julkaistaan pian.", notes: ["LisÃ¤Ã¤ tietoa tulossa pian.", "Julkaisuaikataulu jaetaan, kun se varmistuu.", "Ominaisuuksien yleiskuva julkaistaan tulevissa pÃ¤ivityksissÃ¤."] }
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

  if (navApps) {
    navApps.textContent = ui.navApps;
  }

  if (navAbout) {
    navAbout.textContent = ui.navAbout;
  }

  if (heroEyebrow) {
    heroEyebrow.textContent = ui.heroEyebrow;
  }

  if (heroTitle) {
    heroTitle.textContent = ui.heroTitle;
  }

  if (heroCopy) {
    heroCopy.textContent = ui.heroCopy;
  }

  if (heroCta) {
    heroCta.textContent = ui.heroCta;
  }

  if (downloadsTitle) {
    downloadsTitle.textContent = ui.downloadsTitle;
  }

  if (downloadsCopy) {
    downloadsCopy.textContent = ui.downloadsCopy;
  }

  if (aboutTitle) {
    aboutTitle.textContent = ui.aboutTitle;
  }

  if (aboutLead) {
    aboutLead.textContent = ui.aboutLead;
  }

  if (platformLabel) {
    platformLabel.textContent = ui.platformLabel;
  }

  if (footerCopy) {
    footerCopy.textContent = ui.footerCopy;
  }

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
  getCurrentLanguage: () => currentLanguage,
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
