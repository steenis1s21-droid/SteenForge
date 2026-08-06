(function(global) {
    'use strict';

    var isArchiveCleanupModalOpen = false;
    var isArchivePasswordModalOpen = false;

    function getArchivedItems(ctx) {
        return ctx && typeof ctx.getArchivedItems === 'function' ? (ctx.getArchivedItems() || []) : [];
    }

    function setArchivedItems(ctx, nextItems) {
        if (ctx && typeof ctx.setArchivedItems === 'function') {
            ctx.setArchivedItems(nextItems || []);
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

    function getItems(ctx) {
        return ctx && typeof ctx.getItems === 'function' ? (ctx.getItems() || []) : [];
    }

    function setItems(ctx, nextItems) {
        if (ctx && typeof ctx.setItems === 'function') {
            ctx.setItems(nextItems || []);
        }
    }

    function archiveItem(ctx, id) {
        var doneItems = getDoneItems(ctx);
        var archivedItems = getArchivedItems(ctx);
        var i = doneItems.findIndex(function(p) { return p.id === id; });
        if (i === -1) return;

        archivedItems.push(doneItems[i]);
        doneItems.splice(i, 1);
        setArchivedItems(ctx, archivedItems);
        setDoneItems(ctx, doneItems);
        ctx.saveData();
        ctx.render();
        ctx.showMessage(ctx.t('archiveArchived'), 'success');
    }

    function archiveAll(ctx) {
        var doneItems = getDoneItems(ctx);
        if (doneItems.length === 0) return;

        var archivedItems = getArchivedItems(ctx);
        var count = doneItems.length;
        doneItems.forEach(function(item) { archivedItems.push(item); });

        setDoneItems(ctx, []);
        setArchivedItems(ctx, archivedItems);
        ctx.saveData();
        ctx.render();
        ctx.showMessage(ctx.t('archiveAllSuccess').replace('{count}', count), 'success');
    }

    function showArchiveInfo(ctx) {
        var overlay = document.getElementById('archiveOverlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
        renderArchive(ctx);
    }

    function closeArchiveModal() {
        var overlay = document.getElementById('archiveOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    function updateArchiveVaultButton(ctx) {
        var vaultBtn = document.getElementById('archiveVaultBtn');
        if (!vaultBtn) return;
        vaultBtn.disabled = getArchivedItems(ctx).length === 0;
    }

    function renderArchive(ctx) {
        var archivedItems = getArchivedItems(ctx);

        var title = document.getElementById('archiveTitle');
        if (title) title.textContent = ctx.t('archiveModalTitle') + ' (' + archivedItems.length + ')';
        updateArchiveVaultButton(ctx);

        var searchInput = document.getElementById('archiveSearch');
        var search = ((searchInput && searchInput.value) || '').toLowerCase();

        var container = document.getElementById('archiveContent');
        if (!container) return;

        var html = '';
        var filtered = archivedItems.filter(function(p) {
            return p.name.toLowerCase().includes(search)
                || (p.task || '').toLowerCase().includes(search)
                || (p.note || '').toLowerCase().includes(search);
        });

        var archiveAgeText = function(p) {
            return p.age === '' || p.age === null || p.age === undefined ? '' : ' (' + ctx.escapeHTML(p.age) + ')';
        };

        if (filtered.length === 0) {
            html = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">' + ctx.t('archiveEmpty') + '</p>';
        } else {
            filtered.forEach(function(p) {
                html += '\n                <div class="archive-item">\n                    <b>' + ctx.escapeHTML(p.name) + '</b>' + archiveAgeText(p) + '<br>\n                    ' + ctx.escapeHTML(p.task || '') + '\n                    <div style="margin-top: 4px; font-size: 12px; color: var(--text-muted);">' + ctx.formatTime(p.updated) + '</div>\n                    <div style="margin-top: 4px;">\n                        <button onclick="restoreArchive(' + p.id + ')">' + ctx.t('archiveRestore') + '</button>\n                    </div>\n                </div>\n            ';
            });
        }

        container.innerHTML = html;
    }

    function vaultArchive(ctx, options) {
        options = options || {};
        var archivedItems = getArchivedItems(ctx);

        if (archivedItems.length === 0) {
            ctx.showMessage(ctx.t('archiveEmpty'), 'info');
            updateArchiveVaultButton(ctx);
            return;
        }

        var archiveCount = archivedItems.length;
        var skipConfirm = options.skipConfirm === true;
        var clearAfterExport = options.clearAfterExport !== false;
        if (!skipConfirm && !confirm(ctx.t('archiveVaultConfirm').replace('{count}', archiveCount))) return;

        var password = options.password || ctx.requestEncryptionPassword();
        if (!password) return;

        ctx.showProgress(ctx.t('archiveVaultProgress'));

        try {
            var vaultData = {
                archivedItems: archivedItems,
                adminUpdates: ctx.getAdminUpdates(),
                exportedAt: new Date().toISOString(),
                version: '2.2',
                totalItems: archiveCount,
                source: 'archive-vault'
            };

            var blob = ctx.createEncryptedExportBlob(vaultData, password);
            var fileName = options.fileName || ctx.requestExportFileName('apexcore-archive-vault-' + new Date().toISOString().split('T')[0], '.enc');
            if (!fileName) {
                ctx.hideProgress();
                return;
            }
            ctx.downloadBlob(blob, fileName);

            if (clearAfterExport) {
                setArchivedItems(ctx, []);
                ctx.saveData();
                ctx.render();
                renderArchive(ctx);
            }
            ctx.hideProgress();

            if (clearAfterExport) {
                ctx.showMessage(ctx.t('archiveVaultSuccess').replace('{count}', archiveCount), 'success');
            } else {
                ctx.showMessage(ctx.t('msgEncrypted').replace('{count}', archiveCount), 'success');
            }
        } catch (error) {
            ctx.hideProgress();
            ctx.showMessage('❌ ' + (ctx.getLang() === 'sv' ? 'Fel vid kryptering: ' : 'Encryption error: ') + error.message, 'error');
        }
    }

    function getArchiveSaveBeforeClearPrompt(ctx) {
        var lang = ctx.getLang();
        if (lang === 'en') {
            return 'Do you want to save an encrypted backup file before clearing the archive?\n\nOK = Save encrypted file, then clear archive\nCancel = Continue without backup';
        }
        if (lang === 'da') {
            return 'Vil du gemme en krypteret backupfil, før arkivet ryddes?\n\nOK = Gem krypteret fil og ryd arkivet\nAnnuller = Fortsæt uden backup';
        }
        if (lang === 'no') {
            return 'Vil du lagre en kryptert backupfil før arkivet tømmes?\n\nOK = Lagre kryptert fil og tøm arkivet\nAvbryt = Fortsett uten backup';
        }
        if (lang === 'fi') {
            return 'Haluatko tallentaa salatun varmuuskopiotiedoston ennen arkiston tyhjennystä?\n\nOK = Tallenna salattu tiedosto ja tyhjennä arkisto\nPeruuta = Jatka ilman varmuuskopiota';
        }
        return 'Vill du spara en krypterad backup-fil innan arkivet rensas?\n\nOK = Spara krypterad fil och rensa arkivet\nAvbryt = Fortsätt utan backup';
    }

    function getArchiveCleanupTexts(ctx) {
        var lang = ctx.getLang();
        if (lang === 'en') {
            return {
                title: '🧹 Clear archive',
                text: 'Do you want to save an encrypted backup file before clearing the archive?',
                cancel: '❌ Cancel',
                clear: '🗑️ Clear without backup',
                save: '🗄️ Save encrypted file'
            };
        }
        if (lang === 'da') {
            return {
                title: '🧹 Ryd arkiv',
                text: 'Vil du gemme en krypteret backupfil, før arkivet ryddes?',
                cancel: '❌ Annuller',
                clear: '🗑️ Ryd uden backup',
                save: '🗄️ Gem krypteret fil'
            };
        }
        if (lang === 'no') {
            return {
                title: '🧹 Tøm arkiv',
                text: 'Vil du lagre en kryptert backupfil før arkivet tømmes?',
                cancel: '❌ Avbryt',
                clear: '🗑️ Tøm uten backup',
                save: '🗄️ Lagre kryptert fil'
            };
        }
        if (lang === 'fi') {
            return {
                title: '🧹 Tyhjennä arkisto',
                text: 'Haluatko tallentaa salatun varmuuskopiotiedoston ennen arkiston tyhjennystä?',
                cancel: '❌ Peruuta',
                clear: '🗑️ Tyhjennä ilman varmuuskopiota',
                save: '🗄️ Tallenna salattu tiedosto'
            };
        }
        return {
            title: '🧹 Rensa arkiv',
            text: 'Vill du spara en krypterad backup-fil innan arkivet rensas?',
            cancel: '❌ Avbryt',
            clear: '🗑️ Rensa utan backup',
            save: '🗄️ Spara krypterad fil'
        };
    }

    function getArchivePasswordTexts(ctx) {
        var lang = ctx.getLang();
        if (lang === 'en') {
            return {
                title: '🔐 Encrypted backup',
                text: 'Enter a password for the backup file.',
                placeholder: 'Password',
                placeholderConfirm: 'Confirm password',
                cancel: '❌ Cancel',
                save: '💾 Save backup'
            };
        }
        if (lang === 'da') {
            return {
                title: '🔐 Krypteret backup',
                text: 'Angiv et kodeord til backupfilen.',
                placeholder: 'Kodeord',
                placeholderConfirm: 'Bekræft kodeord',
                cancel: '❌ Annuller',
                save: '💾 Gem backup'
            };
        }
        if (lang === 'no') {
            return {
                title: '🔐 Kryptert backup',
                text: 'Angi passord for backupfilen.',
                placeholder: 'Passord',
                placeholderConfirm: 'Bekreft passord',
                cancel: '❌ Avbryt',
                save: '💾 Lagre backup'
            };
        }
        if (lang === 'fi') {
            return {
                title: '🔐 Salattu varmuuskopio',
                text: 'Anna salasana varmuuskopiotiedostolle.',
                placeholder: 'Salasana',
                placeholderConfirm: 'Vahvista salasana',
                cancel: '❌ Peruuta',
                save: '💾 Tallenna varmuuskopio'
            };
        }
        return {
            title: '🔐 Krypterad backup',
            text: 'Ange lösenord för backup-filen.',
            placeholder: 'Lösenord',
            placeholderConfirm: 'Bekräfta lösenord',
            cancel: '❌ Avbryt',
            save: '💾 Spara backup'
        };
    }

    function getImportPasswordTexts(ctx) {
        var lang = ctx.getLang();
        if (lang === 'en') {
            return {
                title: '🔓 Import encrypted file',
                text: 'Enter the password for the encrypted import file.',
                placeholder: 'Password',
                placeholderConfirm: '',
                cancel: '❌ Cancel',
                save: '📥 Import'
            };
        }
        if (lang === 'da') {
            return {
                title: '🔓 Importer krypteret fil',
                text: 'Indtast kodeordet til den krypterede importfil.',
                placeholder: 'Kodeord',
                placeholderConfirm: '',
                cancel: '❌ Annuller',
                save: '📥 Importér'
            };
        }
        if (lang === 'no') {
            return {
                title: '🔓 Importer kryptert fil',
                text: 'Skriv inn passordet for den krypterte importfilen.',
                placeholder: 'Passord',
                placeholderConfirm: '',
                cancel: '❌ Avbryt',
                save: '📥 Importer'
            };
        }
        if (lang === 'fi') {
            return {
                title: '🔓 Tuo salattu tiedosto',
                text: 'Anna salatun tuontitiedoston salasana.',
                placeholder: 'Salasana',
                placeholderConfirm: '',
                cancel: '❌ Peruuta',
                save: '📥 Tuo'
            };
        }
        return {
            title: '🔓 Importera krypterad fil',
            text: 'Ange lösenordet för den krypterade importfilen.',
            placeholder: 'Lösenord',
            placeholderConfirm: '',
            cancel: '❌ Avbryt',
            save: '📥 Importera'
        };
    }

    function closeArchiveCleanupModal() {
        var modal = document.getElementById('archiveCleanupModal');
        if (!modal) return;
        modal.style.display = 'none';
        isArchiveCleanupModalOpen = false;
    }

    function closeArchivePasswordModal() {
        var modal = document.getElementById('archivePasswordModal');
        if (!modal) return;
        modal.style.display = 'none';
        isArchivePasswordModalOpen = false;
    }

    function showArchivePasswordModal(ctx, onConfirm, options) {
        options = options || {};
        var modal = document.getElementById('archivePasswordModal');
        var title = document.getElementById('archivePasswordTitle');
        var text = document.getElementById('archivePasswordText');
        var passwordInput = document.getElementById('archivePasswordInput');
        var confirmInput = document.getElementById('archivePasswordConfirmInput');
        var cancelBtn = document.getElementById('archivePasswordCancelBtn');
        var okBtn = document.getElementById('archivePasswordOkBtn');
        var requireConfirm = options.requireConfirm !== false;
        var labels = options.labels || getArchivePasswordTexts(ctx);

        if (!modal || !title || !text || !passwordInput || !confirmInput || !cancelBtn || !okBtn) {
            var fallbackPassword = null;
            if (requireConfirm) {
                fallbackPassword = ctx.requestEncryptionPassword();
            } else {
                var fallbackPromptText = options.fallbackPromptText || ctx.t('msgEncryptedPassword');
                try {
                    fallbackPassword = prompt(fallbackPromptText);
                } catch (fallbackPromptError) {
                    fallbackPassword = null;
                }
            }
            if (!fallbackPassword) return;
            onConfirm(fallbackPassword);
            return;
        }

        title.textContent = labels.title;
        text.textContent = labels.text;
        passwordInput.placeholder = labels.placeholder;
        confirmInput.placeholder = labels.placeholderConfirm || '';
        confirmInput.style.display = requireConfirm ? '' : 'none';
        cancelBtn.textContent = labels.cancel;
        okBtn.textContent = labels.save;
        passwordInput.value = '';
        confirmInput.value = '';

        isArchivePasswordModalOpen = true;
        modal.style.display = 'flex';

        function cleanup() {
            closeArchivePasswordModal();
            modal.onclick = null;
            cancelBtn.onclick = null;
            okBtn.onclick = null;
        }

        function cancel() {
            cleanup();
        }

        function submit() {
            var password = (passwordInput.value || '').trim();
            var confirmPassword = (confirmInput.value || '').trim();

            if (!password || password.length < 4) {
                ctx.showMessage(ctx.t('msgEncryptedPasswordShort'), 'error');
                return;
            }
            if (requireConfirm && password !== confirmPassword) {
                ctx.showMessage(ctx.t('msgPasswordMismatch'), 'error');
                return;
            }

            cleanup();
            onConfirm(password);
        }

        modal.onclick = function(event) {
            if (event.target === modal) cancel();
        };

        cancelBtn.onclick = function(event) {
            event.preventDefault();
            cancel();
        };

        okBtn.onclick = function(event) {
            event.preventDefault();
            submit();
        };

        passwordInput.onkeydown = function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (requireConfirm) {
                    confirmInput.focus();
                } else {
                    submit();
                }
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                cancel();
            }
        };

        confirmInput.onkeydown = function(event) {
            if (!requireConfirm) return;
            if (event.key === 'Enter') {
                event.preventDefault();
                submit();
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                cancel();
            }
        };

        setTimeout(function() {
            passwordInput.focus();
        }, 0);
    }

    function showArchiveCleanupModal(ctx) {
        var modal = document.getElementById('archiveCleanupModal');
        var title = document.getElementById('archiveCleanupTitle');
        var text = document.getElementById('archiveCleanupText');
        var cancelBtn = document.getElementById('archiveCleanupCancelBtn');
        var clearBtn = document.getElementById('archiveCleanupClearBtn');
        var backupBtn = document.getElementById('archiveCleanupBackupBtn');

        if (!modal || !title || !text || !cancelBtn || !clearBtn || !backupBtn) {
            var wantsBackupFallback = confirm(getArchiveSaveBeforeClearPrompt(ctx));
            if (wantsBackupFallback) {
                vaultArchive(ctx, { skipConfirm: true, clearAfterExport: true });
                return;
            }
            if (!confirm(ctx.t('archiveConfirmClear'))) return;
            ctx.saveAutoSafetySnapshot();
            setArchivedItems(ctx, []);
            ctx.saveData();
            ctx.render();
            renderArchive(ctx);
            ctx.updateAutoSafetyRestoreButtons();
            ctx.showMessage(ctx.t('archiveCleared'), 'info');
            return;
        }

        var labels = getArchiveCleanupTexts(ctx);
        title.textContent = labels.title;
        text.textContent = labels.text;
        cancelBtn.textContent = labels.cancel;
        clearBtn.textContent = labels.clear;
        backupBtn.textContent = labels.save;

        isArchiveCleanupModalOpen = true;
        modal.style.display = 'flex';

        function cleanup() {
            closeArchiveCleanupModal();
            modal.onclick = null;
            cancelBtn.onclick = null;
            clearBtn.onclick = null;
            backupBtn.onclick = null;
        }

        function cancel() {
            cleanup();
        }

        function clearWithoutBackup() {
            cleanup();
            ctx.saveAutoSafetySnapshot();
            setArchivedItems(ctx, []);
            ctx.saveData();
            ctx.render();
            renderArchive(ctx);
            ctx.updateAutoSafetyRestoreButtons();
            ctx.showMessage(ctx.t('archiveCleared'), 'info');
        }

        function saveBackupThenClear() {
            cleanup();
            showArchivePasswordModal(ctx, function(password) {
                var fileName = 'apexcore-archive-vault-' + new Date().toISOString().split('T')[0] + '.enc';
                vaultArchive(ctx, {
                    skipConfirm: true,
                    clearAfterExport: true,
                    password: password,
                    fileName: fileName
                });
            });
        }

        modal.onclick = function(event) {
            if (event.target === modal) cancel();
        };

        cancelBtn.onclick = function(event) {
            event.preventDefault();
            cancel();
        };

        clearBtn.onclick = function(event) {
            event.preventDefault();
            clearWithoutBackup();
        };

        backupBtn.onclick = function(event) {
            event.preventDefault();
            saveBackupThenClear();
        };
    }

    function clearArchiveWithBackupPrompt(ctx) {
        if (getArchivedItems(ctx).length === 0) {
            ctx.showMessage(ctx.t('archiveEmpty'), 'info');
            return;
        }
        showArchiveCleanupModal(ctx);
    }

    function restoreArchive(ctx, id) {
        var archivedItems = getArchivedItems(ctx);
        var items = getItems(ctx);
        var i = archivedItems.findIndex(function(p) { return p.id === id; });
        if (i === -1) return;

        items.push(archivedItems[i]);
        archivedItems.splice(i, 1);

        setItems(ctx, items);
        setArchivedItems(ctx, archivedItems);
        ctx.saveData();
        ctx.render();
        renderArchive(ctx);
        ctx.showMessage(ctx.t('archiveRestored'), 'info');
    }

    function deleteArchiveItem(ctx, id) {
        if (!confirm(ctx.t('archiveConfirmDelete'))) return;

        var archivedItems = getArchivedItems(ctx).filter(function(p) { return p.id !== id; });
        setArchivedItems(ctx, archivedItems);
        ctx.saveData();
        renderArchive(ctx);
        ctx.showMessage(ctx.t('archiveDeleted'), 'info');
    }

    function clearArchive(ctx) {
        clearArchiveWithBackupPrompt(ctx);
    }

    global.ApexArchiveModule = {
        archiveItem: archiveItem,
        archiveAll: archiveAll,
        showArchiveInfo: showArchiveInfo,
        closeArchiveModal: closeArchiveModal,
        updateArchiveVaultButton: updateArchiveVaultButton,
        renderArchive: renderArchive,
        vaultArchive: vaultArchive,
        getArchiveSaveBeforeClearPrompt: getArchiveSaveBeforeClearPrompt,
        getArchiveCleanupTexts: getArchiveCleanupTexts,
        getArchivePasswordTexts: getArchivePasswordTexts,
        getImportPasswordTexts: getImportPasswordTexts,
        closeArchiveCleanupModal: closeArchiveCleanupModal,
        closeArchivePasswordModal: closeArchivePasswordModal,
        showArchivePasswordModal: showArchivePasswordModal,
        showArchiveCleanupModal: showArchiveCleanupModal,
        clearArchiveWithBackupPrompt: clearArchiveWithBackupPrompt,
        restoreArchive: restoreArchive,
        deleteArchiveItem: deleteArchiveItem,
        clearArchive: clearArchive
    };
})(window);
