(function(global) {
    'use strict';

    function getItems(ctx) {
        return ctx && typeof ctx.getItems === 'function' ? (ctx.getItems() || []) : [];
    }

    function setItems(ctx, nextItems) {
        if (ctx && typeof ctx.setItems === 'function') {
            ctx.setItems(nextItems || []);
        }
    }

    function getDoneItems(ctx) {
        return ctx && typeof ctx.getDoneItems === 'function' ? (ctx.getDoneItems() || []) : [];
    }

    function setDoneItems(ctx, nextItems) {
        if (ctx && typeof ctx.setDoneItems === 'function') {
            ctx.setDoneItems(nextItems || []);
        }
    }

    function getArchivedItems(ctx) {
        return ctx && typeof ctx.getArchivedItems === 'function' ? (ctx.getArchivedItems() || []) : [];
    }

    function setArchivedItems(ctx, nextItems) {
        if (ctx && typeof ctx.setArchivedItems === 'function') {
            ctx.setArchivedItems(nextItems || []);
        }
    }

    function getExportData(ctx) {
        var items = getItems(ctx);
        var doneItems = getDoneItems(ctx);
        var archivedItems = getArchivedItems(ctx);

        return {
            items: items,
            doneItems: doneItems,
            archivedItems: archivedItems,
            adminUpdates: ctx.getAdminUpdates(),
            exportedAt: new Date().toISOString(),
            version: ctx.getLegacyBackupVersion(),
            formatVersion: ctx.getBackupFormatVersion(),
            totalItems: items.length + doneItems.length + archivedItems.length
        };
    }

    function getBackupFileType(data) {
        if (data && data.source === 'archive-vault') return 'vault';
        return 'full-backup';
    }

    function getPayloadFormatVersion(data) {
        if (!data || typeof data !== 'object') return '';
        return String(data.formatVersion || data.version || '').trim();
    }

    function isSupportedBackupVersion(ctx, version) {
        return version === ctx.getBackupFormatVersion() || version === ctx.getLegacyBackupVersion();
    }

    function migrateImportedPayload(ctx, rawData) {
        if (!rawData || typeof rawData !== 'object') {
            return { ok: false, code: 'invalid-structure' };
        }

        var migrated = Object.assign({}, rawData);
        var version = getPayloadFormatVersion(migrated);

        if (!version) {
            version = ctx.getLegacyBackupVersion();
        }

        if (!isSupportedBackupVersion(ctx, version)) {
            return { ok: false, code: 'invalid-version', version: version };
        }

        migrated.formatVersion = version === ctx.getLegacyBackupVersion() ? ctx.getBackupFormatVersion() : version;
        migrated.version = version;

        if (migrated.source === 'archive-vault') {
            if (!Array.isArray(migrated.archivedItems)) {
                return { ok: false, code: 'invalid-structure' };
            }
            if (!Array.isArray(migrated.adminUpdates)) migrated.adminUpdates = [];
            return { ok: true, data: migrated };
        }

        if (!Array.isArray(migrated.items) || !Array.isArray(migrated.doneItems) || !Array.isArray(migrated.archivedItems)) {
            return { ok: false, code: 'invalid-structure' };
        }

        if (!Array.isArray(migrated.adminUpdates)) migrated.adminUpdates = [];
        return { ok: true, data: migrated };
    }

    function getImportDiagnosticsMessage(ctx, code) {
        var text = ctx.getBackupUiText();
        if (code === 'invalid-version') return text.importInvalidVersion;
        if (code === 'invalid-structure') return text.importInvalidStructure;
        if (code === 'wrong-password') return text.importWrongPassword;
        return ctx.t('msgImportError');
    }

    function parseImportJsonContent(content) {
        var parsed;
        try {
            parsed = JSON.parse(content);
        } catch (parseError) {
            if (/^<!doctype html/i.test(content) || /^<html/i.test(content)) {
                return { ok: false, code: 'wrong-file-type', error: parseError };
            }
            return { ok: false, code: 'parse-failed', error: parseError };
        }

        return { ok: true, data: parsed };
    }

    function exportJSON(ctx) {
        var data = getExportData(ctx);
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var fileName = requestExportFileName(ctx, 'apexcore-backup-' + new Date().toISOString().split('T')[0], '.json');
        if (!fileName) return;
        downloadBlob(blob, fileName);
        ctx.setBackupHealthStatus('export', 'ok', 'json');

        var moduleApi = ctx.getImportExportModule();
        if (moduleApi && typeof moduleApi.markExportSuccess === 'function') {
            moduleApi.markExportSuccess('json', data.totalItems);
            ctx.updateRecoveryCenterPanel();
        }
        ctx.showMessage(ctx.t('msgExported').replace('{count}', data.totalItems), 'success');
    }

    function downloadBlob(blob, fileName) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(function() {
            URL.revokeObjectURL(url);
        }, 60000);
    }

    function requestExportFileName(ctx, defaultBaseName, extension) {
        var suggestedName = defaultBaseName + extension;
        var inputName = prompt(ctx.t('exportNamePrompt'), suggestedName);
        if (inputName === null) return null;

        var trimmedName = inputName.trim();
        if (!trimmedName) {
            ctx.showMessage(ctx.t('exportNameInvalid'), 'error');
            return null;
        }

        return trimmedName.toLowerCase().endsWith(extension.toLowerCase()) ? trimmedName : trimmedName + extension;
    }

    function requestEncryptionPassword(ctx) {
        var passwordRaw = prompt(ctx.t('msgEncryptedPassword'));
        var password = (passwordRaw || '').trim();
        if (!password) return null;

        if (password.length < 4) {
            ctx.showMessage(ctx.t('msgEncryptedPasswordShort'), 'error');
            return null;
        }

        var confirmRaw = prompt('🔐 ' + (ctx.getLang() === 'sv' ? 'Bekräfta lösenordet:' : 'Confirm password:'));
        var confirmPassword = (confirmRaw || '').trim();
        if (password !== confirmPassword) {
            ctx.showMessage(ctx.t('msgPasswordMismatch'), 'error');
            return null;
        }

        return password;
    }

    function createEncryptedExportBlob(ctx, data, password) {
        var json = JSON.stringify(data);
        var crypto = ctx.CryptoJS;
        if (!crypto) {
            throw new Error('CryptoJS not loaded');
        }

        var encrypted = crypto.AES.encrypt(json, password).toString();

        try {
            var roundtripText = decryptEncryptedPayload(ctx, encrypted, password);
            JSON.parse(roundtripText);
        } catch (error) {
            throw new Error(ctx.getLang() === 'sv'
                ? 'Krypterad export kunde inte verifieras internt.'
                : 'Encrypted export could not be verified internally.');
        }

        var exportData = {
            encrypted: encrypted,
            algorithm: 'AES',
            version: ctx.getLegacyBackupVersion(),
            formatVersion: ctx.getBackupFormatVersion(),
            timestamp: new Date().toISOString()
        };

        return new Blob([JSON.stringify(exportData)], { type: 'application/json' });
    }

    function exportEncrypted(ctx) {
        var password = requestEncryptionPassword(ctx);
        if (!password) return;

        ctx.showProgress('🔐 Krypterar data...');

        try {
            var data = getExportData(ctx);
            var blob = createEncryptedExportBlob(ctx, data, password);
            var fileName = requestExportFileName(ctx, 'apexcore-encrypted-' + new Date().toISOString().split('T')[0], '.enc');
            if (!fileName) {
                ctx.hideProgress();
                return;
            }
            downloadBlob(blob, fileName);
            ctx.hideProgress();
            ctx.setBackupHealthStatus('export', 'ok', 'encrypted');

            var moduleApi = ctx.getImportExportModule();
            if (moduleApi && typeof moduleApi.markExportSuccess === 'function') {
                moduleApi.markExportSuccess('encrypted', data.totalItems);
                ctx.updateRecoveryCenterPanel();
            }
            ctx.showMessage(ctx.t('msgEncrypted').replace('{count}', data.totalItems), 'success');
        } catch (error) {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('export', 'error', 'encrypted failed');
            ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Fel vid kryptering: ' : 'Encryption error: ') + error.message, 'error');
        }
    }

    function exportCSV(ctx) {
        ctx.showProgress('📊 ' + (ctx.getLang() === 'sv' ? 'Skapar CSV...' : 'Creating CSV...'));

        try {
            var items = getItems(ctx);
            var doneItems = getDoneItems(ctx);
            var archivedItems = getArchivedItems(ctx);

            var csv = 'Typ,Prioritet,Namn,Ålder,Uppgift,Anteckningar,Påminnelse,Datum\n';

            items.forEach(function(p) {
                var priorityText = ctx.getPriorityLabel(p.priority);
                csv += 'Active,' + priorityText + ',"' + p.name + '",' + p.age + ',"' + (p.task || '').replace(/"/g, '""') + '","' + (p.note || '').replace(/"/g, '""') + '","' + (p.notification || '') + '",' + new Date(p.updated).toLocaleString('sv-SE') + '\n';
            });

            doneItems.forEach(function(p) {
                var priorityText = ctx.getPriorityLabel(p.priority);
                csv += 'Done,' + priorityText + ',"' + p.name + '",' + p.age + ',"' + (p.task || '').replace(/"/g, '""') + '","' + (p.note || '').replace(/"/g, '""') + '","' + (p.notification || '') + '",' + new Date(p.updated).toLocaleString('sv-SE') + '\n';
            });

            archivedItems.forEach(function(p) {
                var priorityText = ctx.getPriorityLabel(p.priority);
                csv += 'Archived,' + priorityText + ',"' + p.name + '",' + p.age + ',"' + (p.task || '').replace(/"/g, '""') + '","' + (p.note || '').replace(/"/g, '""') + '","' + (p.notification || '') + '",' + new Date(p.updated).toLocaleString('sv-SE') + '\n';
            });

            var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            var fileName = requestExportFileName(ctx, 'apexcore-data-' + new Date().toISOString().split('T')[0], '.csv');
            if (!fileName) {
                ctx.hideProgress();
                return;
            }

            downloadBlob(blob, fileName);
            ctx.hideProgress();
            ctx.setBackupHealthStatus('export', 'ok', 'csv');

            var moduleApi = ctx.getImportExportModule();
            if (moduleApi && typeof moduleApi.markExportSuccess === 'function') {
                moduleApi.markExportSuccess('csv', items.length + doneItems.length + archivedItems.length);
                ctx.updateRecoveryCenterPanel();
            }

            ctx.showMessage(ctx.t('msgCsvExported').replace('{count}', items.length + doneItems.length + archivedItems.length), 'success');
        } catch (error) {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('export', 'error', 'csv failed');
            ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Fel vid CSV-export: ' : 'CSV export error: ') + error.message, 'error');
        }
    }

    function getPasswordCandidates(password) {
        var base = String(password || '');
        var candidates = [base];

        try {
            candidates.push(base.normalize('NFC'));
            candidates.push(base.normalize('NFD'));
        } catch (e) {
            // ignore
        }

        var trimmed = base.trim();
        if (trimmed && trimmed !== base) {
            candidates.push(trimmed);
            try {
                candidates.push(trimmed.normalize('NFC'));
                candidates.push(trimmed.normalize('NFD'));
            } catch (e) {
                // ignore
            }
        }

        return candidates.filter(function(value, index, arr) {
            return arr.indexOf(value) === index;
        });
    }

    function decryptEncryptedPayload(ctx, encryptedValue, password) {
        var crypto = ctx.CryptoJS;
        if (!crypto) {
            throw new Error('CryptoJS not loaded');
        }

        var encrypted = String(encryptedValue || '').trim();
        if (!encrypted) {
            throw new Error('Encrypted payload missing');
        }

        var encryptedNoWhitespace = encrypted.replace(/\s+/g, '');
        var candidates = getPasswordCandidates(password);

        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            var decrypted = crypto.AES.decrypt(encryptedNoWhitespace, candidate);
            var decryptedText = decrypted.toString(crypto.enc.Utf8).replace(/^\uFEFF/, '').trim();
            if (decryptedText) {
                return decryptedText;
            }
        }

        throw new Error('Wrong password or corrupt encrypted payload');
    }

    function importData(ctx, event) {
        var file = event.target.files[0];
        if (!file) {
            ctx.setPendingImportAction('import');
            return;
        }

        var action = ctx.getPendingImportAction() || 'import';
        ctx.setPendingImportAction('import');

        ctx.showProgress('📥 ' + (ctx.getLang() === 'sv' ? 'Läser fil...' : 'Reading file...'));

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var contentRaw = typeof e.target.result === 'string' ? e.target.result : '';
                var content = contentRaw.replace(/^\uFEFF/, '').trim();

                if (!content) {
                    ctx.hideProgress();
                    ctx.setBackupHealthStatus('import', 'error', 'empty file');
                    ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Filen är tom eller oläsbar.' : 'The file is empty or unreadable.'), 'error');
                    return;
                }

                var parsed = parseImportJsonContent(content);
                if (!parsed.ok) {
                    ctx.hideProgress();
                    ctx.setBackupHealthStatus('import', 'error', parsed.code);
                    if (parsed.code === 'wrong-file-type') {
                        ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Fel filtyp: välj en backupfil (.json eller .enc), inte en HTML-sida.' : 'Wrong file type: select a backup file (.json or .enc), not an HTML page.'), 'error');
                    } else {
                        ctx.showMessage(getImportDiagnosticsMessage(ctx, 'invalid-structure'), 'error');
                    }
                    console.error('Import parse error:', parsed.error);
                    return;
                }

                handleParsedImportData(ctx, parsed.data, action);
            } catch (error) {
                ctx.hideProgress();
                ctx.setBackupHealthStatus('import', 'error', 'runtime');
                ctx.showMessage(ctx.t('msgImportError'), 'error');
                console.error('Import error:', error);
            }
        };

        reader.readAsText(file, 'utf-8');
        event.target.value = '';
    }

    function handleParsedImportData(ctx, data, action) {
        if (data && data.encrypted && data.algorithm === 'AES') {
            ctx.hideProgress();
            ctx.showArchivePasswordModal(function(password) {
                ctx.showProgress('📥 ' + (ctx.getLang() === 'sv' ? 'Läser fil...' : 'Reading file...'));
                decryptAndHandleImport(ctx, data, password, action);
            }, {
                requireConfirm: false,
                labels: ctx.getImportPasswordTexts(),
                fallbackPromptText: ctx.t('msgEncryptedPassword')
            });
            return;
        }

        applyImportAction(ctx, data, action);
    }

    function decryptAndHandleImport(ctx, encryptedWrapper, password, action) {
        if (!password) {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('import', 'error', 'password missing');
            ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Lösenord krävs för att importera!' : 'Password required to import!'), 'error');
            return;
        }

        var decryptedData;
        try {
            var decryptedText = decryptEncryptedPayload(ctx, encryptedWrapper.encrypted, password);
            decryptedData = JSON.parse(decryptedText);
        } catch (error) {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('import', 'error', 'decrypt failed');
            ctx.showMessage('❌ ' + getImportDiagnosticsMessage(ctx, 'wrong-password'), 'error');
            return;
        }

        applyImportAction(ctx, decryptedData, action);
    }

    function applyImportAction(ctx, rawData, action) {
        var migration = migrateImportedPayload(ctx, rawData);
        if (!migration.ok) {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('import', 'error', migration.code);
            ctx.showMessage('❌ ' + getImportDiagnosticsMessage(ctx, migration.code), 'error');
            return;
        }

        var data = migration.data;

        if (action === 'dry-run') {
            runImportDryRun(ctx, data);
            return;
        }

        if (action === 'validate') {
            runBackupValidation(ctx, data);
            return;
        }

        try {
            importProcess(ctx, data);
            ctx.setBackupHealthStatus('import', 'ok', data.version || ctx.getBackupFormatVersion());
        } catch (error) {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('import', 'error', 'process failed');
            ctx.showMessage(ctx.t('msgImportError'), 'error');
            console.error('Import process error:', error);
        }
    }

    function runImportDryRun(ctx, data) {
        var text = ctx.getBackupUiText();
        var fileType = getBackupFileType(data);

        if (fileType === 'vault') {
            ctx.hideProgress();
            ctx.setBackupHealthStatus('import', 'ok', 'dry-run vault');
            ctx.showMessage(text.dryRunVaultSummary.replace('{archived}', data.archivedItems.length), 'info');
            return;
        }

        ctx.hideProgress();
        ctx.setBackupHealthStatus('import', 'ok', 'dry-run full');
        ctx.showMessage(text.dryRunSummary
            .replace('{type}', fileType)
            .replace('{active}', data.items.length)
            .replace('{done}', data.doneItems.length)
            .replace('{archived}', data.archivedItems.length), 'info');
    }

    function runBackupValidation(ctx, data) {
        var text = ctx.getBackupUiText();

        if (data.source === 'archive-vault') {
            prepareVaultItemsForArchive(ctx, data.archivedItems);
        } else {
            data.items.map(ctx.normalizeItemData);
            data.doneItems.map(ctx.normalizeItemData);
            data.archivedItems.map(ctx.normalizeItemData);
        }

        ctx.hideProgress();
        ctx.setBackupHealthStatus('import', 'ok', 'validated');
        ctx.showMessage(text.validateBackupSuccess, 'success');
    }

    function openImportFilePicker(ctx, action) {
        ctx.setPendingImportAction(action || 'import');
        var fileInput = document.getElementById('fileInput');
        if (!fileInput) {
            ctx.setPendingImportAction('import');
            return;
        }
        fileInput.click();
    }

    function startDryRunImport(ctx) {
        openImportFilePicker(ctx, 'dry-run');
    }

    function startBackupValidation(ctx) {
        openImportFilePicker(ctx, 'validate');
    }

    function startStandardImport(ctx) {
        openImportFilePicker(ctx, 'import');
    }

    function generateImportedItemId(usedIds) {
        var nextId = Date.now();
        while (usedIds.has(nextId)) {
            nextId += 1;
        }
        usedIds.add(nextId);
        return nextId;
    }

    function prepareVaultItemsForArchive(ctx, vaultItems) {
        var usedIds = new Set();

        getItems(ctx).forEach(function(item) { usedIds.add(item.id); });
        getDoneItems(ctx).forEach(function(item) { usedIds.add(item.id); });
        getArchivedItems(ctx).forEach(function(item) { usedIds.add(item.id); });

        return vaultItems.map(function(item) {
            return {
                id: generateImportedItemId(usedIds),
                name: item.name || '',
                age: item.age === undefined ? '' : item.age,
                task: item.task || '',
                note: item.note || '',
                priority: ctx.normalizePriorityValue(item.priority),
                category: ctx.normalizeCategoryValue(item.category),
                notification: '',
                notificationShown: false,
                updated: item.updated || Date.now()
            };
        });
    }

    function getArchiveItemFingerprint(ctx, item) {
        return [
            String(item.name || '').trim().toLowerCase(),
            String(item.age === undefined ? '' : item.age).trim(),
            String(item.task || '').trim().toLowerCase(),
            String(item.note || '').trim().toLowerCase(),
            ctx.normalizePriorityValue(item.priority),
            ctx.normalizeCategoryValue(item.category),
            String(item.updated || '').trim()
        ].join('|');
    }

    function splitNewAndDuplicateArchiveItems(ctx, importedItems) {
        var existingFingerprints = new Set(getArchivedItems(ctx).map(function(item) {
            return getArchiveItemFingerprint(ctx, item);
        }));
        var seenIncoming = new Set();

        var uniqueItems = [];
        var duplicateCount = 0;

        importedItems.forEach(function(item) {
            var fp = getArchiveItemFingerprint(ctx, item);
            if (existingFingerprints.has(fp) || seenIncoming.has(fp)) {
                duplicateCount += 1;
                return;
            }
            seenIncoming.add(fp);
            uniqueItems.push(item);
        });

        return {
            uniqueItems: uniqueItems,
            duplicateCount: duplicateCount
        };
    }

    function buildVaultImportPreviewMessage(ctx, deduped, incomingCount) {
        var moduleApi = ctx.getImportExportModule();
        var archivedItems = getArchivedItems(ctx);

        if (moduleApi && typeof moduleApi.buildVaultPreviewMessage === 'function') {
            return moduleApi.buildVaultPreviewMessage({
                lang: ctx.getLang(),
                title: ctx.getBackupUiText().importPreviewTitle,
                continueText: ctx.getBackupUiText().importPreviewContinue,
                beforeArchive: archivedItems.length,
                incomingCount: incomingCount,
                uniqueCount: deduped.uniqueItems.length,
                duplicateCount: deduped.duplicateCount,
                afterArchive: archivedItems.length + deduped.uniqueItems.length
            });
        }

        var lang = ctx.getLang();
        var beforeArchive = archivedItems.length;
        var afterArchive = beforeArchive + deduped.uniqueItems.length;

        if (lang === 'en') {
            return '🔎 ' + ctx.getBackupUiText().importPreviewTitle + '\n\n'
                + 'Vault import:\n'
                + '📦 Current archive: ' + beforeArchive + '\n'
                + '📥 Incoming archived: ' + incomingCount + '\n'
                + '➕ Unique to add: ' + deduped.uniqueItems.length + '\n'
                + '⚠️ Duplicates skipped: ' + deduped.duplicateCount + '\n'
                + '📊 Archive after import: ' + afterArchive + '\n\n'
                + ctx.getBackupUiText().importPreviewContinue;
        }

        return '🔎 ' + ctx.getBackupUiText().importPreviewTitle + '\n\n'
            + 'Vault-import:\n'
            + '📦 Nuvarande arkiv: ' + beforeArchive + '\n'
            + '📥 Inkommande arkivposter: ' + incomingCount + '\n'
            + '➕ Unika att lägga till: ' + deduped.uniqueItems.length + '\n'
            + '⚠️ Dubbletter som hoppas över: ' + deduped.duplicateCount + '\n'
            + '📊 Arkiv efter import: ' + afterArchive + '\n\n'
            + ctx.getBackupUiText().importPreviewContinue;
    }

    function buildFullImportPreviewMessage(ctx, data) {
        var moduleApi = ctx.getImportExportModule();
        var items = getItems(ctx);
        var doneItems = getDoneItems(ctx);
        var archivedItems = getArchivedItems(ctx);

        if (moduleApi && typeof moduleApi.buildFullPreviewMessage === 'function') {
            return moduleApi.buildFullPreviewMessage({
                lang: ctx.getLang(),
                title: ctx.getBackupUiText().importPreviewTitle,
                continueText: ctx.getBackupUiText().importPreviewContinue,
                currentActive: items.length,
                currentDone: doneItems.length,
                currentArchived: archivedItems.length,
                incomingActive: data.items.length,
                incomingDone: data.doneItems.length,
                incomingArchived: data.archivedItems.length,
                addActive: items.length + data.items.length,
                addDone: doneItems.length + data.doneItems.length,
                addArchived: archivedItems.length + data.archivedItems.length
            });
        }

        var lang = ctx.getLang();
        var currentActive = items.length;
        var currentDone = doneItems.length;
        var currentArchived = archivedItems.length;
        var incomingActive = data.items.length;
        var incomingDone = data.doneItems.length;
        var incomingArchived = data.archivedItems.length;

        var addActive = currentActive + incomingActive;
        var addDone = currentDone + incomingDone;
        var addArchived = currentArchived + incomingArchived;

        if (lang === 'en') {
            return '🔎 ' + ctx.getBackupUiText().importPreviewTitle + '\n\n'
                + 'Current data:\n'
                + '📋 Active: ' + currentActive + '\n'
                + '✅ Done: ' + currentDone + '\n'
                + '📦 Archive: ' + currentArchived + '\n\n'
                + 'Incoming backup:\n'
                + '📋 Active: ' + incomingActive + '\n'
                + '✅ Done: ' + incomingDone + '\n'
                + '📦 Archive: ' + incomingArchived + '\n\n'
                + 'If you later choose REPLACE in next step:\n'
                + '📊 Result: ' + incomingActive + ' / ' + incomingDone + ' / ' + incomingArchived + '\n\n'
                + 'If you later choose ADD in next step:\n'
                + '📊 Result: ' + addActive + ' / ' + addDone + ' / ' + addArchived + '\n\n'
                + ctx.getBackupUiText().importPreviewContinue;
        }

        return '🔎 ' + ctx.getBackupUiText().importPreviewTitle + '\n\n'
            + 'Nuvarande data:\n'
            + '📋 Aktiv: ' + currentActive + '\n'
            + '✅ Färdig: ' + currentDone + '\n'
            + '📦 Arkiv: ' + currentArchived + '\n\n'
            + 'Inkommande backup:\n'
            + '📋 Aktiv: ' + incomingActive + '\n'
            + '✅ Färdig: ' + incomingDone + '\n'
            + '📦 Arkiv: ' + incomingArchived + '\n\n'
            + 'Om du väljer ERSÄTT i nästa steg:\n'
            + '📊 Resultat: ' + incomingActive + ' / ' + incomingDone + ' / ' + incomingArchived + '\n\n'
            + 'Om du väljer LÄGG TILL i nästa steg:\n'
            + '📊 Resultat: ' + addActive + ' / ' + addDone + ' / ' + addArchived + '\n\n'
            + ctx.getBackupUiText().importPreviewContinue;
    }

    function requestReplaceConfirmationPhrase(ctx) {
        var moduleApi = ctx.getImportExportModule();
        var token = moduleApi && typeof moduleApi.getReplaceToken === 'function'
            ? moduleApi.getReplaceToken(ctx.getLang())
            : (ctx.getLang() === 'sv' ? 'ERSÄTT' : 'REPLACE');
        var typed = prompt(ctx.getBackupUiText().replacePrompt + ' [' + token + ']');
        if (typed === null) return false;
        return typed.trim().toUpperCase() === token;
    }

    function importProcess(ctx, data) {
        if (data.source === 'archive-vault' && Array.isArray(data.archivedItems)) {
            var importedItems = prepareVaultItemsForArchive(ctx, data.archivedItems);
            var deduped = splitNewAndDuplicateArchiveItems(ctx, importedItems);

            if (!confirm(buildVaultImportPreviewMessage(ctx, deduped, data.archivedItems.length))) {
                ctx.hideProgress();
                ctx.showMessage(ctx.getBackupUiText().importCancelled, 'info');
                return;
            }

            if (Array.isArray(data.adminUpdates)) {
                var mergedUpdates = ctx.mergeAdminUpdates(data.adminUpdates, ctx.getAdminUpdates());
                ctx.saveAdminUpdates(mergedUpdates);
                if (typeof ctx.renderInfoContent === 'function') {
                    ctx.renderInfoContent();
                }
                if (typeof ctx.renderAdminList === 'function') {
                    ctx.renderAdminList();
                }
            }

            var archivedItems = getArchivedItems(ctx).concat(deduped.uniqueItems);
            setArchivedItems(ctx, archivedItems);
            ctx.saveData();
            ctx.render();
            ctx.renderArchive();
            ctx.updateAutoSafetyRestoreButtons();

            var moduleApi = ctx.getImportExportModule();
            if (moduleApi && typeof moduleApi.markImportSuccess === 'function') {
                moduleApi.markImportSuccess('vault', {
                    active: getItems(ctx).length,
                    done: getDoneItems(ctx).length,
                    archived: getArchivedItems(ctx).length
                });
                ctx.updateRecoveryCenterPanel();
            }

            ctx.hideProgress();
            ctx.showMessage(ctx.getLang() === 'sv'
                ? '✅ ' + deduped.uniqueItems.length + ' arkivposter importerades till arkivet.'
                : '✅ ' + deduped.uniqueItems.length + ' archived items were imported to Archive.', 'success');

            if (deduped.duplicateCount > 0) {
                ctx.showMessage(ctx.getBackupUiText().duplicateSkipped.replace('{count}', deduped.duplicateCount), 'info');
            }
            return;
        }

        if (!data.items || !data.doneItems || !data.archivedItems) {
            ctx.hideProgress();
            ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Ogiltig datafil!' : 'Invalid data file!'), 'error');
            return;
        }

        if (!confirm(buildFullImportPreviewMessage(ctx, data))) {
            ctx.hideProgress();
            ctx.showMessage(ctx.getBackupUiText().importCancelled, 'info');
            return;
        }

        var activeCount = data.items.length;
        var doneCount = data.doneItems.length;
        var archivedCount = data.archivedItems.length;
        var dateStr = data.exportedAt ? new Date(data.exportedAt).toLocaleString() : 'Okänt';

        var confirmMsg = ctx.t('confirmImport')
            .replace('{active}', activeCount)
            .replace('{done}', doneCount)
            .replace('{archived}', archivedCount)
            .replace('{date}', dateStr);

        var choice = confirm(confirmMsg);

        if (choice) {
            if (!requestReplaceConfirmationPhrase(ctx)) {
                ctx.hideProgress();
                ctx.showMessage(ctx.getBackupUiText().replacePromptFailed, 'error');
                return;
            }

            setItems(ctx, data.items.map(ctx.normalizeItemData));
            setDoneItems(ctx, data.doneItems.map(ctx.normalizeItemData));
            setArchivedItems(ctx, (data.archivedItems || []).map(ctx.normalizeItemData));

            if (data.adminUpdates) {
                ctx.saveAdminUpdates(ctx.dedupeAdminUpdates(data.adminUpdates));
            }

            ctx.showMessage(ctx.t('confirmReplace')
                .replace('{active}', getItems(ctx).length)
                .replace('{done}', getDoneItems(ctx).length)
                .replace('{archived}', getArchivedItems(ctx).length), 'success');

            var replaceModuleApi = ctx.getImportExportModule();
            if (replaceModuleApi && typeof replaceModuleApi.markImportSuccess === 'function') {
                replaceModuleApi.markImportSuccess('replace', {
                    active: getItems(ctx).length,
                    done: getDoneItems(ctx).length,
                    archived: getArchivedItems(ctx).length
                });
                ctx.updateRecoveryCenterPanel();
            }
        } else {
            var beforeCount = getItems(ctx).length + getDoneItems(ctx).length + getArchivedItems(ctx).length;

            setItems(ctx, getItems(ctx).concat(data.items.map(ctx.normalizeItemData)));
            setDoneItems(ctx, getDoneItems(ctx).concat(data.doneItems.map(ctx.normalizeItemData)));
            setArchivedItems(ctx, getArchivedItems(ctx).concat((data.archivedItems || []).map(ctx.normalizeItemData)));

            if (data.adminUpdates) {
                var merged = ctx.mergeAdminUpdates(data.adminUpdates, ctx.getAdminUpdates());
                ctx.saveAdminUpdates(merged);
            }

            var addedCount = (getItems(ctx).length + getDoneItems(ctx).length + getArchivedItems(ctx).length) - beforeCount;
            ctx.showMessage(ctx.t('confirmAdded').replace('{count}', addedCount), 'success');

            var addModuleApi = ctx.getImportExportModule();
            if (addModuleApi && typeof addModuleApi.markImportSuccess === 'function') {
                addModuleApi.markImportSuccess('add', {
                    active: getItems(ctx).length,
                    done: getDoneItems(ctx).length,
                    archived: getArchivedItems(ctx).length
                });
                ctx.updateRecoveryCenterPanel();
            }
        }

        ctx.saveData();
        ctx.render();
        ctx.updateAutoSafetyRestoreButtons();
        ctx.hideProgress();
    }

    global.ApexImportExportCoreModule = {
        getExportData: getExportData,
        getBackupFileType: getBackupFileType,
        getPayloadFormatVersion: getPayloadFormatVersion,
        isSupportedBackupVersion: isSupportedBackupVersion,
        migrateImportedPayload: migrateImportedPayload,
        getImportDiagnosticsMessage: getImportDiagnosticsMessage,
        parseImportJsonContent: parseImportJsonContent,
        exportJSON: exportJSON,
        downloadBlob: downloadBlob,
        requestExportFileName: requestExportFileName,
        requestEncryptionPassword: requestEncryptionPassword,
        createEncryptedExportBlob: createEncryptedExportBlob,
        exportEncrypted: exportEncrypted,
        exportCSV: exportCSV,
        getPasswordCandidates: getPasswordCandidates,
        decryptEncryptedPayload: decryptEncryptedPayload,
        importData: importData,
        handleParsedImportData: handleParsedImportData,
        decryptAndHandleImport: decryptAndHandleImport,
        applyImportAction: applyImportAction,
        runImportDryRun: runImportDryRun,
        runBackupValidation: runBackupValidation,
        openImportFilePicker: openImportFilePicker,
        startDryRunImport: startDryRunImport,
        startBackupValidation: startBackupValidation,
        startStandardImport: startStandardImport,
        generateImportedItemId: generateImportedItemId,
        prepareVaultItemsForArchive: prepareVaultItemsForArchive,
        getArchiveItemFingerprint: getArchiveItemFingerprint,
        splitNewAndDuplicateArchiveItems: splitNewAndDuplicateArchiveItems,
        buildVaultImportPreviewMessage: buildVaultImportPreviewMessage,
        buildFullImportPreviewMessage: buildFullImportPreviewMessage,
        requestReplaceConfirmationPhrase: requestReplaceConfirmationPhrase,
        importProcess: importProcess
    };
})(window);
