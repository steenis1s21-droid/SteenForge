function playNotificationSound() {
    if (!getSoundEnabled()) {
        return;
    }

    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = 880;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.log('Ljudnotis ej tillgänglig');
    }
}

function closeNotificationPopup() {
    document.getElementById('notificationPopup').style.display = 'none';
}

let settingsMenuOutsideClickRegistered = false;

function getUiControlTexts(lang) {
    if (lang === 'en') {
        return {
            soundOn: '🔊 Sound',
            soundOff: '🔈 Sound',
            soundOnTitle: 'Disable sound notifications',
            soundOffTitle: 'Enable sound notifications',
            themeDark: '☀️ Theme',
            themeLight: '🌓 Theme',
            themeDarkTitle: 'Switch to light theme',
            themeLightTitle: 'Switch to dark theme'
        };
    }
    if (lang === 'da') {
        return {
            soundOn: '🔊 Lyd',
            soundOff: '🔈 Lyd',
            soundOnTitle: 'Slå lydnotifikationer fra',
            soundOffTitle: 'Aktivér lydnotifikationer',
            themeDark: '☀️ Tema',
            themeLight: '🌓 Tema',
            themeDarkTitle: 'Skift til lyst tema',
            themeLightTitle: 'Skift til mørkt tema'
        };
    }
    if (lang === 'no') {
        return {
            soundOn: '🔊 Lyd',
            soundOff: '🔈 Lyd',
            soundOnTitle: 'Slå av lydvarsler',
            soundOffTitle: 'Aktiver lydvarsler',
            themeDark: '☀️ Tema',
            themeLight: '🌓 Tema',
            themeDarkTitle: 'Bytt til lyst tema',
            themeLightTitle: 'Bytt til mørkt tema'
        };
    }
    if (lang === 'fi') {
        return {
            soundOn: '🔊 Ääni',
            soundOff: '🔈 Ääni',
            soundOnTitle: 'Poista ääni-ilmoitukset käytöstä',
            soundOffTitle: 'Ota ääni-ilmoitukset käyttöön',
            themeDark: '☀️ Teema',
            themeLight: '🌓 Teema',
            themeDarkTitle: 'Vaihda vaaleaan teemaan',
            themeLightTitle: 'Vaihda tummaan teemaan'
        };
    }
    return {
        soundOn: '🔊 Ljud',
        soundOff: '🔈 Ljud',
        soundOnTitle: 'Stäng av ljudnotiser',
        soundOffTitle: 'Aktivera ljudnotiser',
        themeDark: '☀️ Tema',
        themeLight: '🌓 Tema',
        themeDarkTitle: 'Byt till ljust tema',
        themeLightTitle: 'Byt till mörkt tema'
    };
}

function getCurrentUiLang() {
    if (typeof getLang === 'function') {
        return getLang();
    }
    return localStorage.getItem('appLanguage') || 'sv';
}

function closeSettingsMenu() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function toggleSettingsMenu() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.classList.toggle('show');
}

function registerSettingsOutsideClickClose() {
    if (settingsMenuOutsideClickRegistered) return;
    settingsMenuOutsideClickRegistered = true;

    document.addEventListener('click', function(e) {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;

        // Close when clicking on the overlay backdrop (not the content itself)
        if (e.target === modal) {
            closeSettingsMenu();
        }
    });
}

registerSettingsOutsideClickClose();

function toggleSound() {
    const newState = !getSoundEnabled();
    setSoundEnabled(newState);
}

function updateSoundButton() {
    const btn = document.getElementById('soundBtn');
    if (btn) {
        const text = getUiControlTexts(getCurrentUiLang());
        const enabled = getSoundEnabled();
        btn.textContent = enabled ? text.soundOn : text.soundOff;
        btn.title = enabled ? text.soundOnTitle : text.soundOffTitle;
    }
}

function toggleTheme() {
    const current = getTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function updateThemeButton() {
    const btn = document.getElementById('themeBtn');
    if (btn) {
        const text = getUiControlTexts(getCurrentUiLang());
        const theme = getTheme();
        btn.textContent = theme === 'dark' ? text.themeDark : text.themeLight;
        btn.title = theme === 'dark' ? text.themeDarkTitle : text.themeLightTitle;
    }
}

function loadTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton();
}
