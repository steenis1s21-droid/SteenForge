
// ============================================
// 🔔 LJUDNOTIS
// ============================================

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
    } catch(e) {
        console.log('Ljudnotis ej tillgänglig');
    }
}

function closeNotificationPopup() {
    document.getElementById('notificationPopup').style.display = 'none';
}





// ============================================
// ⚠️ VIKTIGT: Deklarera ALLA variabler FÖRST!
// ============================================

let items = []
let doneItems = []
let deletedItem = null
let archivedItems = []

let activeEditId = null
let dragId = null
let isDragging = false
let isSaveEditConfirmOpen = false
let notificationInterval = null;
let currentLanguage = 'sv';
let activeGroupsCollapsed = {};

// ============================================
// �️ SÄKERHETS-HJÄLPFUNKTIONER
// ============================================

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

function isPasswordHashed(str) {
    return /^[a-f0-9]{64}$/.test(str);
}

// ============================================
// �🔊 LJUDNOTISER
// ============================================

function getSoundEnabled() {
    const saved = localStorage.getItem('soundEnabled');
    return saved === null ? true : saved === 'true';
}

function setSoundEnabled(enabled) {
    localStorage.setItem('soundEnabled', String(enabled));
    updateSoundButton();
}

function toggleSound() {
    const newState = !getSoundEnabled();
    setSoundEnabled(newState);
}

function updateSoundButton() {
    const btn = document.getElementById('soundBtn');
    if (btn) {
        const enabled = getSoundEnabled();
        btn.textContent = enabled ? '🔊 Ljud' : '🔈 Ljud';
        btn.title = enabled ? 'Stäng av ljudnotiser' : 'Aktivera ljudnotiser';
    }
}

// ============================================
// 🌓 MÖRKT TEMA
// ============================================

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
    updateThemeButton();
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
        btn.textContent = theme === 'dark' ? '☀️ Tema' : '🌓 Tema';
        btn.title = theme === 'dark' ? 'Byt till ljust tema' : 'Byt till mörkt tema';
    }
}

function loadTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton();
}

// ============================================
// SPRÅK - LANGUAGE SUPPORT
// ============================================

const translations = {
    sv: {
        loginTitle: '🔐 Logga in',
        loginStatusWelcome: '👋 Välkommen! Skapa ett eget lösenord.',
        loginStatusLogin: '🔐 Ange ditt lösenord för att logga in.',
        loginPlaceholder: 'Ange lösenord',
        loginBtn: 'Logga in',
        loginErrorShort: '⚠️ Lösenordet måste vara minst 4 tecken.',
        loginErrorWrong: '❌ Fel lösenord! Försök igen.',
        loginSuccess: '✅ Lösenord skapat! Logga in igen.',
        slogan: '- Hjärtat av ditt arbete',
        changePwBtn: 'Ändra lösenord',
        archiveBtn: '📦 Arkiv',
        logoutBtn: '🚪 Logga ut',
        exportJson: 'Exportera JSON',
        exportEncrypted: 'Exportera krypterad',
        exportCsv: 'Exportera CSV',
        importBtn: 'Importera',
        exportNamePrompt: 'Ange filnamn för exporten:',
        exportNameInvalid: '❌ Filnamnet får inte vara tomt!',
        labelName: 'Namn:',
        labelAge: 'Ålder:',
        labelTask: 'Uppgift:',
        labelNotes: 'Anteckningar:',
        labelPriority: 'Prioritet:',
        prioLow: '🟢 Låg',
        prioMedium: '🟡 Medium',
        prioHigh: '🔴 Hög',
        labelNotification: '🔔 Påminnelse:',
        reminderSelect: 'Välj datum och tid',
        reminderOk: 'OK',
        reminderClose: '✕',
        addBtn: '➕ Lägg till',
        nameRequired: 'Ange ett namn',
        activeTitle: '📋 Aktiv',
        doneTitle: '✅ Färdig',
        activeEmptySearch: 'Inga aktiva poster matchar din sökning.',
        cardTask: 'Uppgift',
        cardNotes: 'Anteckningar',
        doneBtn: '✅ Klar',
        deleteBtn: '✕ Ta bort',
        msgOrderUpdated: '🔁 Ordningen uppdaterad',
        searchActive: '🔍 Sök i Aktiv',
        searchDone: '🔍 Sök i Färdig',
        restoreBtn: '↩️ Återställ',
        archiveBtnShort: '📦 Arkiv',
        archiveAllBtn: '📦 Arkivera alla',
        archiveAllSuccess: '📦 Arkiverade {count} objekt',
        archiveModalTitle: '📦 Arkiv',
        archiveSearch: '🔍 Sök i arkivet',
        archiveVaultBtn: '🗄️ Flytta filer till vault',
        archiveVaultConfirm: '🗄️ Skapa en krypterad vault-fil med {count} arkiverade objekt och töm sedan arkivet?',
        archiveVaultProgress: '🗄️ Krypterar arkivet till vault...',
        archiveVaultSuccess: '🗄️ Arkivet sparades som en krypterad vault-fil och tömdes ({count} objekt)',
        archiveClear: '🗑️ Rensa arkiv',
        archiveClose: '❌ Stäng',
        archiveEmpty: 'Arkivet är tomt.',
        archiveRestore: '↩️ Återställ',
        archiveDelete: '🗑️ Ta bort',
        archiveConfirmDelete: 'Ta bort permanent?',
        archiveConfirmClear: 'Vill du rensa hela arkivet?',
        archiveCleared: '🗑️ Arkivet rensat',
        archiveRestored: '↩️ Återställd från arkiv',
        archiveDeleted: '🗑️ Borttagen från arkiv',
        archiveArchived: '📦 Flyttad till arkiv',
        msgMovedDone: '✅ Flyttad till Done!',
        msgMovedActive: '↩️ Flyttad tillbaka till Active!',
        msgExported: '✅ Exporterade {count} poster som JSON!',
        msgEncrypted: '🔐 Data krypterad och exporterad! ({count} poster)',
        msgCsvExported: '📊 Exporterade {count} poster som CSV!',
        msgImportError: '❌ Kunde inte importera filen!',
        msgImportSuccess: '✅ Importerade {count} poster!',
        archiveVaultImported: '🗄️ Importerade {count} arkiverade poster till Active',
        msgPasswordChanged: '✅ Lösenordet har ändrats!',
        msgPasswordShort: '⚠️ Lösenordet måste vara minst 4 tecken!',
        msgPasswordMismatch: '❌ Lösenorden matchar inte!',
        msgPasswordSame: '⚠️ Nya lösenordet måste vara annorlunda.',
        msgPasswordWrong: '❌ Nuvarande lösenord är fel.',
        msgEncryptedPassword: '🔐 Ange lösenordet för den krypterade filen:',
        msgEncryptedPasswordShort: '⚠️ Lösenordet måste vara minst 4 tecken!',
        editTitle: '✏️ Redigera',
        editSave: '💾 Spara',
        editCancel: '❌ Avbryt',
        changePwTitle: '🔑 Ändra lösenord',
        oldPwPlaceholder: 'Nuvarande lösenord',
        newPwPlaceholder: 'Nytt lösenord',
        confirmPwPlaceholder: 'Bekräfta nytt lösenord',
        savePwBtn: 'Spara',
        cancelPwBtn: 'Avbryt',
        undoText: 'Objekt borttaget',
        undoBtn: '↩️ Ångra',
        footerText: 'Created by Jesper Steen',
        infoTitle: '📋 Funktioner och uppdateringar',
        infoIntro: 'Här kan du snabbt se nya funktioner, förbättringar, buggfixar och vad som är planerat härnäst.',
        infoManageUpdates: '⚙️ Hantera uppdateringar',
        infoNew: '🆕 Nytt',
        infoUpdate: '🔄 Uppdaterat',
        infoBugFix: '🛠️ Buggfixar',
        infoPlan: '📋 Planerat',
        adminLoginTitle: '🔐 Admin-inloggning',
        adminLoginDesc: 'Ange admin-lösenord för att hantera uppdateringar',
        adminLoginPasswordPlaceholder: 'Admin-lösenord',
        adminLoginButton: 'Logga in som admin',
        adminLoginCancel: 'Avbryt',
        adminLoginError: '❌ Fel lösenord! Försök igen.',
        adminPanelTitle: '⚙️ Hantera uppdateringar',
        adminPanelIntro: 'Lägg till, redigera eller ta bort uppdateringar i info-rutan.',
        adminTitleLabel: 'Titel',
        adminTitlePlaceholder: 'T.ex. Ny funktion tillagd!',
        adminDescLabel: 'Beskrivning',
        adminDescPlaceholder: 'Beskriv vad som är nytt...',
        adminTypeLabel: 'Typ',
        adminTypeNew: '🆕 Nytt',
        adminTypeUpdate: '🔄 Uppdaterat',
        adminTypeBugFix: '🛠️ Buggfixar',
        adminTypePlan: '📋 Planerat',
        adminDateLabel: 'Datum',
        adminAddButton: '➕ Lägg till',
        adminSaveButton: '💾 Spara alla ändringar',
        adminCloseButton: '❌ Stäng',
        adminCurrentTitle: '📋 Nuvarande uppdateringar',
        adminEmptyText: 'Inga uppdateringar ännu.',
        adminMissingFields: 'Fyll i både titel och beskrivning!',
        adminDeleteConfirm: 'Ta bort denna uppdatering?',
        adminSavedMessage: '✅ Uppdatering sparad!',
        adminDeletedMessage: '🗑️ Uppdatering borttagen',
        adminChangesSavedMessage: '✅ Ändringar sparade!',
        adminExportSuccess: '💾 Info-panelen exporterades ({count} poster)!',
        adminImportConfirm: '📥 Importera info-panel?\n\n📋 {count} poster\n📅 Exporterad: {date}\n\nKlicka "OK" för att ERSÄTTA nuvarande info.\nKlicka "Avbryt" för att LÄGGA TILL posterna.',
        adminImportReplace: '✅ Info-panelen importerades och ersatte nuvarande innehåll ({count} poster)!',
        adminImportAdded: '✅ Lade till {count} info-poster!',
        adminImportInvalid: '❌ Ogiltig info-fil!',
        confirmLogout: 'Är du säker på att du vill logga ut?',
        confirmDialogTitle: '✅ Bekräfta ändring',
        confirmSaveEdit: 'Är du säker på att du vill spara ändringarna?',
        confirmImport: '📥 Importera data?\n\n📊 {active} aktiva poster\n✅ {done} färdiga poster\n📦 {archived} arkiverade poster\n📅 Exporterad: {date}\n\nKlicka "OK" för att ERSÄTTA all nuvarande data.\nKlicka "Avbryt" för att LÄGGA TILL data.',
        confirmReplace: '✅ Importerade {active} aktiva, {done} färdiga och {archived} arkiverade poster! (ERSATTE)',
        confirmAdded: '✅ Importerade {count} nya poster! (LADE TILL)',
        notifTitle: '🔔 Påminnelse: {name}',
        notifBody: '{task} ({priority}) - {note}'
    },
    en: {
        loginTitle: '🔐 Login',
        loginStatusWelcome: '👋 Welcome! Create your own password.',
        loginStatusLogin: '🔐 Enter your password to login.',
        loginPlaceholder: 'Enter password',
        loginBtn: 'Login',
        loginErrorShort: '⚠️ Password must be at least 4 characters.',
        loginErrorWrong: '❌ Wrong password! Try again.',
        loginSuccess: '✅ Password created! Login again.',
        slogan: '- The Heart of Your Work',
        changePwBtn: 'Change password',
        archiveBtn: '📦 Archive',
        logoutBtn: '🚪 Logout',
        exportJson: 'Export JSON',
        exportEncrypted: 'Export encrypted',
        exportCsv: 'Export CSV',
        importBtn: 'Import',
        exportNamePrompt: 'Enter a file name for the export:',
        exportNameInvalid: '❌ File name cannot be empty!',
        labelName: 'Name:',
        labelAge: 'Age:',
        labelTask: 'Task:',
        labelNotes: 'Notes:',
        labelPriority: 'Priority:',
        prioLow: '🟢 Low',
        prioMedium: '🟡 Medium',
        prioHigh: '🔴 High',
        labelNotification: '🔔 Reminder:',
        reminderSelect: 'Select date and time',
        reminderOk: 'OK',
        reminderClose: '✕',
        addBtn: '➕ Add',
        nameRequired: 'Enter a name',
        activeTitle: '📋 Active',
        doneTitle: '✅ Done',
        activeEmptySearch: 'No active items match your search.',
        cardTask: 'Task',
        cardNotes: 'Notes',
        doneBtn: '✅ Done',
        deleteBtn: '✕ Delete',
        msgOrderUpdated: '🔁 Order updated',
        searchActive: '🔍 Search Active',
        searchDone: '🔍 Search Done',
        restoreBtn: '↩️ Restore',
        archiveBtnShort: '📦 Archive',
        archiveAllBtn: '📦 Archive all',
        archiveAllSuccess: '📦 Archived {count} items',
        archiveModalTitle: '📦 Archive',
        archiveSearch: '🔍 Search archive',
        archiveVaultBtn: '🗄️ Move files to vault',
        archiveVaultConfirm: '🗄️ Create one encrypted vault file with {count} archived items and then clear the archive?',
        archiveVaultProgress: '🗄️ Encrypting archive to vault...',
        archiveVaultSuccess: '🗄️ Archive saved as an encrypted vault file and cleared ({count} items)',
        archiveClear: '🗑️ Clear archive',
        archiveClose: '❌ Close',
        archiveEmpty: 'Archive is empty.',
        archiveRestore: '↩️ Restore',
        archiveDelete: '🗑️ Delete',
        archiveConfirmDelete: 'Delete permanently?',
        archiveConfirmClear: 'Clear entire archive?',
        archiveCleared: '🗑️ Archive cleared',
        archiveRestored: '↩️ Restored from archive',
        archiveDeleted: '🗑️ Deleted from archive',
        archiveArchived: '📦 Moved to archive',
        msgMovedDone: '✅ Moved to Done!',
        msgMovedActive: '↩️ Moved back to Active!',
        msgExported: '✅ Exported {count} items as JSON!',
        msgEncrypted: '🔐 Data encrypted and exported! ({count} items)',
        msgCsvExported: '📊 Exported {count} items as CSV!',
        msgImportError: '❌ Could not import file!',
        msgImportSuccess: '✅ Imported {count} items!',
        archiveVaultImported: '🗄️ Imported {count} archived items into Active',
        msgPasswordChanged: '✅ Password changed!',
        msgPasswordShort: '⚠️ Password must be at least 4 characters!',
        msgPasswordMismatch: '❌ Passwords do not match!',
        msgPasswordSame: '⚠️ New password must be different.',
        msgPasswordWrong: '❌ Current password is wrong.',
        msgEncryptedPassword: '🔐 Enter password for encrypted file:',
        msgEncryptedPasswordShort: '⚠️ Password must be at least 4 characters!',
        editTitle: '✏️ Edit',
        editSave: '💾 Save',
        editCancel: '❌ Cancel',
        changePwTitle: '🔑 Change password',
        oldPwPlaceholder: 'Current password',
        newPwPlaceholder: 'New password',
        confirmPwPlaceholder: 'Confirm new password',
        savePwBtn: 'Save',
        cancelPwBtn: 'Cancel',
        undoText: 'Item deleted',
        undoBtn: '↩️ Undo',
        footerText: 'Created by Jesper Steen',
        infoTitle: '📋 Features and updates',
        infoIntro: 'Here you can quickly see new features, improvements, bug fixes, and what is planned next.',
        infoManageUpdates: '⚙️ Manage updates',
        infoNew: '🆕 New',
        infoUpdate: '🔄 Updated',
        infoBugFix: '🛠️ Bug Fixes',
        infoPlan: '📋 Planned',
        adminLoginTitle: '🔐 Admin login',
        adminLoginDesc: 'Enter the admin password to manage updates',
        adminLoginPasswordPlaceholder: 'Admin password',
        adminLoginButton: 'Log in as admin',
        adminLoginCancel: 'Cancel',
        adminLoginError: '❌ Wrong password! Try again.',
        adminPanelTitle: '⚙️ Manage updates',
        adminPanelIntro: 'Add, edit or delete updates in the info box.',
        adminTitleLabel: 'Title',
        adminTitlePlaceholder: 'E.g. New feature added!',
        adminDescLabel: 'Description',
        adminDescPlaceholder: 'Describe what is new...',
        adminTypeLabel: 'Type',
        adminTypeNew: '🆕 New',
        adminTypeUpdate: '🔄 Updated',
        adminTypeBugFix: '🛠️ Bug Fixes',
        adminTypePlan: '📋 Planned',
        adminDateLabel: 'Date',
        adminAddButton: '➕ Add',
        adminExportButton: '💾 Export info',
        adminImportButton: '📥 Import info',
        adminSaveButton: '💾 Save all changes',
        adminCloseButton: '❌ Close',
        adminCurrentTitle: '📋 Current updates',
        adminEmptyText: 'No updates yet.',
        adminMissingFields: 'Please fill in both title and description!',
        adminDeleteConfirm: 'Delete this update?',
        adminSavedMessage: '✅ Update saved!',
        adminDeletedMessage: '🗑️ Update deleted',
        adminChangesSavedMessage: '✅ Changes saved!',
        adminExportSuccess: '💾 Info panel exported ({count} items)!',
        adminImportConfirm: '📥 Import info panel?\n\n📋 {count} items\n📅 Exported: {date}\n\nClick "OK" to REPLACE the current info.\nClick "Cancel" to ADD the items.',
        adminImportReplace: '✅ Info panel imported and replaced the current content ({count} items)!',
        adminImportAdded: '✅ Added {count} info items!',
        adminImportInvalid: '❌ Invalid info file!',
        confirmLogout: 'Are you sure you want to logout?',
        confirmDialogTitle: '✅ Confirm changes',
        confirmSaveEdit: 'Are you sure you want to save the changes?',
        confirmImport: '📥 Import data?\n\n📊 {active} active items\n✅ {done} completed items\n📦 {archived} archived items\n📅 Exported: {date}\n\nClick "OK" to REPLACE all current data.\nClick "Cancel" to ADD data.',
        confirmReplace: '✅ Imported {active} active, {done} completed and {archived} archived items! (REPLACED)',
        confirmAdded: '✅ Imported {count} new items! (ADDED)',
        notifTitle: '🔔 Reminder: {name}',
        notifBody: '{task} ({priority}) - {note}'
    },
    da: {
        loginTitle: '🔐 Log ind',
        loginStatusWelcome: '👋 Velkommen! Opret din egen adgangskode.',
        loginStatusLogin: '🔐 Indtast din adgangskode for at logge ind.',
        loginPlaceholder: 'Indtast adgangskode',
        loginBtn: 'Log ind',
        loginErrorShort: '⚠️ Adgangskoden skal være mindst 4 tegn.',
        loginErrorWrong: '❌ Forkert adgangskode! Prøv igen.',
        loginSuccess: '✅ Adgangskode oprettet! Log ind igen.',
        slogan: '- Hjertet af dit arbejde',
        changePwBtn: 'Skift adgangskode',
        archiveBtn: '📦 Arkiv',
        logoutBtn: '🚪 Log ud',
        exportJson: 'Eksporter JSON',
        exportEncrypted: 'Eksporter krypteret',
        exportCsv: 'Eksporter CSV',
        importBtn: 'Importer',
        exportNamePrompt: 'Angiv et filnavn til eksporten:',
        exportNameInvalid: '❌ Filnavnet må ikke være tomt!',
        labelName: 'Navn:',
        labelAge: 'Alder:',
        labelTask: 'Opgave:',
        labelNotes: 'Noter:',
        labelPriority: 'Prioritet:',
        prioLow: '🟢 Lav',
        prioMedium: '🟡 Medium',
        prioHigh: '🔴 Høj',
        labelNotification: '🔔 Påmindelse:',
        reminderSelect: 'Vælg dato og tid',
        reminderOk: 'OK',
        reminderClose: '✕',
        addBtn: '➕ Tilføj',
        nameRequired: 'Indtast et navn',
        activeTitle: '📋 Aktiv',
        doneTitle: '✅ Færdig',
        activeEmptySearch: 'Ingen aktive poster matcher din søgning.',
        cardTask: 'Opgave',
        cardNotes: 'Noter',
        doneBtn: '✅ Færdig',
        deleteBtn: '✕ Slet',
        msgOrderUpdated: '🔁 Rækkefølgen er opdateret',
        searchActive: '🔍 Søg i Aktiv',
        searchDone: '🔍 Søg i Færdig',
        restoreBtn: '↩️ Gendan',
        archiveBtnShort: '📦 Arkiv',
        archiveAllBtn: '📦 Arkiver alle',
        archiveAllSuccess: '📦 Arkiverede {count} poster',
        archiveModalTitle: '📦 Arkiv',
        archiveSearch: '🔍 Søg i arkivet',
        archiveVaultBtn: '🗄️ Flyt filer til vault',
        archiveVaultConfirm: '🗄️ Opret én krypteret vault-fil med {count} arkiverede poster og tøm derefter arkivet?',
        archiveVaultProgress: '🗄️ Krypterer arkivet til vault...',
        archiveVaultSuccess: '🗄️ Arkivet blev gemt som en krypteret vault-fil og tømt ({count} poster)',
        archiveClear: '🗑️ Ryd arkiv',
        archiveClose: '❌ Luk',
        archiveEmpty: 'Arkivet er tomt.',
        archiveRestore: '↩️ Gendan',
        archiveDelete: '🗑️ Slet',
        archiveConfirmDelete: 'Slet permanent?',
        archiveConfirmClear: 'Vil du rydde hele arkivet?',
        archiveCleared: '🗑️ Arkivet ryddet',
        archiveRestored: '↩️ Gendannet fra arkiv',
        archiveDeleted: '🗑️ Slettet fra arkiv',
        archiveArchived: '📦 Flyttet til arkiv',
        msgMovedDone: '✅ Flyttet til Færdig!',
        msgMovedActive: '↩️ Flyttet tilbage til Aktiv!',
        msgExported: '✅ Eksporterede {count} poster som JSON!',
        msgEncrypted: '🔐 Data krypteret og eksporteret! ({count} poster)',
        msgCsvExported: '📊 Eksporterede {count} poster som CSV!',
        msgImportError: '❌ Kunne ikke importere filen!',
        msgImportSuccess: '✅ Importerede {count} poster!',
        archiveVaultImported: '🗄️ Importerede {count} arkiverede poster til Aktiv',
        msgPasswordChanged: '✅ Adgangskoden er ændret!',
        msgPasswordShort: '⚠️ Adgangskoden skal være mindst 4 tegn!',
        msgPasswordMismatch: '❌ Adgangskoderne matcher ikke!',
        msgPasswordSame: '⚠️ Ny adgangskode skal være anderledes.',
        msgPasswordWrong: '❌ Nuværende adgangskode er forkert.',
        msgEncryptedPassword: '🔐 Indtast adgangskoden for den krypterede fil:',
        msgEncryptedPasswordShort: '⚠️ Adgangskoden skal være mindst 4 tegn!',
        editTitle: '✏️ Rediger',
        editSave: '💾 Gem',
        editCancel: '❌ Annuller',
        changePwTitle: '🔑 Skift adgangskode',
        oldPwPlaceholder: 'Nuværende adgangskode',
        newPwPlaceholder: 'Ny adgangskode',
        confirmPwPlaceholder: 'Bekræft ny adgangskode',
        savePwBtn: 'Gem',
        cancelPwBtn: 'Annuller',
        undoText: 'Objekt slettet',
        undoBtn: '↩️ Fortryd',
        footerText: 'Oprettet af Jesper Steen',
        infoTitle: '📋 Funktioner og opdateringer',
        infoIntro: 'Her kan du hurtigt se nye funktioner, forbedringer, fejlrettelser og hvad der er planlagt som det næste.',
        infoManageUpdates: '⚙️ Administrer opdateringer',
        infoNew: '🆕 Nyt',
        infoUpdate: '🔄 Opdateret',
        infoBugFix: '🛠️ Fejlrettelser',
        infoPlan: '📋 Planlagt',
        adminLoginTitle: '🔐 Admin-login',
        adminLoginDesc: 'Indtast admin-adgangskoden for at styre opdateringer',
        adminLoginPasswordPlaceholder: 'Admin-adgangskode',
        adminLoginButton: 'Log ind som admin',
        adminLoginCancel: 'Annuller',
        adminLoginError: '❌ Forkert adgangskode! Prøv igen.',
        adminPanelTitle: '⚙️ Administrer opdateringer',
        adminPanelIntro: 'Tilføj, rediger eller slet opdateringer i infoboksen.',
        adminTitleLabel: 'Titel',
        adminTitlePlaceholder: 'F.eks. Ny funktion tilføjet!',
        adminDescLabel: 'Beskrivelse',
        adminDescPlaceholder: 'Beskriv hvad der er nyt...',
        adminTypeLabel: 'Type',
        adminTypeNew: '🆕 Nyt',
        adminTypeUpdate: '🔄 Opdateret',
        adminTypeBugFix: '🛠️ Fejlrettelser',
        adminTypePlan: '📋 Planlagt',
        adminDateLabel: 'Dato',
        adminAddButton: '➕ Tilføj',
        adminExportButton: '💾 Eksporter info',
        adminImportButton: '📥 Importer info',
        adminSaveButton: '💾 Gem alle ændringer',
        adminCloseButton: '❌ Luk',
        adminCurrentTitle: '📋 Nuværende opdateringer',
        adminEmptyText: 'Ingen opdateringer endnu.',
        adminMissingFields: 'Udfyld både titel og beskrivelse!',
        adminDeleteConfirm: 'Slet denne opdatering?',
        adminSavedMessage: '✅ Opdatering gemt!',
        adminDeletedMessage: '🗑️ Opdatering slettet',
        adminChangesSavedMessage: '✅ Ændringer gemt!',
        adminExportSuccess: '💾 Info-panelet blev eksporteret ({count} poster)!',
        adminImportConfirm: '📥 Importer info-panel?\n\n📋 {count} poster\n📅 Eksporteret: {date}\n\nKlik "OK" for at ERSTATTE den nuværende info.\nKlik "Annuller" for at TILFØJE posterne.',
        adminImportReplace: '✅ Info-panelet blev importeret og erstattede det nuværende indhold ({count} poster)!',
        adminImportAdded: '✅ Tilføjede {count} info-poster!',
        adminImportInvalid: '❌ Ugyldig info-fil!',
        confirmLogout: 'Er du sikker på, at du vil logge ud?',
        confirmDialogTitle: '✅ Bekræft ændring',
        confirmSaveEdit: 'Er du sikker på, at du vil gemme ændringerne?',
        confirmImport: '📥 Importer data?\n\n📊 {active} aktive poster\n✅ {done} færdige poster\n📦 {archived} arkiverede poster\n📅 Eksporteret: {date}\n\nKlik "OK" for at ERSÆTTE alle nuværende data.\nKlik "Annuller" for at TILFØJE data.',
        confirmReplace: '✅ Importerede {active} aktive, {done} færdige og {archived} arkiverede poster! (ERSATTE)',
        confirmAdded: '✅ Importerede {count} nye poster! (TILFØJET)',
        notifTitle: '🔔 Påmindelse: {name}',
        notifBody: '{task} ({priority}) - {note}'
    },
    no: {
        loginTitle: '🔐 Logg inn',
        loginStatusWelcome: '👋 Velkommen! Opprett ditt eget passord.',
        loginStatusLogin: '🔐 Skriv inn passordet ditt for å logge inn.',
        loginPlaceholder: 'Skriv inn passord',
        loginBtn: 'Logg inn',
        loginErrorShort: '⚠️ Passordet må være minst 4 tegn.',
        loginErrorWrong: '❌ Feil passord! Prøv igjen.',
        loginSuccess: '✅ Passord opprettet! Logg inn igjen.',
        slogan: '- Hjertet av arbeidet ditt',
        changePwBtn: 'Endre passord',
        archiveBtn: '📦 Arkiv',
        logoutBtn: '🚪 Logg ut',
        exportJson: 'Eksporter JSON',
        exportEncrypted: 'Eksporter kryptert',
        exportCsv: 'Eksporter CSV',
        importBtn: 'Importer',
        exportNamePrompt: 'Skriv inn et filnavn for eksporten:',
        exportNameInvalid: '❌ Filnavnet kan ikke være tomt!',
        labelName: 'Navn:',
        labelAge: 'Alder:',
        labelTask: 'Oppgave:',
        labelNotes: 'Notater:',
        labelPriority: 'Prioritet:',
        prioLow: '🟢 Lav',
        prioMedium: '🟡 Medium',
        prioHigh: '🔴 Høy',
        labelNotification: '🔔 Påminnelse:',
        reminderSelect: 'Velg dato og tid',
        reminderOk: 'OK',
        reminderClose: '✕',
        addBtn: '➕ Legg til',
        nameRequired: 'Skriv inn et navn',
        activeTitle: '📋 Aktiv',
        doneTitle: '✅ Ferdig',
        activeEmptySearch: 'Ingen aktive elementer matcher søket ditt.',
        cardTask: 'Oppgave',
        cardNotes: 'Notater',
        doneBtn: '✅ Ferdig',
        deleteBtn: '✕ Slett',
        msgOrderUpdated: '🔁 Rekkefølgen er oppdatert',
        searchActive: '🔍 Søk i Aktiv',
        searchDone: '🔍 Søk i Ferdig',
        restoreBtn: '↩️ Gjenopprett',
        archiveBtnShort: '📦 Arkiv',
        archiveAllBtn: '📦 Arkiver alle',
        archiveAllSuccess: '📦 Arkiverte {count} elementer',
        archiveModalTitle: '📦 Arkiv',
        archiveSearch: '🔍 Søk i arkivet',
        archiveVaultBtn: '🗄️ Flytt filer til vault',
        archiveVaultConfirm: '🗄️ Opprett én kryptert vault-fil med {count} arkiverte elementer og tøm deretter arkivet?',
        archiveVaultProgress: '🗄️ Krypterer arkivet til vault...',
        archiveVaultSuccess: '🗄️ Arkivet ble lagret som en kryptert vault-fil og tømt ({count} elementer)',
        archiveClear: '🗑️ Tøm arkiv',
        archiveClose: '❌ Lukk',
        archiveEmpty: 'Arkivet er tomt.',
        archiveRestore: '↩️ Gjenopprett',
        archiveDelete: '🗑️ Slett',
        archiveConfirmDelete: 'Slett permanent?',
        archiveConfirmClear: 'Vil du tømme hele arkivet?',
        archiveCleared: '🗑️ Arkivet tømt',
        archiveRestored: '↩️ Gjenopprettet fra arkiv',
        archiveDeleted: '🗑️ Slettet fra arkiv',
        archiveArchived: '📦 Flyttet til arkiv',
        msgMovedDone: '✅ Flyttet til Ferdig!',
        msgMovedActive: '↩️ Flyttet tilbake til Aktiv!',
        msgExported: '✅ Eksporterte {count} poster som JSON!',
        msgEncrypted: '🔐 Data kryptert og eksportert! ({count} poster)',
        msgCsvExported: '📊 Eksporterte {count} poster som CSV!',
        msgImportError: '❌ Kunne ikke importere filen!',
        msgImportSuccess: '✅ Importerte {count} poster!',
        archiveVaultImported: '🗄️ Importerte {count} arkiverte poster til Aktiv',
        msgPasswordChanged: '✅ Passordet er endret!',
        msgPasswordShort: '⚠️ Passordet må være minst 4 tegn!',
        msgPasswordMismatch: '❌ Passordene matcher ikke!',
        msgPasswordSame: '⚠️ Nytt passord må være annerledes.',
        msgPasswordWrong: '❌ Nåværende passord er feil.',
        msgEncryptedPassword: '🔐 Skriv inn passordet for den krypterte filen:',
        msgEncryptedPasswordShort: '⚠️ Passordet må være minst 4 tegn!',
        editTitle: '✏️ Rediger',
        editSave: '💾 Lagre',
        editCancel: '❌ Avbryt',
        changePwTitle: '🔑 Endre passord',
        oldPwPlaceholder: 'Nåværende passord',
        newPwPlaceholder: 'Nytt passord',
        confirmPwPlaceholder: 'Bekreft nytt passord',
        savePwBtn: 'Lagre',
        cancelPwBtn: 'Avbryt',
        undoText: 'Objekt slettet',
        undoBtn: '↩️ Angre',
        footerText: 'Opprettet av Jesper Steen',
        infoTitle: '📋 Funksjoner og oppdateringer',
        infoIntro: 'Her kan du raskt se nye funksjoner, forbedringer, feilrettinger og hva som er planlagt videre.',
        infoManageUpdates: '⚙️ Administrer oppdateringer',
        infoNew: '🆕 Nytt',
        infoUpdate: '🔄 Oppdatert',
        infoBugFix: '🛠️ Feilrettinger',
        infoPlan: '📋 Planlagt',
        adminLoginTitle: '🔐 Admin-login',
        adminLoginDesc: 'Skriv inn admin-passordet for å administrere oppdateringer',
        adminLoginPasswordPlaceholder: 'Admin-passord',
        adminLoginButton: 'Logg inn som admin',
        adminLoginCancel: 'Avbryt',
        adminLoginError: '❌ Feil passord! Prøv igjen.',
        adminPanelTitle: '⚙️ Administrer oppdateringer',
        adminPanelIntro: 'Legg til, rediger eller slett oppdateringer i infoboksen.',
        adminTitleLabel: 'Tittel',
        adminTitlePlaceholder: 'F.eks. Ny funksjon lagt til!',
        adminDescLabel: 'Beskrivelse',
        adminDescPlaceholder: 'Beskriv hva som er nytt...',
        adminTypeLabel: 'Type',
        adminTypeNew: '🆕 Nytt',
        adminTypeUpdate: '🔄 Oppdatert',
        adminTypeBugFix: '🛠️ Feilrettinger',
        adminTypePlan: '📋 Planlagt',
        adminDateLabel: 'Dato',
        adminAddButton: '➕ Legg til',
        adminExportButton: '💾 Eksporter info',
        adminImportButton: '📥 Importer info',
        adminSaveButton: '💾 Lagre alle endringer',
        adminCloseButton: '❌ Lukk',
        adminCurrentTitle: '📋 Nåværende oppdateringer',
        adminEmptyText: 'Ingen oppdateringer ennå.',
        adminMissingFields: 'Fyll inn både tittel og beskrivelse!',
        adminDeleteConfirm: 'Slette denne oppdateringen?',
        adminSavedMessage: '✅ Oppdatering lagret!',
        adminDeletedMessage: '🗑️ Oppdatering slettet',
        adminChangesSavedMessage: '✅ Endringer lagret!',
        adminExportSuccess: '💾 Infopanelet ble eksportert ({count} poster)!',
        adminImportConfirm: '📥 Importer infopanel?\n\n📋 {count} poster\n📅 Eksportert: {date}\n\nKlikk "OK" for å ERSTATTE nåværende info.\nKlikk "Avbryt" for å LEGGE TIL postene.',
        adminImportReplace: '✅ Infopanelet ble importert og erstattet nåværende innhold ({count} poster)!',
        adminImportAdded: '✅ La til {count} info-poster!',
        adminImportInvalid: '❌ Ugyldig info-fil!',
        confirmLogout: 'Er du sikker på at du vil logge ut?',
        confirmDialogTitle: '✅ Bekreft endring',
        confirmSaveEdit: 'Er du sikker på at du vil lagre endringene?',
        confirmImport: '📥 Importer data?\n\n📊 {active} aktive poster\n✅ {done} ferdige poster\n📦 {archived} arkiverte poster\n📅 Eksportert: {date}\n\nKlikk "OK" for å ERSATTE alle nåværende data.\nKlikk "Avbryt" for å LEGGE TIL data.',
        confirmReplace: '✅ Importerte {active} aktive, {done} ferdige og {archived} arkiverte poster! (ERSATTE)',
        confirmAdded: '✅ Importerte {count} nye poster! (LAGT TIL)',
        notifTitle: '🔔 Påminnelse: {name}',
        notifBody: '{task} ({priority}) - {note}'
    },
    fi: {
        loginTitle: '🔐 Kirjaudu sisään',
        loginStatusWelcome: '👋 Tervetuloa! Luo oma salasanasi.',
        loginStatusLogin: '🔐 Kirjoita salasanasi kirjautuaksesi sisään.',
        loginPlaceholder: 'Kirjoita salasana',
        loginBtn: 'Kirjaudu',
        loginErrorShort: '⚠️ Salasanan on oltava vähintään 4 merkkiä.',
        loginErrorWrong: '❌ Väärä salasana! Yritä uudelleen.',
        loginSuccess: '✅ Salasana luotu! Kirjaudu sisään uudelleen.',
        slogan: '- Työsi sydän',
        changePwBtn: 'Vaihda salasana',
        archiveBtn: '📦 Arkisto',
        logoutBtn: '🚪 Kirjaudu ulos',
        exportJson: 'Vie JSON',
        exportEncrypted: 'Vie salattu',
        exportCsv: 'Vie CSV',
        importBtn: 'Tuo',
        exportNamePrompt: 'Anna viennille tiedostonimi:',
        exportNameInvalid: '❌ Tiedostonimi ei voi olla tyhjä!',
        labelName: 'Nimi:',
        labelAge: 'Ikä:',
        labelTask: 'Tehtävä:',
        labelNotes: 'Muistiinpanot:',
        labelPriority: 'Tärkeys:',
        prioLow: '🟢 Matala',
        prioMedium: '🟡 Keskitaso',
        prioHigh: '🔴 Korkea',
        labelNotification: '🔔 Muistutus:',
        reminderSelect: 'Valitse päivämäärä ja aika',
        reminderOk: 'OK',
        reminderClose: '✕',
        addBtn: '➕ Lisää',
        nameRequired: 'Anna nimi',
        activeTitle: '📋 Aktiivinen',
        doneTitle: '✅ Valmis',
        activeEmptySearch: 'Yksikään aktiivinen kohde ei vastaa hakuasi.',
        cardTask: 'Tehtävä',
        cardNotes: 'Muistiinpanot',
        doneBtn: '✅ Valmis',
        deleteBtn: '✕ Poista',
        msgOrderUpdated: '🔁 Järjestys päivitetty',
        searchActive: '🔍 Etsi Aktiivisesta',
        searchDone: '🔍 Etsi Valmiista',
        restoreBtn: '↩️ Palauta',
        archiveBtnShort: '📦 Arkisto',
        archiveAllBtn: '📦 Arkistoi kaikki',
        archiveAllSuccess: '📦 Arkistoitu {count} kohdetta',
        archiveModalTitle: '📦 Arkisto',
        archiveSearch: '🔍 Etsi arkistosta',
        archiveVaultBtn: '🗄️ Siirrä tiedostot vaultiin',
        archiveVaultConfirm: '🗄️ Luo yksi salattu vault-tiedosto, jossa on {count} arkistoitua kohdetta, ja tyhjennä sitten arkisto?',
        archiveVaultProgress: '🗄️ Salataan arkisto vaultiin...',
        archiveVaultSuccess: '🗄️ Arkisto tallennettiin salattuna vault-tiedostona ja tyhjennettiin ({count} kohdetta)',
        archiveClear: '🗑️ Tyhjennä arkisto',
        archiveClose: '❌ Sulje',
        archiveEmpty: 'Arkisto on tyhjä.',
        archiveRestore: '↩️ Palauta',
        archiveDelete: '🗑️ Poista',
        archiveConfirmDelete: 'Poista pysyvästi?',
        archiveConfirmClear: 'Haluatko tyhjentää koko arkiston?',
        archiveCleared: '🗑️ Arkisto tyhjennetty',
        archiveRestored: '↩️ Palautettu arkistosta',
        archiveDeleted: '🗑️ Poistettu arkistosta',
        archiveArchived: '📦 Siirretty arkistoon',
        msgMovedDone: '✅ Siirretty Valmiisiin!',
        msgMovedActive: '↩️ Siirretty takaisin Aktiiviseen!',
        msgExported: '✅ Vietiin {count} kohdetta JSON-muodossa!',
        msgEncrypted: '🔐 Tiedot salattiin ja vietiin! ({count} kohdetta)',
        msgCsvExported: '📊 Vietiin {count} kohdetta CSV-muodossa!',
        msgImportError: '❌ Tiedoston tuonti epäonnistui!',
        msgImportSuccess: '✅ Tuotiin {count} kohdetta!',
        archiveVaultImported: '🗄️ Tuotiin {count} arkistoitua kohdetta Aktiiviseen',
        msgPasswordChanged: '✅ Salasana vaihdettu!',
        msgPasswordShort: '⚠️ Salasanan on oltava vähintään 4 merkkiä!',
        msgPasswordMismatch: '❌ Salasanat eivät täsmää!',
        msgPasswordSame: '⚠️ Uuden salasanan on oltava erilainen.',
        msgPasswordWrong: '❌ Nykyinen salasana on väärin.',
        msgEncryptedPassword: '🔐 Anna salattuun tiedostoon salasana:',
        msgEncryptedPasswordShort: '⚠️ Salasanan on oltava vähintään 4 merkkiä!',
        editTitle: '✏️ Muokkaa',
        editSave: '💾 Tallenna',
        editCancel: '❌ Peruuta',
        changePwTitle: '🔑 Vaihda salasana',
        oldPwPlaceholder: 'Nykyinen salasana',
        newPwPlaceholder: 'Uusi salasana',
        confirmPwPlaceholder: 'Vahvista uusi salasana',
        savePwBtn: 'Tallenna',
        cancelPwBtn: 'Peruuta',
        undoText: 'Kohde poistettu',
        undoBtn: '↩️ Kumoa',
        footerText: 'Luonut Jesper Steen',
        infoTitle: '📋 Ominaisuudet ja päivitykset',
        infoIntro: 'Täältä näet nopeasti uudet ominaisuudet, parannukset, bugikorjaukset ja tulevat suunnitelmat.',
        infoManageUpdates: '⚙️ Hallitse päivityksiä',
        infoNew: '🆕 Uusi',
        infoUpdate: '🔄 Päivitetty',
        infoBugFix: '🛠️ Bugikorjaukset',
        infoPlan: '📋 Suunniteltu',
        adminLoginTitle: '🔐 Ylläpitäjän kirjautuminen',
        adminLoginDesc: 'Syötä ylläpitäjän salasana hallitaksesi päivityksiä',
        adminLoginPasswordPlaceholder: 'Ylläpitäjän salasana',
        adminLoginButton: 'Kirjaudu ylläpitäjänä',
        adminLoginCancel: 'Peruuta',
        adminLoginError: '❌ Väärä salasana! Yritä uudelleen.',
        adminPanelTitle: '⚙️ Hallitse päivityksiä',
        adminPanelIntro: 'Lisää, muokkaa tai poista päivityksiä tiedotuskentästä.',
        adminTitleLabel: 'Otsikko',
        adminTitlePlaceholder: 'Esim. Uusi ominaisuus lisätty!',
        adminDescLabel: 'Kuvaus',
        adminDescPlaceholder: 'Kuvaa mitä uutta on...',
        adminTypeLabel: 'Tyyppi',
        adminTypeNew: '🆕 Uusi',
        adminTypeUpdate: '🔄 Päivitetty',
        adminTypeBugFix: '🛠️ Bugikorjaukset',
        adminTypePlan: '📋 Suunniteltu',
        adminDateLabel: 'Päivämäärä',
        adminAddButton: '➕ Lisää',
        adminExportButton: '💾 Vie info',
        adminImportButton: '📥 Tuo info',
        adminSaveButton: '💾 Tallenna kaikki muutokset',
        adminCloseButton: '❌ Sulje',
        adminCurrentTitle: '📋 Nykyiset päivitykset',
        adminEmptyText: 'Ei vielä päivityksiä.',
        adminMissingFields: 'Täytä sekä otsikko että kuvaus!',
        adminDeleteConfirm: 'Poistetaanko tämä päivitys?',
        adminSavedMessage: '✅ Päivitys tallennettu!',
        adminDeletedMessage: '🗑️ Päivitys poistettu',
        adminChangesSavedMessage: '✅ Muutokset tallennettu!',
        adminExportSuccess: '💾 Infopaneeli vietiin ({count} kohdetta)!',
        adminImportConfirm: '📥 Tuodaanko infopaneeli?\n\n📋 {count} kohdetta\n📅 Viety: {date}\n\nNapsauta "OK" korvataksesi nykyiset tiedot.\nNapsauta "Peruuta" lisätäksesi kohteet.',
        adminImportReplace: '✅ Infopaneeli tuotiin ja nykyinen sisältö korvattiin ({count} kohdetta)!',
        adminImportAdded: '✅ Lisättiin {count} infokohdetta!',
        adminImportInvalid: '❌ Virheellinen infotiedosto!',
        confirmLogout: 'Haluatko varmasti kirjautua ulos?',
        confirmDialogTitle: '✅ Vahvista muutokset',
        confirmSaveEdit: 'Haluatko varmasti tallentaa muutokset?',
        confirmImport: '📥 Tuo tietoja?\n\n📊 {active} aktiivista kohdetta\n✅ {done} valmista kohdetta\n📦 {archived} arkistoitua kohdetta\n📅 Viety: {date}\n\nNapsauta "OK" KORVATAKSESI kaikki nykyiset tiedot.\nNapsauta "Peruuta" LISÄTÄKSESI tietoja.',
        confirmReplace: '✅ Tuotiin {active} aktiivista, {done} valmista ja {archived} arkistoitua kohdetta! (KORVATTU)',
        confirmAdded: '✅ Tuotiin {count} uutta kohdetta! (LISÄTTY)',
        notifTitle: '🔔 Muistutus: {name}',
        notifBody: '{task} ({priority}) - {note}'
    }
};

// ============================================
// SPRÅKFUNKTIONER
// ============================================

function getLang() {
    return localStorage.getItem('appLanguage') || 'sv';
}

function setLang(lang) {
    localStorage.setItem('appLanguage', lang);
    currentLanguage = lang;
}

function getCategoryTexts() {
    const lang = getLang();
    if (lang === 'en') {
        return {
            label: 'Category:',
            high: 'High Priority',
            patients: 'Patients',
            authorities: 'Authorities',
            administration: 'Administration',
            private: 'Private',
            games: 'Games',
            other: 'Other',
            highPriority: 'High Priority'
        };
    }
    if (lang === 'da') {
        return {
            label: 'Kategori:',
            high: 'Høj prioritet',
            patients: 'Patienter',
            authorities: 'Myndigheder',
            administration: 'Administration',
            private: 'Privat',
            games: 'Spil',
            other: 'Andet',
            highPriority: 'Hoj prioritet'
        };
    }
    if (lang === 'no') {
        return {
            label: 'Kategori:',
            high: 'Høy prioritet',
            patients: 'Pasienter',
            authorities: 'Myndigheter',
            administration: 'Administrasjon',
            private: 'Privat',
            games: 'Spill',
            other: 'Annet',
            highPriority: 'Hoy prioritet'
        };
    }
    if (lang === 'fi') {
        return {
            label: 'Kategoria:',
            high: 'Korkea prioriteetti',
            patients: 'Potilaat',
            authorities: 'Viranomaiset',
            administration: 'Hallinto',
            private: 'Yksityinen',
            games: 'Pelit',
            other: 'Muu',
            highPriority: 'Korkea prioriteetti'
        };
    }

    return {
        label: 'Kategori:',
        high: 'Hög prioritet',
        patients: 'Patienter',
        authorities: 'Myndigheter',
        administration: 'Administration',
        private: 'Privat',
        games: 'Spel',
        other: 'Övrigt',
        highPriority: 'Hog prioritet'
    };
}

function getSortTexts() {
    var lang = getLang();
    if (lang === 'en') {
        return {
            dateDesc: 'Newest first',
            dateAsc: 'Oldest first',
            nameAsc: 'Name A-Z',
            nameDesc: 'Name Z-A'
        };
    }
    if (lang === 'da') {
        return {
            dateDesc: 'Nyeste først',
            dateAsc: 'Ældste først',
            nameAsc: 'Navn A-Å',
            nameDesc: 'Navn Å-A'
        };
    }
    if (lang === 'no') {
        return {
            dateDesc: 'Nyeste først',
            dateAsc: 'Eldste først',
            nameAsc: 'Navn A-Å',
            nameDesc: 'Navn Å-A'
        };
    }
    if (lang === 'fi') {
        return {
            dateDesc: 'Uusimmat ensin',
            dateAsc: 'Vanhimmat ensin',
            nameAsc: 'Nimi A-Ö',
            nameDesc: 'Nimi Ö-A'
        };
    }

    return {
        dateDesc: 'Nyast först',
        dateAsc: 'Äldst först',
        nameAsc: 'Namn A-Ö',
        nameDesc: 'Namn Ö-A'
    };
}

function updateSortLanguageText() {
    var text = getSortTexts();
    var dateDesc = document.getElementById('sortOptionDateDesc');
    var dateAsc = document.getElementById('sortOptionDateAsc');
    var nameAsc = document.getElementById('sortOptionNameAsc');
    var nameDesc = document.getElementById('sortOptionNameDesc');

    if (dateDesc) dateDesc.textContent = text.dateDesc;
    if (dateAsc) dateAsc.textContent = text.dateAsc;
    if (nameAsc) nameAsc.textContent = text.nameAsc;
    if (nameDesc) nameDesc.textContent = text.nameDesc;
}

function getCategoryIcon(categoryKey) {
    var normalized = normalizeCategoryValue(categoryKey);
    if (normalized === 'high') return '🔴';
    if (normalized === 'patients') return '🏥';
    if (normalized === 'authorities') return '🏛️';
    if (normalized === 'administration') return '🗂️';
    if (normalized === 'private') return '🏠';
    if (normalized === 'games') return '🎮';
    return '📌';
}

function updateCategoryLanguageText() {
    const text = getCategoryTexts();

    const categoryLabel = document.getElementById('categoryLabel');
    if (categoryLabel) categoryLabel.textContent = text.label;

    const editCategoryLabel = document.getElementById('editCategoryLabel');
    if (editCategoryLabel) editCategoryLabel.textContent = text.label;

    const categoryOptionHigh = document.getElementById('categoryOptionHigh');
    if (categoryOptionHigh) categoryOptionHigh.textContent = getCategoryIcon('high') + ' ' + text.high;
    const categoryOptionPatients = document.getElementById('categoryOptionPatients');
    if (categoryOptionPatients) categoryOptionPatients.textContent = getCategoryIcon('patients') + ' ' + text.patients;
    const categoryOptionAuthorities = document.getElementById('categoryOptionAuthorities');
    if (categoryOptionAuthorities) categoryOptionAuthorities.textContent = getCategoryIcon('authorities') + ' ' + text.authorities;
    const categoryOptionAdministration = document.getElementById('categoryOptionAdministration');
    if (categoryOptionAdministration) categoryOptionAdministration.textContent = getCategoryIcon('administration') + ' ' + text.administration;
    const categoryOptionPrivate = document.getElementById('categoryOptionPrivate');
    if (categoryOptionPrivate) categoryOptionPrivate.textContent = getCategoryIcon('private') + ' ' + text.private;
    const categoryOptionGames = document.getElementById('categoryOptionGames');
    if (categoryOptionGames) categoryOptionGames.textContent = getCategoryIcon('games') + ' ' + text.games;
    const categoryOptionOther = document.getElementById('categoryOptionOther');
    if (categoryOptionOther) categoryOptionOther.textContent = getCategoryIcon('other') + ' ' + text.other;

    const editCategoryOptionHigh = document.getElementById('editCategoryOptionHigh');
    if (editCategoryOptionHigh) editCategoryOptionHigh.textContent = getCategoryIcon('high') + ' ' + text.high;
    const editCategoryOptionPatients = document.getElementById('editCategoryOptionPatients');
    if (editCategoryOptionPatients) editCategoryOptionPatients.textContent = getCategoryIcon('patients') + ' ' + text.patients;
    const editCategoryOptionAuthorities = document.getElementById('editCategoryOptionAuthorities');
    if (editCategoryOptionAuthorities) editCategoryOptionAuthorities.textContent = getCategoryIcon('authorities') + ' ' + text.authorities;
    const editCategoryOptionAdministration = document.getElementById('editCategoryOptionAdministration');
    if (editCategoryOptionAdministration) editCategoryOptionAdministration.textContent = getCategoryIcon('administration') + ' ' + text.administration;
    const editCategoryOptionPrivate = document.getElementById('editCategoryOptionPrivate');
    if (editCategoryOptionPrivate) editCategoryOptionPrivate.textContent = getCategoryIcon('private') + ' ' + text.private;
    const editCategoryOptionGames = document.getElementById('editCategoryOptionGames');
    if (editCategoryOptionGames) editCategoryOptionGames.textContent = getCategoryIcon('games') + ' ' + text.games;
    const editCategoryOptionOther = document.getElementById('editCategoryOptionOther');
    if (editCategoryOptionOther) editCategoryOptionOther.textContent = getCategoryIcon('other') + ' ' + text.other;
}

function t(key) {
    const lang = getLang();
    const parts = key.split('.');
    let value = translations[lang];
    for (let part of parts) {
        if (value && value[part] !== undefined) {
            value = value[part];
        } else {
            return key;
        }
    }
    return value || key;
}

function toggleLanguageMenu() {
    document.getElementById('languageDropdown').classList.toggle('show');
}

document.addEventListener('click', function(e) {
    const wrapper = document.querySelector('.language-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('languageDropdown').classList.remove('show');
    }
});

function updateLanguageMenu() {
    const lang = getLang();
    document.querySelectorAll('.language-dropdown button').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function changeLanguage(lang) {
    setLang(lang);
    updateLanguageMenu();
    document.getElementById('languageDropdown').classList.remove('show');
    applyLanguage();
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    const setText = function(id, key) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = t(key);
        }
    };

    const setPlaceholder = function(id, key) {
        const el = document.getElementById(id);
        if (el) {
            el.placeholder = t(key);
        }
    };

    setText('loginTitle', 'loginTitle');
    setText('loginBtn', 'loginBtn');
    setPlaceholder('passwordInput', 'loginPlaceholder');

    setText('changePwTitle', 'changePwTitle');
    setPlaceholder('oldPassword', 'oldPwPlaceholder');
    setPlaceholder('newPassword1', 'newPwPlaceholder');
    setPlaceholder('newPassword2', 'confirmPwPlaceholder');
    setText('savePwBtn', 'savePwBtn');
    setText('cancelPwBtn', 'cancelPwBtn');

    setText('subtitleSlogan', 'slogan');
    setText('changePwBtn', 'changePwBtn');
    setText('archiveBtn', 'archiveBtn');
    setText('logoutBtn', 'logoutBtn');

    setText('exportJsonBtn', 'exportJson');
    setText('exportEncryptedBtn', 'exportEncrypted');
    setText('exportCsvBtn', 'exportCsv');
    setText('importBtn', 'importBtn');

    setPlaceholder('searchInput', 'searchActive');
    setPlaceholder('doneSearchInput', 'archiveSearch');
    setText('archiveAllBtn', 'archiveAllBtn');

    setText('undoText', 'undoText');
    setText('undoBtn', 'undoBtn');

    setText('footerText', 'footerText');
    setText('infoTitle', 'infoTitle');
    updateAdminPanelLanguage();
    if (typeof renderInfoContent === 'function') {
        renderInfoContent();
    }

    const archiveTitle = document.getElementById('archiveTitle');
    if (archiveTitle) {
        archiveTitle.textContent = t('archiveModalTitle') + ' (' + archivedItems.length + ')';
    }
    setPlaceholder('archiveSearch', 'archiveSearch');
    setText('archiveVaultBtn', 'archiveVaultBtn');
    setText('archiveClearBtn', 'archiveClear');
    setText('archiveCloseBtn', 'archiveClose');
    if (typeof updateReminderLanguageText === 'function') updateReminderLanguageText();
    if (typeof updateCategoryLanguageText === 'function') updateCategoryLanguageText();
    if (typeof updateSortLanguageText === 'function') updateSortLanguageText();

    const statusDiv = document.getElementById('loginStatus');
    if (statusDiv) {
        if (isFirstTimeUser()) {
            statusDiv.textContent = t('loginStatusWelcome');
        } else if (!document.getElementById('app').classList.contains('hidden')) {
        } else {
            statusDiv.textContent = t('loginStatusLogin');
        }
    }

    render();
}

function updateAdminPanelLanguage() {
    const adminLoginTitle = document.getElementById('adminLoginTitle');
    if (adminLoginTitle) adminLoginTitle.textContent = t('adminLoginTitle');

    const adminLoginDesc = document.getElementById('adminLoginDesc');
    if (adminLoginDesc) adminLoginDesc.textContent = t('adminLoginDesc');

    const adminPasswordInput = document.getElementById('adminPasswordInput');
    if (adminPasswordInput) adminPasswordInput.placeholder = t('adminLoginPasswordPlaceholder');

    const adminLoginButton = document.getElementById('adminLoginButton');
    if (adminLoginButton) adminLoginButton.textContent = t('adminLoginButton');

    const adminLoginCancel = document.getElementById('adminLoginCancel');
    if (adminLoginCancel) adminLoginCancel.textContent = t('adminLoginCancel');

    const adminPanelTitle = document.getElementById('adminPanelTitle');
    if (adminPanelTitle) adminPanelTitle.textContent = t('adminPanelTitle');

    const adminPanelIntro = document.getElementById('adminPanelIntro');
    if (adminPanelIntro) adminPanelIntro.textContent = t('adminPanelIntro');

    const adminTitleLabel = document.getElementById('adminTitleLabel');
    if (adminTitleLabel) adminTitleLabel.textContent = t('adminTitleLabel');

    const adminTitle = document.getElementById('adminTitle');
    if (adminTitle) adminTitle.placeholder = t('adminTitlePlaceholder');

    const adminDescLabel = document.getElementById('adminDescLabel');
    if (adminDescLabel) adminDescLabel.textContent = t('adminDescLabel');

    const adminDesc = document.getElementById('adminDesc');
    if (adminDesc) adminDesc.placeholder = t('adminDescPlaceholder');

    const adminTypeLabel = document.getElementById('adminTypeLabel');
    if (adminTypeLabel) adminTypeLabel.textContent = t('adminTypeLabel');

    const adminTypeNewOption = document.getElementById('adminTypeNewOption');
    if (adminTypeNewOption) adminTypeNewOption.textContent = t('adminTypeNew');

    const adminTypeUpdateOption = document.getElementById('adminTypeUpdateOption');
    if (adminTypeUpdateOption) adminTypeUpdateOption.textContent = t('adminTypeUpdate');

    const adminTypeBugFixOption = document.getElementById('adminTypeBugFixOption');
    if (adminTypeBugFixOption) adminTypeBugFixOption.textContent = t('adminTypeBugFix');

    const adminTypePlanOption = document.getElementById('adminTypePlanOption');
    if (adminTypePlanOption) adminTypePlanOption.textContent = t('adminTypePlan');

    const adminDateLabel = document.getElementById('adminDateLabel');
    if (adminDateLabel) adminDateLabel.textContent = t('adminDateLabel');

    const adminAddButton = document.getElementById('adminAddButton');
    if (adminAddButton) adminAddButton.textContent = t('adminAddButton');

    const adminSaveButton = document.getElementById('adminSaveButton');
    if (adminSaveButton) adminSaveButton.textContent = t('adminSaveButton');

    const adminCloseButton = document.getElementById('adminCloseButton');
    if (adminCloseButton) adminCloseButton.textContent = t('adminCloseButton');

    const adminCurrentTitle = document.getElementById('adminCurrentTitle');
    if (adminCurrentTitle) adminCurrentTitle.textContent = t('adminCurrentTitle');

    if (document.getElementById('adminPanel').style.display === 'flex') {
        renderAdminList();
    }
}

// ============================================
// LÖSENORD - LOGIN
// ============================================

function getStoredPassword() {
    try {
        return localStorage.getItem("userPassword");
    } catch (e) {
        return null;
    }
}

function setStoredPassword(password) {
    try {
        localStorage.setItem("userPassword", hashPassword(password));
    } catch (e) {
        console.warn('Kunde inte spara lösenord:', e);
    }
}

function isFirstTimeUser() {
    const storedPassword = getStoredPassword();
    return storedPassword === null || storedPassword === '';
}

function checkPassword() {
    showApp();
}

function showApp() {
    const loginBox = document.getElementById("loginBox");
    if (loginBox) {
        loginBox.style.display = "none";
    }

    const app = document.getElementById("app");
    if (app) {
        app.classList.remove("hidden");
    }

    updateLanguageMenu();
    applyLanguage();
    loadTheme();
    setTimeout(function() {
        checkNotifications();
    }, 1000);
}

try {
    showApp();
} catch (e) {
    console.warn('Kunde inte öppna ApexCore appen direkt:', e);
}

// ============================================
// LOGGA UT
// ============================================

function logout() {
    if (confirm(t('confirmLogout'))) {
        localStorage.removeItem("login");
        location.reload();
    }
}

// ============================================
// ÄNDRA LÖSENORD
// ============================================

function showChangePassword() {
    document.getElementById("changePasswordModal").style.display = "flex";
    document.getElementById("changeError").textContent = "";
    document.getElementById("changeSuccess").textContent = "";
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword1").value = "";
    document.getElementById("newPassword2").value = "";
}

function closeChangePassword() {
    document.getElementById("changePasswordModal").style.display = "none";
}

function changePassword() {
    const oldPw = document.getElementById("oldPassword").value;
    const newPw1 = document.getElementById("newPassword1").value;
    const newPw2 = document.getElementById("newPassword2").value;
    const errorDiv = document.getElementById("changeError");
    const successDiv = document.getElementById("changeSuccess");

    errorDiv.textContent = "";
    successDiv.textContent = "";

    const storedPw = getStoredPassword();
    const oldPwMatch = isPasswordHashed(storedPw)
        ? hashPassword(oldPw) === storedPw
        : oldPw === storedPw;

    if (!oldPwMatch) {
        errorDiv.textContent = t('msgPasswordWrong');
        return;
    }

    if (newPw1.length < 4) {
        errorDiv.textContent = t('msgPasswordShort');
        return;
    }

    if (newPw1 !== newPw2) {
        errorDiv.textContent = t('msgPasswordMismatch');
        return;
    }

    if (newPw1 === oldPw) {
        errorDiv.textContent = t('msgPasswordSame');
        return;
    }

    setStoredPassword(newPw1);
    successDiv.textContent = t('msgPasswordChanged');
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword1").value = "";
    document.getElementById("newPassword2").value = "";

    setTimeout(function() {
        closeChangePassword();
    }, 2000);
}

// ============================================
// SAVE / LOAD
// ============================================

function saveData() {
    try {
        localStorage.setItem("items", JSON.stringify(items || []));
        localStorage.setItem("doneItems", JSON.stringify(doneItems || []));
        localStorage.setItem("archivedItems", JSON.stringify(archivedItems || []));
        localStorage.setItem('activeGroupsCollapsed', JSON.stringify(activeGroupsCollapsed || {}));
    } catch (e) {
        console.warn('Kunde inte spara appdata:', e);
    }
}

function normalizePriorityValue(value) {
    return value === 'high' ? 'high' : 'normal';
}

function normalizeCategoryValue(value) {
    var normalized = String(value || '').toLowerCase();
    if (normalized === 'high' || normalized === 'patients' || normalized === 'authorities' || normalized === 'administration' || normalized === 'private' || normalized === 'games' || normalized === 'other') {
        return normalized;
    }
    return 'other';
}

function getStoredAddCategory() {
    var stored = normalizeCategoryValue(localStorage.getItem('lastAddCategory'));
    return stored === 'high' ? 'patients' : stored;
}

function setStoredAddCategory(category) {
    var normalized = normalizeCategoryValue(category);
    if (normalized === 'high') return;
    localStorage.setItem('lastAddCategory', normalized);
}

function applyStoredAddCategorySelection() {
    var categoryInput = document.getElementById('categoryInput');
    if (!categoryInput) return;
    categoryInput.value = getStoredAddCategory();
}

function getStoredActiveSortMode() {
    var mode = localStorage.getItem('activeSortMode') || 'date-desc';
    var validModes = ['date-desc', 'date-asc', 'name-asc', 'name-desc'];
    return validModes.indexOf(mode) !== -1 ? mode : 'date-desc';
}

function setActiveSortMode(mode) {
    var validModes = ['date-desc', 'date-asc', 'name-asc', 'name-desc'];
    var normalized = validModes.indexOf(mode) !== -1 ? mode : 'date-desc';
    localStorage.setItem('activeSortMode', normalized);

    var sortSelect = document.getElementById('activeSortSelect');
    if (sortSelect) {
        sortSelect.value = normalized;
    }
}

function sortActiveItems(list) {
    var mode = getStoredActiveSortMode();
    var lang = getLang();
    var sorted = (list || []).slice();

    sorted.sort(function(a, b) {
        if (mode === 'name-asc' || mode === 'name-desc') {
            var nameA = String(a.name || '');
            var nameB = String(b.name || '');
            var cmp = nameA.localeCompare(nameB, lang, { sensitivity: 'base' });
            if (cmp !== 0) return mode === 'name-asc' ? cmp : -cmp;
            return (b.updated || 0) - (a.updated || 0);
        }

        var dateA = Number(a.updated || 0);
        var dateB = Number(b.updated || 0);
        if (dateA !== dateB) {
            return mode === 'date-asc' ? dateA - dateB : dateB - dateA;
        }

        return String(a.name || '').localeCompare(String(b.name || ''), lang, { sensitivity: 'base' });
    });

    return sorted;
}

function normalizeItemData(item) {
    if (!item || typeof item !== 'object') return item;

    item.priority = normalizePriorityValue(item.priority);
    item.category = normalizeCategoryValue(item.category);
    return item;
}

function loadData() {
    try {
        const i = localStorage.getItem("items");
        const d = localStorage.getItem("doneItems");
        const a = localStorage.getItem("archivedItems");
        const g = localStorage.getItem('activeGroupsCollapsed');

        items = i ? JSON.parse(i) : [];
        doneItems = d ? JSON.parse(d) : [];
        archivedItems = a ? JSON.parse(a) : [];

        try {
            activeGroupsCollapsed = g ? JSON.parse(g) : {};
        } catch (e) {
            activeGroupsCollapsed = {};
        }
    } catch (e) {
        items = [];
        doneItems = [];
        archivedItems = [];
        activeGroupsCollapsed = {};
        console.warn('Kunde inte läsa appdata, använder tomt state:', e);
    }

    items = (items || []).map(normalizeItemData);
    doneItems = (doneItems || []).map(normalizeItemData);
    archivedItems = (archivedItems || []).map(normalizeItemData);

    // Migrate historical Done entries into Archive so one completed flow is used.
    if (doneItems.length > 0) {
        archivedItems = doneItems.concat(archivedItems);
        doneItems = [];
        saveData();
    }

    const lang = localStorage.getItem('appLanguage') || 'sv';
    currentLanguage = lang;

    if (!localStorage.getItem('lastAddCategory')) {
        localStorage.setItem('lastAddCategory', 'patients');
    }
}

// ============================================
// MEDDELANDEN OCH PROGRESS
// ============================================

function showMessage(text, type) {
    if (!type) type = 'info';
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;
    msg.style.display = 'block';
    setTimeout(function() {
        msg.style.display = 'none';
    }, 4000);
}

function showProgress(text) {
    document.getElementById('progressText').textContent = text;
    document.getElementById('progressOverlay').style.display = 'flex';
}

function hideProgress() {
    document.getElementById('progressOverlay').style.display = 'none';
}

function getDefaultUpdates() {
    const lang = getLang();

    if (lang === 'en') {
        return [
            { id: 'archive-vault', type: 'new', date: '2026-07-30', title: '🗄️ Archive vault export', description: 'You can move archived items into one encrypted vault file. After the file is created, the archive is cleared.' },
            { id: 'vault-import', type: 'new', date: '2026-07-30', title: '📥 Restore vault items into Active', description: 'A vault file can be imported later and its archived items will be placed in Active so they can be searched and worked with again.' },
            { id: 'info-panel-backup', type: 'new', date: '2026-07-30', title: '💾 Save and restore the info panel', description: 'The info panel can be exported as its own file, imported again later, and is included automatically inside vault exports.' },
            { id: 'custom-export-filenames', type: 'update', date: '2026-07-30', title: '✏️ Name exported files yourself', description: 'When exporting backups, CSV files, encrypted files, info-panel files, or vault files, you can now choose the file name yourself.' },
            { id: 'neutral-button-style', type: 'update', date: '2026-07-30', title: '🎛️ Cleaner button styling', description: 'Buttons that still stood out with stronger accent colors now use a more neutral style that matches the rest of the app.' },
            { id: 'duplicate-protection', type: 'bugfix', date: '2026-07-30', title: '🧹 Duplicate protection for info imports', description: 'Imported info-panel entries are now checked for duplicates so the same built-in or imported update is not added more than once.' },
            { id: 'active-categories', type: 'new', date: '2026-07-31', title: '📁 Categories in Active', description: 'Active items can now be grouped into collapsible categories: Patients, Administration, Private and Other.' },
            { id: 'high-priority-top', type: 'update', date: '2026-07-31', title: '🔴 High priority always on top', description: 'High-priority items now override categories and are always shown first in Active for better visibility.' },
            { id: 'edit-outside-close', type: 'update', date: '2026-07-31', title: '🖱️ Click outside to close Edit', description: 'The edit panel now closes when you click outside it, making quick miss-click recovery easier.' },
            { id: 'high-in-category', type: 'update', date: '2026-07-31', title: '🔴 High priority moved into Category', description: 'High priority can now be selected directly in the category list, so one selector handles both grouping and priority placement.' },
            { id: 'hide-empty-notes', type: 'bugfix', date: '2026-07-31', title: '📝 Empty notes are hidden', description: 'If an item has no notes, the Notes row is no longer shown in Active to keep cards cleaner.' }
        ];
    }

    if (lang === 'da') {
        return [
            { id: 'archive-vault', type: 'new', date: '2026-07-30', title: '🗄️ Eksport af arkiv-vault', description: 'Du kan flytte arkiverede poster til én krypteret vault-fil. Når filen er oprettet, bliver arkivet tømt.' },
            { id: 'vault-import', type: 'new', date: '2026-07-30', title: '📥 Gendan vault-poster til Aktiv', description: 'En vault-fil kan importeres senere, og de arkiverede poster bliver lagt i Aktiv, så de kan søges frem og bruges igen.' },
            { id: 'info-panel-backup', type: 'new', date: '2026-07-30', title: '💾 Gem og gendan info-panelet', description: 'Info-panelet kan eksporteres som sin egen fil, importeres igen senere og følger automatisk med i vault-eksporter.' },
            { id: 'custom-export-filenames', type: 'update', date: '2026-07-30', title: '✏️ Giv eksportfiler dine egne navne', description: 'Når du eksporterer backups, CSV-filer, krypterede filer, info-filer eller vault-filer, kan du nu selv vælge filnavnet.' },
            { id: 'neutral-button-style', type: 'update', date: '2026-07-30', title: '🎛️ Renere knapstil', description: 'Knapper, som tidligere skilte sig ud med stærkere accentfarver, bruger nu en mere neutral stil, der passer til resten af appen.' },
            { id: 'duplicate-protection', type: 'bugfix', date: '2026-07-30', title: '🧹 Beskyttelse mod dubletter ved info-import', description: 'Importerede info-panel-poster bliver nu kontrolleret for dubletter, så den samme indbyggede eller importerede opdatering ikke tilføjes mere end én gang.' },
            { id: 'active-categories', type: 'new', date: '2026-07-31', title: '📁 Kategorier i Aktiv', description: 'Aktive poster kan nu grupperes i sammenklappelige kategorier: Patienter, Administration, Privat og Andet.' },
            { id: 'high-priority-top', type: 'update', date: '2026-07-31', title: '🔴 Høj prioritet altid øverst', description: 'Poster med høj prioritet overstyrer nu kategorier og vises altid først i Aktiv for bedre synlighed.' },
            { id: 'edit-outside-close', type: 'update', date: '2026-07-31', title: '🖱️ Klik udenfor for at lukke Redigér', description: 'Redigér-panelet lukkes nu, når du klikker udenfor det, så fejlklik er hurtigere at rette.' },
            { id: 'high-in-category', type: 'update', date: '2026-07-31', title: '🔴 Høj prioritet flyttet til Kategori', description: 'Høj prioritet kan nu vælges direkte i kategorilisten, så én vælger styrer både gruppering og prioriteret placering.' },
            { id: 'hide-empty-notes', type: 'bugfix', date: '2026-07-31', title: '📝 Tomme noter skjules', description: 'Hvis en post ikke har noter, vises Notes-linjen ikke længere i Aktiv for et renere kort.' }
        ];
    }

    if (lang === 'no') {
        return [
            { id: 'archive-vault', type: 'new', date: '2026-07-30', title: '🗄️ Eksport av arkiv-vault', description: 'Du kan flytte arkiverte elementer til én kryptert vault-fil. Når filen er laget, blir arkivet tømt.' },
            { id: 'vault-import', type: 'new', date: '2026-07-30', title: '📥 Gjenopprett vault-elementer til Aktiv', description: 'En vault-fil kan importeres senere, og de arkiverte elementene legges i Aktiv slik at de blir søkbare og kan brukes igjen.' },
            { id: 'info-panel-backup', type: 'new', date: '2026-07-30', title: '💾 Lagre og gjenopprett infopanelet', description: 'Infopanelet kan eksporteres som egen fil, importeres igjen senere og følger automatisk med i vault-eksporter.' },
            { id: 'custom-export-filenames', type: 'update', date: '2026-07-30', title: '✏️ Gi eksportfiler egne navn', description: 'Når du eksporterer sikkerhetskopier, CSV-filer, krypterte filer, infofiler eller vault-filer, kan du nå velge filnavnet selv.' },
            { id: 'neutral-button-style', type: 'update', date: '2026-07-30', title: '🎛️ Renere knappestil', description: 'Knapper som tidligere skilte seg ut med sterkere aksentfarger bruker nå en mer nøytral stil som passer resten av appen.' },
            { id: 'duplicate-protection', type: 'bugfix', date: '2026-07-30', title: '🧹 Beskyttelse mot duplikater ved infoimport', description: 'Importerte infopanel-oppføringer blir nå kontrollert for duplikater slik at samme innebygde eller importerte oppdatering ikke legges til mer enn én gang.' },
            { id: 'active-categories', type: 'new', date: '2026-07-31', title: '📁 Kategorier i Aktiv', description: 'Aktive elementer kan nå grupperes i sammenleggbare kategorier: Pasienter, Administrasjon, Privat og Annet.' },
            { id: 'high-priority-top', type: 'update', date: '2026-07-31', title: '🔴 Høy prioritet alltid øverst', description: 'Elementer med høy prioritet overstyrer nå kategorier og vises alltid først i Aktiv for bedre synlighet.' },
            { id: 'edit-outside-close', type: 'update', date: '2026-07-31', title: '🖱️ Klikk utenfor for å lukke Rediger', description: 'Redigeringspanelet lukkes nå når du klikker utenfor det, slik at feilklikk er enklere å rette opp.' },
            { id: 'high-in-category', type: 'update', date: '2026-07-31', title: '🔴 Høy prioritet flyttet til Kategori', description: 'Høy prioritet kan nå velges direkte i kategorilisten, slik at én velger styrer både gruppering og prioritert plassering.' },
            { id: 'hide-empty-notes', type: 'bugfix', date: '2026-07-31', title: '📝 Tomme notater skjules', description: 'Hvis et element ikke har notater, vises ikke Notes-linjen lenger i Aktiv for et renere kort.' }
        ];
    }

    if (lang === 'fi') {
        return [
            { id: 'archive-vault', type: 'new', date: '2026-07-30', title: '🗄️ Arkistovaultin vienti', description: 'Voit siirtää arkistoidut kohteet yhteen salattuun vault-tiedostoon. Kun tiedosto on luotu, arkisto tyhjennetään.' },
            { id: 'vault-import', type: 'new', date: '2026-07-30', title: '📥 Palauta vault-kohteet Aktiiviseen', description: 'Vault-tiedosto voidaan tuoda myöhemmin takaisin, ja sen arkistoidut kohteet lisätään Aktiiviseen, jotta niitä voi hakea ja käyttää uudelleen.' },
            { id: 'info-panel-backup', type: 'new', date: '2026-07-30', title: '💾 Tallenna ja palauta infopaneeli', description: 'Infopaneeli voidaan viedä omana tiedostonaan, tuoda takaisin myöhemmin ja se sisältyy automaattisesti myös vault-vienteihin.' },
            { id: 'custom-export-filenames', type: 'update', date: '2026-07-30', title: '✏️ Anna vientitiedostoille omat nimet', description: 'Kun viet varmuuskopioita, CSV-tiedostoja, salattuja tiedostoja, infotiedostoja tai vault-tiedostoja, voit nyt valita tiedostonimen itse.' },
            { id: 'neutral-button-style', type: 'update', date: '2026-07-30', title: '🎛️ Selkeämpi painiketyyli', description: 'Painikkeet, jotka erottuivat aiemmin voimakkaammilla korosteväreillä, käyttävät nyt neutraalimpaa tyyliä, joka sopii paremmin muuhun sovellukseen.' },
            { id: 'duplicate-protection', type: 'bugfix', date: '2026-07-30', title: '🧹 Kaksoiskappalesuoja infotiedoille', description: 'Tuodut infopaneelin merkinnät tarkistetaan nyt kaksoiskappaleiden varalta, jotta sama sisäänrakennettu tai tuotu päivitys ei lisäänny useammin kuin kerran.' },
            { id: 'active-categories', type: 'new', date: '2026-07-31', title: '📁 Kategoriat Aktiivisessa', description: 'Aktiiviset kohteet voidaan nyt ryhmitellä avattaviin ja suljettaviin kategorioihin: Potilaat, Hallinto, Yksityinen ja Muu.' },
            { id: 'high-priority-top', type: 'update', date: '2026-07-31', title: '🔴 Korkea prioriteetti aina ylhäällä', description: 'Korkean prioriteetin kohteet ohittavat nyt kategoriat ja näkyvät aina ensimmäisenä Aktiivisessa paremman näkyvyyden vuoksi.' },
            { id: 'edit-outside-close', type: 'update', date: '2026-07-31', title: '🖱️ Sulje muokkaus klikkaamalla ulkopuolelle', description: 'Muokkauspaneeli sulkeutuu nyt, kun klikkaat sen ulkopuolelle, mikä helpottaa virheklikkauksista toipumista.' },
            { id: 'high-in-category', type: 'update', date: '2026-07-31', title: '🔴 Korkea prioriteetti siirrettiin Kategoriaan', description: 'Korkea prioriteetti voidaan nyt valita suoraan kategorialistasta, joten yksi valinta ohjaa sekä ryhmittelyä että prioriteettisijoittelua.' },
            { id: 'hide-empty-notes', type: 'bugfix', date: '2026-07-31', title: '📝 Tyhjät muistiinpanot piilotetaan', description: 'Jos kohteella ei ole muistiinpanoja, Notes-riviä ei enää näytetä Aktiivisessa, jotta kortti pysyy siistimpänä.' }
        ];
    }

    return [
        { id: 'archive-vault', type: 'new', date: '2026-07-30', title: '🗄️ Exportera arkivet till en vault-fil', description: 'Du kan flytta arkiverade poster till en krypterad vault-fil. När filen har skapats töms arkivet automatiskt.' },
        { id: 'vault-import', type: 'new', date: '2026-07-30', title: '📥 Återställ vault-poster till Active', description: 'En vault-fil kan importeras senare och dess arkiverade poster läggs då i Active så att de går att söka fram och använda igen.' },
        { id: 'info-panel-backup', type: 'new', date: '2026-07-30', title: '💾 Spara och återställ info-panelen', description: 'Info-panelen kan exporteras som en egen fil, importeras igen senare och följer också automatiskt med i vault-exporter.' },
        { id: 'custom-export-filenames', type: 'update', date: '2026-07-30', title: '✏️ Välj egna namn på exportfiler', description: 'När du exporterar backuper, CSV-filer, krypterade filer, infofiler eller vault-filer kan du nu själv välja filnamnet.' },
        { id: 'neutral-button-style', type: 'update', date: '2026-07-30', title: '🎛️ Renare knappstil', description: 'Knappar som tidigare stack ut med starkare accentfärger använder nu en mer neutral stil som passar bättre ihop med resten av appen.' },
        { id: 'duplicate-protection', type: 'bugfix', date: '2026-07-30', title: '🧹 Dubblettskydd vid info-import', description: 'Importerade poster i info-panelen kontrolleras nu för dubbletter så att samma inbyggda eller importerade uppdatering inte läggs till mer än en gång.' },
        { id: 'active-categories', type: 'new', date: '2026-07-31', title: '📁 Kategorier i Active', description: 'Aktiva poster kan nu grupperas i kollapsbara kategorier: Patienter, Administration, Privat och Övrigt.' },
        { id: 'high-priority-top', type: 'update', date: '2026-07-31', title: '🔴 Hög prioritet alltid överst', description: 'Poster med hög prioritet överstyr nu kategorier och visas alltid först i Active för bättre synlighet.' },
        { id: 'edit-outside-close', type: 'update', date: '2026-07-31', title: '🖱️ Klicka utanför för att stänga Redigera', description: 'Redigeringspanelen stängs nu när du klickar utanför den, så det går snabbare att återhämta sig från felklick.' },
        { id: 'high-in-category', type: 'update', date: '2026-07-31', title: '🔴 Hög prioritet flyttad till Kategori', description: 'Hög prioritet kan nu väljas direkt i kategorilistan, så en och samma väljare hanterar både gruppering och prioriterad placering.' },
        { id: 'hide-empty-notes', type: 'bugfix', date: '2026-07-31', title: '📝 Tomma anteckningar döljs', description: 'Om en post saknar anteckningar visas inte längre Notes-raden i Active, vilket gör korten renare.' }
    ];
}

function getAdminUpdates() {
    const updates = localStorage.getItem('adminUpdates');
    if (updates) {
        try {
            return JSON.parse(updates);
        } catch(e) {
            return getDefaultUpdates();
        }
    }
    return getDefaultUpdates();
}

function getSharedUpdatesUrls() {
    const baseUrl = window.location.href;
    const absoluteBase = new URL(baseUrl, window.location.href);
    const currentDir = new URL('.', absoluteBase);
    const repoBase = 'https://steenis1s21-droid.github.io/SteenForge';
    const rawRepoBase = 'https://raw.githubusercontent.com/steenis1s21-droid/SteenForge/publish-clean';

    return [
        new URL('./updates.json', currentDir).toString(),
        new URL('/updates.json', absoluteBase).toString(),
        rawRepoBase + '/updates.json',
        repoBase + '/updates.json',
        repoBase + '/ApexCore_3.0.3_stable/dist-web/updates.json',
        repoBase + '/ApexCore_3.0.3_stable/updates.json'
    ].filter(function(url, index, arr) {
        return arr.indexOf(url) === index;
    });
}

function normalizeRemoteUpdates(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.updates)) return payload.updates;
    if (Array.isArray(payload.adminUpdates)) return payload.adminUpdates;
    return [];
}

function mergeRemoteUpdates(remoteUpdates) {
    const mergedUpdates = mergeAdminUpdates(remoteUpdates, getAdminUpdates());
    saveAdminUpdates(mergedUpdates);
    return mergedUpdates;
}

function loadSharedUpdates() {
    const urls = getSharedUpdatesUrls();
    let index = 0;

    function tryNext() {
        if (index >= urls.length) {
            return Promise.resolve(false);
        }

        const url = urls[index];
        index += 1;

        return fetch(url, { cache: 'no-store' })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(payload) {
                const remoteUpdates = normalizeRemoteUpdates(payload);
                if (remoteUpdates.length > 0) {
                    mergeRemoteUpdates(remoteUpdates);
                    return true;
                }
                return false;
            })
            .catch(function() {
                return tryNext();
            });
    }

    return tryNext();
}

function syncSharedUpdatesOnLoad() {
    loadSharedUpdates().then(function(hasUpdates) {
        if (hasUpdates) {
            showMessage('🔄 Hämtade delade uppdateringar från GitHub', 'success');
        }
    });
}

window.addEventListener('load', function() {
    syncSharedUpdatesOnLoad();
});

window.addEventListener('pageshow', function() {
    syncSharedUpdatesOnLoad();
});

function refreshSharedUpdatesFromGitHub() {
    showMessage('🔄 Hämtar uppdateringar från GitHub...', 'info');
    loadSharedUpdates().then(function(hasUpdates) {
        if (hasUpdates) {
            showMessage('✅ Hämtade nya uppdateringar från GitHub', 'success');
        } else {
            showMessage('ℹ️ Inga nya delade uppdateringar hittades', 'info');
        }
    });
}

function getAdminUpdateKey(item) {
    if (!item || typeof item !== 'object') return '';

    const parts = [];
    if (item.id) parts.push(String(item.id));
    if (item.title) parts.push(String(item.title));
    if (item.description) parts.push(String(item.description));
    if (item.type) parts.push(String(item.type));
    if (item.date) parts.push(String(item.date));

    return parts.join('|');
}

function dedupeAdminUpdates(updates) {
    const seen = new Set();

    return (updates || []).filter(function(item) {
        const key = getAdminUpdateKey(item);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function mergeAdminUpdates(primaryUpdates, secondaryUpdates) {
    return dedupeAdminUpdates((primaryUpdates || []).concat(secondaryUpdates || []));
}

function mergeDefaultUpdatesWithStored(defaultUpdates, storedUpdates) {
    const defaultIds = new Set((defaultUpdates || []).map(function(item) {
        return item.id;
    }).filter(Boolean));

    const customStoredUpdates = (storedUpdates || []).filter(function(item) {
        return !item.id || !defaultIds.has(item.id);
    });

    return dedupeAdminUpdates((defaultUpdates || []).concat(customStoredUpdates));
}

function getUpdateTypeSortOrder(type) {
    const order = {
        new: 0,
        update: 1,
        bugfix: 2,
        plan: 3
    };

    return Object.prototype.hasOwnProperty.call(order, type) ? order[type] : 99;
}

function sortUpdatesByType(updates) {
    return (updates || []).slice().sort(function(a, b) {
        return getUpdateTypeSortOrder(a.type) - getUpdateTypeSortOrder(b.type);
    });
}

function getUpdateBadgeClass(type) {
    if (type === 'new') return 'badge-new';
    if (type === 'update') return 'badge-update';
    if (type === 'bugfix') return 'badge-bugfix';
    return 'badge-plan';
}

function getUpdateBadgeText(type) {
    if (type === 'new') return t('infoNew');
    if (type === 'update') return t('infoUpdate');
    if (type === 'bugfix') return t('infoBugFix');
    return t('infoPlan');
}

const ADMIN_UPDATES_SYNC_VERSION = '2026-07-31-high-in-category-notes-hidden';

function syncAdminUpdatesWithDefaults() {
    try {
        if (localStorage.getItem('adminUpdatesSyncVersion') === ADMIN_UPDATES_SYNC_VERSION) {
            return;
        }

        const mergedUpdates = mergeDefaultUpdatesWithStored(getDefaultUpdates(), getAdminUpdates());
        saveAdminUpdates(mergedUpdates);
        localStorage.setItem('adminUpdatesSyncVersion', ADMIN_UPDATES_SYNC_VERSION);
    } catch (e) {
        console.warn('Kunde inte synkronisera adminuppdateringar:', e);
    }
}

function saveAdminUpdates(updates) {
    localStorage.setItem('adminUpdates', JSON.stringify(dedupeAdminUpdates(updates || [])));
}

function exportAdminUpdatesFile() {
    const updates = getAdminUpdates();
    const exportData = {
        source: 'admin-updates',
        adminUpdates: updates,
        exportedAt: new Date().toISOString(),
        version: '2.2'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const fileName = requestExportFileName('apexcore-info-panel-' + new Date().toISOString().split('T')[0], '.json');
    if (!fileName) return;
    downloadBlob(blob, fileName);
    showMessage(t('adminExportSuccess').replace('{count}', updates.length), 'success');
}

function getSharedUpdatesPayload() {
    return {
        updates: dedupeAdminUpdates(getAdminUpdates())
    };
}

function publishSharedUpdatesFile() {
    const payload = getSharedUpdatesPayload();
    const json = JSON.stringify(payload, null, 2);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updates.json';
    a.click();
    URL.revokeObjectURL(url);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).catch(function() {});
    }

    const repoOwner = 'steenis1s21-droid';
    const repoName = 'SteenForge';
    const filePath = 'updates.json';
    const editUrl = 'https://github.com/' + repoOwner + '/' + repoName + '/edit/main/' + filePath;

    window.open(editUrl, '_blank');
    showMessage('📤 Filen sparades lokalt och GitHub öppnades för manuell publicering.', 'success');
}

function importAdminUpdatesFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    showProgress('📥 ' + (getLang() === 'sv' ? 'Läser info-fil...' : 'Reading info file...'));

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const data = JSON.parse(content);

            if (!data || !Array.isArray(data.adminUpdates)) {
                hideProgress();
                showMessage(t('adminImportInvalid'), 'error');
                return;
            }

            const importedUpdates = data.adminUpdates;
            const dateStr = data.exportedAt ? new Date(data.exportedAt).toLocaleString() : 'Unknown';
            const confirmMsg = t('adminImportConfirm')
                .replace('{count}', importedUpdates.length)
                .replace('{date}', dateStr);

            const replaceExisting = confirm(confirmMsg);
            if (replaceExisting) {
                const uniqueImportedUpdates = dedupeAdminUpdates(importedUpdates);
                saveAdminUpdates(uniqueImportedUpdates);
                showMessage(t('adminImportReplace').replace('{count}', uniqueImportedUpdates.length), 'success');
            } else {
                const existingUpdates = getAdminUpdates();
                const mergedUpdates = mergeAdminUpdates(importedUpdates, existingUpdates);
                saveAdminUpdates(mergedUpdates);
                showMessage(t('adminImportAdded').replace('{count}', mergedUpdates.length - existingUpdates.length), 'success');
            }

            renderAdminList();
            renderInfoContent();
            hideProgress();
        } catch (error) {
            hideProgress();
            showMessage(t('adminImportInvalid'), 'error');
            console.error('Admin import error:', error);
        }
    };

    reader.readAsText(file);
    event.target.value = '';
}

// ============================================
// NOTISER / PÅMINNELSER
// ============================================

function checkNotifications() {
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
    }
    
    notificationInterval = setInterval(function() {
        const now = new Date().getTime();
        
        items.forEach(function(item) {
            if (item.notification && item.notification !== '') {
                try {
                    const notifTime = new Date(item.notification).getTime();
                    
                    if (notifTime > 0 && now >= notifTime && now < notifTime + 5000) {
                        if (!item.notificationShown) {
                            item.notificationShown = true;
                            showNotificationPopup(item);
                            saveData();
                        }
                    }
                } catch(e) {}
            }
        });
    }, 5000);
}

function showNotificationPopup(item) {
    const popup = document.getElementById('notificationPopup');
    const title = document.getElementById('notifTitle');
    const body = document.getElementById('notifBody');
    
    playNotificationSound();
    
    const priorityText = getPriorityBadgeText(item.priority);
    
    const notifTitle = t('notifTitle').replace('{name}', item.name);
    const notifBody = t('notifBody')
        .replace('{task}', item.task || '')
        .replace('{priority}', priorityText)
        .replace('{note}', item.note || '');
    
    title.textContent = notifTitle;
    body.textContent = notifBody;
    
    popup.style.display = 'block';
    
    setTimeout(function() {
        closeNotificationPopup();
    }, 15000);
}

function closeNotificationPopup() {
    document.getElementById('notificationPopup').style.display = 'none';
}

// ============================================
// EXPORT / IMPORT
// ============================================

function getExportData() {
    return {
        items: items,
        doneItems: doneItems,
        archivedItems: archivedItems,
        adminUpdates: getAdminUpdates(),
        exportedAt: new Date().toISOString(),
        version: '2.2',
        totalItems: items.length + doneItems.length + archivedItems.length
    };
}

function exportJSON() {
    const data = getExportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const fileName = requestExportFileName('apexcore-backup-' + new Date().toISOString().split('T')[0], '.json');
    if (!fileName) return;
    downloadBlob(blob, fileName);
    showMessage(t('msgExported').replace('{count}', data.totalItems), 'success');
}

function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

function requestExportFileName(defaultBaseName, extension) {
    const suggestedName = defaultBaseName + extension;
    const inputName = prompt(t('exportNamePrompt'), suggestedName);
    if (inputName === null) return null;

    const trimmedName = inputName.trim();
    if (!trimmedName) {
        showMessage(t('exportNameInvalid'), 'error');
        return null;
    }

    return trimmedName.toLowerCase().endsWith(extension.toLowerCase()) ? trimmedName : trimmedName + extension;
}

function requestEncryptionPassword() {
    const password = prompt(t('msgEncryptedPassword'));
    if (!password) return null;

    if (password.length < 4) {
        showMessage(t('msgEncryptedPasswordShort'), 'error');
        return null;
    }

    const confirmPassword = prompt('🔐 ' + (getLang() === 'sv' ? 'Bekräfta lösenordet:' : 'Confirm password:'));
    if (password !== confirmPassword) {
        showMessage(t('msgPasswordMismatch'), 'error');
        return null;
    }

    return password;
}

function createEncryptedExportBlob(data, password) {
    const json = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(json, password).toString();

    const exportData = {
        encrypted: encrypted,
        algorithm: 'AES',
        version: '2.2',
        timestamp: new Date().toISOString()
    };

    return new Blob([JSON.stringify(exportData)], { type: 'application/json' });
}

function exportEncrypted() {
    const password = requestEncryptionPassword();
    if (!password) return;

    showProgress('🔐 Krypterar data...');

    try {
        const data = getExportData();
        const blob = createEncryptedExportBlob(data, password);
        const fileName = requestExportFileName('apexcore-encrypted-' + new Date().toISOString().split('T')[0], '.enc');
        if (!fileName) {
            hideProgress();
            return;
        }
        downloadBlob(blob, fileName);
        hideProgress();
        showMessage(t('msgEncrypted').replace('{count}', data.totalItems), 'success');
    } catch (error) {
        hideProgress();
        showMessage('❌ ' + (getLang() === 'sv' ? 'Fel vid kryptering: ' : 'Encryption error: ') + error.message, 'error');
    }
}

function exportCSV() {
    showProgress('📊 ' + (getLang() === 'sv' ? 'Skapar CSV...' : 'Creating CSV...'));

    try {
        let csv = 'Typ,Prioritet,Namn,Ålder,Uppgift,Anteckningar,Påminnelse,Datum\n';
        
        items.forEach(function(p) {
            const priorityText = getPriorityLabel(p.priority);
            csv += 'Active,' + priorityText + ',"' + p.name + '",' + p.age + ',"' + (p.task || '').replace(/"/g, '""') + '","' + (p.note || '').replace(/"/g, '""') + '","' + (p.notification || '') + '",' + new Date(p.updated).toLocaleString('sv-SE') + '\n';
        });
        
        doneItems.forEach(function(p) {
            const priorityText = getPriorityLabel(p.priority);
            csv += 'Done,' + priorityText + ',"' + p.name + '",' + p.age + ',"' + (p.task || '').replace(/"/g, '""') + '","' + (p.note || '').replace(/"/g, '""') + '","' + (p.notification || '') + '",' + new Date(p.updated).toLocaleString('sv-SE') + '\n';
        });

        archivedItems.forEach(function(p) {
            const priorityText = getPriorityLabel(p.priority);
            csv += 'Archived,' + priorityText + ',"' + p.name + '",' + p.age + ',"' + (p.task || '').replace(/"/g, '""') + '","' + (p.note || '').replace(/"/g, '""') + '","' + (p.notification || '') + '",' + new Date(p.updated).toLocaleString('sv-SE') + '\n';
        });

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const fileName = requestExportFileName('apexcore-data-' + new Date().toISOString().split('T')[0], '.csv');
        if (!fileName) {
            hideProgress();
            return;
        }
        downloadBlob(blob, fileName);
        hideProgress();
        showMessage(t('msgCsvExported').replace('{count}', items.length + doneItems.length + archivedItems.length), 'success');
    } catch (error) {
        hideProgress();
        showMessage('❌ ' + (getLang() === 'sv' ? 'Fel vid CSV-export: ' : 'CSV export error: ') + error.message, 'error');
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    showProgress('📥 ' + (getLang() === 'sv' ? 'Läser fil...' : 'Reading file...'));

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let data = JSON.parse(content);
            
            if (data.encrypted && data.algorithm === 'AES') {
                const password = prompt(t('msgEncryptedPassword'));
                if (!password) {
                    hideProgress();
                    showMessage('❌ ' + (getLang() === 'sv' ? 'Lösenord krävs för att importera!' : 'Password required to import!'), 'error');
                    return;
                }

                try {
                    const decrypted = CryptoJS.AES.decrypt(data.encrypted, password);
                    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
                    
                    if (!decryptedText) {
                        throw new Error('Fel lösenord eller korrupt data');
                    }
                    
                    data = JSON.parse(decryptedText);
                    importProcess(data);
                } catch (error) {
                    hideProgress();
                    showMessage('❌ ' + (getLang() === 'sv' ? 'Fel lösenord eller korrupt fil!' : 'Wrong password or corrupt file!'), 'error');
                    return;
                }
            } else {
                importProcess(data);
            }
        } catch (error) {
            hideProgress();
            showMessage(t('msgImportError'), 'error');
            console.error('Import error:', error);
        }
    };

    reader.readAsText(file);
    event.target.value = '';
}

function generateImportedItemId(usedIds) {
    var nextId = Date.now();
    while (usedIds.has(nextId)) {
        nextId += 1;
    }
    usedIds.add(nextId);
    return nextId;
}

function prepareVaultItemsForActive(vaultItems) {
    var usedIds = new Set();

    items.forEach(function(item) { usedIds.add(item.id); });
    doneItems.forEach(function(item) { usedIds.add(item.id); });
    archivedItems.forEach(function(item) { usedIds.add(item.id); });

    return vaultItems.map(function(item) {
        return {
            id: generateImportedItemId(usedIds),
            name: item.name || '',
            age: item.age === undefined ? '' : item.age,
            task: item.task || '',
            note: item.note || '',
            priority: normalizePriorityValue(item.priority),
            category: normalizeCategoryValue(item.category),
            notification: '',
            notificationShown: false,
            updated: item.updated || Date.now()
        };
    });
}

function importProcess(data) {
    if (data.source === 'archive-vault' && Array.isArray(data.archivedItems)) {
        const importedItems = prepareVaultItemsForActive(data.archivedItems);
        if (Array.isArray(data.adminUpdates)) {
            const mergedUpdates = mergeAdminUpdates(data.adminUpdates, getAdminUpdates());
            saveAdminUpdates(mergedUpdates);
            renderInfoContent();
            renderAdminList();
        }
        items = items.concat(importedItems);
        saveData();
        render();
        hideProgress();
        showMessage(t('archiveVaultImported').replace('{count}', importedItems.length), 'success');
        return;
    }

    if (!data.items || !data.doneItems || !data.archivedItems) {
        hideProgress();
        showMessage('❌ ' + (getLang() === 'sv' ? 'Ogiltig datafil!' : 'Invalid data file!'), 'error');
        return;
    }

    const activeCount = data.items.length;
    const doneCount = data.doneItems.length;
    const archivedCount = data.archivedItems.length;
    const dateStr = data.exportedAt ? new Date(data.exportedAt).toLocaleString() : 'Okänt';

    const confirmMsg = t('confirmImport')
        .replace('{active}', activeCount)
        .replace('{done}', doneCount)
        .replace('{archived}', archivedCount)
        .replace('{date}', dateStr);

    const choice = confirm(confirmMsg);

    if (choice) {
        items = data.items.map(normalizeItemData);
        doneItems = data.doneItems.map(normalizeItemData);
        archivedItems = (data.archivedItems || []).map(normalizeItemData);
        if (data.adminUpdates) {
            saveAdminUpdates(dedupeAdminUpdates(data.adminUpdates));
        }
        showMessage(t('confirmReplace')
            .replace('{active}', items.length)
            .replace('{done}', doneItems.length)
            .replace('{archived}', archivedItems.length), 'success');
    } else {
        const beforeCount = items.length + doneItems.length + archivedItems.length;
        items = items.concat(data.items.map(normalizeItemData));
        doneItems = doneItems.concat(data.doneItems.map(normalizeItemData));
        archivedItems = archivedItems.concat((data.archivedItems || []).map(normalizeItemData));
        if (data.adminUpdates) {
            const merged = mergeAdminUpdates(data.adminUpdates, getAdminUpdates());
            saveAdminUpdates(merged);
        }
        const addedCount = (items.length + doneItems.length + archivedItems.length) - beforeCount;
        showMessage(t('confirmAdded').replace('{count}', addedCount), 'success');
    }

    saveData();
    render();
    hideProgress();
}

// ============================================
// FLYTT TILL ARKIV / FRÅN ARKIV
// ============================================

function moveToDoneById(id) {
    var i = items.findIndex(function(p) { return p.id === id; });
    if (i !== -1) {
        archivedItems.push(items[i]);
        items.splice(i, 1);
        saveData();
        render();
        showMessage(t('archiveArchived'), 'success');
    }
}

function moveToActiveById(id) {
    var i = archivedItems.findIndex(function(p) { return p.id === id; });
    if (i !== -1) {
        items.push(archivedItems[i]);
        archivedItems.splice(i, 1);
        saveData();
        render();
        showMessage(t('archiveRestored'), 'info');
    }
}

// ============================================
// ADD, EDIT, DELETE
// ============================================

function fillReminderSelect(selectId, start, end) {
    var select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = '';
    for (var i = start; i <= end; i++) {
        var value = String(i).padStart(2, '0');
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    }
}

function formatReminderValue(value) {
    if (!value) return t('reminderSelect');

    var match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (match) {
        return match[3] + '/' + match[2] + '/' + match[1] + ' ' + match[4] + ':' + match[5];
    }

    return value;
}

function getTodayReminderDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function getCurrentReminderTime() {
    var now = new Date();
    return {
        hour: String(now.getHours()).padStart(2, '0'),
        minute: String(now.getMinutes()).padStart(2, '0')
    };
}

function getReminderElements(prefix) {
    var hidden = document.getElementById(prefix + 'Input') || document.getElementById(prefix);
    var dateInput = document.getElementById(prefix + 'Date');
    var hourSelect = document.getElementById(prefix + 'Hour');
    var minuteSelect = document.getElementById(prefix + 'Minute');
    var display = document.getElementById(prefix + 'DisplayText');
    return { hidden: hidden, dateInput: dateInput, hourSelect: hourSelect, minuteSelect: minuteSelect, display: display };
}

function populateReminderFields(prefix, value) {
    var elements = getReminderElements(prefix);
    var hidden = elements.hidden;
    var dateInput = elements.dateInput;
    var hourSelect = elements.hourSelect;
    var minuteSelect = elements.minuteSelect;
    var display = elements.display;

    if (!hidden || !dateInput || !hourSelect || !minuteSelect || !display) return;

    if (!value) {
        var today = getTodayReminderDate();
        var currentTime = getCurrentReminderTime();
        dateInput.value = today;
        hourSelect.value = currentTime.hour;
        minuteSelect.value = currentTime.minute;
        hidden.value = '';
        display.textContent = t('reminderSelect');
        return;
    }

    var match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (match) {
        dateInput.value = match[1] + '-' + match[2] + '-' + match[3];
        hourSelect.value = match[4];
        minuteSelect.value = match[5];
        hidden.value = value;
        display.textContent = formatReminderValue(value);
        return;
    }

    hidden.value = value;
    display.textContent = formatReminderValue(value);
}

function syncReminderValue(prefix) {
    var elements = getReminderElements(prefix);
    var hidden = elements.hidden;
    var dateInput = elements.dateInput;
    var hourSelect = elements.hourSelect;
    var minuteSelect = elements.minuteSelect;
    var display = elements.display;

    if (!hidden || !dateInput || !hourSelect || !minuteSelect || !display) return;

    if (!dateInput.value) {
        dateInput.value = getTodayReminderDate();
    }

    if (!hourSelect.value || !minuteSelect.value) {
        var currentTime = getCurrentReminderTime();
        hourSelect.value = hourSelect.value || currentTime.hour;
        minuteSelect.value = minuteSelect.value || currentTime.minute;
    }

    hidden.value = dateInput.value + 'T' + hourSelect.value + ':' + minuteSelect.value;
    display.textContent = formatReminderValue(hidden.value);
}

function prepareReminderPicker(prefix) {
    var elements = getReminderElements(prefix);
    if (!elements.hidden) return;

    if (elements.hidden.value) {
        populateReminderFields(prefix, elements.hidden.value);
    } else {
        populateReminderFields(prefix, '');
    }
}

function openReminderEditor(prefix) {
    var panel = document.getElementById(prefix + 'PickerPanel');
    if (!panel) return;

    document.querySelectorAll('.reminder-picker-panel').forEach(function(item) {
        item.classList.remove('open');
    });

    prepareReminderPicker(prefix);
    panel.classList.add('open');
}

function toggleReminderEditor(prefix) {
    var panel = document.getElementById(prefix + 'PickerPanel');
    if (!panel) return;

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        return;
    }

    document.querySelectorAll('.reminder-picker-panel').forEach(function(item) {
        item.classList.remove('open');
    });

    prepareReminderPicker(prefix);
    panel.classList.add('open');
}

function closeReminderEditor(prefix) {
    var panel = document.getElementById(prefix + 'PickerPanel');
    if (panel) {
        panel.classList.remove('open');
    }
}

function applyReminderValue(prefix) {
    syncReminderValue(prefix);
    closeReminderEditor(prefix);
}

function updateReminderLanguageText() {
    populateReminderFields('notification', document.getElementById('notificationInput').value);
    populateReminderFields('editNotification', document.getElementById('editNotification').value);

    const okBtn = document.getElementById('notificationOkBtn');
    if (okBtn) okBtn.textContent = t('reminderOk');
    const closeBtn = document.getElementById('notificationCloseBtn');
    if (closeBtn) closeBtn.textContent = t('reminderClose');
    const editOkBtn = document.getElementById('editNotificationOkBtn');
    if (editOkBtn) editOkBtn.textContent = t('reminderOk');
    const editCloseBtn = document.getElementById('editNotificationCloseBtn');
    if (editCloseBtn) editCloseBtn.textContent = t('reminderClose');
}

function initReminderInputs() {
    fillReminderSelect('notificationHour', 0, 23);
    fillReminderSelect('notificationMinute', 0, 59);
    fillReminderSelect('editNotificationHour', 0, 23);
    fillReminderSelect('editNotificationMinute', 0, 59);
    populateReminderFields('notification', '');
    populateReminderFields('editNotification', '');
}

function getNeutralPriorityLabel() {
    var lang = getLang();
    if (lang === 'en') return 'Neutral';
    if (lang === 'da') return 'Neutral';
    if (lang === 'no') return 'Nøytral';
    if (lang === 'fi') return 'Neutraali';
    return 'Neutral';
}

function getPriorityLabel(priority) {
    var normalized = normalizePriorityValue(priority);
    if (normalized !== 'high') {
        return getNeutralPriorityLabel();
    }

    var key = 'prioHigh';
    var raw = t(key) || priority;
    var cleaned = raw.replace(/^[^\p{L}]+/u, '').replace(/[^\p{L}\p{M}\s-]+$/u, '').trim();
    if (!cleaned) {
        cleaned = 'High';
    }
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function getPriorityBadgeText(priority) {
    return normalizePriorityValue(priority) === 'high'
        ? '🔴 ' + getPriorityLabel('high')
        : '⚪ ' + getNeutralPriorityLabel();
}

function addItem() {
    var nameVal = document.getElementById('nameInput').value.trim();
    var ageInput = document.getElementById('ageInput').value.trim();
    var ageVal = ageInput === '' ? '' : parseInt(ageInput);
    var taskVal = document.getElementById('taskInput').value.trim();
    var noteVal = document.getElementById('noteInput').value.trim();
    var categoryVal = normalizeCategoryValue(document.getElementById('categoryInput').value);
    var priorityVal = categoryVal === 'high' ? 'high' : 'normal';
    var notificationVal = document.getElementById('notificationInput').value;

    if (!nameVal) {
        alert(t('nameRequired'));
        return;
    }

    var newItem = {
        id: Date.now(),
        name: nameVal,
        age: ageVal,
        task: taskVal || '',
        note: noteVal || '',
        category: categoryVal,
        priority: priorityVal,
        notification: notificationVal || '',
        notificationShown: false,
        updated: Date.now()
    };

    items.push(newItem);

    if (categoryVal !== 'high') {
        setStoredAddCategory(categoryVal);
    }

    document.getElementById('nameInput').value = '';
    document.getElementById('ageInput').value = '';
    document.getElementById('taskInput').value = '';
    document.getElementById('noteInput').value = '';
    document.getElementById('categoryInput').value = categoryVal === 'high'
        ? getStoredAddCategory()
        : categoryVal;
    document.getElementById('notificationInput').value = '';
    populateReminderFields('notification', '');

    saveData();
    render();
}

function editItem(id) {
    var p = items.find(function(item) { return item.id === id; });
    if (!p) return;

    activeEditId = id;

    document.getElementById('editName').value = p.name;
    document.getElementById('editAge').value = p.age;
    document.getElementById('editTask').value = p.task || '';
    document.getElementById('editNote').value = p.note || '';
    document.getElementById('editCategory').value = normalizeCategoryValue(p.category);
    document.getElementById('editNotification').value = p.notification || '';
    populateReminderFields('editNotification', p.notification || '');

    document.getElementById('editor').style.display = 'block';
}

function showSaveEditConfirm(onConfirm) {
    var modal = document.getElementById('saveEditConfirmModal');
    var title = document.getElementById('saveEditConfirmTitle');
    var text = document.getElementById('saveEditConfirmText');
    var confirmBtn = document.getElementById('saveEditConfirmOkBtn');
    var cancelBtn = document.getElementById('saveEditConfirmCancelBtn');

    if (!modal || !title || !text || !confirmBtn || !cancelBtn) {
        if (confirm(t('confirmSaveEdit'))) {
            onConfirm();
        }
        return;
    }

    title.textContent = t('confirmDialogTitle');
    text.textContent = t('confirmSaveEdit');
    cancelBtn.textContent = t('editCancel');
    confirmBtn.textContent = t('editSave');

    isSaveEditConfirmOpen = true;
    modal.style.display = 'flex';

    function cleanup() {
        modal.style.display = 'none';
        isSaveEditConfirmOpen = false;
        modal.onclick = null;
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        document.removeEventListener('keydown', onKeyDown);
    }

    function cancelConfirm() {
        cleanup();
    }

    function approveConfirm() {
        cleanup();
        onConfirm();
    }

    function onKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            cancelConfirm();
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            approveConfirm();
        }
    }

    modal.onclick = function(event) {
        if (event.target === modal) {
            cancelConfirm();
        }
    };

    cancelBtn.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        cancelConfirm();
    };

    confirmBtn.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        approveConfirm();
    };

    document.addEventListener('keydown', onKeyDown);
    setTimeout(function() {
        confirmBtn.focus();
    }, 0);
}

function saveEdit() {
    var p = items.find(function(item) { return item.id === activeEditId; });
    if (!p) return;

    showSaveEditConfirm(function() {
        var editAgeInput = document.getElementById('editAge').value.trim();
        var editAgeVal = editAgeInput === '' ? '' : parseInt(editAgeInput);

        p.name = document.getElementById('editName').value;
        p.age = editAgeVal;
        p.task = document.getElementById('editTask').value;
        p.note = document.getElementById('editNote').value;
        p.category = normalizeCategoryValue(document.getElementById('editCategory').value);
        p.priority = p.category === 'high' ? 'high' : 'normal';
        p.notification = document.getElementById('editNotification').value || '';
        populateReminderFields('editNotification', p.notification || '');
        p.notificationShown = false;
        p.updated = Date.now();

        closeEdit();
        saveData();
        render();
    });
}

function closeEdit() {
    document.getElementById('editor').style.display = 'none';
    activeEditId = null;
}

document.addEventListener('mousedown', function(e) {
    var editor = document.getElementById('editor');
    if (!editor || editor.style.display !== 'block') return;

    if (isSaveEditConfirmOpen) return;

    if (!editor.contains(e.target)) {
        closeEdit();
    }
});

function deleteItem(id) {
    var i = items.findIndex(function(p) { return p.id === id; });
    if (i === -1) return;

    deletedItem = items[i];
    items.splice(i, 1);

    document.getElementById('undoBar').style.display = 'block';

    setTimeout(function() {
        document.getElementById('undoBar').style.display = 'none';
        deletedItem = null;
    }, 5000);

    saveData();
    render();
}

function undoDelete() {
    if (deletedItem) {
        items.push(deletedItem);
        deletedItem = null;
        document.getElementById('undoBar').style.display = 'none';
        saveData();
        render();
    }
}

// ============================================
// DRAG & DROP
// ============================================

function startDrag(id) {
    dragId = id;
    isDragging = true;
    setTimeout(function() { 
        isDragging = false; 
    }, 100);
}

var activeDrop = document.getElementById('activeDrop');
var doneDrop = document.getElementById('doneDrop');

activeDrop.ondragover = function(e) { 
    e.preventDefault(); 
};

doneDrop.ondragover = function(e) { 
    e.preventDefault(); 
};

doneDrop.ondrop = function() { 
    if (dragId !== null) {
        moveToDone(dragId);
        dragId = null;
    }
};

activeDrop.ondrop = function() { 
    if (dragId !== null) {
        moveToActive(dragId);
        dragId = null;
    }
};

function moveToDone(id) {
    var i = items.findIndex(function(p) { return p.id === id; });
    if (i !== -1) {
        archivedItems.push(items[i]);
        items.splice(i, 1);
        saveData();
        render();
        showMessage(t('archiveArchived'), 'success');
    }
}

function moveToActive(id) {
    var i = archivedItems.findIndex(function(p) { return p.id === id; });
    if (i !== -1) {
        items.push(archivedItems[i]);
        archivedItems.splice(i, 1);
        saveData();
        render();
        showMessage(t('archiveRestored'), 'info');
    }
}

function reorderActiveItems(fromId, toId) {
    if (fromId === null || toId === null || fromId === toId) return;

    var fromIndex = items.findIndex(function(p) { return p.id === fromId; });
    var toIndex = items.findIndex(function(p) { return p.id === toId; });
    if (fromIndex === -1 || toIndex === -1) return;

    var movedItem = items.splice(fromIndex, 1)[0];
    var insertIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
    items.splice(insertIndex, 0, movedItem);

    saveData();
    render();
    showMessage(t('msgOrderUpdated'), 'info');
}

// ============================================
// ENTER-TANGENT I FORMULÄRET
// ============================================

function setupEnterKey() {
    var inputs = ['nameInput', 'ageInput', 'taskInput', 'noteInput'];
    
    inputs.forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem();
                }
            });
        }
    });
}

// ============================================
// RENDER
// ============================================

function formatTime(date) {
    return new Date(date).toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function render() {
    var activeList = document.getElementById('activeList');
    var doneList = document.getElementById('doneList');
    
    activeList.innerHTML = '';
    doneList.innerHTML = '';

    var sortSelect = document.getElementById('activeSortSelect');
    if (sortSelect) {
        sortSelect.value = getStoredActiveSortMode();
    }

    var searchText = (document.getElementById('searchInput')?.value || '').toLowerCase();
    var filteredItems = items.filter(function(x) {
        var normalizedCategory = normalizeCategoryValue(x.category);
        var categoryText = getCategoryTexts()[normalizedCategory] || getCategoryTexts().highPriority || '';
        return (x.name + ' ' + (x.task || '') + ' ' + (x.note || '') + ' ' + categoryText).toLowerCase().includes(searchText);
    });

    function createActiveListItem(p, showCategoryTag, displayCategoryKey) {
        if (showCategoryTag === undefined) showCategoryTag = true;
        if (!displayCategoryKey) displayCategoryKey = normalizeCategoryValue(p.category);

        var li = document.createElement('li');

        var normalizedPriority = normalizePriorityValue(p.priority);
        var normalizedCategory = normalizeCategoryValue(p.category);
        li.className = 'category-item-' + displayCategoryKey;

        var priorityText = getPriorityLabel(normalizedPriority);
        var categoryText = getCategoryTexts()[normalizedCategory] || getCategoryTexts().other;
        var categoryIcon = getCategoryIcon(normalizedCategory);
        var taskLabel = t('cardTask');
        var notesLabel = t('cardNotes');
        var doneBtnText = t('doneBtn');
        var deleteBtnText = t('deleteBtn');
        var noteText = (p.note || '').trim();
        var notesLine = noteText ? '<br><b>' + escapeHTML(notesLabel) + ':</b> ' + escapeHTML(noteText) : '';
        
        var notifIcon = p.notification && p.notification !== '' ? ' 🔔' : '';
        var ageText = p.age === '' || p.age === null || p.age === undefined ? '' : ` (${escapeHTML(p.age)})`;
        
        li.innerHTML = `
            <div class="active-item">
                <div class="item-content">
                    <strong>${escapeHTML(p.name)}</strong>${ageText}
                    <br><b>${escapeHTML(taskLabel)}:</b> ${escapeHTML(p.task || '')}
                    ${notesLine}
                    <br><span style="font-size: 12px; color: var(--text-muted);">${priorityText}${showCategoryTag ? ' • ' + categoryIcon + ' ' + escapeHTML(categoryText) : ''}${notifIcon}</span>
                    <div class='litenText'>${formatTime(p.updated)}</div>
                </div>
                <div class="item-actions">
                    <button class="done-btn" onclick="event.stopPropagation(); moveToDoneById(${p.id})">${escapeHTML(doneBtnText)}</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteItem(${p.id})">${escapeHTML(deleteBtnText)}</button>
                </div>
            </div>
        `;

        li.draggable = true;
        li.ondragstart = function() { startDrag(p.id); };
        li.ondragover = function(e) {
            e.preventDefault();
        };
        li.ondrop = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (dragId !== null && dragId !== p.id) {
                reorderActiveItems(dragId, p.id);
            }
            dragId = null;
        };

        li.onclick = function() {
            if (isDragging) return;
            editItem(p.id);
        };

        return li;
    }

    function renderActiveGroup(groupKey, groupTitle, groupItems, showCategoryTag, groupClassName, listClassName) {
        if (!groupItems.length) return;
        if (showCategoryTag === undefined) showCategoryTag = true;
        if (!groupClassName) groupClassName = '';
        if (!listClassName) listClassName = '';

        var collapsed = activeGroupsCollapsed[groupKey] === true;
        var groupContainer = document.createElement('li');
        groupContainer.className = 'active-group' + (groupClassName ? ' ' + groupClassName : '');

        groupContainer.innerHTML = `
            <button type="button" class="active-group-toggle category-${groupKey}" onclick="event.stopPropagation(); toggleActiveGroup('${groupKey}')">
                <span class="group-left"><span>${collapsed ? '▸' : '▾'}</span>${escapeHTML(groupTitle)}</span>
                <span class="active-group-count">${groupItems.length}</span>
            </button>
            <ul class="active-group-items${listClassName ? ' ' + listClassName : ''}${collapsed ? ' collapsed' : ''}"></ul>
        `;

        var groupList = groupContainer.querySelector('.active-group-items');
        sortActiveItems(groupItems).forEach(function(item) {
            groupList.appendChild(createActiveListItem(item, showCategoryTag, groupKey));
        });

        activeList.appendChild(groupContainer);
    }

    var groupedItems = {
        patients: [],
        authorities: [],
        administration: [],
        private: [],
        games: [],
        other: []
    };

    var highPriorityItems = [];

    filteredItems.forEach(function(item) {
        var normalizedPriority = normalizePriorityValue(item.priority);
        var normalizedCategory = normalizeCategoryValue(item.category);

        if (normalizedPriority === 'high' || normalizedCategory === 'high') {
            highPriorityItems.push(item);
        } else {
            groupedItems[normalizedCategory].push(item);
        }
    });

    var categoryText = getCategoryTexts();
    renderActiveGroup('high', getCategoryIcon('high') + ' ' + categoryText.high, highPriorityItems, false, 'high-priority-strip', 'high-priority-items');
    renderActiveGroup('patients', getCategoryIcon('patients') + ' ' + categoryText.patients, groupedItems.patients);
    renderActiveGroup('authorities', getCategoryIcon('authorities') + ' ' + categoryText.authorities, groupedItems.authorities);
    renderActiveGroup('administration', getCategoryIcon('administration') + ' ' + categoryText.administration, groupedItems.administration);
    renderActiveGroup('private', getCategoryIcon('private') + ' ' + categoryText.private, groupedItems.private);
    renderActiveGroup('games', getCategoryIcon('games') + ' ' + categoryText.games, groupedItems.games);
    renderActiveGroup('other', getCategoryIcon('other') + ' ' + categoryText.other, groupedItems.other);

    if (filteredItems.length === 0) {
        var emptyLi = document.createElement('li');
        emptyLi.style.cursor = 'default';
        emptyLi.textContent = t('activeEmptySearch');
        activeList.appendChild(emptyLi);
    }

    var doneSearch = (document.getElementById('doneSearchInput')?.value || '').toLowerCase();
    archivedItems.filter(function(p) {
        return (p.name + ' ' + (p.task || '') + ' ' + (p.note || '')).toLowerCase().includes(doneSearch);
    }).forEach(function(p) {
        var li = document.createElement('li');
        var ageText = p.age === '' || p.age === null || p.age === undefined ? '' : ` (${escapeHTML(p.age)})`;
        
        li.innerHTML = `
            ${escapeHTML(p.name)}${ageText} - ${escapeHTML(p.task || '')}
            <button class="undo-done-btn" onclick="event.stopPropagation(); restoreArchive(${p.id})">${t('restoreBtn')}</button>
            <button class="done-btn" onclick="event.stopPropagation(); deleteArchiveItem(${p.id})">${t('archiveDelete')}</button>
        `;
        li.draggable = true;
        li.ondragstart = function() { startDrag(p.id); };
        doneList.appendChild(li);
    });

    document.getElementById('activeTitle').textContent = t('activeTitle') + ' (' + items.length + ')';
    document.getElementById('doneTitle').textContent = t('archiveModalTitle') + ' (' + archivedItems.length + ')';
    updateArchiveVaultButton();

    // saveData borttagen från render för att förhindra överskrivning vid uppstart
}

function toggleActiveGroup(groupKey) {
    activeGroupsCollapsed[groupKey] = !(activeGroupsCollapsed[groupKey] === true);
    saveData();
    render();
}

function setupActiveColumnWheelScroll() {
    function isEditableTarget(target) {
        if (!target || !target.closest) return false;
        return !!target.closest('input, textarea, select, [contenteditable="true"]');
    }

    function isArchiveListTarget(target) {
        return !!(target && target.closest && target.closest('.done-column ul'));
    }

    function isScrollableElement(element) {
        if (!element || element === document.body || element === document.documentElement) return false;
        if (element.scrollHeight <= element.clientHeight + 1) return false;

        var style = window.getComputedStyle(element);
        var overflowY = style.overflowY;
        return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
    }

    function hasOtherScrollableAncestor(target, activeList) {
        var current = target;
        while (current && current !== document.body) {
            if (current === activeList) return false;
            if (activeList && activeList.contains(current)) return false;
            if (isScrollableElement(current)) return true;
            current = current.parentElement;
        }
        return false;
    }

    var activeColumn = document.querySelector('.active-column');
    var activeList = document.getElementById('activeList');
    var archiveList = document.querySelector('.done-column ul');
    if (!activeColumn || !activeList) return;

    if (setupActiveColumnWheelScroll._initialized) return;
    setupActiveColumnWheelScroll._initialized = true;

    activeColumn.addEventListener('wheel', function(event) {
        if (isEditableTarget(event.target)) return;
        if (isArchiveListTarget(event.target)) return;

        var nestedList = event.target.closest('.active-group-items');
        if (nestedList && isScrollableElement(nestedList)) {
            return;
        }

        event.preventDefault();
        activeList.scrollTop += event.deltaY;
    }, { passive: false });

    document.addEventListener('wheel', function(event) {
        if (activeColumn.contains(event.target)) return;
        if (isEditableTarget(event.target)) return;
        if (isArchiveListTarget(event.target)) return;
        if (hasOtherScrollableAncestor(event.target, activeList)) return;

        event.preventDefault();
        activeList.scrollTop += event.deltaY;
    }, { passive: false });

    if (archiveList) {
        archiveList.addEventListener('wheel', function(event) {
            event.preventDefault();
            archiveList.scrollTop += event.deltaY;
        }, { passive: false });
    }
}

// ============================================
// ARKIV FUNKTIONER
// ============================================

function archiveItem(id) {
    var i = doneItems.findIndex(function(p) { return p.id === id; });
    if (i === -1) return;
    archivedItems.push(doneItems[i]);
    doneItems.splice(i, 1);
    saveData();
    render();
    showMessage(t('archiveArchived'), 'success');
}

function archiveAll() {
    if (doneItems.length === 0) return;
    var count = doneItems.length;
    doneItems.forEach(function(item) { archivedItems.push(item); });
    doneItems = [];
    saveData();
    render();
    showMessage(t('archiveAllSuccess').replace('{count}', count), 'success');
}

function showArchiveInfo() {
    document.getElementById('archiveOverlay').style.display = 'block';
    renderArchive();
}

function closeArchiveModal() {
    document.getElementById('archiveOverlay').style.display = 'none';
}

function updateArchiveVaultButton() {
    var vaultBtn = document.getElementById('archiveVaultBtn');
    if (!vaultBtn) return;
    vaultBtn.disabled = archivedItems.length === 0;
}

function renderArchive() {
    var title = document.getElementById('archiveTitle');
    if (title) title.textContent = t('archiveModalTitle') + ' (' + archivedItems.length + ')';
    updateArchiveVaultButton();
    
    var search = (document.getElementById('archiveSearch')?.value || '').toLowerCase();
    var container = document.getElementById('archiveContent');
    if (!container) return;
    
    var html = '';
    var filtered = archivedItems.filter(function(p) {
        return p.name.toLowerCase().includes(search) || 
               (p.task || '').toLowerCase().includes(search) || 
               (p.note || '').toLowerCase().includes(search);
    });
    var archiveAgeText = function(p) {
        return p.age === '' || p.age === null || p.age === undefined ? '' : ` (${escapeHTML(p.age)})`;
    };
    
    if (filtered.length === 0) {
        html = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">' + t('archiveEmpty') + '</p>';
    } else {
        filtered.forEach(function(p) {
            html += `
                <div class="archive-item">
                    <b>${escapeHTML(p.name)}</b>${archiveAgeText(p)}<br>
                    ${escapeHTML(p.task || '')}
                    <div style="margin-top: 4px; font-size: 12px; color: var(--text-muted);">${formatTime(p.updated)}</div>
                    <div style="margin-top: 4px;">
                        <button onclick="restoreArchive(${p.id})">${t('archiveRestore')}</button>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

function vaultArchive() {
    if (archivedItems.length === 0) {
        showMessage(t('archiveEmpty'), 'info');
        updateArchiveVaultButton();
        return;
    }

    var archiveCount = archivedItems.length;
    if (!confirm(t('archiveVaultConfirm').replace('{count}', archiveCount))) return;

    var password = requestEncryptionPassword();
    if (!password) return;

    showProgress(t('archiveVaultProgress'));

    try {
        var vaultData = {
            archivedItems: archivedItems,
            adminUpdates: getAdminUpdates(),
            exportedAt: new Date().toISOString(),
            version: '2.2',
            totalItems: archiveCount,
            source: 'archive-vault'
        };

        var blob = createEncryptedExportBlob(vaultData, password);
        var fileName = requestExportFileName('apexcore-archive-vault-' + new Date().toISOString().split('T')[0], '.enc');
        if (!fileName) {
            hideProgress();
            return;
        }
        downloadBlob(blob, fileName);

        archivedItems = [];
        saveData();
        render();
        renderArchive();
        hideProgress();
        showMessage(t('archiveVaultSuccess').replace('{count}', archiveCount), 'success');
    } catch (error) {
        hideProgress();
        showMessage('❌ ' + (getLang() === 'sv' ? 'Fel vid kryptering: ' : 'Encryption error: ') + error.message, 'error');
    }
}

function restoreArchive(id) {
    var i = archivedItems.findIndex(function(p) { return p.id === id; });
    if (i === -1) return;
    items.push(archivedItems[i]);
    archivedItems.splice(i, 1);
    saveData();
    render();
    renderArchive();
    showMessage(t('archiveRestored'), 'info');
}

function deleteArchiveItem(id) {
    if (!confirm(t('archiveConfirmDelete'))) return;
    archivedItems = archivedItems.filter(function(p) { return p.id !== id; });
    saveData();
    renderArchive();
    showMessage(t('archiveDeleted'), 'info');
}

function clearArchive() {
    if (!confirm(t('archiveConfirmClear'))) return;
    archivedItems = [];
    saveData();
    renderArchive();
    showMessage(t('archiveCleared'), 'info');
}

// ============================================
// 🆕 ADMIN FUNKTIONER
// ============================================

let isAdminLoggedIn = false;
let editAdminIndex = -1;

function getAdminPasswordHash() {
    const stored = localStorage.getItem('adminPasswordHash');
    if (stored && isPasswordHashed(stored)) return stored;
    return hashPassword('admin123');
}

function showAdminLogin() {
    if (isAdminLoggedIn) {
        openAdminPanel();
        return;
    }

    document.getElementById('adminLoginOverlay').style.display = 'flex';
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminLoginError').textContent = '';
    document.getElementById('adminPasswordInput').focus();
}

function closeAdminLogin() {
    document.getElementById('adminLoginOverlay').style.display = 'none';
}

function adminLogin() {
    const input = document.getElementById('adminPasswordInput').value;
    const errorDiv = document.getElementById('adminLoginError');
    
    if (hashPassword(input) === getAdminPasswordHash()) {
        isAdminLoggedIn = true;
        errorDiv.textContent = '';
        closeAdminLogin();
        openAdminPanel();
    } else {
        errorDiv.textContent = t('adminLoginError');
        document.getElementById('adminPasswordInput').value = '';
    }
}

function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'flex';
    document.getElementById('adminDate').value = new Date().toISOString().split('T')[0];
    renderAdminList();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    editAdminIndex = -1;
}

function addAdminItem() {
    const title = document.getElementById('adminTitle').value.trim();
    const desc = document.getElementById('adminDesc').value.trim();
    const type = document.getElementById('adminType').value;
    const date = document.getElementById('adminDate').value || 'Planerat';
    
    if (!title || !desc) {
        alert(t('adminMissingFields'));
        return;
    }
    
    const updates = getAdminUpdates();
    const newItem = { type, date, title, description: desc };
    
    if (editAdminIndex >= 0) {
        updates[editAdminIndex] = newItem;
        editAdminIndex = -1;
    } else {
        updates.unshift(newItem);
    }
    
    saveAdminUpdates(updates);
    clearAdminForm();
    renderAdminList();
    renderInfoContent();
    showMessage(t('adminSavedMessage'), 'success');
}

function deleteAdminItem(index) {
    if (!confirm(t('adminDeleteConfirm'))) return;
    const updates = getAdminUpdates();
    updates.splice(index, 1);
    saveAdminUpdates(updates);
    renderAdminList();
    renderInfoContent();
    showMessage(t('adminDeletedMessage'), 'info');
}

function editAdminItem(index) {
    const updates = getAdminUpdates();
    const item = updates[index];
    
    document.getElementById('adminTitle').value = item.title;
    document.getElementById('adminDesc').value = item.description;
    document.getElementById('adminType').value = item.type;
    document.getElementById('adminDate').value = item.date !== 'Planerat' ? item.date : '';
    
    editAdminIndex = index;
    document.querySelector('#adminPanel .admin-content').scrollTop = 0;
}

function clearAdminForm() {
    document.getElementById('adminTitle').value = '';
    document.getElementById('adminDesc').value = '';
    document.getElementById('adminType').value = 'new';
    document.getElementById('adminDate').value = new Date().toISOString().split('T')[0];
    editAdminIndex = -1;
}

function renderAdminList() {
    const container = document.getElementById('adminList');
    const updates = sortUpdatesByType(getAdminUpdates().map(function(item, index) {
        return Object.assign({ originalIndex: index }, item);
    }));
    
    if (updates.length === 0) {
        container.innerHTML = '<p id="adminEmptyText" style="color: var(--text-muted);">' + t('adminEmptyText') + '</p>';
        return;
    }
    
    let html = '';
    updates.forEach(function(item) {
        const badgeClass = getUpdateBadgeClass(item.type);
        const badgeText = getUpdateBadgeText(item.type);
        
        html += `
            <div class="admin-item">
                <div class="item-info">
                    <div class="title">${escapeHTML(item.title)}</div>
                    <div class="desc">
                        <span class="badge ${badgeClass}" style="font-size: 10px;">${badgeText}</span>
                        ${escapeHTML(item.date)} - ${escapeHTML(item.description)}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editAdminItem(${item.originalIndex})">✏️</button>
                    <button class="delete-btn" onclick="deleteAdminItem(${item.originalIndex})">✕</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function saveAdminChanges() {
    renderAdminList();
    renderInfoContent();
    showMessage(t('adminChangesSavedMessage'), 'success');
}

// ============================================
// INIT
// ============================================

loadData();
syncAdminUpdatesWithDefaults();
syncSharedUpdatesOnLoad();
applyStoredAddCategorySelection();
render();
setupEnterKey();
updateLanguageMenu();
applyLanguage();
loadTheme();
updateSoundButton();
initReminderInputs();
setupActiveColumnWheelScroll();
setActiveSortMode(getStoredActiveSortMode());
saveData();

setTimeout(function() {
    checkNotifications();
}, 500);

console.log('⭕ ApexCore redo!');
console.log('📊 ' + items.length + ' aktiva, ' + doneItems.length + ' färdiga, ' + archivedItems.length + ' arkiverade poster');
console.log('🌍 Språk: ' + getLang());
console.log('🌓 Tema: ' + getTheme());
console.log('⚙️ Admin-lösenord: admin123');
console.log('⌨️ Enter-tangent aktiverad!');
console.log('🔔 Notiser aktiverade! (kontrolleras var 5:e sekund)');
console.log("RECOVERY CHECK", {items: items.length, personer: localStorage.getItem("personer")?.length || 0});

