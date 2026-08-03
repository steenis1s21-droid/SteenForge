function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

function isPasswordHashed(str) {
    return /^[a-f0-9]{64}$/.test(str);
}

function getSoundEnabled() {
    try {
        const saved = localStorage.getItem('soundEnabled');
        return saved === null ? true : saved === 'true';
    } catch (e) {
        return true;
    }
}

function setSoundEnabled(enabled) {
    try {
        localStorage.setItem('soundEnabled', String(enabled));
    } catch (e) {
        console.warn('Kunde inte spara ljudinställning:', e);
    }
    if (typeof updateSoundButton === 'function') {
        updateSoundButton();
    }
}

function getTheme() {
    try {
        return localStorage.getItem('theme') || 'light';
    } catch (e) {
        return 'light';
    }
}

function setTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.warn('Kunde inte spara tema:', e);
    }
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof updateThemeButton === 'function') {
        updateThemeButton();
    }
}
