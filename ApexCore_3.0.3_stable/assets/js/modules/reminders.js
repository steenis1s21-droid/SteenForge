(function(global) {
    var notificationInterval = null;

    function getReminderElements(prefix) {
        var hidden = document.getElementById(prefix + 'Input') || document.getElementById(prefix);
        var dateInput = document.getElementById(prefix + 'Date');
        var hourSelect = document.getElementById(prefix + 'Hour');
        var minuteSelect = document.getElementById(prefix + 'Minute');
        var display = document.getElementById(prefix + 'DisplayText');
        return { hidden: hidden, dateInput: dateInput, hourSelect: hourSelect, minuteSelect: minuteSelect, display: display };
    }

    function fillReminderSelect(selectId, start, end) {
        var select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '';
        for (var i = start; i <= end; i++) {
            var value = String(i).padStart(2, '0');
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        }
    }

    function getTodayReminderDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function getCurrentReminderTime() {
        var now = new Date();
        return {
            hour: String(now.getHours()).padStart(2, '0'),
            minute: String(now.getMinutes()).padStart(2, '0')
        };
    }

    function formatReminderValue(ctx, value) {
        if (!value) return ctx.t('reminderSelect');

        var match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
        if (match) {
            return match[3] + '/' + match[2] + '/' + match[1] + ' ' + match[4] + ':' + match[5];
        }

        return value;
    }

    function populateReminderFields(ctx, prefix, value) {
        var elements = getReminderElements(prefix);
        var hidden = elements.hidden;
        var dateInput = elements.dateInput;
        var hourSelect = elements.hourSelect;
        var minuteSelect = elements.minuteSelect;
        var display = elements.display;

        if (!hidden || !dateInput || !hourSelect || !minuteSelect || !display) return;

        if (!value) {
            var today = getTodayReminderDate();
            var currentTime = getCurrentReminderTime();
            dateInput.value = today;
            hourSelect.value = currentTime.hour;
            minuteSelect.value = currentTime.minute;
            hidden.value = '';
            display.textContent = ctx.t('reminderSelect');
            return;
        }

        var match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
        if (match) {
            dateInput.value = match[1] + '-' + match[2] + '-' + match[3];
            hourSelect.value = match[4];
            minuteSelect.value = match[5];
            hidden.value = value;
            display.textContent = formatReminderValue(ctx, value);
            return;
        }

        hidden.value = value;
        display.textContent = formatReminderValue(ctx, value);
    }

    function syncReminderValue(ctx, prefix) {
        var elements = getReminderElements(prefix);
        var hidden = elements.hidden;
        var dateInput = elements.dateInput;
        var hourSelect = elements.hourSelect;
        var minuteSelect = elements.minuteSelect;
        var display = elements.display;

        if (!hidden || !dateInput || !hourSelect || !minuteSelect || !display) return;

        if (!dateInput.value) {
            dateInput.value = getTodayReminderDate();
        }

        if (!hourSelect.value || !minuteSelect.value) {
            var currentTime = getCurrentReminderTime();
            hourSelect.value = hourSelect.value || currentTime.hour;
            minuteSelect.value = minuteSelect.value || currentTime.minute;
        }

        hidden.value = dateInput.value + 'T' + hourSelect.value + ':' + minuteSelect.value;
        display.textContent = formatReminderValue(ctx, hidden.value);
    }

    function prepareReminderPicker(ctx, prefix) {
        var elements = getReminderElements(prefix);
        if (!elements.hidden) return;

        if (elements.hidden.value) {
            populateReminderFields(ctx, prefix, elements.hidden.value);
        } else {
            populateReminderFields(ctx, prefix, '');
        }
    }

    function openReminderEditor(ctx, prefix) {
        var panel = document.getElementById(prefix + 'PickerPanel');
        if (!panel) return;

        document.querySelectorAll('.reminder-picker-panel').forEach(function(item) {
            item.classList.remove('open');
        });

        prepareReminderPicker(ctx, prefix);
        panel.classList.add('open');
    }

    function toggleReminderEditor(ctx, prefix) {
        var panel = document.getElementById(prefix + 'PickerPanel');
        if (!panel) return;

        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
            return;
        }

        document.querySelectorAll('.reminder-picker-panel').forEach(function(item) {
            item.classList.remove('open');
        });

        prepareReminderPicker(ctx, prefix);
        panel.classList.add('open');
    }

    function closeReminderEditor(prefix) {
        var panel = document.getElementById(prefix + 'PickerPanel');
        if (panel) {
            panel.classList.remove('open');
        }
    }

    function applyReminderValue(ctx, prefix) {
        syncReminderValue(ctx, prefix);
        closeReminderEditor(prefix);
    }

    function updateReminderLanguageText(ctx) {
        var notificationInput = document.getElementById('notificationInput');
        var editNotificationInput = document.getElementById('editNotification');

        populateReminderFields(ctx, 'notification', notificationInput ? notificationInput.value : '');
        populateReminderFields(ctx, 'editNotification', editNotificationInput ? editNotificationInput.value : '');

        var okBtn = document.getElementById('notificationOkBtn');
        if (okBtn) okBtn.textContent = ctx.t('reminderOk');
        var closeBtn = document.getElementById('notificationCloseBtn');
        if (closeBtn) closeBtn.textContent = ctx.t('reminderClose');
        var editOkBtn = document.getElementById('editNotificationOkBtn');
        if (editOkBtn) editOkBtn.textContent = ctx.t('reminderOk');
        var editCloseBtn = document.getElementById('editNotificationCloseBtn');
        if (editCloseBtn) editCloseBtn.textContent = ctx.t('reminderClose');
    }

    function initReminderInputs(ctx) {
        fillReminderSelect('notificationHour', 0, 23);
        fillReminderSelect('notificationMinute', 0, 59);
        fillReminderSelect('editNotificationHour', 0, 23);
        fillReminderSelect('editNotificationMinute', 0, 59);
        populateReminderFields(ctx, 'notification', '');
        populateReminderFields(ctx, 'editNotification', '');
    }

    function showNotificationPopup(ctx, item) {
        var popup = document.getElementById('notificationPopup');
        var title = document.getElementById('notifTitle');
        var body = document.getElementById('notifBody');
        if (!popup || !title || !body) return;

        ctx.playNotificationSound();

        var priorityText = ctx.getPriorityBadgeText(item.priority);
        var notifTitle = ctx.t('notifTitle').replace('{name}', item.name);
        var notifBody = ctx.t('notifBody')
            .replace('{task}', item.task || '')
            .replace('{priority}', priorityText)
            .replace('{note}', item.note || '');

        title.textContent = notifTitle;
        body.textContent = notifBody;
        popup.style.display = 'block';

        setTimeout(function() {
            closeNotificationPopup();
        }, 15000);
    }

    function closeNotificationPopup() {
        var popup = document.getElementById('notificationPopup');
        if (popup) popup.style.display = 'none';
    }

    function checkNotifications(ctx) {
        if (notificationInterval) {
            clearInterval(notificationInterval);
            notificationInterval = null;
        }

        notificationInterval = setInterval(function() {
            var now = new Date().getTime();

            ctx.getItems().forEach(function(item) {
                if (item.notification && item.notification !== '') {
                    try {
                        var notifTime = new Date(item.notification).getTime();
                        if (notifTime > 0 && now >= notifTime && now < notifTime + 5000) {
                            if (!item.notificationShown) {
                                item.notificationShown = true;
                                showNotificationPopup(ctx, item);
                                ctx.saveData();
                            }
                        }
                    } catch (e) {
                        // ignore invalid reminder date values
                    }
                }
            });
        }, 5000);
    }

    global.ApexRemindersModule = {
        checkNotifications: checkNotifications,
        showNotificationPopup: showNotificationPopup,
        closeNotificationPopup: closeNotificationPopup,
        fillReminderSelect: fillReminderSelect,
        formatReminderValue: formatReminderValue,
        getTodayReminderDate: getTodayReminderDate,
        getCurrentReminderTime: getCurrentReminderTime,
        getReminderElements: getReminderElements,
        populateReminderFields: populateReminderFields,
        syncReminderValue: syncReminderValue,
        prepareReminderPicker: prepareReminderPicker,
        openReminderEditor: openReminderEditor,
        toggleReminderEditor: toggleReminderEditor,
        closeReminderEditor: closeReminderEditor,
        applyReminderValue: applyReminderValue,
        updateReminderLanguageText: updateReminderLanguageText,
        initReminderInputs: initReminderInputs
    };
})(window);
