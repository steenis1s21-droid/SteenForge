function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

function isPasswordHashed(str) {
    return /^[a-f0-9]{64}$/.test(str);
}

function getSoundEnabled() {
    const saved = localStorage.getItem('soundEnabled');
    return saved === null ? true : saved === 'true';
}

function setSoundEnabled(enabled) {
    localStorage.setItem('soundEnabled', String(enabled));
    updateSoundButton();
}

function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton();
}
