(function(global) {
    var isAdminLoggedIn = false;
    var editAdminIndex = -1;

    function getAdminPasswordHash(ctx) {
        var stored = localStorage.getItem('adminPasswordHash');
        if (stored && isPasswordHashed(stored)) return stored;
        return hashPassword('admin123');
    }

    function showAdminLogin(ctx) {
        if (isAdminLoggedIn) {
            openAdminPanel(ctx);
            return;
        }

        var overlay = document.getElementById('adminLoginOverlay');
        var passwordInput = document.getElementById('adminPasswordInput');
        var error = document.getElementById('adminLoginError');
        if (!overlay || !passwordInput || !error) return;

        overlay.style.display = 'flex';
        passwordInput.value = '';
        error.textContent = '';
        passwordInput.focus();
    }

    function closeAdminLogin() {
        var overlay = document.getElementById('adminLoginOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    function adminLogin(ctx) {
        var inputEl = document.getElementById('adminPasswordInput');
        var errorDiv = document.getElementById('adminLoginError');
        if (!inputEl || !errorDiv) return;

        var input = inputEl.value;
        if (hashPassword(input) === getAdminPasswordHash(ctx)) {
            isAdminLoggedIn = true;
            errorDiv.textContent = '';
            closeAdminLogin();
            openAdminPanel(ctx);
            return;
        }

        errorDiv.textContent = ctx.t('adminLoginError');
        inputEl.value = '';
    }

    function openAdminPanel(ctx) {
        var panel = document.getElementById('adminPanel');
        var date = document.getElementById('adminDate');
        if (!panel || !date) return;

        panel.style.display = 'flex';
        date.value = new Date().toISOString().split('T')[0];
        renderAdminList(ctx);
    }

    function closeAdminPanel() {
        var panel = document.getElementById('adminPanel');
        if (panel) panel.style.display = 'none';
        editAdminIndex = -1;
    }

    function addAdminItem(ctx) {
        var titleEl = document.getElementById('adminTitle');
        var descEl = document.getElementById('adminDesc');
        var typeEl = document.getElementById('adminType');
        var dateEl = document.getElementById('adminDate');
        if (!titleEl || !descEl || !typeEl || !dateEl) return;

        var title = titleEl.value.trim();
        var desc = descEl.value.trim();
        var type = typeEl.value;
        var date = dateEl.value || 'Planerat';

        if (!title || !desc) {
            alert(ctx.t('adminMissingFields'));
            return;
        }

        var updates = ctx.getAdminUpdates();
        var newItem = { type: type, date: date, title: title, description: desc };

        if (editAdminIndex >= 0) {
            updates[editAdminIndex] = newItem;
            editAdminIndex = -1;
        } else {
            updates.unshift(newItem);
        }

        ctx.saveAdminUpdates(updates);
        clearAdminForm();
        renderAdminList(ctx);
        renderInfoContent(ctx);
        ctx.showMessage(ctx.t('adminSavedMessage'), 'success');
    }

    function deleteAdminItem(ctx, index) {
        if (!confirm(ctx.t('adminDeleteConfirm'))) return;

        var updates = ctx.getAdminUpdates();
        updates.splice(index, 1);
        ctx.saveAdminUpdates(updates);
        renderAdminList(ctx);
        renderInfoContent(ctx);
        ctx.showMessage(ctx.t('adminDeletedMessage'), 'info');
    }

    function editAdminItem(ctx, index) {
        var updates = ctx.getAdminUpdates();
        var item = updates[index];
        if (!item) return;

        var titleEl = document.getElementById('adminTitle');
        var descEl = document.getElementById('adminDesc');
        var typeEl = document.getElementById('adminType');
        var dateEl = document.getElementById('adminDate');
        if (!titleEl || !descEl || !typeEl || !dateEl) return;

        titleEl.value = item.title;
        descEl.value = item.description;
        typeEl.value = item.type;
        dateEl.value = item.date !== 'Planerat' ? item.date : '';

        editAdminIndex = index;
        var content = document.querySelector('#adminPanel .admin-content');
        if (content) content.scrollTop = 0;
    }

    function clearAdminForm() {
        var titleEl = document.getElementById('adminTitle');
        var descEl = document.getElementById('adminDesc');
        var typeEl = document.getElementById('adminType');
        var dateEl = document.getElementById('adminDate');
        if (!titleEl || !descEl || !typeEl || !dateEl) return;

        titleEl.value = '';
        descEl.value = '';
        typeEl.value = 'new';
        dateEl.value = new Date().toISOString().split('T')[0];
        editAdminIndex = -1;
    }

    function renderAdminList(ctx) {
        var container = document.getElementById('adminList');
        if (!container) return;

        var updates = ctx.sortUpdatesByType(ctx.getAdminUpdates().map(function(item, index) {
            return Object.assign({ originalIndex: index }, item);
        }));

        if (updates.length === 0) {
            container.innerHTML = '<p id="adminEmptyText" style="color: var(--text-muted);">' + ctx.t('adminEmptyText') + '</p>';
            return;
        }

        var html = '';
        updates.forEach(function(item) {
            var badgeClass = ctx.getUpdateBadgeClass(item.type);
            var badgeText = ctx.getUpdateBadgeText(item.type);

            html += '\n            <div class="admin-item">\n                <div class="item-info">\n                    <div class="title">' + ctx.escapeHTML(item.title) + '</div>\n                    <div class="desc">\n                        <span class="badge ' + badgeClass + '" style="font-size: 10px;">' + badgeText + '</span>\n                        ' + ctx.escapeHTML(item.date) + ' - ' + ctx.escapeHTML(item.description) + '\n                    </div>\n                </div>\n                <div class="item-actions">\n                    <button class="edit-btn" onclick="editAdminItem(' + item.originalIndex + ')">✏️</button>\n                    <button class="delete-btn" onclick="deleteAdminItem(' + item.originalIndex + ')">✕</button>\n                </div>\n            </div>\n        ';
        });

        container.innerHTML = html;
    }

    function renderInfoContent(ctx) {
        var container = document.getElementById('infoContent');
        if (!container) return;

        var updates = ctx.sortUpdatesByType(ctx.getAdminUpdates());
        if (!updates.length) {
            container.innerHTML = '<p style="color: var(--text-muted);">' + ctx.t('adminEmptyText') + '</p>';
            return;
        }

        var html = '';
        updates.forEach(function(item) {
            html += '<div class="info-update-item">'
                + '<div class="title">' + ctx.escapeHTML(item.title || '') + '</div>'
                + '<div class="desc">'
                + '<span class="badge ' + ctx.escapeHTML(ctx.getUpdateBadgeClass(item.type)) + '">' + ctx.escapeHTML(ctx.getUpdateBadgeText(item.type)) + '</span> '
                + ctx.escapeHTML(item.date || '') + ' - ' + ctx.escapeHTML(item.description || '')
                + '</div>'
                + '</div>';
        });

        container.innerHTML = html;
    }

    function saveAdminChanges(ctx) {
        renderAdminList(ctx);
        renderInfoContent(ctx);
        ctx.showMessage(ctx.t('adminChangesSavedMessage'), 'success');
    }

    global.ApexAdminUpdatesModule = {
        getAdminPasswordHash: getAdminPasswordHash,
        showAdminLogin: showAdminLogin,
        closeAdminLogin: closeAdminLogin,
        adminLogin: adminLogin,
        openAdminPanel: openAdminPanel,
        closeAdminPanel: closeAdminPanel,
        addAdminItem: addAdminItem,
        deleteAdminItem: deleteAdminItem,
        editAdminItem: editAdminItem,
        clearAdminForm: clearAdminForm,
        renderAdminList: renderAdminList,
        renderInfoContent: renderInfoContent,
        saveAdminChanges: saveAdminChanges
    };
})(window);
