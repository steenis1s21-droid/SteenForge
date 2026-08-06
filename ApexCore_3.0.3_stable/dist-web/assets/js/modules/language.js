(function(global) {
    function getTranslations() {
        return global.ApexTranslations || {};
    }

    function getLang() {
        return localStorage.getItem('appLanguage') || 'sv';
    }

    function setLang(lang, onChange) {
        localStorage.setItem('appLanguage', lang);
        if (typeof onChange === 'function') {
            onChange(lang);
        }
    }

    function getCategoryTexts(lang) {
        if (lang === 'en') {
            return {
                label: 'Category:',
                high: 'High Priority',
                patients: 'Patients',
                authorities: 'Authorities',
                administration: 'Administration',
                private: 'Private',
                games: 'Games',
                other: 'Other',
                highPriority: 'High Priority'
            };
        }
        if (lang === 'da') {
            return {
                label: 'Kategori:',
                high: 'Høj prioritet',
                patients: 'Patienter',
                authorities: 'Myndigheder',
                administration: 'Administration',
                private: 'Privat',
                games: 'Spil',
                other: 'Andet',
                highPriority: 'Hoj prioritet'
            };
        }
        if (lang === 'no') {
            return {
                label: 'Kategori:',
                high: 'Høy prioritet',
                patients: 'Pasienter',
                authorities: 'Myndigheter',
                administration: 'Administrasjon',
                private: 'Privat',
                games: 'Spill',
                other: 'Annet',
                highPriority: 'Hoy prioritet'
            };
        }
        if (lang === 'fi') {
            return {
                label: 'Kategoria:',
                high: 'Korkea prioriteetti',
                patients: 'Potilaat',
                authorities: 'Viranomaiset',
                administration: 'Hallinto',
                private: 'Yksityinen',
                games: 'Pelit',
                other: 'Muu',
                highPriority: 'Korkea prioriteetti'
            };
        }

        return {
            label: 'Kategori:',
            high: 'Hög prioritet',
            patients: 'Patienter',
            authorities: 'Myndigheter',
            administration: 'Administration',
            private: 'Privat',
            games: 'Spel',
            other: 'Övrigt',
            highPriority: 'Hog prioritet'
        };
    }

    function getSortTexts(lang) {
        if (lang === 'en') {
            return {
                dateDesc: 'Newest first',
                dateAsc: 'Oldest first',
                nameAsc: 'Name A-Z',
                nameDesc: 'Name Z-A'
            };
        }
        if (lang === 'da') {
            return {
                dateDesc: 'Nyeste først',
                dateAsc: 'Ældste først',
                nameAsc: 'Navn A-Å',
                nameDesc: 'Navn Å-A'
            };
        }
        if (lang === 'no') {
            return {
                dateDesc: 'Nyeste først',
                dateAsc: 'Eldste først',
                nameAsc: 'Navn A-Å',
                nameDesc: 'Navn Å-A'
            };
        }
        if (lang === 'fi') {
            return {
                dateDesc: 'Uusimmat ensin',
                dateAsc: 'Vanhimmat ensin',
                nameAsc: 'Nimi A-Ö',
                nameDesc: 'Nimi Ö-A'
            };
        }

        return {
            dateDesc: 'Nyast först',
            dateAsc: 'Äldst först',
            nameAsc: 'Namn A-Ö',
            nameDesc: 'Namn Ö-A'
        };
    }

    function getHeaderMenuTexts(lang) {
        if (lang === 'en') {
            return {
                settings: '⚙️ Settings',
                language: '🌍 Language'
            };
        }
        if (lang === 'da') {
            return {
                settings: '⚙️ Indstillinger',
                language: '🌍 Sprog'
            };
        }
        if (lang === 'no') {
            return {
                settings: '⚙️ Innstillinger',
                language: '🌍 Språk'
            };
        }
        if (lang === 'fi') {
            return {
                settings: '⚙️ Asetukset',
                language: '🌍 Kieli'
            };
        }

        return {
            settings: '⚙️ Inställningar',
            language: '🌍 Språk'
        };
    }

    function updateSortLanguageText(lang) {
        var text = getSortTexts(lang || getLang());
        var dateDesc = document.getElementById('sortOptionDateDesc');
        var dateAsc = document.getElementById('sortOptionDateAsc');
        var nameAsc = document.getElementById('sortOptionNameAsc');
        var nameDesc = document.getElementById('sortOptionNameDesc');

        if (dateDesc) dateDesc.textContent = text.dateDesc;
        if (dateAsc) dateAsc.textContent = text.dateAsc;
        if (nameAsc) nameAsc.textContent = text.nameAsc;
        if (nameDesc) nameDesc.textContent = text.nameDesc;
    }

    function getCategoryIcon(categoryKey, normalizeCategoryValue) {
        var normalized = typeof normalizeCategoryValue === 'function'
            ? normalizeCategoryValue(categoryKey)
            : String(categoryKey || '').toLowerCase();

        if (normalized === 'high') return '🔴';
        if (normalized === 'patients') return '🏥';
        if (normalized === 'authorities') return '🏛️';
        if (normalized === 'administration') return '🗂️';
        if (normalized === 'private') return '🏠';
        if (normalized === 'games') return '🎮';
        return '📌';
    }

    function updateCategoryLanguageText(ctx) {
        var text = getCategoryTexts(getLang());
        var normalizeCategoryValue = ctx && ctx.normalizeCategoryValue;

        var icon = function(category) {
            return getCategoryIcon(category, normalizeCategoryValue);
        };

        var categoryLabel = document.getElementById('categoryLabel');
        if (categoryLabel) categoryLabel.textContent = text.label;

        var editCategoryLabel = document.getElementById('editCategoryLabel');
        if (editCategoryLabel) editCategoryLabel.textContent = text.label;

        var categoryOptionHigh = document.getElementById('categoryOptionHigh');
        if (categoryOptionHigh) categoryOptionHigh.textContent = icon('high') + ' ' + text.high;
        var categoryOptionPatients = document.getElementById('categoryOptionPatients');
        if (categoryOptionPatients) categoryOptionPatients.textContent = icon('patients') + ' ' + text.patients;
        var categoryOptionAuthorities = document.getElementById('categoryOptionAuthorities');
        if (categoryOptionAuthorities) categoryOptionAuthorities.textContent = icon('authorities') + ' ' + text.authorities;
        var categoryOptionAdministration = document.getElementById('categoryOptionAdministration');
        if (categoryOptionAdministration) categoryOptionAdministration.textContent = icon('administration') + ' ' + text.administration;
        var categoryOptionPrivate = document.getElementById('categoryOptionPrivate');
        if (categoryOptionPrivate) categoryOptionPrivate.textContent = icon('private') + ' ' + text.private;
        var categoryOptionGames = document.getElementById('categoryOptionGames');
        if (categoryOptionGames) categoryOptionGames.textContent = icon('games') + ' ' + text.games;
        var categoryOptionOther = document.getElementById('categoryOptionOther');
        if (categoryOptionOther) categoryOptionOther.textContent = icon('other') + ' ' + text.other;

        var editCategoryOptionHigh = document.getElementById('editCategoryOptionHigh');
        if (editCategoryOptionHigh) editCategoryOptionHigh.textContent = icon('high') + ' ' + text.high;
        var editCategoryOptionPatients = document.getElementById('editCategoryOptionPatients');
        if (editCategoryOptionPatients) editCategoryOptionPatients.textContent = icon('patients') + ' ' + text.patients;
        var editCategoryOptionAuthorities = document.getElementById('editCategoryOptionAuthorities');
        if (editCategoryOptionAuthorities) editCategoryOptionAuthorities.textContent = icon('authorities') + ' ' + text.authorities;
        var editCategoryOptionAdministration = document.getElementById('editCategoryOptionAdministration');
        if (editCategoryOptionAdministration) editCategoryOptionAdministration.textContent = icon('administration') + ' ' + text.administration;
        var editCategoryOptionPrivate = document.getElementById('editCategoryOptionPrivate');
        if (editCategoryOptionPrivate) editCategoryOptionPrivate.textContent = icon('private') + ' ' + text.private;
        var editCategoryOptionGames = document.getElementById('editCategoryOptionGames');
        if (editCategoryOptionGames) editCategoryOptionGames.textContent = icon('games') + ' ' + text.games;
        var editCategoryOptionOther = document.getElementById('editCategoryOptionOther');
        if (editCategoryOptionOther) editCategoryOptionOther.textContent = icon('other') + ' ' + text.other;
    }

    function t(key) {
        var lang = getLang();
        var parts = key.split('.');
        var value = getTranslations()[lang] || getTranslations().sv || {};
        for (var i = 0; i < parts.length; i += 1) {
            var part = parts[i];
            if (value && value[part] !== undefined) {
                value = value[part];
            } else {
                return key;
            }
        }
        return value || key;
    }

    function getBackupUiText(lang) {
        if (lang === 'en') {
            return {
                importDryRun: 'Dry-run import',
                validateBackup: 'Validate backup',
                restoreSafety: 'Restore safety',
                backupToggleShow: 'Show backup status',
                backupToggleHide: 'Hide backup status',
                recoveryCenterTitle: 'Recovery Center',
                recoveryToggleShow: 'Show Recovery Center',
                recoveryToggleHide: 'Hide Recovery Center',
                recoveryLastExport: 'Last export',
                recoveryLastImport: 'Last import',
                recoverySafetySnapshot: 'Safety snapshot',
                recoveryNoData: 'No data',
                healthTitle: 'Backup health',
                crypto: 'Crypto',
                storage: 'Storage',
                exportStatus: 'Export',
                importStatus: 'Import',
                ok: 'OK',
                warn: 'Warning',
                error: 'Error',
                unknown: 'Unknown',
                dryRunSummary: 'Dry-run: {type} with {active} active, {done} done, {archived} archived.',
                dryRunVaultSummary: 'Dry-run: archive vault with {archived} archived items.',
                validateBackupSuccess: '✅ Backup validation passed.',
                importInvalidVersion: 'Unsupported backup version.',
                importInvalidStructure: 'Backup file is missing required fields.',
                importWrongPassword: 'Wrong password or corrupt file.',
                autoSafetySaved: 'Automatic safety snapshot saved before clearing archive.',
                autoSafetyMissing: 'No safety snapshot available.',
                autoSafetyRestored: '✅ Safety snapshot restored ({count} archived items).',
                importPreviewTitle: 'Import preview',
                importPreviewContinue: 'Continue import?',
                importCancelled: 'Import cancelled before writing data.',
                replacePrompt: 'Type REPLACE to confirm full replacement:',
                replacePromptFailed: 'Replacement cancelled because confirmation phrase did not match.',
                duplicateSkipped: 'Skipped {count} duplicate archive items during import.'
            };
        }

        return {
            importDryRun: 'Torrkör import',
            validateBackup: 'Validera backup',
            restoreSafety: 'Återställ safety',
            backupToggleShow: 'Visa backupstatus',
            backupToggleHide: 'Dölj backupstatus',
            recoveryCenterTitle: 'Recovery Center',
            recoveryToggleShow: 'Visa Recovery Center',
            recoveryToggleHide: 'Dölj Recovery Center',
            recoveryLastExport: 'Senaste export',
            recoveryLastImport: 'Senaste import',
            recoverySafetySnapshot: 'Safety snapshot',
            recoveryNoData: 'Ingen data',
            healthTitle: 'Backupstatus',
            crypto: 'Crypto',
            storage: 'Lagring',
            exportStatus: 'Export',
            importStatus: 'Import',
            ok: 'OK',
            warn: 'Varning',
            error: 'Fel',
            unknown: 'Okänd',
            dryRunSummary: 'Torrkörning: {type} med {active} aktiva, {done} färdiga, {archived} arkiverade.',
            dryRunVaultSummary: 'Torrkörning: arkiv-vault med {archived} arkiverade poster.',
            validateBackupSuccess: '✅ Backupvalidering lyckades.',
            importInvalidVersion: 'Backupfilens version stöds inte.',
            importInvalidStructure: 'Backupfilen saknar nödvändiga fält.',
            importWrongPassword: 'Fel lösenord eller korrupt fil.',
            autoSafetySaved: 'Automatisk säkerhetskopia sparades före arkivrensning.',
            autoSafetyMissing: 'Ingen safety-snapshot tillgänglig.',
            autoSafetyRestored: '✅ Safety-snapshot återställd ({count} arkiverade poster).',
            importPreviewTitle: 'Importförhandsgranskning',
            importPreviewContinue: 'Fortsätt importen?',
            importCancelled: 'Importen avbröts innan data skrevs.',
            replacePrompt: 'Skriv ERSÄTT för att bekräfta total ersättning:',
            replacePromptFailed: 'Ersättning avbröts eftersom bekräftelsetexten inte stämde.',
            duplicateSkipped: 'Hoppade över {count} dubbletter vid arkivimport.'
        };
    }

    function toggleLanguageMenu() {
        var dropdown = document.getElementById('languageDropdown');
        if (!dropdown) return;
        dropdown.classList.toggle('show');
    }

    function updateLanguageMenu(lang) {
        var selected = lang || getLang();
        document.querySelectorAll('.language-dropdown button').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === selected);
        });
    }

    function changeLanguage(lang, ctx) {
        var deps = ctx || {};
        if (typeof deps.setLang === 'function') deps.setLang(lang);
        if (typeof deps.updateLanguageMenu === 'function') deps.updateLanguageMenu();

        var dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.classList.remove('show');
        if (typeof global.closeSettingsMenu === 'function') global.closeSettingsMenu();

        if (typeof deps.applyLanguage === 'function') deps.applyLanguage();
    }

    function applyLanguage(ctx) {
        var deps = ctx || {};
        var translate = typeof deps.t === 'function' ? deps.t : t;
        var headerMenuText = getHeaderMenuTexts(getLang());

        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var text = translate(key);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });

        var setText = function(id, key) {
            var el = document.getElementById(id);
            if (el) el.textContent = translate(key);
        };

        var setPlaceholder = function(id, key) {
            var el = document.getElementById(id);
            if (el) el.placeholder = translate(key);
        };

        setText('loginTitle', 'loginTitle');
        setText('loginBtn', 'loginBtn');
        setPlaceholder('passwordInput', 'loginPlaceholder');

        setText('changePwTitle', 'changePwTitle');
        setPlaceholder('oldPassword', 'oldPwPlaceholder');
        setPlaceholder('newPassword1', 'newPwPlaceholder');
        setPlaceholder('newPassword2', 'confirmPwPlaceholder');
        setText('savePwBtn', 'savePwBtn');
        setText('cancelPwBtn', 'cancelPwBtn');

        setText('subtitleSlogan', 'slogan');
        setText('changePwBtn', 'changePwBtn');
        setText('archiveBtn', 'archiveBtn');
        setText('logoutBtn', 'logoutBtn');

        setText('exportJsonBtn', 'exportJson');
        setText('exportEncryptedBtn', 'exportEncrypted');
        setText('exportCsvBtn', 'exportCsv');
        setText('importBtn', 'importBtn');
        setText('phonebookBtn', 'phonebookBtn');
        setText('phonebookTitle', 'phonebookTitle');
        setText('phonebookNameLabel', 'phonebookNameLabel');
        setText('phonebookCategoryLabel', 'phonebookCategoryLabel');
        setText('phonebookCategoryOptionPatients', 'phonebookCategoryPatients');
        setText('phonebookCategoryOptionAuthorities', 'phonebookCategoryAuthorities');
        setText('phonebookCategoryOptionPrivate', 'phonebookCategoryPrivate');
        setText('phonebookCategoryOptionOther', 'phonebookCategoryOther');
        setText('phonebookPhoneLabel', 'phonebookPhoneLabel');
        setText('phonebookAddBtn', 'phonebookAddBtn');
        setText('phonebookCloseBtn', 'phonebookCloseBtn');
        setPlaceholder('phonebookName', 'phonebookNamePlaceholder');
        setPlaceholder('phonebookPhone', 'phonebookPhonePlaceholder');
        setPlaceholder('phonebookSearch', 'phonebookSearchPlaceholder');
        var settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.textContent = headerMenuText.settings;
        var languageBtn = document.getElementById('languageBtn');
        if (languageBtn) languageBtn.textContent = headerMenuText.language;

        var backupText = typeof deps.getBackupUiText === 'function' ? deps.getBackupUiText() : getBackupUiText(getLang());
        var importDryRunBtn = document.getElementById('importDryRunBtn');
        if (importDryRunBtn) importDryRunBtn.textContent = backupText.importDryRun;
        var validateBackupBtn = document.getElementById('validateBackupBtn');
        if (validateBackupBtn) validateBackupBtn.textContent = backupText.validateBackup;

        if (typeof deps.updateBackupHealthPanel === 'function') deps.updateBackupHealthPanel();
        if (typeof deps.updateBackupHealthToggleButton === 'function') deps.updateBackupHealthToggleButton();
        if (typeof deps.updateRecoveryCenterPanel === 'function') deps.updateRecoveryCenterPanel();

        setPlaceholder('searchInput', 'searchActive');
        setPlaceholder('doneSearchInput', 'archiveSearch');
        setText('archiveAllBtn', 'archiveAllBtn');

        setText('undoText', 'undoText');
        setText('undoBtn', 'undoBtn');

        setText('footerText', 'footerText');
        setText('infoTitle', 'infoTitle');

        if (typeof deps.updateAdminPanelLanguage === 'function') deps.updateAdminPanelLanguage();
        if (typeof deps.renderInfoContent === 'function') deps.renderInfoContent();

        var archiveTitle = document.getElementById('archiveTitle');
        if (archiveTitle) {
            var archivedCount = typeof deps.getArchivedItemsCount === 'function' ? deps.getArchivedItemsCount() : 0;
            archiveTitle.textContent = translate('archiveModalTitle') + ' (' + archivedCount + ')';
        }

        setPlaceholder('archiveSearch', 'archiveSearch');
        setText('archiveVaultBtn', 'archiveVaultBtn');

        var archiveRestoreSafetyBtn = document.getElementById('archiveRestoreSafetyBtn');
        if (archiveRestoreSafetyBtn) archiveRestoreSafetyBtn.textContent = backupText.restoreSafety;

        var sideArchiveRestoreSafetyBtn = document.getElementById('sideArchiveRestoreSafetyBtn');
        if (sideArchiveRestoreSafetyBtn) sideArchiveRestoreSafetyBtn.textContent = backupText.restoreSafety;

        setText('archiveClearBtn', 'archiveClear');
        setText('sideArchiveClearBtn', 'archiveClear');
        setText('archiveCloseBtn', 'archiveClose');

        if (typeof deps.updateAutoSafetyRestoreButtons === 'function') deps.updateAutoSafetyRestoreButtons();
        if (typeof deps.updateRecoveryCenterPanel === 'function') deps.updateRecoveryCenterPanel();
        if (typeof deps.updateReminderLanguageText === 'function') deps.updateReminderLanguageText();
        if (typeof deps.updateCategoryLanguageText === 'function') deps.updateCategoryLanguageText();
        if (typeof deps.updateSortLanguageText === 'function') deps.updateSortLanguageText();
        if (typeof global.updateSoundButton === 'function') global.updateSoundButton();
        if (typeof global.updateThemeButton === 'function') global.updateThemeButton();
        if (typeof global.renderPhonebookPanel === 'function') global.renderPhonebookPanel();

        var statusDiv = document.getElementById('loginStatus');
        if (statusDiv) {
            if (typeof deps.isFirstTimeUser === 'function' && deps.isFirstTimeUser()) {
                statusDiv.textContent = translate('loginStatusWelcome');
            } else if (typeof deps.isAppHidden === 'function' && !deps.isAppHidden()) {
                // Keep current status text while app is open.
            } else {
                statusDiv.textContent = translate('loginStatusLogin');
            }
        }

        if (typeof deps.render === 'function') deps.render();
    }

    function updateAdminPanelLanguage(ctx) {
        var deps = ctx || {};
        var translate = typeof deps.t === 'function' ? deps.t : t;

        var setText = function(id, key) {
            var el = document.getElementById(id);
            if (el) el.textContent = translate(key);
        };

        var setPlaceholder = function(id, key) {
            var el = document.getElementById(id);
            if (el) el.placeholder = translate(key);
        };

        setText('adminLoginTitle', 'adminLoginTitle');
        setText('adminLoginDesc', 'adminLoginDesc');
        setPlaceholder('adminPasswordInput', 'adminLoginPasswordPlaceholder');
        setText('adminLoginButton', 'adminLoginButton');
        setText('adminLoginCancel', 'adminLoginCancel');

        setText('adminPanelTitle', 'adminPanelTitle');
        setText('adminPanelIntro', 'adminPanelIntro');
        setText('adminTitleLabel', 'adminTitleLabel');
        setPlaceholder('adminTitle', 'adminTitlePlaceholder');
        setText('adminDescLabel', 'adminDescLabel');
        setPlaceholder('adminDesc', 'adminDescPlaceholder');
        setText('adminTypeLabel', 'adminTypeLabel');
        setText('adminTypeNewOption', 'adminTypeNew');
        setText('adminTypeUpdateOption', 'adminTypeUpdate');
        setText('adminTypeBugFixOption', 'adminTypeBugFix');
        setText('adminTypePlanOption', 'adminTypePlan');
        setText('adminDateLabel', 'adminDateLabel');
        setText('adminAddButton', 'adminAddButton');
        setText('adminSaveButton', 'adminSaveButton');
        setText('adminCloseButton', 'adminCloseButton');
        setText('adminCurrentTitle', 'adminCurrentTitle');

        var adminPanel = document.getElementById('adminPanel');
        if (adminPanel && adminPanel.style.display === 'flex' && typeof deps.renderAdminList === 'function') {
            deps.renderAdminList();
        }
    }

    function registerOutsideClickClose() {
        document.addEventListener('click', function(e) {
            var wrapper = document.querySelector('.language-wrapper');
            var dropdown = document.getElementById('languageDropdown');
            if (!wrapper || !dropdown) return;
            if (!wrapper.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    registerOutsideClickClose();

    global.ApexLanguageModule = {
        getLang: getLang,
        setLang: setLang,
        getCategoryTexts: getCategoryTexts,
        getSortTexts: getSortTexts,
        updateSortLanguageText: updateSortLanguageText,
        getCategoryIcon: getCategoryIcon,
        updateCategoryLanguageText: updateCategoryLanguageText,
        t: t,
        getBackupUiText: getBackupUiText,
        toggleLanguageMenu: toggleLanguageMenu,
        updateLanguageMenu: updateLanguageMenu,
        changeLanguage: changeLanguage,
        applyLanguage: applyLanguage,
        updateAdminPanelLanguage: updateAdminPanelLanguage
    };
})(window);
