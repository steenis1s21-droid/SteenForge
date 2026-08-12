(function(global) {
    'use strict';

    var PHONEBOOK_STORAGE_KEY = 'phonebookContacts';
    var PHONEBOOK_GROUP_STATE_KEY = 'phonebookCollapsedGroups';
    var ALLOWED_PHONEBOOK_CATEGORIES = ['patients', 'authorities', 'private', 'other'];
    var hasOutsideClickHandler = false;
    var panelOriginalParent = null;
    var panelOriginalNextSibling = null;

    // ============================================================
    // HJÄLPFUNKTIONER FÖR ATT HANTERA CTX OCH SPRÅK
    // ============================================================

    function safeT(ctx, key) {
        if (ctx && typeof ctx.t === 'function') {
            return ctx.t(key);
        }
        var fallback = {
            'phonebookCategoryPatients': '🏥 Patienter',
            'phonebookCategoryAuthorities': '🏛️ Myndigheter',
            'phonebookCategoryPrivate': '🏠 Privat',
            'phonebookCategoryOther': '📌 Övrigt',
            'phonebookEmpty': 'Inga kontakter ännu.',
            'phonebookNameRequired': 'Ange ett namn!',
            'phonebookComingSoon': '📞 Telefonbok kommer snart!'
        };
        return fallback[key] || key;
    }

    function safeEscape(ctx, text) {
        if (ctx && typeof ctx.escapeHTML === 'function') {
            return ctx.escapeHTML(text);
        }
        return String(text || '');
    }

    // ============================================================
    // KÄRN-FUNKTIONER
    // ============================================================

    function readContacts() {
        try {
            var raw = localStorage.getItem(PHONEBOOK_STORAGE_KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(function(entry) {
                return entry && typeof entry.id === 'number';
            }).map(function(entry) {
                var normalized = normalizePhonebookCategory(entry.category);
                entry.category = normalized;
                return entry;
            });
        } catch (e) {
            return [];
        }
    }

    function normalizePhonebookCategory(value) {
        var normalized = String(value || '').toLowerCase();
        if (ALLOWED_PHONEBOOK_CATEGORIES.indexOf(normalized) !== -1) {
            return normalized;
        }
        return 'other';
    }

    function getCategoryMeta(ctx, category) {
        var normalized = normalizePhonebookCategory(category);
        var label = safeT(ctx, 'phonebookCategory' + normalized.charAt(0).toUpperCase() + normalized.slice(1));
        var icons = {
            patients: '🏥',
            authorities: '🏛️',
            private: '🏠',
            other: '📌'
        };
        return { icon: icons[normalized] || '📌', label: label };
    }

    function saveContacts(list) {
        localStorage.setItem(PHONEBOOK_STORAGE_KEY, JSON.stringify(Array.isArray(list) ? list : []));
    }

    function readCollapsedGroups() {
        try {
            var raw = localStorage.getItem(PHONEBOOK_GROUP_STATE_KEY);
            if (!raw) return {};
            var parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return {};
            return parsed;
        } catch (e) {
            return {};
        }
    }

    function saveCollapsedGroups(groups) {
        localStorage.setItem(PHONEBOOK_GROUP_STATE_KEY, JSON.stringify(groups && typeof groups === 'object' ? groups : {}));
    }

    function sortContacts(contacts) {
        return contacts.slice().sort(function(a, b) {
            var nameA = String(a.name || '').trim();
            var nameB = String(b.name || '').trim();
            var nameCmp = nameA.localeCompare(nameB, 'sv', { sensitivity: 'base' });
            if (nameCmp !== 0) return nameCmp;
            var phoneA = String(a.phone || '').trim();
            var phoneB = String(b.phone || '').trim();
            return phoneA.localeCompare(phoneB, 'sv', { sensitivity: 'base' });
        });
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

    // ============================================================
    // RENDER FUNKTION
    // ============================================================

    function renderContacts(ctx) {
        var listEl = document.getElementById('phonebookList');
        var searchEl = document.getElementById('phonebookSearch');
        if (!listEl) return;

        var collapsedGroups = readCollapsedGroups();
        var contacts = readContacts();
        var q = searchEl ? String(searchEl.value || '').toLowerCase().trim() : '';

        var filtered = contacts.filter(function(entry) {
            var meta = getCategoryMeta(ctx, entry.category);
            if (!q) return true;
            return String(entry.name || '').toLowerCase().indexOf(q) !== -1
                || String(entry.phone || '').toLowerCase().indexOf(q) !== -1
                || String(meta.label || '').toLowerCase().indexOf(q) !== -1;
        });

        if (filtered.length === 0) {
            var emptyText = safeT(ctx, 'phonebookEmpty');
            listEl.innerHTML = '<li class="phonebook-empty">' + safeEscape(ctx, emptyText) + '</li>';
            return;
        }

        var grouped = { patients: [], authorities: [], private: [], other: [] };
        filtered.forEach(function(entry) {
            var category = normalizePhonebookCategory(entry.category);
            grouped[category].push(entry);
        });

        var htmlParts = [];
        ALLOWED_PHONEBOOK_CATEGORIES.forEach(function(categoryKey) {
            var contactsInCategory = sortContacts(grouped[categoryKey]);
            if (contactsInCategory.length === 0) return;

            var meta = getCategoryMeta(ctx, categoryKey);
            var collapsed = collapsedGroups[categoryKey] === true;
            var categoryText = safeEscape(ctx, meta.label);

            var itemsHtml = contactsInCategory.map(function(entry) {
                var name = safeEscape(ctx, entry.name || '');
                var phone = safeEscape(ctx, entry.phone || '');
                return '<li class="phonebook-item">'
                    + '<div class="phonebook-entry">'
                    + '<strong>' + name + '</strong>'
                    + '<span>' + phone + '</span>'
                    + '</div>'
                    + '<button type="button" onclick="deletePhonebookContact(' + entry.id + ')">✕</button>'
                    + '</li>';
            }).join('');

            htmlParts.push(
                '<li class="phonebook-group">'
                    + '<button type="button" class="phonebook-group-toggle" onclick="togglePhonebookCategory(\'' + categoryKey + '\')">'
                        + '<span class="phonebook-group-left">'
                            + '<span class="phonebook-group-arrow">' + (collapsed ? '▸' : '▾') + '</span>'
                            + meta.icon + ' ' + categoryText
                        + '</span>'
                        + '<span class="phonebook-group-count">' + contactsInCategory.length + '</span>'
                    + '</button>'
                    + '<ul class="phonebook-group-items' + (collapsed ? ' collapsed' : '') + '">'
                        + itemsHtml
                    + '</ul>'
                + '</li>'
            );
        });

        listEl.innerHTML = htmlParts.join('');
    }

    // ============================================================
    // ÖPPNA / STÄNG
    // ============================================================

    function openPhonebook(ctx) {
        ctx = ctx || {};
        var panel = document.getElementById('phonebookPanel');
        if (!panel) {
            // Visa meddelande via ctx om möjligt
            if (typeof ctx.showMessage === 'function') {
                ctx.showMessage(safeT(ctx, 'phonebookComingSoon'), 'info');
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
        var categorySelect = document.getElementById('phonebookCategory');
        if (nameInput) nameInput.focus();
        if (categorySelect) {
            categorySelect.value = normalizePhonebookCategory(categorySelect.value || 'patients');
        }
    }

    function closePhonebookPanel() {
        var panel = document.getElementById('phonebookPanel');
        if (!panel) return;
        panel.style.display = 'none';
        setPanelInlineMode(false);
    }

    // ============================================================
    // LÄGG TILL / TA BORT
    // ============================================================

    function addPhonebookContact(ctx) {
        ctx = ctx || {};
        var nameEl = document.getElementById('phonebookName');
        var categoryEl = document.getElementById('phonebookCategory');
        var phoneEl = document.getElementById('phonebookPhone');
        if (!nameEl || !phoneEl || !categoryEl) return;

        var name = String(nameEl.value || '').trim();
        var category = normalizePhonebookCategory(categoryEl.value);
        var phone = String(phoneEl.value || '').trim();

        if (!name) {
            if (typeof ctx.showMessage === 'function') {
                ctx.showMessage(safeT(ctx, 'phonebookNameRequired'), 'error');
            } else {
                alert(safeT(ctx, 'phonebookNameRequired'));
            }
            return;
        }

        var contacts = readContacts();
        contacts.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: name,
            category: category,
            phone: phone
        });
        saveContacts(contacts);

        nameEl.value = '';
        categoryEl.value = 'patients';
        phoneEl.value = '';

        renderContacts(ctx);
        nameEl.focus();

        if (typeof ctx.showMessage === 'function') {
            ctx.showMessage('✅ Kontakt tillagd!', 'success');
        }
    }

    function deletePhonebookContact(ctx, id) {
        ctx = ctx || {};
        var contacts = readContacts();
        var next = contacts.filter(function(entry) {
            return entry.id !== id;
        });
        saveContacts(next);
        renderContacts(ctx);
        if (typeof ctx.showMessage === 'function') {
            ctx.showMessage('🗑️ Kontakt borttagen.', 'info');
        }
    }

    function togglePhonebookCategory(ctx, categoryKey) {
        ctx = ctx || {};
        var normalized = normalizePhonebookCategory(categoryKey);
        var collapsedGroups = readCollapsedGroups();
        collapsedGroups[normalized] = !(collapsedGroups[normalized] === true);
        saveCollapsedGroups(collapsedGroups);
        renderContacts(ctx);
    }

    // ============================================================
    // GLOBALA ANROPSFUNKTIONER (från HTML)
    // ============================================================

    function renderPhonebook() {
        var ctx = window.ApexAppContext || window;
        renderContacts(ctx);
    }

    function addPhonebookContactDirect() {
        var ctx = window.ApexAppContext || window;
        addPhonebookContact(ctx);
    }

    function deletePhonebookContact(id) {
        var ctx = window.ApexAppContext || window;
        deletePhonebookContact(ctx, id);
    }

    function togglePhonebookCategory(categoryKey) {
        var ctx = window.ApexAppContext || window;
        togglePhonebookCategory(ctx, categoryKey);
    }

    function openPhonebookPanel() {
        var ctx = window.ApexAppContext || window;
        openPhonebook(ctx);
    }

    // ============================================================
    // EXPORTERA MODUL
    // ============================================================

    global.ApexPhonebookModule = {
        openPhonebook: openPhonebook,
        closePhonebookPanel: closePhonebookPanel,
        addPhonebookContact: addPhonebookContact,
        deletePhonebookContact: deletePhonebookContact,
        togglePhonebookCategory: togglePhonebookCategory,
        renderContacts: renderContacts
    };

    // Gör globala funktioner tillgängliga för HTML
    global.renderPhonebook = renderPhonebook;
    global.addPhonebookContactDirect = addPhonebookContactDirect;
    global.deletePhonebookContact = deletePhonebookContact;
    global.togglePhonebookCategory = togglePhonebookCategory;
    global.openPhonebookPanel = openPhonebookPanel;

})(window);