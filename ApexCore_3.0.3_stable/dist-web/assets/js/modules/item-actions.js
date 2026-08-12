(function(global) {
    'use strict';

    var dropZonesInitialized = false;

    function getItems(ctx) {
        return ctx.getItems() || [];
    }

    function getArchivedItems(ctx) {
        return ctx.getArchivedItems() || [];
    }

    function getDeletedItem(ctx) {
        return typeof ctx.getDeletedItem === 'function' ? ctx.getDeletedItem() : null;
    }

    function setDeletedItem(ctx, value) {
        if (typeof ctx.setDeletedItem === 'function') {
            ctx.setDeletedItem(value);
        }
    }

    function moveToDoneById(ctx, id) {
        var items = getItems(ctx);
        var archivedItems = getArchivedItems(ctx);
        var index = items.findIndex(function(item) { return item.id === id; });
        if (index === -1) return;

        archivedItems.push(items[index]);
        items.splice(index, 1);
        ctx.saveData();
        ctx.render();
        ctx.showMessage(ctx.t('archiveArchived'), 'success');
    }

    function moveToActiveById(ctx, id) {
        var items = getItems(ctx);
        var archivedItems = getArchivedItems(ctx);
        var index = archivedItems.findIndex(function(item) { return item.id === id; });
        if (index === -1) return;

        items.push(archivedItems[index]);
        archivedItems.splice(index, 1);
        ctx.saveData();
        ctx.render();
        ctx.showMessage(ctx.t('archiveRestored'), 'info');
    }

    function deleteItem(ctx, id) {
        var items = getItems(ctx);
        var index = items.findIndex(function(item) { return item.id === id; });
        if (index === -1) return;

        setDeletedItem(ctx, items[index]);
        items.splice(index, 1);

        var undoBar = document.getElementById('undoBar');
        if (undoBar) undoBar.style.display = 'block';

        setTimeout(function() {
            var laterUndoBar = document.getElementById('undoBar');
            if (laterUndoBar) laterUndoBar.style.display = 'none';
            setDeletedItem(ctx, null);
        }, 5000);

        ctx.saveData();
        ctx.render();
    }

    function undoDelete(ctx) {
        var deletedItem = getDeletedItem(ctx);
        if (deletedItem) {
            var items = getItems(ctx);
            items.push(deletedItem);
            setDeletedItem(ctx, null);
            var undoBar = document.getElementById('undoBar');
            if (undoBar) undoBar.style.display = 'none';
            ctx.saveData();
            ctx.render();
        }
    }

    function startDrag(ctx, id) {
        ctx.setDragId(id);
        ctx.setIsDragging(true);
        setTimeout(function() {
            ctx.setIsDragging(false);
        }, 100);
    }

    function moveToDone(ctx, id) {
        moveToDoneById(ctx, id);
    }

    function moveToActive(ctx, id) {
        moveToActiveById(ctx, id);
    }

    function reorderActiveItems(ctx, fromId, toId) {
        if (fromId === null || toId === null || fromId === toId) return;

        var items = getItems(ctx);
        var fromIndex = items.findIndex(function(item) { return item.id === fromId; });
        var toIndex = items.findIndex(function(item) { return item.id === toId; });
        if (fromIndex === -1 || toIndex === -1) return;

        var movedItem = items.splice(fromIndex, 1)[0];
        var insertIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
        items.splice(insertIndex, 0, movedItem);

        ctx.saveData();
        ctx.render();
        ctx.showMessage(ctx.t('msgOrderUpdated'), 'info');
    }

    function initItemDropZones(ctx) {
        if (dropZonesInitialized) return;
        var activeDrop = document.getElementById('activeDrop');
        var doneDrop = document.getElementById('doneDrop');
        if (!activeDrop || !doneDrop) return;

        dropZonesInitialized = true;

        activeDrop.ondragover = function(e) {
            e.preventDefault();
        };

        doneDrop.ondragover = function(e) {
            e.preventDefault();
        };

        doneDrop.ondrop = function() {
            var dragId = typeof ctx.getDragId === 'function' ? ctx.getDragId() : null;
            if (dragId !== null) {
                moveToDone(ctx, dragId);
                ctx.setDragId(null);
            }
        };

        activeDrop.ondrop = function() {
            var dragId = typeof ctx.getDragId === 'function' ? ctx.getDragId() : null;
            if (dragId !== null) {
                moveToActive(ctx, dragId);
                ctx.setDragId(null);
            }
        };
    }

    global.ApexItemActionsModule = {
        moveToDoneById: moveToDoneById,
        moveToActiveById: moveToActiveById,
        deleteItem: deleteItem,
        undoDelete: undoDelete,
        startDrag: startDrag,
        moveToDone: moveToDone,
        moveToActive: moveToActive,
        reorderActiveItems: reorderActiveItems,
        initItemDropZones: initItemDropZones
    };
})(window);
