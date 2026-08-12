(function(global) {
    'use strict';

    var PHONEBOOK_STORAGE_KEY = 'phonebookContacts';
    var PHONEBOOK_GROUP_STATE_KEY = 'phonebookCollapsedGroups';
    var ALLOWED_PHONEBOOK_CATEGORIES = ['patients', 'authorities', 'private', 'other'];
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
        if (normalized === 'patients') {
            return { icon: '🏥', label: ctx.t('phonebookCategoryPatients') };
        }
        if (normalized === 'authorities') {
            return { icon: '🏛️', label: ctx.t('phonebookCategoryAuthorities') };
        }
        if (normalized === 'private') {
            return { icon: '🏠', label: ctx.t('phonebookCategoryPrivate') };
        }
        return { icon: '📌', label: ctx.t('phonebookCategoryOther') };
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
            var emptyText = ctx && typeof ctx.t === 'function' ? ctx.t('phonebookEmpty') : 'Inga kontakter ännu.';
            listEl.innerHTML = '<li class="phonebook-empty">' + (ctx && typeof ctx.escapeHTML === 'function' ? ctx.escapeHTML(emptyText) : emptyText) + '</li>';
            return;
        }

        var grouped = {
            patients: [],
            authorities: [],
            private: [],
            other: []
        };

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
            var categoryText = ctx && typeof ctx.escapeHTML === 'function' ? ctx.escapeHTML(meta.label) : meta.label;

            var itemsHtml = contactsInCategory.map(function(entry) {
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
        var categorySelect = document.getElementById('phonebookCategory');
        if (nameInput) {
            nameInput.focus();
        }
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

    function addPhonebookContact(ctx) {
        var nameEl = document.getElementById('phonebookName');
        var categoryEl = document.getElementById('phonebookCategory');
        var phoneEl = document.getElementById('phonebookPhone');
        if (!nameEl || !phoneEl || !categoryEl) return;

        var name = String(nameEl.value || '').trim();
        var category = normalizePhonebookCategory(categoryEl.value);
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
            category: category,
            phone: phone
        });
        saveContacts(contacts);

        nameEl.value = '';
        categoryEl.value = 'patients';
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

    function togglePhonebookCategory(ctx, categoryKey) {
        var normalized = normalizePhonebookCategory(categoryKey);
        var collapsedGroups = readCollapsedGroups();
        collapsedGroups[normalized] = !(collapsedGroups[normalized] === true);
        saveCollapsedGroups(collapsedGroups);
        renderContacts(ctx);
    }

    global.ApexPhonebookModule = {
        openPhonebook: openPhonebook,
        closePhonebookPanel: closePhonebookPanel,
        addPhonebookContact: addPhonebookContact,
        deletePhonebookContact: deletePhonebookContact,
        togglePhonebookCategory: togglePhonebookCategory,
        renderContacts: renderContacts,
        initPhonebookAutoClose: initPhonebookAutoClose
    };
})(window);
