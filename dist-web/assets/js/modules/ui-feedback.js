(function(global) {
    'use strict';

    var messageTimer = null;

    function showMessage(text, type) {
        if (!type) type = 'info';
        var msg = document.getElementById('message');
        if (!msg) return;

        msg.textContent = text;
        msg.className = 'message ' + type;
        msg.style.display = 'block';

        if (messageTimer) {
            clearTimeout(messageTimer);
        }

        messageTimer = setTimeout(function() {
            msg.style.display = 'none';
        }, 4000);
    }

    function showProgress(text) {
        var progressText = document.getElementById('progressText');
        var progressOverlay = document.getElementById('progressOverlay');
        if (progressText) progressText.textContent = text;
        if (progressOverlay) progressOverlay.style.display = 'flex';
    }

    function hideProgress() {
        var progressOverlay = document.getElementById('progressOverlay');
        if (progressOverlay) progressOverlay.style.display = 'none';
    }

    global.ApexUIFeedbackModule = {
        showMessage: showMessage,
        showProgress: showProgress,
        hideProgress: hideProgress
    };
})(window);
