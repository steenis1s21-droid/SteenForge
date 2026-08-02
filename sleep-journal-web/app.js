        /*
            SNABBT HITTA RÄTT KOD (Ctrl+F)
            ==============================
            1) SPRÅK OCH TEMA
            2) VECKA OCH DAGAR
            3) TID OCH AUTOMATISK RÄKNING
            4) SPARA OCH ARKIV
            5) POPUP OCH SMÅ MEDDELANDEN
            6) UPPSTART

            Tips:
            Sök på funktionsnamnet för att hoppa direkt.
        */

    // #region KONFIG OCH TEXTDATA
    // Namn på platser där appen sparar saker i webbläsaren.
const STORAGE_KEY = 'sleepJournal_';
        const ARCHIVE_INDEX_KEY = STORAGE_KEY + 'archives';
        const THEME_KEY = STORAGE_KEY + 'theme';
        const LANGUAGE_KEY = STORAGE_KEY + 'language';
        const ARCHIVE_STATUS = {
            DRAFT: 'draft',
            AUTO: 'auto',
            MANUAL: 'manual'
        };
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Alla texter för varje språk finns här.
        // ÄNDRA HÄR: Byt ord och meningar i appen genom att ändra texterna i I18N.
        const I18N = {
            en: {
                notesPlaceholder : 'How did you sleep?',
                hoursPlaceholder: 'e.g., 7.5',
                appTitle: '😴 Sleep Journal',
                languageName: 'English',
                archiveBtn: '📊 Weekly summary',
                clearBtn: 'Clear',
                saveWeekBtn: 'Save Week',
                backBtn: '← Back',
                archiveTitle: 'Sleep Archive',
                weekPrefix: 'Week',
                bedTime: 'Bed Time:',
                wakeTime: 'Wake Time:',
                hoursSlept: 'Hours Slept:',
                notes: 'Notes:',
                addThisDay: 'Add This Day',
                updateThisDay: 'Update This Day',
                chooseArchive: 'Choose archive:',
                deleteSelected: 'Delete Selected',
                noArchive: 'No archived weeks yet. Save your first week!',
                noArchiveSelected: 'No archive selected.',
                weeklySummaryLabel: 'Summary',
                weeklyTotalHours: 'Total sleep this week: {hours}h',
                weeklyAverageHours: 'Average per night: {hours}h',
                weeklyFilledDays: 'Filled days: {count}/7',
                weeklyTargetHours: 'Target: 49h/week',
                weeklyGoalMet: 'Goal reached',
                weeklyGoalNotMet: 'Goal not reached',
                footerCredit: 'Created by Jesper Steen',
                dayHeader: 'Day',
                hoursHeader: 'Hours Slept',
                actionHeader: 'Action',
                editDay: 'Edit Day',
                deleteDay: 'Delete Day',
                inProgress: 'In Progress',
                autoSaved: 'Auto Saved (Full Week)',
                manualSave: 'Manual Save',
                typeLabel: 'Type',
                savedLabel: 'Saved',
                switchToDark: 'Switch to dark mode',
                switchToLight: 'Switch to light mode',
                switchLanguage: 'Switch language',
                switchToLanguage: 'Switch language to {language}',
                ok: 'OK',
                cancel: 'Cancel',
                emptyDay: 'Add at least one value for {day} before saving.',
                dayAdded: '{day} added.',
                dayAddedFull: '{day} added. Full week auto-saved.',
                dayUpdated: '{day} updated.',
                dayUpdatedFull: '{day} updated. Full week auto-saved.',
                dayUpdatedArchive: '{day} updated in archive.',
                weekSaved: 'Week saved successfully!',
                confirmDeleteArchive: 'Delete this archive entry?',
                confirmDeleteDay: 'Delete {day} from this archive?',
                confirmClearWeek: 'Are you sure you want to clear this week?',
                weekCleared: 'Week cleared!',
                dayNames: {
                    Monday: 'Monday',
                    Tuesday: 'Tuesday',
                    Wednesday: 'Wednesday',
                    Thursday: 'Thursday',
                    Friday: 'Friday',
                    Saturday: 'Saturday',
                    Sunday: 'Sunday'
                }
            },
            sv: {
                notesPlaceholder : 'Hur sov du?',
                hoursPlaceholder: 't.ex. 7,5',
                appTitle: '😴 Sömndagbok',
                languageName: 'Svenska',
                archiveBtn: '📊 Veckosammanfattning',
                clearBtn: 'Rensa',
                saveWeekBtn: 'Spara vecka',
                backBtn: '← Tillbaka',
                archiveTitle: 'Sömnarkiv',
                weekPrefix: 'Vecka',
                bedTime: 'Läggtid:',
                wakeTime: 'Vakentid:',
                hoursSlept: 'Sovtimmar:',
                notes: 'Anteckningar:',
                addThisDay: 'Lägg till dag',
                updateThisDay: 'Uppdatera dag',
                chooseArchive: 'Välj arkiv:',
                deleteSelected: 'Ta bort vald',
                noArchive: 'Inga sparade veckor än. Spara din första vecka!',
                noArchiveSelected: 'Inget arkiv valt.',
                weeklySummaryLabel: 'Summering',
                weeklyTotalHours: 'Totala sovtimmar denna vecka: {hours}h',
                weeklyAverageHours: 'Snitt per natt: {hours}h',
                weeklyFilledDays: 'Ifyllda dagar: {count}/7',
                weeklyTargetHours: 'Mål: 49h/vecka',
                weeklyGoalMet: 'Målet uppnått',
                weeklyGoalNotMet: 'Målet inte uppnått',
                footerCredit: 'Skapad av Jesper Steen',
                dayHeader: 'Dag',
                hoursHeader: 'Sovtimmar',
                actionHeader: 'Åtgärd',
                editDay: 'Redigera dag',
                deleteDay: 'Ta bort dag',
                inProgress: 'Pågående',
                autoSaved: 'Autosparad (full vecka)',
                manualSave: 'Manuell sparning',
                typeLabel: 'Typ',
                savedLabel: 'Sparad',
                switchToDark: 'Byt till mörkt läge',
                switchToLight: 'Byt till ljust läge',
                switchLanguage: 'Byt språk',
                switchToLanguage: 'Byt språk till {language}',
                ok: 'OK',
                cancel: 'Avbryt',
                emptyDay: 'Lägg till minst ett värde för {day} innan du sparar.',
                dayAdded: '{day} sparad.',
                dayAddedFull: '{day} sparad. Full vecka autosparad.',
                dayUpdated: '{day} uppdaterad.',
                dayUpdatedFull: '{day} uppdaterad. Full vecka autosparad.',
                dayUpdatedArchive: '{day} uppdaterad i arkivet.',
                weekSaved: 'Veckan sparades!',
                confirmDeleteArchive: 'Ta bort denna arkivpost?',
                confirmDeleteDay: 'Ta bort {day} från detta arkiv?',
                confirmClearWeek: 'Är du säker på att du vill rensa denna vecka?',
                weekCleared: 'Veckan rensad!',
                dayNames: {
                    Monday: 'Måndag',
                    Tuesday: 'Tisdag',
                    Wednesday: 'Onsdag',
                    Thursday: 'Torsdag',
                    Friday: 'Fredag',
                    Saturday: 'Lördag',
                    Sunday: 'Söndag'
                }
            },
            no: {
                notesPlaceholder : 'Hvordan sov du?',
                hoursPlaceholder: 'f.eks. 7,5',
                appTitle: '😴 Søvndagbok',
                languageName: 'Norsk',
                archiveBtn: '📊 Ukesammendrag',
                clearBtn: 'Tomm',
                saveWeekBtn: 'Lagre uke',
                backBtn: '← Tilbake',
                archiveTitle: 'Søvnarkiv',
                weekPrefix: 'Uke',
                bedTime: 'Leggetid:',
                wakeTime: 'Vaketid:',
                hoursSlept: 'Sovetimer:',
                notes: 'Notater:',
                addThisDay: 'Legg til dag',
                updateThisDay: 'Oppdater dag',
                chooseArchive: 'Velg arkiv:',
                deleteSelected: 'Slett valgt',
                noArchive: 'Ingen lagrede uker ennå. Lagre din første uke!',
                noArchiveSelected: 'Ingen arkiv valgt.',
                weeklySummaryLabel: 'Oppsummering',
                weeklyTotalHours: 'Totalt sovetimer denne uken: {hours}h',
                weeklyAverageHours: 'Snitt per natt: {hours}h',
                weeklyFilledDays: 'Utfylte dager: {count}/7',
                weeklyTargetHours: 'Mål: 49t/uke',
                weeklyGoalMet: 'Målet nådd',
                weeklyGoalNotMet: 'Målet ikke nådd',
                footerCredit: 'Laget av Jesper Steen',
                dayHeader: 'Dag',
                hoursHeader: 'Sovetimer',
                actionHeader: 'Handling',
                editDay: 'Rediger dag',
                deleteDay: 'Slett dag',
                inProgress: 'Under arbeid',
                autoSaved: 'Autolagret (full uke)',
                manualSave: 'Manuell lagring',
                typeLabel: 'Type',
                savedLabel: 'Lagret',
                switchToDark: 'Bytt til mørk modus',
                switchToLight: 'Bytt til lys modus',
                switchLanguage: 'Bytt språk',
                switchToLanguage: 'Bytt språk til {language}',
                ok: 'OK',
                cancel: 'Avbryt',
                emptyDay: 'Legg til minst en verdi for {day} for du lagrer.',
                dayAdded: '{day} lagret.',
                dayAddedFull: '{day} lagret. Full uke autolagret.',
                dayUpdated: '{day} oppdatert.',
                dayUpdatedFull: '{day} oppdatert. Full uke autolagret.',
                dayUpdatedArchive: '{day} oppdatert i arkivet.',
                weekSaved: 'Uken ble lagret!',
                confirmDeleteArchive: 'Slette denne arkivposten?',
                confirmDeleteDay: 'Slette {day} fra dette arkivet?',
                confirmClearWeek: 'Er du sikker på at du vil tømme denne uken?',
                weekCleared: 'Uken er tømt!',
                dayNames: {
                    Monday: 'Mandag',
                    Tuesday: 'Tirsdag',
                    Wednesday: 'Onsdag',
                    Thursday: 'Torsdag',
                    Friday: 'Fredag',
                    Saturday: 'Lørdag',
                    Sunday: 'Søndag'
                }
            }
        };
        let activeDay = 'Monday';
        let weekDraftData = {};
        let currentLanguage = 'en';
        let archiveEditContext = null;
        let clearedDays = new Set();
    // #endregion

        // #region SPRAK OCH OVERSATTNING
        // Hämtar rätt text för valt språk.
        function t(key, vars = {}) {
            const dict = I18N[currentLanguage] || I18N.en;
            const fallback = I18N.en;
            let text = dict[key] || fallback[key] || key;
            Object.keys(vars).forEach(varKey => {
                text = text.replace(`{${varKey}}`, vars[varKey]);
            });
            return text;
        }

        // Visar dagens namn på rätt språk.
        function getDayLabel(day) {
            const dict = I18N[currentLanguage] || I18N.en;
            return (dict.dayNames && dict.dayNames[day]) || day;
        }

        // Byter intern status till text som användaren kan läsa.
        function getLocalizedStatusLabel(status) {
            if (status === ARCHIVE_STATUS.DRAFT) {
                return t('inProgress');
            }
            if (status === ARCHIVE_STATUS.AUTO) {
                return t('autoSaved');
            }
            return t('manualSave');
        }

        // Väljer språk när sidan öppnas.
        // ÄNDRA HÄR: Vill du alltid starta på ett språk? Ändra sista return i den här funktionen.
        function getPreferredLanguage() {
            const stored = localStorage.getItem(LANGUAGE_KEY);
            if (stored && I18N[stored]) {
                return stored;
            }

            const browserLanguage = (navigator.language || 'en').toLowerCase();
            if (browserLanguage.startsWith('sv')) {
                return 'sv';
            }
            if (browserLanguage.startsWith('no') || browserLanguage.startsWith('nb') || browserLanguage.startsWith('nn')) {
                return 'no';
            }
            return 'en';
        }

        // Byter alla texter i appen till valt språk.
        function applyLanguage() {
            const appTitle = document.getElementById('appTitle');
            const archiveBtn = document.getElementById('archiveBtn');
            const clearBtn = document.getElementById('clearBtn');
            const saveWeekBtn = document.getElementById('saveWeekBtn');
            const backBtn = document.getElementById('backBtn');
            const archiveTitle = document.getElementById('archiveTitle');
            const languageSelect = document.getElementById('languageSelect');
            const appFooter = document.getElementById('appFooter');

            if (appTitle) appTitle.textContent = t('appTitle');
            if (archiveBtn) archiveBtn.textContent = t('archiveBtn');
            if (clearBtn) clearBtn.textContent = t('clearBtn');
            if (saveWeekBtn) saveWeekBtn.textContent = t('saveWeekBtn');
            if (backBtn) backBtn.textContent = t('backBtn');
            if (archiveTitle) archiveTitle.textContent = t('archiveTitle');
            if (appFooter) appFooter.textContent = t('footerCredit');
            if (languageSelect) {
                languageSelect.value = currentLanguage;
            }

            const modalOk = document.getElementById('appModalOk');
            const modalCancel = document.getElementById('appModalCancel');
            if (modalOk) modalOk.textContent = t('ok');
            if (modalCancel) modalCancel.textContent = t('cancel');

            const weekInfo = getWeekDateRange();
            document.getElementById('weekDisplay').textContent = `${t('weekPrefix')}: ${weekInfo.start} - ${weekInfo.end}`;

            renderCalendarStrip();
            renderDayEditor(activeDay);

            if (document.getElementById('archiveView').classList.contains('show')) {
                const selector = document.getElementById('archiveSelect');
                showArchive(selector ? selector.value : '');
            }

            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            applyTheme(currentTheme);
        }

        // Körs när man väljer språk i listan.
        function changeLanguage(language) {
            if (!I18N[language]) {
                return;
            }
            currentLanguage = language;
            localStorage.setItem(LANGUAGE_KEY, language);
            applyLanguage();
        }
        // #endregion
        
        // #region VECKA OCH FORMUPPBYGGNAD
        // Räknar ut vilket veckonummer det är.
        function getWeekNumber() {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const diff = now - start;
            const oneWeek = 1000 * 60 * 60 * 24 * 7;
            return Math.floor(diff / oneWeek);
        }
        
        // Tar fram start och slut på veckan.
        function getWeekDateRange() {
            const now = new Date();
            const dayOfWeek = now.getDay() || 7;
            const monday = new Date(now);
            monday.setDate(now.getDate() - dayOfWeek + 1);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            
            return {
                start: monday.toDateString(),
                end: sunday.toDateString(),
                key: `${monday.getFullYear()}-W${getWeekNumber()}`
            };
        }
        
        // Skapar området där man fyller i sömn för dagarna.
        function initializeForm() {
            const weekInfo = getWeekDateRange();
            document.getElementById('weekDisplay').textContent = `${t('weekPrefix')}: ${weekInfo.start} - ${weekInfo.end}`;
            
            const dayEntries = document.getElementById('dayEntries');
            weekDraftData = { ...getCurrentWeekData() };
            clearedDays = new Set();
            if (!days.includes(activeDay)) {
                activeDay = days[0];
            }

            dayEntries.innerHTML = `
                <div id="calendarStrip" class="calendar-strip"></div>
                <div id="dayEditor"></div>
            `;

            renderCalendarStrip();
            renderDayEditor(activeDay);
        }
        // #endregion

        // #region TEMA
        // Väljer om sidan ska börja ljus eller mörk.
        // ÄNDRA HÄR: Vill du alltid starta ljust eller mörkt? Ändra sista return i den här funktionen.
        function getPreferredTheme() {
            const storedTheme = localStorage.getItem(THEME_KEY);
            if (storedTheme === 'dark' || storedTheme === 'light') {
                return storedTheme;
            }

            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }

        // Byter färger mellan ljust och mörkt läge.
        function applyTheme(theme) {
            document.body.classList.toggle('dark-mode', theme === 'dark');
            const toggle = document.getElementById('themeToggle');
            if (toggle) {
                const isDark = theme === 'dark';
                toggle.textContent = isDark ? '☀' : '🌙';
                const nextModeText = isDark ? t('switchToLight') : t('switchToDark');
                toggle.setAttribute('aria-label', nextModeText);
                toggle.setAttribute('title', nextModeText);
            }
        }

        // När du klickar på månen/solen byter den tema.
        function toggleTheme() {
            const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, nextTheme);
            applyTheme(nextTheme);
        }

        // Startar temat.
        function initializeTheme() {
            applyTheme(getPreferredTheme());
        }
        // #endregion

        // #region DAGRENDERING OCH TID
        // Kollar om en dag har något ifyllt alls.
        function hasAnyDayValue(dayData = {}) {
            return Boolean(dayData.bedtime || dayData.waketime || dayData.hours || dayData.notes);
        }

        // Hämtar dagens data: först utkast, annars sparad data.
        function getEffectiveDayData(day) {
            const draft = weekDraftData[day] || {};
            if (hasAnyDayValue(draft)) {
                return draft;
            }

            if (clearedDays.has(day)) {
                return draft;
            }

            const stored = getCurrentWeekData()[day] || {};
            return stored;
        }

        // Ritar knapparna för veckans dagar.
        function renderCalendarStrip() {
            const strip = document.getElementById('calendarStrip');
            if (!strip) {
                return;
            }

            strip.innerHTML = days.map(day => {
                const isActive = day === activeDay;
                const isFilled = hasAnyDayValue(getEffectiveDayData(day));
                return `<button type="button" class="calendar-day-btn${isActive ? ' active' : ''}${isFilled ? ' filled' : ''}" onclick="switchActiveDay('${day}')">${getDayLabel(day).slice(0, 3)}</button>`;
            }).join('');
        }

        // Visar fälten för den dag du just nu tittar på.
        // ÄNDRA HÄR: Placeholder-texter för fälten kommer från I18N-nycklarna notesPlaceholder och hoursPlaceholder.
        function renderDayEditor(day) {
            const editor = document.getElementById('dayEditor');
            if (!editor) {
                return;
            }

            const dayData = getEffectiveDayData(day);
            const hasExistingData = hasAnyDayValue(dayData);
            editor.innerHTML = `
                <div class="day-entry">
                    <div class="day-title">${getDayLabel(day)}</div>
                    <div class="time-row">
                        <div class="input-group">
                            <label>${t('bedTime')}</label>
                            <input type="time" id="active_bedtime" value="${dayData.bedtime || ''}" />
                        </div>
                        <div class="input-group">
                            <label>${t('wakeTime')}</label>
                            <input type="time" id="active_waketime" value="${dayData.waketime || ''}" />
                        </div>
                    </div>
                    <div class="input-group">
                        <label>${t('hoursSlept')}</label>
                        <input type="number" id="active_hours" step="0.5" value="${dayData.hours || ''}" placeholder="${t('hoursPlaceholder')}" />
                    </div>
                    <div class="input-group full">
                        <label>${t('notes')}</label>
                        <textarea id="active_notes" placeholder="${t('notesPlaceholder')}">${dayData.notes || ''}</textarea>
                    </div>
                    <button type="button" class="btn-day-save" onclick="saveSingleDay()">${hasExistingData ? t('updateThisDay') : t('addThisDay')}</button>
                </div>
            `;

            bindSleepTimeAutoCalculation();
            syncActiveSleepHours();
        }

        // Gör om tid som 22:30 till minuter.
        function parseTimeToMinutes(timeValue) {
            if (!timeValue || !timeValue.includes(':')) {
                return null;
            }

            const [hoursText, minutesText] = timeValue.split(':');
            const hours = Number(hoursText);
            const minutes = Number(minutesText);
            if (Number.isNaN(hours) || Number.isNaN(minutes)) {
                return null;
            }

            return (hours * 60) + minutes;
        }

        // Räknar hur många timmar man sov.
        function calculateSleepHours(bedtime, waketime) {
            const bedtimeMinutes = parseTimeToMinutes(bedtime);
            const waketimeMinutes = parseTimeToMinutes(waketime);
            if (bedtimeMinutes === null || waketimeMinutes === null) {
                return '';
            }

            let durationMinutes = waketimeMinutes - bedtimeMinutes;
            if (durationMinutes < 0) {
                durationMinutes += 24 * 60;
            }

            const roundedHours = Math.round((durationMinutes / 60) * 2) / 2;
            return Number.isInteger(roundedHours) ? String(roundedHours) : roundedHours.toFixed(1);
        }

        // Skriver in sömntimmar automatiskt.
        function syncActiveSleepHours() {
            const bedtimeEl = document.getElementById('active_bedtime');
            const waketimeEl = document.getElementById('active_waketime');
            const hoursEl = document.getElementById('active_hours');
            if (!bedtimeEl || !waketimeEl || !hoursEl) {
                return;
            }

            hoursEl.value = calculateSleepHours(bedtimeEl.value, waketimeEl.value);
        }

        // Lyssnar på tidfälten och uppdaterar timmar direkt.
        function bindSleepTimeAutoCalculation() {
            const bedtimeEl = document.getElementById('active_bedtime');
            const waketimeEl = document.getElementById('active_waketime');
            if (!bedtimeEl || !waketimeEl) {
                return;
            }

            bedtimeEl.addEventListener('input', syncActiveSleepHours);
            waketimeEl.addEventListener('input', syncActiveSleepHours);
        }

        // Sparar det du nyss skrev i tillfälligt minne.
        function captureActiveDayInputs() {
            const bedtimeEl = document.getElementById('active_bedtime');
            if (!bedtimeEl) {
                return;
            }

            const nextDayData = {
                bedtime: bedtimeEl.value,
                waketime: document.getElementById('active_waketime').value,
                hours: document.getElementById('active_hours').value,
                notes: document.getElementById('active_notes').value
            };

            weekDraftData[activeDay] = nextDayData;
            if (hasAnyDayValue(nextDayData)) {
                clearedDays.delete(activeDay);
            }
        }

        // Sparar aktuell dag och byter till den dag du klickar på.
        function switchActiveDay(day) {
            captureActiveDayInputs();
            activeDay = day;
            renderCalendarStrip();
            renderDayEditor(day);
        }
        // #endregion
        
        // #region SPARFLÖDE
        // Hämtar den veckodata som finns just nu.
        function getCurrentWeekData() {
            const weekInfo = getWeekDateRange();
            const progressArchive = getProgressArchiveForWeek(weekInfo.key);
            if (progressArchive) {
                return progressArchive.data || {};
            }

            const archives = getAllArchivedWeeks();
            const matchingWeeks = archives.filter(archive => archive.weekKey === weekInfo.key);
            if (matchingWeeks.length > 0) {
                return matchingWeeks[0].data || {};
            }

            const latestArchive = archives[0];
            return latestArchive ? (latestArchive.data || {}) : {};
        }
        
        // Sparar hela veckan när du trycker på Spara vecka.
        async function saveWeekData(event) {
            event.preventDefault();
            archiveEditContext = null;
            captureActiveDayInputs();
            
            const weekInfo = getWeekDateRange();
            const currentData = getCurrentWeekData();
            const data = {};

            days.forEach(day => {
                const draft = weekDraftData[day] || {};
                if (hasAnyDayValue(draft)) {
                    data[day] = draft;
                    return;
                }

                const stored = currentData[day] || {};
                if (hasAnyDayValue(stored)) {
                    data[day] = stored;
                }
            });

            const archives = readArchiveStore();
            archives.push({
                id: generateArchiveId(),
                weekKey: weekInfo.key,
                savedAt: new Date().toISOString(),
                status: ARCHIVE_STATUS.MANUAL,
                data
            });
            writeArchiveStore(archives);

            await showAppAlert(`✅ ${t('weekSaved')}`);
        }
        // #endregion

        // #region ARKIVSTATUS OCH UPPDATERING
        // Kollar om alla 7 dagar finns med.
        function hasFullWeek(data) {
            return days.every(day => Boolean(data[day]));
        }

        // Kollar om en post är en pågående vecka.
        function isProgressArchive(archive) {
            return archive.status === ARCHIVE_STATUS.DRAFT || archive.status === ARCHIVE_STATUS.AUTO;
        }

        // Hämtar senaste pågående sparning för veckan.
        function getProgressArchiveForWeek(weekKey) {
            const archives = readArchiveStore()
                .filter(archive => archive.weekKey === weekKey && isProgressArchive(archive))
                .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
            return archives[0] || null;
        }

        // Uppdaterar veckans pågående sparning när en dag sparas.
        function upsertWeekProgressArchive(weekKey, dayToUpdate, nextDayData) {
            const archives = readArchiveStore();
            const existingIndex = archives.findIndex(archive => (
                archive.weekKey === weekKey &&
                isProgressArchive(archive)
            ));

            const data = existingIndex === -1
                ? {}
                : { ...(archives[existingIndex].data || {}) };

            if (nextDayData && dayToUpdate) {
                data[dayToUpdate] = nextDayData;
            }

            if (Object.keys(data).length === 0) {
                if (existingIndex !== -1) {
                    archives.splice(existingIndex, 1);
                    writeArchiveStore(archives);
                }
                return { status: null };
            }

            const status = hasFullWeek(data) ? ARCHIVE_STATUS.AUTO : ARCHIVE_STATUS.DRAFT;
            const nextEntry = {
                id: existingIndex === -1 ? generateArchiveId() : archives[existingIndex].id,
                weekKey,
                savedAt: new Date().toISOString(),
                status,
                data
            };

            if (existingIndex === -1) {
                archives.push(nextEntry);
            } else {
                archives[existingIndex] = nextEntry;
            }

            writeArchiveStore(archives);
            return { status };
        }

        // Tömmer fälten för en dag.
        function clearDayInputs(day) {
            weekDraftData[day] = {
                bedtime: '',
                waketime: '',
                hours: '',
                notes: ''
            };

            if (day !== activeDay) {
                return;
            }

            document.getElementById('active_bedtime').value = '';
            document.getElementById('active_waketime').value = '';
            document.getElementById('active_hours').value = '';
            document.getElementById('active_notes').value = '';
        }

        // Ändrar en dag i ett redan sparat arkiv.
        function updateArchiveDay(archiveId, day, dayData) {
            const archives = readArchiveStore();
            const archiveIndex = archives.findIndex(archive => archive.id === archiveId);
            if (archiveIndex === -1) {
                return false;
            }

            const archive = archives[archiveIndex];
            archive.data = archive.data || {};
            archive.data[day] = dayData;

            if (isProgressArchive(archive)) {
                archive.status = hasFullWeek(archive.data) ? ARCHIVE_STATUS.AUTO : ARCHIVE_STATUS.DRAFT;
            }

            archive.savedAt = new Date().toISOString();
            archives[archiveIndex] = archive;
            writeArchiveStore(archives);
            return true;
        }
        // #endregion

        // #region FEEDBACK OCH DIALOGER
        // Visar ett litet snabbt meddelande längst ner.
        function showToast(message) {
            let toast = document.getElementById('appToast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'appToast';
                toast.className = 'toast';
                document.body.appendChild(toast);
            }

            toast.textContent = message;
            toast.classList.add('show');

            clearTimeout(showToast.hideTimer);
            showToast.hideTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, 1600);
        }

        // Visar popup-rutan för frågor och meddelanden.
        function showAppDialog(message, confirmMode = false) {
            const overlay = document.getElementById('appModal');
            const messageEl = document.getElementById('appModalMessage');
            const okBtn = document.getElementById('appModalOk');
            const cancelBtn = document.getElementById('appModalCancel');

            if (!overlay || !messageEl || !okBtn || !cancelBtn) {
                return Promise.resolve(confirmMode ? false : true);
            }

            messageEl.textContent = message;
            okBtn.textContent = t('ok');
            cancelBtn.textContent = t('cancel');
            cancelBtn.style.display = confirmMode ? 'inline-flex' : 'none';
            overlay.classList.add('show');

            return new Promise(resolve => {
                const previousOnKeyDown = document.onkeydown;

                const close = (result) => {
                    overlay.classList.remove('show');
                    okBtn.onclick = null;
                    cancelBtn.onclick = null;
                    overlay.onclick = null;
                    document.onkeydown = previousOnKeyDown;
                    resolve(result);
                };

                okBtn.onclick = () => close(true);
                cancelBtn.onclick = () => close(false);

                overlay.onclick = (event) => {
                    if (event.target === overlay && confirmMode) {
                        close(false);
                    }
                };

                document.onkeydown = (event) => {
                    if (event.key === 'Escape') {
                        close(confirmMode ? false : true);
                    }
                };
            });
        }

        // Enkel popup med OK-knapp.
        function showAppAlert(message) {
            return showAppDialog(message, false);
        }

        // Popup med OK och Avbryt.
        function showAppConfirm(message) {
            return showAppDialog(message, true);
        }
        // #endregion

        // #region SPARA ENSKILD DAG
        // Sparar en dag, antingen i veckan eller i arkivet du redigerar.
        async function saveSingleDay() {
            const weekInfo = getWeekDateRange();
            const day = archiveEditContext ? archiveEditContext.day : activeDay;
            const existingStoredDay = archiveEditContext
                ? ((readArchiveStore().find(archive => archive.id === archiveEditContext.archiveId) || {}).data || {})[day] || {}
                : getCurrentWeekData()[day] || {};
            const isUpdate = hasAnyDayValue(existingStoredDay);

            captureActiveDayInputs();
            const dayValues = weekDraftData[day] || {};
            const bedtime = dayValues.bedtime || '';
            const waketime = dayValues.waketime || '';
            const hours = dayValues.hours || '';
            const notes = dayValues.notes || '';

            if (!bedtime && !waketime && !hours && !notes) {
                await showAppAlert(t('emptyDay', { day: getDayLabel(day) }));
                return;
            }

            const dayData = {
                bedtime,
                waketime,
                hours,
                notes
            };

            if (archiveEditContext) {
                const archiveId = archiveEditContext.archiveId;
                const updated = updateArchiveDay(archiveId, day, dayData);
                archiveEditContext = null;
                if (updated) {
                    showToast(t('dayUpdatedArchive', { day: getDayLabel(day) }));
                    showArchive(archiveId);
                }
                return;
            }

            const progress = upsertWeekProgressArchive(weekInfo.key, day, dayData);
            renderCalendarStrip();
            renderDayEditor(day);
            if (progress.status === ARCHIVE_STATUS.AUTO) {
                showToast(t(isUpdate ? 'dayUpdatedFull' : 'dayAddedFull', { day: getDayLabel(day) }));
            } else {
                showToast(t(isUpdate ? 'dayUpdated' : 'dayAdded', { day: getDayLabel(day) }));
            }
        }
        // #endregion

        // #region LAGRING OCH DATAMIGRERING
        // Skapar ett unikt id för en arkivpost.
        function generateArchiveId() {
            return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        }

        // Kollar om texten ser trasig ut (fel teckenkodning).
        function looksLikeMojibake(value) {
            return typeof value === 'string' && /[ÃâÂ]/.test(value);
        }

        // Försöker laga trasig text.
        function repairMojibakeString(value) {
            if (!looksLikeMojibake(value)) {
                return value;
            }

            try {
                const bytes = Uint8Array.from(value, char => char.charCodeAt(0) & 0xff);
                return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
            } catch (error) {
                return value;
            }
        }

        // Går igenom data och lagar trasig text överallt.
        function repairMojibakeInValue(value) {
            if (typeof value === 'string') {
                return repairMojibakeString(value);
            }

            if (Array.isArray(value)) {
                return value.map(item => repairMojibakeInValue(item));
            }

            if (value && typeof value === 'object') {
                const repaired = {};
                Object.keys(value).forEach(key => {
                    repaired[key] = repairMojibakeInValue(value[key]);
                });
                return repaired;
            }

            return value;
        }

        // Skickar tillbaka lagad data och säger om något ändrades.
        function sanitizeArchiveStoreData(archives) {
            const repaired = repairMojibakeInValue(archives);
            const hasChanges = JSON.stringify(repaired) !== JSON.stringify(archives);
            return { repaired, hasChanges };
        }

        function getStorageBackends() {
            const backends = [];

            try {
                if (window.localStorage) {
                    backends.push(window.localStorage);
                }
            } catch (error) {
                // Ignorera om lagring inte är tillgänglig.
            }

            try {
                if (window.sessionStorage) {
                    backends.push(window.sessionStorage);
                }
            } catch (error) {
                // Ignorera om lagring inte är tillgänglig.
            }

            return backends;
        }

        function readStorageValue(storage, key) {
            try {
                return storage.getItem(key);
            } catch (error) {
                return null;
            }
        }

        function writeStorageValue(storage, key, value) {
            try {
                storage.setItem(key, value);
                return true;
            } catch (error) {
                return false;
            }
        }

        // Läser in arkivet från webbläsarens minne.
        function readArchiveStore() {
            const backends = getStorageBackends();
            const rawCandidates = [];

            backends.forEach(storage => {
                const raw = readStorageValue(storage, ARCHIVE_INDEX_KEY);
                if (raw !== null && raw !== '') {
                    rawCandidates.push(raw);
                }
            });

            const backupKey = ARCHIVE_INDEX_KEY + '_backup';
            backends.forEach(storage => {
                const raw = readStorageValue(storage, backupKey);
                if (raw !== null && raw !== '') {
                    rawCandidates.push(raw);
                }
            });

            for (const raw of rawCandidates) {
                try {
                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed)) {
                        continue;
                    }

                    const { repaired, hasChanges } = sanitizeArchiveStoreData(parsed);
                    if (hasChanges) {
                        writeArchiveStore(repaired);
                    }

                    return repaired;
                } catch (error) {
                    // Försök nästa kandidat om denna var trasig.
                }
            }

            return [];
        }

        // Sparar arkivet i webbläsarens minne.
        function writeArchiveStore(archives) {
            const payload = JSON.stringify(archives);
            const backupKey = ARCHIVE_INDEX_KEY + '_backup';
            const backends = getStorageBackends();

            backends.forEach(storage => {
                writeStorageValue(storage, ARCHIVE_INDEX_KEY, payload);
                writeStorageValue(storage, backupKey, payload);
            });
        }

        // Flyttar gammal sparning till nya formatet (bara en gång).
        function migrateLegacyStorage() {
            if (localStorage.getItem(ARCHIVE_INDEX_KEY)) {
                return;
            }

            const legacyEntries = [];
            for (let key in localStorage) {
                if (key.startsWith(STORAGE_KEY) && key !== ARCHIVE_INDEX_KEY) {
                    const weekKey = key.substring(STORAGE_KEY.length);
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        legacyEntries.push({
                            id: generateArchiveId(),
                            weekKey,
                            savedAt: new Date().toISOString(),
                            data
                        });
                    } catch (error) {
                        // Hoppa över gammal data som inte går att läsa.
                    }
                }
            }

            if (legacyEntries.length > 0) {
                writeArchiveStore(legacyEntries);
                legacyEntries.forEach(entry => {
                    localStorage.removeItem(STORAGE_KEY + entry.weekKey);
                });
            }
        }
        
        // Hämtar alla arkiv, nyaste först.
        function getAllArchivedWeeks() {
            const archives = readArchiveStore();
            return archives.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        }

        // Skyddar text så den är säker att visa i HTML.
        function escapeHtml(value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        // #endregion

        // #region ARKIVVY UI
        // Bygger tabellen för den arkivvecka du valt.
        function buildArchiveTable(archive) {
            if (!archive) {
                return `<div class="no-data">${t('noArchiveSelected')}</div>`;
            }

            const statusLabel = getLocalizedStatusLabel(archive.status);
            // Vi räknar ihop alla timmar som finns sparade i veckan.
            const totalHours = days.reduce((sum, day) => {
                // Hämta timmarna för en dag, som text först.
                const rawHours = archive.data?.[day]?.hours;
                // Gör om texten till ett riktigt nummer, även om det står komma i stället för punkt.
                const numericHours = parseFloat(String(rawHours || '').replace(',', '.'));
                // Om det är ett riktigt tal lägger vi till det, annars hoppar vi över dagen.
                return Number.isFinite(numericHours) ? sum + numericHours : sum;
            }, 0);
            // Vi räknar hur många dagar som faktiskt har något ifyllt alls.
            const filledDays = days.reduce((count, day) => {
                // Kolla om dagen har något sparat, inte bara timmar.
                const rawHours = archive.data?.[day]?.hours;
                const hasDayData = Boolean(archive.data?.[day]?.bedtime || archive.data?.[day]?.waketime || archive.data?.[day]?.notes || String(rawHours || '').trim());
                // Om dagen är använd får den räknas med.
                return hasDayData ? count + 1 : count;
            }, 0);
            // Snittet är totalsumman delat på antal använda dagar.
            const averageHours = filledDays > 0 ? totalHours / filledDays : 0;
            // Gör talen fina att visa för människor.
            const totalHoursText = Number.isInteger(totalHours) ? String(totalHours) : totalHours.toFixed(1);
            const averageHoursText = Number.isInteger(averageHours) ? String(averageHours) : averageHours.toFixed(1);
            const targetHours = 49;
            const goalReached = totalHours >= targetHours;
            const goalStatusText = goalReached ? t('weeklyGoalMet') : t('weeklyGoalNotMet');

            // Här börjar själva arkivtabellen.
            let html = `<div style="margin-bottom: 10px; color: var(--text-main); font-weight: bold;">${t('weekPrefix')}: ${escapeHtml(archive.weekKey)} | ${t('typeLabel')}: ${escapeHtml(statusLabel)} | ${t('savedLabel')}: ${new Date(archive.savedAt).toLocaleString()}</div>
                <table>
                    <tr>
                        <th>${t('dayHeader')}</th>
                        <th>${t('bedTime')}</th>
                        <th>${t('wakeTime')}</th>
                        <th>${t('hoursHeader')}</th>
                        <th>${t('notes')}</th>
                        <th class="archive-action-cell">${t('actionHeader')}</th>
                    </tr>`;

            days.forEach(day => {
                // En dag i taget får sin egen rad.
                const dayData = archive.data[day] || {};
                const hasDayData = dayData.bedtime || dayData.waketime || dayData.hours || dayData.notes;
                html += `<tr>
                    <td><strong>${getDayLabel(day)}</strong></td>
                    <td>${escapeHtml(dayData.bedtime) || '-'}</td>
                    <td>${escapeHtml(dayData.waketime) || '-'}</td>
                    <td>${dayData.hours ? escapeHtml(dayData.hours) + 'h' : '-'}</td>
                    <td>${escapeHtml(dayData.notes) || '-'}</td>
                    <td class="archive-action-cell">${hasDayData ? `<span class="archive-action-buttons"><button type="button" class="btn-row-delete" onclick="editDayFromArchive('${archive.id}','${day}')">${t('editDay')}</button><button type="button" class="btn-row-delete" onclick="deleteDayFromArchive('${archive.id}','${day}')">${t('deleteDay')}</button></span>` : '-'}</td>
                </tr>`;
            });

            // Här lägger vi allt på en enda rad så det ser mer samlat ut.
            html += `<tr class="archive-summary-row">
                <td colspan="6">
                    <div class="archive-summary-content">
                        <span class="archive-summary-prefix">${t('weeklySummaryLabel')}:</span>
                        <span class="archive-summary-item">${t('weeklyTotalHours', { hours: totalHoursText })}</span>
                        <span class="archive-summary-item">${t('weeklyAverageHours', { hours: averageHoursText })}</span>
                        <span class="archive-summary-item">${t('weeklyFilledDays', { count: filledDays })}</span>
                        <span class="archive-summary-goal ${goalReached ? 'goal-met' : 'goal-not-met'}">${t('weeklyTargetHours')} · ${goalStatusText}</span>
                    </div>
                </td>
            </tr></table>`;
            return html;
        }

        // Visar om tabellen när du väljer annat arkiv.
        function renderSelectedArchive() {
            const selector = document.getElementById('archiveSelect');
            const archiveContent = document.getElementById('archiveContent');
            if (!selector || !archiveContent) {
                return;
            }

            const archives = getAllArchivedWeeks();
            const selectedId = selector.value;
            const selectedArchive = archives.find(archive => archive.id === selectedId);
            archiveContent.innerHTML = buildArchiveTable(selectedArchive);
        }
        
        // Öppnar arkivsidan och fyller den med innehåll.
        function showArchive(selectedArchiveId = '') {
            const archiveContent = document.getElementById('archiveContent');
            const weeks = getAllArchivedWeeks();
            
            if (weeks.length === 0) {
                archiveContent.innerHTML = `<div class="no-data">${t('noArchive')}</div>`;
            } else {
                const options = weeks.map(archive => {
                    const statusLabel = getLocalizedStatusLabel(archive.status);
                    const label = `${archive.weekKey} - ${statusLabel} - ${new Date(archive.savedAt).toLocaleString()}`;
                    return `<option value="${archive.id}">${escapeHtml(label)}</option>`;
                }).join('');

                archiveContent.innerHTML = `
                    <div class="archive-controls">
                        <label for="archiveSelect">${t('chooseArchive')}</label>
                        <select id="archiveSelect">${options}</select>
                        <button class="btn-delete" onclick="deleteSelectedArchive()">${t('deleteSelected')}</button>
                    </div>
                    <div id="archiveTableWrap"></div>
                `;

                const selector = document.getElementById('archiveSelect');
                if (selectedArchiveId && weeks.some(archive => archive.id === selectedArchiveId)) {
                    selector.value = selectedArchiveId;
                }
                selector.addEventListener('change', () => {
                    const wrapper = document.getElementById('archiveTableWrap');
                    const archives = getAllArchivedWeeks();
                    const selectedArchive = archives.find(archive => archive.id === selector.value);
                    wrapper.innerHTML = buildArchiveTable(selectedArchive);
                });

                const wrapper = document.getElementById('archiveTableWrap');
                const selectedArchive = weeks.find(archive => archive.id === selector.value) || weeks[0];
                wrapper.innerHTML = buildArchiveTable(selectedArchive);
            }
            
            document.getElementById('mainView').style.display = 'none';
            document.getElementById('archiveView').classList.add('show');
        }

        // Tar bort den arkivpost du valt i listan.
        async function deleteSelectedArchive() {
            const selector = document.getElementById('archiveSelect');
            if (!selector) {
                return;
            }

            const selectedId = selector.value;
            if (!selectedId) {
                return;
            }

            const confirmed = await showAppConfirm(t('confirmDeleteArchive'));
            if (!confirmed) {
                return;
            }

            const archives = readArchiveStore().filter(archive => archive.id !== selectedId);
            writeArchiveStore(archives);
            showArchive();
        }

        // Tar bort en dag från ett sparat arkiv.
        async function deleteDayFromArchive(archiveId, day) {
            const confirmed = await showAppConfirm(t('confirmDeleteDay', { day: getDayLabel(day) }));
            if (!confirmed) {
                return;
            }

            const archives = readArchiveStore();
            const archiveIndex = archives.findIndex(archive => archive.id === archiveId);
            if (archiveIndex === -1) {
                return;
            }

            const archive = archives[archiveIndex];
            if (!archive.data || !archive.data[day]) {
                return;
            }

            delete archive.data[day];
            if (archive.status === ARCHIVE_STATUS.AUTO && !hasFullWeek(archive.data)) {
                archive.status = ARCHIVE_STATUS.DRAFT;
            }
            archive.savedAt = new Date().toISOString();

            const hasAnyDay = days.some(d => archive.data[d]);
            if (!hasAnyDay && isProgressArchive(archive)) {
                archives.splice(archiveIndex, 1);
            } else {
                archives[archiveIndex] = archive;
            }

            writeArchiveStore(archives);
            showArchive(archiveId);
            initializeForm();
        }

        // Hämtar en arkivdag tillbaka så du kan ändra den.
        function editDayFromArchive(archiveId, day) {
            const archive = readArchiveStore().find(item => item.id === archiveId);
            if (!archive || !archive.data || !archive.data[day]) {
                return;
            }

            archiveEditContext = { archiveId, day };
            weekDraftData = {
                [day]: {
                    bedtime: archive.data[day].bedtime || '',
                    waketime: archive.data[day].waketime || '',
                    hours: archive.data[day].hours || '',
                    notes: archive.data[day].notes || ''
                }
            };
            activeDay = day;

            backToMain();
            renderCalendarStrip();
            renderDayEditor(day);
        }
        
        // Går från arkiv tillbaka till startsidan.
        function backToMain() {
            document.getElementById('mainView').style.display = 'block';
            document.getElementById('archiveView').classList.remove('show');
        }
        // #endregion
        
        // #region RENSNING OCH UPPSTART
        // Rensar veckans fält efter att du bekräftat.
        async function clearWeek() {
            const confirmed = await showAppConfirm(t('confirmClearWeek'));
            if (!confirmed) {
                return;
            }

            archiveEditContext = null;
            weekDraftData = {};
            clearedDays = new Set(days);
            renderCalendarStrip();
            renderDayEditor(activeDay);
            showToast(t('weekCleared'));
        }
        
        // Detta körs när sidan startar.
        migrateLegacyStorage();
        currentLanguage = getPreferredLanguage();
        initializeTheme();
        document.getElementById('sleepForm').addEventListener('submit', saveWeekData);
        initializeForm();
        applyLanguage();
        // #endregion

