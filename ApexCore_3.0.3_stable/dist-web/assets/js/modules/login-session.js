(function(global) {
    'use strict';

    function getStoredPassword() {
        try {
            return localStorage.getItem('userPassword');
        } catch (e) {
            return null;
        }
    }

    function setStoredPassword(password) {
        try {
            localStorage.setItem('userPassword', hashPassword(password));
        } catch (e) {
            console.warn('Kunde inte spara lösenord:', e);
        }
    }

    function isFirstTimeUser() {
        var storedPassword = getStoredPassword();
        return storedPassword === null || storedPassword === '';
    }

    function showApp(ctx) {
        var loginBox = document.getElementById('loginBox');
        if (loginBox) {
            loginBox.style.display = 'none';
        }

        var app = document.getElementById('app');
        if (app) {
            app.classList.remove('hidden');
        }

        if (ctx && typeof ctx.updateLanguageMenu === 'function') ctx.updateLanguageMenu();
        if (ctx && typeof ctx.applyLanguage === 'function') ctx.applyLanguage();
        if (ctx && typeof ctx.loadTheme === 'function') ctx.loadTheme();
        if (ctx && typeof ctx.checkNotifications === 'function') {
            setTimeout(function() {
                ctx.checkNotifications();
            }, 1000);
        }
    }

    function checkPassword(ctx) {
        showApp(ctx);
    }

    function logout(ctx) {
        if (confirm(ctx.t('confirmLogout'))) {
            localStorage.removeItem('login');
            location.reload();
        }
    }

    function showChangePassword() {
        var modal = document.getElementById('changePasswordModal');
        if (modal) modal.style.display = 'flex';
        var errorDiv = document.getElementById('changeError');
        var successDiv = document.getElementById('changeSuccess');
        var oldPw = document.getElementById('oldPassword');
        var newPw1 = document.getElementById('newPassword1');
        var newPw2 = document.getElementById('newPassword2');
        if (errorDiv) errorDiv.textContent = '';
        if (successDiv) successDiv.textContent = '';
        if (oldPw) oldPw.value = '';
        if (newPw1) newPw1.value = '';
        if (newPw2) newPw2.value = '';
    }

    function closeChangePassword() {
        var modal = document.getElementById('changePasswordModal');
        if (modal) modal.style.display = 'none';
    }

    function changePassword(ctx) {
        var oldPwEl = document.getElementById('oldPassword');
        var newPw1El = document.getElementById('newPassword1');
        var newPw2El = document.getElementById('newPassword2');
        var errorDiv = document.getElementById('changeError');
        var successDiv = document.getElementById('changeSuccess');
        if (!oldPwEl || !newPw1El || !newPw2El || !errorDiv || !successDiv) return;

        var oldPw = oldPwEl.value;
        var newPw1 = newPw1El.value;
        var newPw2 = newPw2El.value;

        errorDiv.textContent = '';
        successDiv.textContent = '';

        var storedPw = getStoredPassword();
        var oldPwMatch = isPasswordHashed(storedPw)
            ? hashPassword(oldPw) === storedPw
            : oldPw === storedPw;

        if (!oldPwMatch) {
            errorDiv.textContent = ctx.t('msgPasswordWrong');
            return;
        }

        if (newPw1.length < 4) {
            errorDiv.textContent = ctx.t('msgPasswordShort');
            return;
        }

        if (newPw1 !== newPw2) {
            errorDiv.textContent = ctx.t('msgPasswordMismatch');
            return;
        }

        if (newPw1 === oldPw) {
            errorDiv.textContent = ctx.t('msgPasswordSame');
            return;
        }

        setStoredPassword(newPw1);
        successDiv.textContent = ctx.t('msgPasswordChanged');
        oldPwEl.value = '';
        newPw1El.value = '';
        newPw2El.value = '';

        setTimeout(function() {
            closeChangePassword();
        }, 2000);
    }

    global.ApexLoginSessionModule = {
        getStoredPassword: getStoredPassword,
        setStoredPassword: setStoredPassword,
        isFirstTimeUser: isFirstTimeUser,
        showApp: showApp,
        checkPassword: checkPassword,
        logout: logout,
        showChangePassword: showChangePassword,
        closeChangePassword: closeChangePassword,
        changePassword: changePassword
    };
})(window);
