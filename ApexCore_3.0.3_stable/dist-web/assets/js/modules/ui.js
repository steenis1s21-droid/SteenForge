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

function toggleSound() {
    const newState = !getSoundEnabled();
    setSoundEnabled(newState);
}

function updateSoundButton() {
    const btn = document.getElementById('soundBtn');
    if (btn) {
        const enabled = getSoundEnabled();
        btn.textContent = enabled ? '🔊' : '🔈';
        btn.title = enabled ? 'Stäng av ljudnotiser' : 'Aktivera ljudnotiser';
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
        const theme = getTheme();
        btn.textContent = theme === 'dark' ? '☀️' : '🌓';
        btn.title = theme === 'dark' ? 'Byt till ljust tema' : 'Byt till mörkt tema';
    }
}

function loadTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton();
}
