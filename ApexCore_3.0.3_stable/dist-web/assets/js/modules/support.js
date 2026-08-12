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
            subtitle: 'Beskriv ditt problem sa oppnar vi ett forifyllt GitHub-arende.',
            name: 'Namn',
            email: 'E-post',
            subject: 'Amne',
            message: 'Meddelande',
            cancel: 'Avbryt',
            send: 'Skapa arende',
            opening: 'Oppnar supportarande...',
            subjectRequired: 'Ange ett amne.',
            messageRequired: 'Ange ett meddelande.'
        };
    }

    function getEl(id) {
        return document.getElementById(id);
    }

    function createOverlayMarkup(texts) {
        return [
            '<div class="support-sheet" style="width:min(620px,92vw);max-height:92vh;overflow:auto;background:#fff;border:1px solid #d8dde6;border-radius:14px;box-shadow:0 24px 48px rgba(0,0,0,0.24);padding:18px 18px 14px;">',
            '<h3 style="margin:0 0 6px;font-size:22px;">', texts.title, '</h3>',
            '<p style="margin:0 0 14px;color:#475467;font-size:13px;">', texts.subtitle, '</p>',
            '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">', texts.name, '</label>',
            '<input id="supportNameInput" type="text" style="width:100%;margin-bottom:10px;padding:10px;border:1px solid #cfd4dc;border-radius:10px;">',
            '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">', texts.email, '</label>',
            '<input id="supportEmailInput" type="email" style="width:100%;margin-bottom:10px;padding:10px;border:1px solid #cfd4dc;border-radius:10px;">',
            '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">', texts.subject, '</label>',
            '<input id="supportSubjectInput" type="text" style="width:100%;margin-bottom:10px;padding:10px;border:1px solid #cfd4dc;border-radius:10px;">',
            '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">', texts.message, '</label>',
            '<textarea id="supportMessageInput" rows="7" style="width:100%;margin-bottom:12px;padding:10px;border:1px solid #cfd4dc;border-radius:10px;resize:vertical;"></textarea>',
            '<div style="display:flex;gap:8px;justify-content:flex-end;">',
            '<button id="supportCancelBtn" type="button" style="padding:9px 12px;border:1px solid #cfd4dc;border-radius:10px;background:#fff;cursor:pointer;">', texts.cancel, '</button>',
            '<button id="supportSendBtn" type="button" style="padding:9px 12px;border:1px solid #0f172a;border-radius:10px;background:#111827;color:#fff;cursor:pointer;">', texts.send, '</button>',
            '</div>',
            '</div>'
        ].join('');
    }

    function ensureOverlay(texts) {
        var overlay = getEl(OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.display = 'none';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.background = 'rgba(9, 16, 28, 0.58)';
            overlay.style.zIndex = '6000';
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
