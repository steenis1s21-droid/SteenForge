(function(global) {
    var RECOVERY_CENTER_STORAGE_KEY = 'recoveryCenterState';

    function readRecoveryState() {
        try {
            var raw = localStorage.getItem(RECOVERY_CENTER_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (error) {
            return {};
        }
    }

    function writeRecoveryState(state) {
        try {
            localStorage.setItem(RECOVERY_CENTER_STORAGE_KEY, JSON.stringify(state || {}));
        } catch (error) {
            // ignore localStorage write errors
        }
    }

    function setRecoveryEntry(key, payload) {
        var current = readRecoveryState();
        current[key] = Object.assign({
            at: new Date().toISOString()
        }, payload || {});
        writeRecoveryState(current);
        return current;
    }

    function markExportSuccess(kind, count) {
        return setRecoveryEntry('lastExport', {
            kind: kind || 'unknown',
            count: typeof count === 'number' ? count : null,
            status: 'success'
        });
    }

    function markImportSuccess(mode, counts) {
        return setRecoveryEntry('lastImport', {
            mode: mode || 'unknown',
            counts: counts || null,
            status: 'success'
        });
    }

    function markSafetySnapshot(action, count) {
        return setRecoveryEntry('safetySnapshot', {
            action: action || 'updated',
            count: typeof count === 'number' ? count : null,
            status: 'success'
        });
    }

    function buildVaultPreviewMessage(options) {
        var opts = options || {};
        var lang = opts.lang || 'sv';
        var title = opts.title || (lang === 'en' ? 'Import preview' : 'Importforhandsgranskning');
        var continueText = opts.continueText || (lang === 'en' ? 'Continue import?' : 'Fortsatt import?');

        if (lang === 'en') {
            return '🔎 ' + title + '\n\n'
                + 'Vault import:\n'
                + '📦 Current archive: ' + opts.beforeArchive + '\n'
                + '📥 Incoming archived: ' + opts.incomingCount + '\n'
                + '➕ Unique to add: ' + opts.uniqueCount + '\n'
                + '⚠️ Duplicates skipped: ' + opts.duplicateCount + '\n'
                + '📊 Archive after import: ' + opts.afterArchive + '\n\n'
                + continueText;
        }

        return '🔎 ' + title + '\n\n'
            + 'Vault-import:\n'
            + '📦 Nuvarande arkiv: ' + opts.beforeArchive + '\n'
            + '📥 Inkommande arkivposter: ' + opts.incomingCount + '\n'
            + '➕ Unika att lagga till: ' + opts.uniqueCount + '\n'
            + '⚠️ Dubbletter som hoppas over: ' + opts.duplicateCount + '\n'
            + '📊 Arkiv efter import: ' + opts.afterArchive + '\n\n'
            + continueText;
    }

    function buildFullPreviewMessage(options) {
        var opts = options || {};
        var lang = opts.lang || 'sv';
        var title = opts.title || (lang === 'en' ? 'Import preview' : 'Importforhandsgranskning');
        var continueText = opts.continueText || (lang === 'en' ? 'Continue import?' : 'Fortsatt import?');

        if (lang === 'en') {
            return '🔎 ' + title + '\n\n'
                + 'Current data:\n'
                + '📋 Active: ' + opts.currentActive + '\n'
                + '✅ Done: ' + opts.currentDone + '\n'
                + '📦 Archive: ' + opts.currentArchived + '\n\n'
                + 'Incoming backup:\n'
                + '📋 Active: ' + opts.incomingActive + '\n'
                + '✅ Done: ' + opts.incomingDone + '\n'
                + '📦 Archive: ' + opts.incomingArchived + '\n\n'
                + 'If you later choose REPLACE in next step:\n'
                + '📊 Result: ' + opts.incomingActive + ' / ' + opts.incomingDone + ' / ' + opts.incomingArchived + '\n\n'
                + 'If you later choose ADD in next step:\n'
                + '📊 Result: ' + opts.addActive + ' / ' + opts.addDone + ' / ' + opts.addArchived + '\n\n'
                + continueText;
        }

        return '🔎 ' + title + '\n\n'
            + 'Nuvarande data:\n'
            + '📋 Aktiv: ' + opts.currentActive + '\n'
            + '✅ Fardig: ' + opts.currentDone + '\n'
            + '📦 Arkiv: ' + opts.currentArchived + '\n\n'
            + 'Inkommande backup:\n'
            + '📋 Aktiv: ' + opts.incomingActive + '\n'
            + '✅ Fardig: ' + opts.incomingDone + '\n'
            + '📦 Arkiv: ' + opts.incomingArchived + '\n\n'
            + 'Om du valjer ERSATT i nasta steg:\n'
            + '📊 Resultat: ' + opts.incomingActive + ' / ' + opts.incomingDone + ' / ' + opts.incomingArchived + '\n\n'
            + 'Om du valjer LAGG TILL i nasta steg:\n'
            + '📊 Resultat: ' + opts.addActive + ' / ' + opts.addDone + ' / ' + opts.addArchived + '\n\n'
            + continueText;
    }

    function getReplaceToken(lang) {
        return lang === 'sv' ? 'ERSÄTT' : 'REPLACE';
    }

    global.ImportExportModule = {
        readRecoveryState: readRecoveryState,
        writeRecoveryState: writeRecoveryState,
        markExportSuccess: markExportSuccess,
        markImportSuccess: markImportSuccess,
        markSafetySnapshot: markSafetySnapshot,
        buildVaultPreviewMessage: buildVaultPreviewMessage,
        buildFullPreviewMessage: buildFullPreviewMessage,
        getReplaceToken: getReplaceToken
    };
})(window);
