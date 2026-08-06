(function(global) {
    var isRecoveryCenterOpen = false;
    var isBackupHealthOpen = false;

    function readBackupHealthState(storageKey) {
        try {
            var raw = localStorage.getItem(storageKey || 'backupHealthState');
            return raw ? JSON.parse(raw) : {};
        } catch (error) {
            return {};
        }
    }

    function writeBackupHealthState(state, storageKey) {
        try {
            localStorage.setItem(storageKey || 'backupHealthState', JSON.stringify(state || {}));
        } catch (error) {
            // ignore localStorage write failures
        }
    }

    function setBackupHealthStatus(ctx, key, status, detail) {
        var current = readBackupHealthState(ctx.backupHealthStorageKey);
        current[key] = {
            status: status,
            detail: detail || '',
            at: new Date().toISOString()
        };
        writeBackupHealthState(current, ctx.backupHealthStorageKey);
        updateBackupHealthPanel(ctx);
    }

    function testStorageAvailability() {
        try {
            var probeKey = '__apexcore_backup_probe__';
            localStorage.setItem(probeKey, '1');
            localStorage.removeItem(probeKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    function updateHealthChip(id, label, statusEntry, backupText) {
        var el = document.getElementById(id);
        if (!el) return;

        var status = statusEntry && statusEntry.status ? statusEntry.status : 'unknown';
        var detail = statusEntry && statusEntry.detail ? statusEntry.detail : '';

        var statusText = backupText.unknown;
        if (status === 'ok') statusText = backupText.ok;
        if (status === 'warn') statusText = backupText.warn;
        if (status === 'error') statusText = backupText.error;

        el.className = 'health-chip ' + status;
        el.textContent = label + ': ' + statusText + (detail ? ' - ' + detail : '');
    }

    function updateBackupHealthPanel(ctx) {
        var panel = document.getElementById('backupHealthPanel');
        if (!panel) return;

        var backupText = ctx.getBackupUiText();
        var title = panel.querySelector('.backup-health-title');
        if (title) title.textContent = backupText.healthTitle;

        var state = readBackupHealthState(ctx.backupHealthStorageKey);

        updateHealthChip('healthCrypto', backupText.crypto, state.crypto, backupText);
        updateHealthChip('healthStorage', backupText.storage, state.storage, backupText);
        updateHealthChip('healthExport', backupText.exportStatus, state.export, backupText);
        updateHealthChip('healthImport', backupText.importStatus, state.import, backupText);

        updateBackupHealthToggleButton(ctx);
    }

    function initBackupHealthPanel(ctx) {
        var storageOk = testStorageAvailability();
        setBackupHealthStatus(ctx, 'crypto', typeof CryptoJS !== 'undefined' ? 'ok' : 'error', typeof CryptoJS !== 'undefined' ? '' : 'CryptoJS');
        setBackupHealthStatus(ctx, 'storage', storageOk ? 'ok' : 'error', storageOk ? '' : 'localStorage');
        updateBackupHealthPanel(ctx);
    }

    function updateBackupHealthToggleButton(ctx) {
        var button = document.getElementById('backupHealthToggleBtn');
        if (!button) return;

        var backupText = ctx.getBackupUiText();
        button.textContent = isBackupHealthOpen
            ? backupText.backupToggleHide
            : backupText.backupToggleShow;
    }

    function setBackupHealthOpenState(ctx, nextOpen) {
        isBackupHealthOpen = !!nextOpen;

        var panel = document.getElementById('backupHealthPanel');
        if (panel) {
            panel.classList.toggle('hidden', !isBackupHealthOpen);
        }

        updateBackupHealthToggleButton(ctx);
    }

    function toggleBackupHealthPanel(ctx) {
        setBackupHealthOpenState(ctx, !isBackupHealthOpen);
    }

    function formatRecoveryEntry(entry, fallback) {
        if (!entry) return fallback;

        var atText = entry.at ? new Date(entry.at).toLocaleString() : '-';
        var detail = '';

        if (entry.kind) detail = entry.kind;
        if (entry.mode) detail = entry.mode;
        if (entry.action) detail = entry.action;
        if (typeof entry.count === 'number') detail = (detail ? detail + ', ' : '') + entry.count;
        if (entry.counts && typeof entry.counts === 'object') {
            var c = entry.counts;
            detail = (detail ? detail + ', ' : '') + [c.active || 0, c.done || 0, c.archived || 0].join('/');
        }

        return atText + (detail ? ' - ' + detail : '');
    }

    function updateRecoveryCenterPanel(ctx) {
        var panel = document.getElementById('recoveryCenterPanel');
        if (!panel) return;

        var backupText = ctx.getBackupUiText();
        var moduleApi = ctx.getImportExportModule();
        var state = moduleApi && typeof moduleApi.readRecoveryState === 'function'
            ? moduleApi.readRecoveryState()
            : {};

        var title = document.getElementById('recoveryCenterTitle');
        if (title) title.textContent = backupText.recoveryCenterTitle;

        var exportLine = document.getElementById('recoveryLastExport');
        if (exportLine) {
            exportLine.textContent = backupText.recoveryLastExport + ': ' + formatRecoveryEntry(state.lastExport, backupText.recoveryNoData);
        }

        var importLine = document.getElementById('recoveryLastImport');
        if (importLine) {
            importLine.textContent = backupText.recoveryLastImport + ': ' + formatRecoveryEntry(state.lastImport, backupText.recoveryNoData);
        }

        var safetyLine = document.getElementById('recoverySafetySnapshot');
        if (safetyLine) {
            safetyLine.textContent = backupText.recoverySafetySnapshot + ': ' + formatRecoveryEntry(state.safetySnapshot, backupText.recoveryNoData);
        }

        updateRecoveryCenterToggleButton(ctx);
    }

    function updateRecoveryCenterToggleButton(ctx) {
        var button = document.getElementById('recoveryToggleBtn');
        if (!button) return;

        var backupText = ctx.getBackupUiText();
        button.textContent = isRecoveryCenterOpen
            ? backupText.recoveryToggleHide
            : backupText.recoveryToggleShow;
    }

    function setRecoveryCenterOpenState(ctx, nextOpen) {
        isRecoveryCenterOpen = !!nextOpen;

        var panel = document.getElementById('recoveryCenterPanel');
        if (panel) {
            panel.classList.toggle('hidden', !isRecoveryCenterOpen);
        }

        updateRecoveryCenterToggleButton(ctx);
    }

    function toggleRecoveryCenterPanel(ctx) {
        setRecoveryCenterOpenState(ctx, !isRecoveryCenterOpen);
    }

    function hasAutoSafetySnapshot() {
        try {
            var raw = localStorage.getItem('archiveAutoSafetyBackup');
            if (!raw) return false;
            var parsed = JSON.parse(raw);
            return parsed && Array.isArray(parsed.archivedItems);
        } catch (error) {
            return false;
        }
    }

    function updateAutoSafetyRestoreButtons(ctx) {
        var hasSnapshot = hasAutoSafetySnapshot();
        var lang = ctx.getLang();

        ['archiveRestoreSafetyBtn', 'sideArchiveRestoreSafetyBtn'].forEach(function(id) {
            var btn = document.getElementById(id);
            if (!btn) return;
            btn.disabled = false;
            btn.style.opacity = hasSnapshot ? '1' : '0.65';
            btn.title = hasSnapshot
                ? (lang === 'en' ? 'Restore saved safety snapshot' : 'Återställ sparad safety-snapshot')
                : (lang === 'en' ? 'No snapshot available yet. Clear archive once to create one.' : 'Ingen snapshot finns ännu. Rensa arkivet en gång för att skapa en.');
        });
    }

    function saveAutoSafetySnapshot(ctx) {
        var archivedItems = ctx.getArchivedItems();
        var snapshot = {
            archivedItems: archivedItems,
            adminUpdates: ctx.getAdminUpdates(),
            exportedAt: new Date().toISOString(),
            version: ctx.legacyBackupVersion,
            formatVersion: ctx.backupFormatVersion,
            source: 'auto-safety-archive-clear'
        };

        try {
            localStorage.setItem('archiveAutoSafetyBackup', JSON.stringify(snapshot));
            setBackupHealthStatus(ctx, 'export', 'warn', 'auto safety backup');
            updateAutoSafetyRestoreButtons(ctx);

            var moduleApi = ctx.getImportExportModule();
            if (moduleApi && typeof moduleApi.markSafetySnapshot === 'function') {
                moduleApi.markSafetySnapshot('created', archivedItems.length);
                updateRecoveryCenterPanel(ctx);
            }

            ctx.showMessage(ctx.getBackupUiText().autoSafetySaved, 'info');
        } catch (error) {
            setBackupHealthStatus(ctx, 'export', 'error', 'auto safety backup failed');
            console.warn('Auto safety snapshot failed:', error);
        }
    }

    function restoreAutoSafetySnapshot(ctx) {
        var raw = localStorage.getItem('archiveAutoSafetyBackup');
        if (!raw) {
            ctx.showMessage(ctx.getBackupUiText().autoSafetyMissing, 'info');
            updateAutoSafetyRestoreButtons(ctx);
            return;
        }

        var parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            ctx.showMessage(ctx.getBackupUiText().autoSafetyMissing, 'error');
            updateAutoSafetyRestoreButtons(ctx);
            return;
        }

        if (!parsed || !Array.isArray(parsed.archivedItems)) {
            ctx.showMessage(ctx.getBackupUiText().autoSafetyMissing, 'error');
            updateAutoSafetyRestoreButtons(ctx);
            return;
        }

        var exportedAtText = parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString() : '-';
        var confirmText = (ctx.getLang() === 'en'
            ? 'Restore safety snapshot from ' + exportedAtText + '?\n\nArchived items: ' + parsed.archivedItems.length
            : 'Återställ safety-snapshot från ' + exportedAtText + '?\n\nArkiverade poster: ' + parsed.archivedItems.length);

        if (!confirm(confirmText)) {
            return;
        }

        ctx.setArchivedItems(parsed.archivedItems.map(ctx.normalizeItemData));

        if (Array.isArray(parsed.adminUpdates)) {
            ctx.saveAdminUpdates(ctx.dedupeAdminUpdates(parsed.adminUpdates));
            if (typeof ctx.renderInfoContent === 'function') {
                ctx.renderInfoContent();
            }
            if (typeof ctx.renderAdminList === 'function') {
                ctx.renderAdminList();
            }
        }

        ctx.saveData();
        ctx.render();
        ctx.renderArchive();
        setBackupHealthStatus(ctx, 'import', 'ok', 'safety restored');
        updateAutoSafetyRestoreButtons(ctx);

        var moduleApi = ctx.getImportExportModule();
        if (moduleApi && typeof moduleApi.markSafetySnapshot === 'function') {
            moduleApi.markSafetySnapshot('restored', ctx.getArchivedItems().length);
        }
        if (moduleApi && typeof moduleApi.markImportSuccess === 'function') {
            moduleApi.markImportSuccess('safety-restore', {
                active: ctx.getItems().length,
                done: ctx.getDoneItems().length,
                archived: ctx.getArchivedItems().length
            });
        }

        updateRecoveryCenterPanel(ctx);
        ctx.showMessage(ctx.getBackupUiText().autoSafetyRestored.replace('{count}', ctx.getArchivedItems().length), 'success');
    }

    global.ApexBackupRecoveryModule = {
        readBackupHealthState: readBackupHealthState,
        writeBackupHealthState: writeBackupHealthState,
        setBackupHealthStatus: setBackupHealthStatus,
        testStorageAvailability: testStorageAvailability,
        updateBackupHealthPanel: updateBackupHealthPanel,
        initBackupHealthPanel: initBackupHealthPanel,
        updateBackupHealthToggleButton: updateBackupHealthToggleButton,
        setBackupHealthOpenState: setBackupHealthOpenState,
        toggleBackupHealthPanel: toggleBackupHealthPanel,
        formatRecoveryEntry: formatRecoveryEntry,
        updateRecoveryCenterPanel: updateRecoveryCenterPanel,
        updateRecoveryCenterToggleButton: updateRecoveryCenterToggleButton,
        setRecoveryCenterOpenState: setRecoveryCenterOpenState,
        toggleRecoveryCenterPanel: toggleRecoveryCenterPanel,
        hasAutoSafetySnapshot: hasAutoSafetySnapshot,
        updateAutoSafetyRestoreButtons: updateAutoSafetyRestoreButtons,
        saveAutoSafetySnapshot: saveAutoSafetySnapshot,
        restoreAutoSafetySnapshot: restoreAutoSafetySnapshot
    };
})(window);
