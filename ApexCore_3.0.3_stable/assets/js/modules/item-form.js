(function(global) {
    'use strict';

    var enterKeyBound = false;

    function resetAddForm(ctx) {
        var nameInput = document.getElementById('nameInput');
        var ageInput = document.getElementById('ageInput');
        var taskInput = document.getElementById('taskInput');
        var noteInput = document.getElementById('noteInput');
        var categoryInput = document.getElementById('categoryInput');
        var notificationInput = document.getElementById('notificationInput');

        if (nameInput) nameInput.value = '';
        if (ageInput) ageInput.value = '';
        if (taskInput) taskInput.value = '';
        if (noteInput) noteInput.value = '';
        if (categoryInput) categoryInput.value = ctx.getStoredAddCategory() === 'high' ? 'patients' : ctx.getStoredAddCategory();
        if (notificationInput) notificationInput.value = '';
        ctx.populateReminderFields('notification', '');
    }

    function addItem(ctx) {
        var nameInput = document.getElementById('nameInput');
        var ageInput = document.getElementById('ageInput');
        var taskInput = document.getElementById('taskInput');
        var noteInput = document.getElementById('noteInput');
        var categoryInput = document.getElementById('categoryInput');
        var notificationInput = document.getElementById('notificationInput');

        if (!nameInput || !ageInput || !taskInput || !noteInput || !categoryInput || !notificationInput) {
            return;
        }

        var nameVal = nameInput.value.trim();
        var ageValRaw = ageInput.value.trim();
        var ageVal = ageValRaw === '' ? '' : parseInt(ageValRaw, 10);
        var taskVal = taskInput.value.trim();
        var noteVal = noteInput.value.trim();
        var categoryVal = ctx.normalizeCategoryValue(categoryInput.value);
        var priorityVal = categoryVal === 'high' ? 'high' : 'normal';
        var notificationVal = notificationInput.value;

        if (!nameVal) {
            alert(ctx.t('nameRequired'));
            return;
        }

        var items = ctx.getItems();
        items.push({
            id: Date.now(),
            name: nameVal,
            age: ageVal,
            task: taskVal || '',
            note: noteVal || '',
            category: categoryVal,
            priority: priorityVal,
            notification: notificationVal || '',
            notificationShown: false,
            pinned: false,
            updated: Date.now()
        });

        if (categoryVal !== 'high') {
            ctx.setStoredAddCategory(categoryVal);
        }

        resetAddForm(ctx);
        ctx.saveData();
        ctx.render();
    }

    function setupEnterKey(ctx) {
        if (enterKeyBound) return;
        enterKeyBound = true;

        ['nameInput', 'ageInput', 'taskInput', 'noteInput'].forEach(function(id) {
            var input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    if (input.tagName.toLowerCase() === 'textarea') return;
                    e.preventDefault();
                    addItem(ctx);
                }
            });
        });
    }

    function initAddForm(ctx) {
        var categoryInput = document.getElementById('categoryInput');
        if (categoryInput) {
            categoryInput.value = ctx.getStoredAddCategory() === 'high' ? 'patients' : ctx.getStoredAddCategory();
        }
        setupEnterKey(ctx);
    }

    global.ApexItemFormModule = {
        resetAddForm: resetAddForm,
        addItem: addItem,
        setupEnterKey: setupEnterKey,
        initAddForm: initAddForm
    };
})(window);
