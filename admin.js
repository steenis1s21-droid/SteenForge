(function() {
  'use strict';

  var REPO_OWNER = 'steenis1s21-droid';
  var REPO_NAME = 'SteenForge';
  var ABOUT_PATH = 'about.json';
  var API_BASE = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME;
  var TOKEN_KEY = 'sf-admin-token';
  var LANGUAGES = ['sv', 'en', 'da', 'no', 'fi'];

  var token = null;
  var isPublishing = false;

  // --- DOM refs ---
  var $ = function(id) { return document.getElementById(id); };
  var loginOverlay = $('adminLoginOverlay');
  var editorPanel = $('adminEditorPanel');
  var tokenInput = $('adminTokenInput');
  var loginStatus = $('adminLoginStatus');
  var publishStatus = $('adminPublishStatus');

  // --- Helpers ---
  function setStatus(el, msg, type) {
    el.textContent = msg;
    el.className = 'admin-status';
    if (type) el.classList.add('admin-status--' + type);
  }

  function clearStatus(el) {
    el.textContent = '';
    el.className = 'admin-status';
  }

  function getHeaders(useToken) {
    var activeToken = useToken || token;
    return {
      'Authorization': 'Bearer ' + activeToken,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  // --- Token storage (session only, cleared on tab close) ---
  function getStoredToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch(e) { return null; }
  }

  function storeToken(t) {
    try { sessionStorage.setItem(TOKEN_KEY, t); } catch(e) {}
  }

  function clearStoredToken() {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch(e) {}
  }

  // --- GitHub API ---
  function verifyToken(testToken) {
    return fetch('https://api.github.com/user', {
      headers: {
        'Authorization': 'Bearer ' + testToken,
        'Accept': 'application/vnd.github.v3+json'
      }
    }).then(function(resp) {
      if (!resp.ok) {
        if (resp.status === 401) throw new Error('Token är ogiltig eller har gått ut.');
        throw new Error('Kunde inte verifiera token (' + resp.status + ')');
      }
      return resp.json();
    }).then(function(user) {
      // Verify user matches the repo owner
      if (user.login.toLowerCase() !== REPO_OWNER.toLowerCase()) {
        throw new Error('Token tillhör ' + user.login + ', inte ' + REPO_OWNER + '.');
      }
      // Verify token has access to the repo
      return fetch(API_BASE, {
        headers: getHeaders(testToken)
      });
    }).then(function(resp) {
      if (!resp.ok) {
        if (resp.status === 404) throw new Error('Token har inte åtkomst till repot.');
        if (resp.status === 403) throw new Error('Token har inte repo-scope.');
        throw new Error('Kunde inte verifiera repo-åtkomst (' + resp.status + ')');
      }
      return true;
    });
  }

  function getAboutFileSha() {
    return fetch(API_BASE + '/contents/' + ABOUT_PATH, {
      headers: getHeaders()
    }).then(function(resp) {
      if (!resp.ok) throw new Error('Kunde inte hämta about.json från repot.');
      return resp.json();
    }).then(function(data) {
      return data.sha;
    });
  }

  function publishAboutFile(content, sha) {
    var payload = JSON.stringify({
      message: 'Update about.json via SteenForge admin panel',
      content: btoa(unescape(encodeURIComponent(content))),
      sha: sha
    });

    return fetch(API_BASE + '/contents/' + ABOUT_PATH, {
      method: 'PUT',
      headers: getHeaders(),
      body: payload
    }).then(function(resp) {
      if (!resp.ok) {
        if (resp.status === 409) throw new Error('Konflikt — about.json har ändrats sedan du laddade sidan. Ladda om och försök igen.');
        throw new Error('Kunde inte publicera (' + resp.status + ').');
      }
      return resp.json();
    });
  }

  // --- Build content from the single textarea, applied to all languages ---
  function buildAboutContent() {
    var textarea = $('adminAboutText');
    var paragraphs = textarea ? textarea.value.split('\n').filter(function(line) {
      return line.trim() !== '';
    }) : [];
    var result = {};
    LANGUAGES.forEach(function(lang) {
      result[lang] = paragraphs;
    });
    return JSON.stringify(result, null, 2);
  }

  // --- Translate a single text string via free Google Translate endpoint ---
  function translateText(text, targetLang) {
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      targetLang + '&dt=t&q=' + encodeURIComponent(text);
    return fetch(url).then(function(resp) {
      if (!resp.ok) throw new Error('Översättning misslyckades (' + resp.status + ')');
      return resp.json();
    }).then(function(data) {
      // data[0] is an array of [translated, original, ...] segments
      return data[0].map(function(seg) { return seg[0]; }).join('');
    });
  }

  // --- Translate all paragraphs to a target language ---
  function translateParagraphs(paragraphs, targetLang) {
    return Promise.all(paragraphs.map(function(p) {
      return translateText(p, targetLang);
    }));
  }

  // --- Translate the master text to all languages and publish ---
  function handleTranslatePublish() {
    if (isPublishing) return;
    var textarea = $('adminAboutText');
    var paragraphs = textarea ? textarea.value.split('\n').filter(function(line) {
      return line.trim() !== '';
    }) : [];

    if (!paragraphs.length) {
      setStatus(publishStatus, 'Skriv lite text först.', 'error');
      return;
    }

    isPublishing = true;
    $('adminTranslateBtn').disabled = true;
    $('adminPublishBtn').disabled = true;
    setStatus(publishStatus, 'Översätter till alla språk...', 'info');

    // sv stays as-is; translate to en, da, no, fi
    var result = { sv: paragraphs };
    var targets = LANGUAGES.filter(function(l) { return l !== 'sv'; });

    var chain = Promise.resolve();
    targets.forEach(function(lang) {
      chain = chain.then(function() {
        return translateParagraphs(paragraphs, lang).then(function(translated) {
          result[lang] = translated;
        });
      });
    });

    chain.then(function() {
      setStatus(publishStatus, 'Översatt! Publicerar...', 'info');
      return publishContent(JSON.stringify(result, null, 2));
    }).then(function() {
      setStatus(publishStatus, '✅ Publicerad! Ändringarna syns om 1–2 minuter.', 'success');
      try {
        if (window.SteenForge && window.SteenForge.setAboutStory) {
          window.SteenForge.setAboutStory(result);
        }
      } catch(e) {}
    }).catch(function(err) {
      setStatus(publishStatus, '❌ ' + err.message, 'error');
    }).finally(function() {
      isPublishing = false;
      $('adminTranslateBtn').disabled = false;
      $('adminPublishBtn').disabled = false;
    });
  }

  // --- Populate editor from current aboutStory ---
  function populateEditor() {
    var story = (window.SteenForge && window.SteenForge.getAboutStory) ? window.SteenForge.getAboutStory() : {};
    var textarea = $('adminAboutText');
    if (!textarea) return;
    // Use the current language if it has content, otherwise fall back to sv/en
    var lang = (story.sv && story.sv.length) ? 'sv' : 'en';
    textarea.value = (story[lang] || []).join('\n');
  }

  // --- UI: Show/hide login ---
  function showLogin() {
    loginOverlay.classList.remove('hidden');
    tokenInput.value = '';
    clearStatus(loginStatus);
    tokenInput.focus();
  }

  function hideLogin() {
    loginOverlay.classList.add('hidden');
  }

  // --- UI: Show/hide editor ---
  function showEditor() {
    populateEditor();
    editorPanel.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideEditor() {
    editorPanel.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // --- Login flow ---
  function handleLogin() {
    var inputToken = tokenInput.value.trim();
    if (!inputToken) {
      setStatus(loginStatus, 'Ange en token.', 'error');
      return;
    }

    setStatus(loginStatus, 'Verifierar...', 'info');
    $('adminLoginSubmit').disabled = true;

    verifyToken(inputToken).then(function() {
      token = inputToken;
      storeToken(token);
      hideLogin();
      showEditor();
      setStatus(loginStatus, '', '');
    }).catch(function(err) {
      setStatus(loginStatus, err.message, 'error');
    }).finally(function() {
      $('adminLoginSubmit').disabled = false;
    });
  }

  // --- Publish a given content object to about.json ---
  function publishContent(content) {
    var sha = null;
    return getAboutFileSha().then(function(fileSha) {
      sha = fileSha;
      return publishAboutFile(content, sha);
    });
  }

  // --- Publish flow (as-is, same text for all languages) ---
  function handlePublish() {
    if (isPublishing) return;
    isPublishing = true;
    $('adminPublishBtn').disabled = true;
    $('adminTranslateBtn').disabled = true;
    setStatus(publishStatus, 'Publicerar...', 'info');

    var content = buildAboutContent();

    publishContent(content).then(function() {
      setStatus(publishStatus, '✅ Publicerad! Ändringarna syns om 1–2 minuter.', 'success');
      // Update the in-memory story so the about section reflects immediately
      try {
        var parsed = JSON.parse(content);
        if (window.SteenForge && window.SteenForge.setAboutStory) {
          window.SteenForge.setAboutStory(parsed);
        }
      } catch(e) {}
    }).catch(function(err) {
      setStatus(publishStatus, '❌ ' + err.message, 'error');
    }).finally(function() {
      isPublishing = false;
      $('adminPublishBtn').disabled = false;
      $('adminTranslateBtn').disabled = false;
    });
  }

  // --- Logout ---
  function handleLogout() {
    token = null;
    clearStoredToken();
    hideEditor();
    showLogin();
  }

  // --- Init ---
  function init() {
    // Try to restore token from session
    var stored = getStoredToken();
    if (stored) {
      token = stored;
      // Silently verify, if it fails just show login
      verifyToken(token).then(function() {
        showEditor();
      }).catch(function() {
        token = null;
        clearStoredToken();
        // Don't auto-show login on page load, just attach the button
      });
    }

    // Admin open button
    $('adminOpenBtn').addEventListener('click', function() {
      if (token) {
        showEditor();
      } else {
        showLogin();
      }
    });

    // Login overlay
    $('adminLoginSubmit').addEventListener('click', handleLogin);
    $('adminLoginCancel').addEventListener('click', hideLogin);
    loginOverlay.addEventListener('click', function(e) {
      if (e.target === loginOverlay) hideLogin();
    });
    tokenInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleLogin();
    });

    // Editor
    $('adminEditorClose').addEventListener('click', function() {
      if (token) {
        // Optionally log out, or just close
        if (confirm('Logga ut från admin?')) {
          handleLogout();
        } else {
          hideEditor();
        }
      } else {
        hideEditor();
      }
    });
    $('adminPublishBtn').addEventListener('click', handlePublish);
    $('adminTranslateBtn').addEventListener('click', handleTranslatePublish);

    // Keyboard shortcut: Escape to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (!editorPanel.classList.contains('hidden')) {
          hideEditor();
        } else if (!loginOverlay.classList.contains('hidden')) {
          hideLogin();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();