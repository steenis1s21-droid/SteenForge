(function(global) {
    'use strict';

    var PHONEBOOK_STORAGE_KEY = 'phonebookContacts';
    var hasOutsideClickHandler = false;
    var panelOriginalParent = null;
    var panelOriginalNextSibling = null;

    function readContacts() {
        try {
            var raw = localStorage.getItem(PHONEBOOK_STORAGE_KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(function(entry) {
                return entry && typeof entry.id === 'number';
            });
        } catch (e) {
            return [];
        }
    }

    function saveContacts(list) {
        localStorage.setItem(PHONEBOOK_STORAGE_KEY, JSON.stringify(Array.isArray(list) ? list : []));
    }

    function isPanelOpen() {
        var panel = document.getElementById('phonebookPanel');
        return !!panel && panel.style.display === 'block';
    }

    function setPanelInlineMode(isInline) {
        var panel = document.getElementById('phonebookPanel');
        var activeColumn = document.getElementById('activeDrop');
        if (!panel || !activeColumn) return;

        if (isInline) {
            if (!panelOriginalParent) {
                panelOriginalParent = panel.parentNode;
            }
            panelOriginalNextSibling = panel.nextSibling;

            activeColumn.classList.add('is-phonebook-open');
            panel.classList.add('inline-phonebook');
            activeColumn.appendChild(panel);
            return;
        }

        activeColumn.classList.remove('is-phonebook-open');
        panel.classList.remove('inline-phonebook');

        if (!panelOriginalParent) return;

        if (panelOriginalNextSibling && panelOriginalNextSibling.parentNode === panelOriginalParent) {
            panelOriginalParent.insertBefore(panel, panelOriginalNextSibling);
            return;
        }

        panelOriginalParent.appendChild(panel);
    }

    function renderContacts(ctx) {
        var listEl = document.getElementById('phonebookList');
        var searchEl = document.getElementById('phonebookSearch');
        if (!listEl) return;

        var contacts = readContacts();
        var q = searchEl ? String(searchEl.value || '').toLowerCase().trim() : '';
        var filtered = contacts.filter(function(entry) {
            if (!q) return true;
            return String(entry.name || '').toLowerCase().indexOf(q) !== -1
                || String(entry.phone || '').toLowerCase().indexOf(q) !== -1;
        });

        if (filtered.length === 0) {
            var emptyText = ctx && typeof ctx.t === 'function' ? ctx.t('phonebookEmpty') : 'Inga kontakter ännu.';
            listEl.innerHTML = '<li class="phonebook-empty">' + (ctx && typeof ctx.escapeHTML === 'function' ? ctx.escapeHTML(emptyText) : emptyText) + '</li>';
            return;
        }

        var html = filtered.map(function(entry) {
            var name = ctx && typeof ctx.escapeHTML === 'function' ? ctx.escapeHTML(entry.name || '') : (entry.name || '');
            var phone = ctx && typeof ctx.escapeHTML === 'function' ? ctx.escapeHTML(entry.phone || '') : (entry.phone || '');
            return '<li class="phonebook-item">'
                + '<div class="phonebook-entry">'
                + '<strong>' + name + '</strong>'
                + '<span>' + phone + '</span>'
                + '</div>'
                + '<button type="button" onclick="deletePhonebookContact(' + entry.id + ')">✕</button>'
                + '</li>';
        }).join('');

        listEl.innerHTML = html;
    }

    function openPhonebook(ctx) {
        if (!ctx) return;
        var panel = document.getElementById('phonebookPanel');
        if (!panel) {
            if (typeof ctx.showMessage === 'function' && typeof ctx.t === 'function') {
                ctx.showMessage(ctx.t('phonebookComingSoon'));
            }
            return;
        }

        if (typeof ctx.closeEdit === 'function') {
            ctx.closeEdit();
        }

        setPanelInlineMode(true);
        panel.style.display = 'block';

        renderContacts(ctx);

        var nameInput = document.getElementById('phonebookName');
        if (nameInput) {
            nameInput.focus();
        }
    }

    function closePhonebookPanel() {
        var panel = document.getElementById('phonebookPanel');
        if (!panel) return;
        panel.style.display = 'none';
        setPanelInlineMode(false);
    }

    function addPhonebookContact(ctx) {
        var nameEl = document.getElementById('phonebookName');
        var phoneEl = document.getElementById('phonebookPhone');
        if (!nameEl || !phoneEl) return;

        var name = String(nameEl.value || '').trim();
        var phone = String(phoneEl.value || '').trim();

        if (!name) {
            if (ctx && typeof ctx.showMessage === 'function' && typeof ctx.t === 'function') {
                ctx.showMessage(ctx.t('phonebookNameRequired'));
            }
            return;
        }

        var contacts = readContacts();
        contacts.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: name,
            phone: phone
        });
        saveContacts(contacts);

        nameEl.value = '';
        phoneEl.value = '';

        renderContacts(ctx);
        nameEl.focus();
    }

    function deletePhonebookContact(ctx, id) {
        var contacts = readContacts();
        var next = contacts.filter(function(entry) {
            return entry.id !== id;
        });
        saveContacts(next);
        renderContacts(ctx);
    }

    function initPhonebookAutoClose(ctx) {
        if (hasOutsideClickHandler) return;
        hasOutsideClickHandler = true;

        document.addEventListener('mousedown', function(e) {
            var panel = document.getElementById('phonebookPanel');
            if (!panel || panel.style.display !== 'block') return;

            var triggerBtn = document.getElementById('phonebookBtn');
            var clickedInsidePanel = panel.contains(e.target);
            var clickedTrigger = triggerBtn ? triggerBtn.contains(e.target) : false;

            if (!clickedInsidePanel && !clickedTrigger) {
                closePhonebookPanel();
            }
        });
    }

    global.ApexPhonebookModule = {
        openPhonebook: openPhonebook,
        closePhonebookPanel: closePhonebookPanel,
        addPhonebookContact: addPhonebookContact,
        deletePhonebookContact: deletePhonebookContact,
        renderContacts: renderContacts,
        initPhonebookAutoClose: initPhonebookAutoClose
    };
})(window);
