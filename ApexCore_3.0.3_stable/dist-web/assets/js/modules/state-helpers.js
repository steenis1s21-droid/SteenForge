(function(global) {
    'use strict';

    function normalizePriorityValue(value) {
        return value === 'high' ? 'high' : 'normal';
    }

    function normalizeCategoryValue(value) {
        var normalized = String(value || '').toLowerCase();
        if (normalized === 'high' || normalized === 'patients' || normalized === 'authorities' || normalized === 'administration' || normalized === 'private' || normalized === 'games' || normalized === 'other') {
            return normalized;
        }
        return 'other';
    }

    function saveData(ctx) {
        try {
            localStorage.setItem('items', JSON.stringify(ctx.getItems() || []));
            localStorage.setItem('doneItems', JSON.stringify(ctx.getDoneItems() || []));
            localStorage.setItem('archivedItems', JSON.stringify(ctx.getArchivedItems() || []));
            localStorage.setItem('activeGroupsCollapsed', JSON.stringify(ctx.getActiveGroupsCollapsed() || {}));
        } catch (e) {
            console.warn('Kunde inte spara appdata:', e);
        }
    }

    function getStoredAddCategory() {
        var stored = normalizeCategoryValue(localStorage.getItem('lastAddCategory'));
        return stored === 'high' ? 'patients' : stored;
    }

    function setStoredAddCategory(category) {
        var normalized = normalizeCategoryValue(category);
        if (normalized === 'high') return;
        localStorage.setItem('lastAddCategory', normalized);
    }

    function applyStoredAddCategorySelection() {
        var categoryInput = document.getElementById('categoryInput');
        if (!categoryInput) return;
        categoryInput.value = getStoredAddCategory();
    }

    function getStoredActiveSortMode() {
        var mode = localStorage.getItem('activeSortMode') || 'date-desc';
        var validModes = ['date-desc', 'date-asc', 'name-asc', 'name-desc'];
        return validModes.indexOf(mode) !== -1 ? mode : 'date-desc';
    }

    function setActiveSortMode(mode) {
        var validModes = ['date-desc', 'date-asc', 'name-asc', 'name-desc'];
        var normalized = validModes.indexOf(mode) !== -1 ? mode : 'date-desc';
        localStorage.setItem('activeSortMode', normalized);

        var sortSelect = document.getElementById('activeSortSelect');
        if (sortSelect) {
            sortSelect.value = normalized;
        }
    }

    function sortActiveItems(ctx, list) {
        var mode = getStoredActiveSortMode();
        var lang = ctx.getLang();
        var sorted = (list || []).slice();

        sorted.sort(function(a, b) {
            if (mode === 'name-asc' || mode === 'name-desc') {
                var nameA = String(a.name || '');
                var nameB = String(b.name || '');
                var cmp = nameA.localeCompare(nameB, lang, { sensitivity: 'base' });
                if (cmp !== 0) return mode === 'name-asc' ? cmp : -cmp;
                return (b.updated || 0) - (a.updated || 0);
            }

            var dateA = Number(a.updated || 0);
            var dateB = Number(b.updated || 0);
            if (dateA !== dateB) {
                return mode === 'date-asc' ? dateA - dateB : dateB - dateA;
            }

            return String(a.name || '').localeCompare(String(b.name || ''), lang, { sensitivity: 'base' });
        });

        return sorted;
    }

    function normalizeItemData(item) {
        if (!item || typeof item !== 'object') return item;

        item.priority = normalizePriorityValue(item.priority);
        item.category = normalizeCategoryValue(item.category);
        return item;
    }

    function loadData(ctx) {
        var items;
        var doneItems;
        var archivedItems;
        var groups;

        try {
            var i = localStorage.getItem('items');
            var d = localStorage.getItem('doneItems');
            var a = localStorage.getItem('archivedItems');
            var g = localStorage.getItem('activeGroupsCollapsed');

            items = i ? JSON.parse(i) : [];
            doneItems = d ? JSON.parse(d) : [];
            archivedItems = a ? JSON.parse(a) : [];

            try {
                groups = g ? JSON.parse(g) : {};
            } catch (groupErr) {
                groups = {};
            }
        } catch (e) {
            items = [];
            doneItems = [];
            archivedItems = [];
            groups = {};
            console.warn('Kunde inte läsa appdata, använder tomt state:', e);
        }

        items = (items || []).map(normalizeItemData);
        doneItems = (doneItems || []).map(normalizeItemData);
        archivedItems = (archivedItems || []).map(normalizeItemData);

        // Migrate historical Done entries into Archive so one completed flow is used.
        var migratedDoneToArchive = doneItems.length > 0;
        if (migratedDoneToArchive) {
            archivedItems = doneItems.concat(archivedItems);
            doneItems = [];
        }

        ctx.setItems(items);
        ctx.setDoneItems(doneItems);
        ctx.setArchivedItems(archivedItems);
        ctx.setActiveGroupsCollapsed(groups || {});

        if (localStorage.getItem('appLanguage')) {
            ctx.setCurrentLanguage(localStorage.getItem('appLanguage'));
        } else {
            ctx.setCurrentLanguage('sv');
        }

        if (!localStorage.getItem('lastAddCategory')) {
            localStorage.setItem('lastAddCategory', 'patients');
        }

        // Persist immediately if Done->Archive migration happened.
        if (migratedDoneToArchive) {
            saveData(ctx);
        }
    }

    global.ApexStateHelpersModule = {
        saveData: saveData,
        normalizePriorityValue: normalizePriorityValue,
        normalizeCategoryValue: normalizeCategoryValue,
        getStoredAddCategory: getStoredAddCategory,
        setStoredAddCategory: setStoredAddCategory,
        applyStoredAddCategorySelection: applyStoredAddCategorySelection,
        getStoredActiveSortMode: getStoredActiveSortMode,
        setActiveSortMode: setActiveSortMode,
        sortActiveItems: sortActiveItems,
        normalizeItemData: normalizeItemData,
        loadData: loadData
    };
})(window);
