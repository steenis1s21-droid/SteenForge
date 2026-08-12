(function(global) {
    'use strict';

    var SUPPORT_ISSUE_URL = 'https://github.com/steenis1s21-droid/SteenForge/issues/new';
    var OVERLAY_ID = 'supportFormOverlay';

    function getLang(ctx) {
        if (ctx && typeof ctx.getLang === 'function') {
            return ctx.getLang();
        }
        return 'sv';
    }

    function getTexts(lang) {
        if (lang === 'en') {
            return {
                title: 'Support',
                subtitle: 'Describe your issue and we will open a prefilled GitHub issue.',
                name: 'Name',
                email: 'Email',
                subject: 'Subject',
                message: 'Message',
                cancel: 'Cancel',
                send: 'Create issue',
                opening: 'Opening support issue...',
                subjectRequired: 'Please enter a subject.',
                messageRequired: 'Please enter a message.'
            };
        }

        return {
            title: 'Support',
            subtitle: 'Beskriv ditt problem så öppnar vi ett förifyllt GitHub-ärende.',
            name: 'Namn',
            email: 'E-post',
            subject: 'Ämne',
            message: 'Meddelande',
            cancel: 'Avbryt',
            send: 'Skapa ärende',
            opening: 'Öppnar supportärende...',
            subjectRequired: 'Ange ett ämne.',
            messageRequired: 'Ange ett meddelande.'
        };
    }

    function getEl(id) {
        return document.getElementById(id);
    }

    function createOverlayMarkup(texts) {
        return [
            '<div class="support-sheet">',
            '<div class="support-sheet-header">',
            '<h3 class="support-sheet-title">', texts.title, '</h3>',
            '<p class="support-sheet-subtitle">', texts.subtitle, '</p>',
            '</div>',
            '<div class="support-form-field">',
            '<label for="supportNameInput">', texts.name, '</label>',
            '<input id="supportNameInput" type="text" autocomplete="name">',
            '</div>',
            '<div class="support-form-field">',
            '<label for="supportEmailInput">', texts.email, '</label>',
            '<input id="supportEmailInput" type="email" autocomplete="email">',
            '</div>',
            '<div class="support-form-field">',
            '<label for="supportSubjectInput">', texts.subject, '</label>',
            '<input id="supportSubjectInput" type="text">',
            '</div>',
            '<div class="support-form-field">',
            '<label for="supportMessageInput">', texts.message, '</label>',
            '<textarea id="supportMessageInput" rows="7"></textarea>',
            '</div>',
            '<div class="support-actions">',
            '<button id="supportCancelBtn" class="support-btn-secondary" type="button">', texts.cancel, '</button>',
            '<button id="supportSendBtn" class="support-btn-primary" type="button">', texts.send, '</button>',
            '</div>',
            '</div>'
        ].join('');
    }

    function ensureOverlay(texts) {
        var overlay = getEl(OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.style.display = 'none';
            overlay.innerHTML = createOverlayMarkup(texts);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeSupportForm();
                }
            });
        }

        return overlay;
    }

    function closeSupportForm() {
        var overlay = getEl(OVERLAY_ID);
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    function buildIssueBody(name, email, message) {
        var lines = [
            '### Support message',
            '',
            '**Name:** ' + (name || '-'),
            '**Email:** ' + (email || '-'),
            '',
            '### Problem description',
            message || '-',
            '',
            '---',
            '**Source:** ApexCore support form',
            '**Page:** ' + window.location.href,
            '**User agent:** ' + navigator.userAgent
        ];

        return lines.join('\n');
    }

    function submitSupportForm(ctx, texts) {
        var name = (getEl('supportNameInput').value || '').trim();
        var email = (getEl('supportEmailInput').value || '').trim();
        var subject = (getEl('supportSubjectInput').value || '').trim();
        var message = (getEl('supportMessageInput').value || '').trim();

        if (!subject) {
            if (ctx && typeof ctx.showMessage === 'function') {
                ctx.showMessage(texts.subjectRequired, 'error');
            }
            return;
        }

        if (!message) {
            if (ctx && typeof ctx.showMessage === 'function') {
                ctx.showMessage(texts.messageRequired, 'error');
            }
            return;
        }

        var body = buildIssueBody(name, email, message);
        var url = SUPPORT_ISSUE_URL + '?title=' + encodeURIComponent('[Support] ' + subject) + '&body=' + encodeURIComponent(body);

        window.open(url, '_blank');
        closeSupportForm();

        if (ctx && typeof ctx.showMessage === 'function') {
            ctx.showMessage(texts.opening, 'info');
        }
    }

    function wireOverlayEvents(ctx, texts) {
        var cancelBtn = getEl('supportCancelBtn');
        var sendBtn = getEl('supportSendBtn');
        var messageInput = getEl('supportMessageInput');

        if (cancelBtn) {
            cancelBtn.onclick = closeSupportForm;
        }

        if (sendBtn) {
            sendBtn.onclick = function() {
                submitSupportForm(ctx, texts);
            };
        }

        if (messageInput) {
            messageInput.onkeydown = function(event) {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                    submitSupportForm(ctx, texts);
                }
            };
        }
    }

    function openSupportCenter(ctx) {
        var texts = getTexts(getLang(ctx));
        var overlay = ensureOverlay(texts);
        wireOverlayEvents(ctx, texts);

        overlay.style.display = 'flex';

        var subjectInput = getEl('supportSubjectInput');
        if (subjectInput) {
            subjectInput.focus();
        }
    }

    global.ApexSupportModule = {
        openSupportCenter: openSupportCenter,
        closeSupportForm: closeSupportForm
    };
})(window);
