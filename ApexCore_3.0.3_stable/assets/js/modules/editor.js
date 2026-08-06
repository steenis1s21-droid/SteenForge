(function(global) {
    var activeEditId = null;
    var editorOriginalParent = null;
    var editorOriginalNextSibling = null;
    var isSaveEditConfirmOpen = false;
    var hasOutsideClickHandler = false;

    function editItem(ctx, id) {
        var items = ctx.getItems();
        var p = items.find(function(item) { return item.id === id; });
        if (!p) return;

        activeEditId = id;

        document.getElementById('editName').value = p.name;
        document.getElementById('editAge').value = p.age;
        document.getElementById('editTask').value = p.task || '';
        document.getElementById('editNote').value = p.note || '';
        document.getElementById('editCategory').value = ctx.normalizeCategoryValue(p.category);
        document.getElementById('editNotification').value = p.notification || '';
        ctx.populateReminderFields('editNotification', p.notification || '');

        setEditorInlineMode(true);
        document.getElementById('editor').style.display = 'block';
    }

    function setEditorInlineMode(isInline) {
        var editor = document.getElementById('editor');
        var activeColumn = document.getElementById('activeDrop');
        if (!editor || !activeColumn) return;

        if (isInline) {
            if (!editorOriginalParent) {
                editorOriginalParent = editor.parentNode;
            }
            editorOriginalNextSibling = editor.nextSibling;

            activeColumn.classList.add('is-editing');
            editor.classList.add('inline-editor');
            activeColumn.appendChild(editor);
            return;
        }

        activeColumn.classList.remove('is-editing');
        editor.classList.remove('inline-editor');

        if (!editorOriginalParent) return;

        if (editorOriginalNextSibling && editorOriginalNextSibling.parentNode === editorOriginalParent) {
            editorOriginalParent.insertBefore(editor, editorOriginalNextSibling);
            return;
        }

        editorOriginalParent.appendChild(editor);
    }

    function showSaveEditConfirm(ctx, onConfirm) {
        var modal = document.getElementById('saveEditConfirmModal');
        var title = document.getElementById('saveEditConfirmTitle');
        var text = document.getElementById('saveEditConfirmText');
        var confirmBtn = document.getElementById('saveEditConfirmOkBtn');
        var cancelBtn = document.getElementById('saveEditConfirmCancelBtn');

        if (!modal || !title || !text || !confirmBtn || !cancelBtn) {
            if (confirm(ctx.t('confirmSaveEdit'))) {
                onConfirm();
            }
            return;
        }

        title.textContent = ctx.t('confirmDialogTitle');
        text.textContent = ctx.t('confirmSaveEdit');
        cancelBtn.textContent = ctx.t('editCancel');
        confirmBtn.textContent = ctx.t('editSave');

        isSaveEditConfirmOpen = true;
        modal.style.display = 'flex';

        function cleanup() {
            modal.style.display = 'none';
            isSaveEditConfirmOpen = false;
            modal.onclick = null;
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            document.removeEventListener('keydown', onKeyDown);
        }

        function cancelConfirm() {
            cleanup();
        }

        function approveConfirm() {
            cleanup();
            onConfirm();
        }

        function onKeyDown(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                cancelConfirm();
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                approveConfirm();
            }
        }

        modal.onclick = function(event) {
            if (event.target === modal) {
                cancelConfirm();
            }
        };

        cancelBtn.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            cancelConfirm();
        };

        confirmBtn.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            approveConfirm();
        };

        document.addEventListener('keydown', onKeyDown);
        setTimeout(function() {
            confirmBtn.focus();
        }, 0);
    }

    function saveEdit(ctx) {
        var items = ctx.getItems();
        var p = items.find(function(item) { return item.id === activeEditId; });
        if (!p) return;

        showSaveEditConfirm(ctx, function() {
            var editAgeInput = document.getElementById('editAge').value.trim();
            var editAgeVal = editAgeInput === '' ? '' : parseInt(editAgeInput, 10);

            p.name = document.getElementById('editName').value;
            p.age = editAgeVal;
            p.task = document.getElementById('editTask').value;
            p.note = document.getElementById('editNote').value;
            p.category = ctx.normalizeCategoryValue(document.getElementById('editCategory').value);
            p.priority = p.category === 'high' ? 'high' : 'normal';
            p.notification = document.getElementById('editNotification').value || '';
            ctx.populateReminderFields('editNotification', p.notification || '');
            p.notificationShown = false;
            p.updated = Date.now();

            closeEdit(ctx);
            ctx.saveData();
            ctx.render();
        });
    }

    function closeEdit(ctx) {
        ctx.closeReminderEditor('editNotification');
        document.getElementById('editor').style.display = 'none';
        setEditorInlineMode(false);
        activeEditId = null;
    }

    function initEditorAutoClose(ctx) {
        if (hasOutsideClickHandler) return;
        hasOutsideClickHandler = true;

        document.addEventListener('mousedown', function(e) {
            var editor = document.getElementById('editor');
            if (!editor || editor.style.display !== 'block') return;

            if (isSaveEditConfirmOpen) return;

            if (!editor.contains(e.target)) {
                closeEdit(ctx);
            }
        });
    }

    global.ApexEditorModule = {
        editItem: editItem,
        setEditorInlineMode: setEditorInlineMode,
        showSaveEditConfirm: showSaveEditConfirm,
        saveEdit: saveEdit,
        closeEdit: closeEdit,
        initEditorAutoClose: initEditorAutoClose
    };
})(window);
