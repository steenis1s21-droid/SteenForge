(function(global) {
    'use strict';

    var renderDebounceTimer = null;
    var wheelScrollInitialized = false;

    function formatTime(date) {
        return new Date(date).toLocaleString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    function render(ctx) {
        var activeList = document.getElementById('activeList');
        var doneList = document.getElementById('doneList');
        if (!activeList || !doneList) return;

        activeList.innerHTML = '';
        doneList.innerHTML = '';

        var sortSelect = document.getElementById('activeSortSelect');
        if (sortSelect) {
            sortSelect.value = ctx.getStoredActiveSortMode();
        }

        var searchInput = document.getElementById('searchInput');
        var searchText = ((searchInput && searchInput.value) || '').toLowerCase();
        var items = ctx.getItems();
        var archivedItems = ctx.getArchivedItems();

        var filteredItems = items.filter(function(x) {
            var normalizedCategory = ctx.normalizeCategoryValue(x.category);
            var categoryTexts = ctx.getCategoryTexts();
            var categoryText = categoryTexts[normalizedCategory] || categoryTexts.highPriority || '';
            return (x.name + ' ' + (x.task || '') + ' ' + (x.note || '') + ' ' + categoryText).toLowerCase().includes(searchText);
        });

        function sortItemsForCategory(categoryItems) {
            return categoryItems.slice().sort(function(a, b) {
                var aPinned = a.pinned ? 1 : 0;
                var bPinned = b.pinned ? 1 : 0;
                if (aPinned !== bPinned) return bPinned - aPinned;
                return (b.updated || 0) - (a.updated || 0);
            });
        }

        function createActiveListItem(p, showCategoryTag, displayCategoryKey) {
            if (showCategoryTag === undefined) showCategoryTag = true;
            if (!displayCategoryKey) displayCategoryKey = ctx.normalizeCategoryValue(p.category);

            var li = document.createElement('li');
            var normalizedPriority = ctx.normalizePriorityValue(p.priority);
            var normalizedCategory = ctx.normalizeCategoryValue(p.category);
            li.className = 'category-item-' + displayCategoryKey;
            if (p.pinned) li.classList.add('pinned-item');

            var priorityText = ctx.getPriorityLabel(normalizedPriority);
            var categoryTexts = ctx.getCategoryTexts();
            var categoryText = categoryTexts[normalizedCategory] || categoryTexts.other;
            var categoryIcon = ctx.getCategoryIcon(normalizedCategory);
            var taskLabel = ctx.t('cardTask');
            var notesLabel = ctx.t('cardNotes');
            var doneBtnText = ctx.t('doneBtn');
            var deleteBtnText = ctx.t('deleteBtn');
            var pinBtnText = p.pinned ? ctx.t('unpinBtn') : ctx.t('pinBtn');
            var noteText = (p.note || '').trim();
            var notesLine = noteText ? '<br><b>' + ctx.escapeHTML(notesLabel) + ':</b> ' + ctx.escapeHTML(noteText) : '';

            var notifIcon = p.notification && p.notification !== '' ? ' 🔔' : '';
            var pinIcon = p.pinned ? ' 📌' : '';
            var ageText = p.age === '' || p.age === null || p.age === undefined ? '' : ' (' + ctx.escapeHTML(p.age) + ')';

            li.innerHTML = '\n            <div class="active-item">\n                <div class="item-content">\n                    <strong>' + ctx.escapeHTML(p.name) + '</strong>' + ageText + pinIcon + '\n                    <br><b>' + ctx.escapeHTML(taskLabel) + ':</b> ' + ctx.escapeHTML(p.task || '') + '\n                    ' + notesLine + '\n                    <br><span style="font-size: 12px; color: var(--text-muted);">' + priorityText + (showCategoryTag ? ' • ' + categoryIcon + ' ' + ctx.escapeHTML(categoryText) : '') + notifIcon + '</span>\n                    <div class=\'litenText\'>' + formatTime(p.updated) + '</div>\n                </div>\n                <div class="item-actions">\n                    <button class="pin-btn" onclick="event.stopPropagation(); togglePin(' + p.id + ')" title="' + ctx.escapeHTML(pinBtnText) + '">' + ctx.escapeHTML(pinBtnText) + '</button>\n                    <button class="done-btn" onclick="event.stopPropagation(); moveToDoneById(' + p.id + ')">' + ctx.escapeHTML(doneBtnText) + '</button>\n                    <button class="delete-btn" onclick="event.stopPropagation(); deleteItem(' + p.id + ')">' + ctx.escapeHTML(deleteBtnText) + '</button>\n                </div>\n            </div>\n        ';

            li.draggable = true;
            li.ondragstart = function() { ctx.startDrag(p.id); };
            li.ondragover = function(e) {
                e.preventDefault();
            };
            li.ondrop = function(e) {
                e.preventDefault();
                e.stopPropagation();
                var dragId = ctx.getDragId();
                if (dragId !== null && dragId !== p.id) {
                    ctx.reorderActiveItems(dragId, p.id);
                }
                ctx.setDragId(null);
            };

            li.onclick = function() {
                if (ctx.getIsDragging()) return;
                ctx.editItem(p.id);
            };

            return li;
        }

        function renderActiveGroup(groupKey, groupTitle, groupItems, showCategoryTag, groupClassName, listClassName) {
            if (!groupItems.length) return;
            if (showCategoryTag === undefined) showCategoryTag = true;
            if (!groupClassName) groupClassName = '';
            if (!listClassName) listClassName = '';

            var collapsedMap = ctx.getActiveGroupsCollapsed();
            var collapsed = collapsedMap[groupKey] === true;
            var groupContainer = document.createElement('li');
            groupContainer.className = 'active-group' + (groupClassName ? ' ' + groupClassName : '');

            groupContainer.innerHTML = '\n            <button type="button" class="active-group-toggle category-' + groupKey + '" data-group-key="' + groupKey + '" onclick="event.stopPropagation(); toggleActiveGroup(\'' + groupKey + '\')">\n                <span class="group-left"><span class="group-arrow">' + (collapsed ? '▸' : '▾') + '</span>' + ctx.escapeHTML(groupTitle) + '</span>\n                <span class="active-group-count">' + groupItems.length + '</span>\n            </button>\n            <ul class="active-group-items' + (listClassName ? ' ' + listClassName : '') + (collapsed ? ' collapsed' : '') + '"></ul>\n        ';

            var groupList = groupContainer.querySelector('.active-group-items');
            ctx.sortActiveItems(groupItems).forEach(function(item) {
                groupList.appendChild(createActiveListItem(item, showCategoryTag, groupKey));
            });

            activeList.appendChild(groupContainer);
        }

        var groupedItems = {
            patients: [],
            authorities: [],
            administration: [],
            private: [],
            games: [],
            other: []
        };

        var highPriorityItems = [];
        var pinnedItems = [];

        filteredItems.forEach(function(item) {
            var normalizedPriority = ctx.normalizePriorityValue(item.priority);
            var normalizedCategory = ctx.normalizeCategoryValue(item.category);

            if (item.pinned) {
                pinnedItems.push(item);
            } else if (normalizedPriority === 'high' || normalizedCategory === 'high') {
                highPriorityItems.push(item);
            } else {
                groupedItems[normalizedCategory].push(item);
            }
        });

        var categoryText = ctx.getCategoryTexts();
        if (pinnedItems.length > 0) {
            renderActiveGroup('pinned', '📌 ' + (ctx.t('pinBtn') || 'Pinned'), sortItemsForCategory(pinnedItems), false, 'pinned-strip', 'pinned-items');
        }
        renderActiveGroup('high', ctx.getCategoryIcon('high') + ' ' + categoryText.high, sortItemsForCategory(highPriorityItems), false, 'high-priority-strip', 'high-priority-items');
        renderActiveGroup('patients', ctx.getCategoryIcon('patients') + ' ' + categoryText.patients, sortItemsForCategory(groupedItems.patients));
        renderActiveGroup('authorities', ctx.getCategoryIcon('authorities') + ' ' + categoryText.authorities, sortItemsForCategory(groupedItems.authorities));
        renderActiveGroup('administration', ctx.getCategoryIcon('administration') + ' ' + categoryText.administration, sortItemsForCategory(groupedItems.administration));
        renderActiveGroup('private', ctx.getCategoryIcon('private') + ' ' + categoryText.private, sortItemsForCategory(groupedItems.private));
        renderActiveGroup('games', ctx.getCategoryIcon('games') + ' ' + categoryText.games, sortItemsForCategory(groupedItems.games));
        renderActiveGroup('other', ctx.getCategoryIcon('other') + ' ' + categoryText.other, sortItemsForCategory(groupedItems.other));

        if (filteredItems.length === 0) {
            var emptyLi = document.createElement('li');
            emptyLi.style.cursor = 'default';
            emptyLi.textContent = ctx.t('activeEmptySearch');
            activeList.appendChild(emptyLi);
        }

        var doneSearchInput = document.getElementById('doneSearchInput');
        var doneSearch = ((doneSearchInput && doneSearchInput.value) || '').toLowerCase();
        archivedItems.filter(function(p) {
            return (p.name + ' ' + (p.task || '') + ' ' + (p.note || '')).toLowerCase().includes(doneSearch);
        }).forEach(function(p) {
            var li = document.createElement('li');
            var ageText = p.age === '' || p.age === null || p.age === undefined ? '' : ' (' + ctx.escapeHTML(p.age) + ')';

            li.innerHTML = '\n            ' + ctx.escapeHTML(p.name) + ageText + ' - ' + ctx.escapeHTML(p.task || '') + '\n            <button class="undo-done-btn" onclick="event.stopPropagation(); restoreArchive(' + p.id + ')">' + ctx.t('restoreBtn') + '</button>\n            <button class="done-btn" onclick="event.stopPropagation(); deleteArchiveItem(' + p.id + ')">' + ctx.t('archiveDelete') + '</button>\n        ';
            li.draggable = true;
            li.ondragstart = function() { ctx.startDrag(p.id); };
            doneList.appendChild(li);
        });

        var activeTitle = document.getElementById('activeTitle');
        if (activeTitle) {
            activeTitle.textContent = ctx.t('activeTitle') + ' (' + items.length + ')';
        }

        var doneTitle = document.getElementById('doneTitle');
        if (doneTitle) {
            doneTitle.textContent = ctx.t('archiveModalTitle') + ' (' + archivedItems.length + ')';
        }

        ctx.updateArchiveVaultButton();
    }

    function toggleActiveGroup(ctx, groupKey) {
        var collapsedMap = ctx.getActiveGroupsCollapsed();
        var collapsed = !(collapsedMap[groupKey] === true);
        collapsedMap[groupKey] = collapsed;
        ctx.setActiveGroupsCollapsed(collapsedMap);
        ctx.saveData();

        var toggle = document.querySelector('.active-group-toggle[data-group-key="' + groupKey + '"]');
        if (!toggle) {
            ctx.renderSelf();
            return;
        }

        var groupList = toggle.parentElement ? toggle.parentElement.querySelector('.active-group-items') : null;
        if (!groupList) {
            ctx.renderSelf();
            return;
        }

        groupList.classList.toggle('collapsed', collapsed);
        var arrow = toggle.querySelector('.group-arrow');
        if (arrow) {
            arrow.textContent = collapsed ? '▸' : '▾';
        }
    }

    function renderDebounced(ctx) {
        if (renderDebounceTimer !== null) {
            clearTimeout(renderDebounceTimer);
        }
        renderDebounceTimer = setTimeout(function() {
            renderDebounceTimer = null;
            ctx.renderSelf();
        }, 120);
    }

    function setupActiveColumnWheelScroll() {
        function isEditableTarget(target) {
            if (!target || !target.closest) return false;
            return !!target.closest('input, textarea, select, [contenteditable="true"]');
        }

        function isArchiveListTarget(target) {
            return !!(target && target.closest && target.closest('.done-column ul'));
        }

        function isScrollableElement(element) {
            if (!element || element === document.body || element === document.documentElement) return false;
            if (element.scrollHeight <= element.clientHeight + 1) return false;

            var style = window.getComputedStyle(element);
            var overflowY = style.overflowY;
            return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
        }

        function canScrollInDirection(element, deltaY) {
            if (!isScrollableElement(element)) return false;
            if (deltaY < 0) return element.scrollTop > 0;
            if (deltaY > 0) return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
            return false;
        }

        function getGroupListFromTarget(target) {
            if (!target || !target.closest) return null;
            var group = target.closest('.active-group');
            if (!group) return null;
            return group.querySelector('.active-group-items');
        }

        function getEditorFromTarget(target) {
            if (!target || !target.closest) return null;
            return target.closest('#editor');
        }

        function getPhonebookFromTarget(target) {
            if (!target || !target.closest) return null;
            return target.closest('#phonebookPanel');
        }

        function getOpenEditor() {
            var editor = document.getElementById('editor');
            if (!editor) return null;
            if (window.getComputedStyle(editor).display === 'none') return null;
            return editor;
        }

        function getOpenPhonebook() {
            var phonebook = document.getElementById('phonebookPanel');
            if (!phonebook) return null;
            if (window.getComputedStyle(phonebook).display === 'none') return null;
            return phonebook;
        }

        function hasOtherScrollableAncestor(target, activeList) {
            var current = target;
            while (current && current !== document.body) {
                if (current === activeList) return false;
                if (activeList && activeList.contains(current)) return false;
                if (isScrollableElement(current)) return true;
                current = current.parentElement;
            }
            return false;
        }

        var activeColumn = document.querySelector('.active-column');
        var activeList = document.getElementById('activeList');
        var archiveList = document.querySelector('.done-column ul');
        if (!activeColumn || !activeList) return;

        if (wheelScrollInitialized) return;
        wheelScrollInitialized = true;

        activeColumn.addEventListener('wheel', function(event) {
            if (isEditableTarget(event.target)) return;
            if (isArchiveListTarget(event.target)) return;

            var panel = getEditorFromTarget(event.target)
                || getPhonebookFromTarget(event.target)
                || getOpenEditor()
                || getOpenPhonebook();

            if (panel && isScrollableElement(panel)) {
                event.preventDefault();
                if (canScrollInDirection(panel, event.deltaY)) {
                    panel.scrollTop += event.deltaY;
                }
                return;
            }

            var groupListFromHeader = getGroupListFromTarget(event.target);
            if (groupListFromHeader) {
                event.preventDefault();
                if (canScrollInDirection(groupListFromHeader, event.deltaY)) {
                    groupListFromHeader.scrollTop += event.deltaY;
                }
                return;
            }

            var nestedList = event.target.closest('.active-group-items');
            if (nestedList && isScrollableElement(nestedList)) {
                event.preventDefault();
                if (canScrollInDirection(nestedList, event.deltaY)) {
                    nestedList.scrollTop += event.deltaY;
                }
                return;
            }

            event.preventDefault();
            activeList.scrollTop += event.deltaY;
        }, { passive: false });

        document.addEventListener('wheel', function(event) {
            if (activeColumn.contains(event.target)) return;
            if (isEditableTarget(event.target)) return;
            if (isArchiveListTarget(event.target)) return;
            if (hasOtherScrollableAncestor(event.target, activeList)) return;

            var openEditor = getOpenEditor();
            if (openEditor && isScrollableElement(openEditor)) {
                event.preventDefault();
                if (canScrollInDirection(openEditor, event.deltaY)) {
                    openEditor.scrollTop += event.deltaY;
                }
                return;
            }

            var openPhonebook = getOpenPhonebook();
            if (openPhonebook && isScrollableElement(openPhonebook)) {
                event.preventDefault();
                if (canScrollInDirection(openPhonebook, event.deltaY)) {
                    openPhonebook.scrollTop += event.deltaY;
                }
                return;
            }

            event.preventDefault();
            activeList.scrollTop += event.deltaY;
        }, { passive: false });

        if (archiveList) {
            archiveList.addEventListener('wheel', function(event) {
                event.preventDefault();
                archiveList.scrollTop += event.deltaY;
            }, { passive: false });
        }
    }

    global.ApexActiveRenderingModule = {
        formatTime: formatTime,
        render: render,
        toggleActiveGroup: toggleActiveGroup,
        renderDebounced: renderDebounced,
        setupActiveColumnWheelScroll: setupActiveColumnWheelScroll
    };
})(window);
