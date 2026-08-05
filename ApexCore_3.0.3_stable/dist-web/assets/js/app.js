
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
let renderDebounceTimer = null;
let renderArchiveDebounceTimer = null;
let isArchiveCleanupModalOpen = false;
let isArchivePasswordModalOpen = false;
let pendingImportAction = 'import';
let editorOriginalParent = null;
let editorOriginalNextSibling = null;
let isRecoveryCenterOpen = false;
let isBackupHealthOpen = false;

const BACKUP_FORMAT_VERSION = '3.0';
const LEGACY_BACKUP_VERSION = '2.2';
const BACKUP_HEALTH_STORAGE_KEY = 'backupHealthState';

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

function getBackupUiText() {
    var lang = getLang();
    if (lang === 'en') {
        return {
            importDryRun: 'Dry-run import',
            validateBackup: 'Validate backup',
            restoreSafety: 'Restore safety',
            backupToggleShow: 'Show backup status',
            backupToggleHide: 'Hide backup status',
            recoveryCenterTitle: 'Recovery Center',
            recoveryToggleShow: 'Show Recovery Center',
            recoveryToggleHide: 'Hide Recovery Center',
            recoveryLastExport: 'Last export',
            recoveryLastImport: 'Last import',
            recoverySafetySnapshot: 'Safety snapshot',
            recoveryNoData: 'No data',
            healthTitle: 'Backup health',
            crypto: 'Crypto',
            storage: 'Storage',
            exportStatus: 'Export',
            importStatus: 'Import',
            ok: 'OK',
            warn: 'Warning',
            error: 'Error',
            unknown: 'Unknown',
            dryRunSummary: 'Dry-run: {type} with {active} active, {done} done, {archived} archived.',
            dryRunVaultSummary: 'Dry-run: archive vault with {archived} archived items.',
            validateBackupSuccess: '✅ Backup validation passed.',
            importInvalidVersion: 'Unsupported backup version.',
            importInvalidStructure: 'Backup file is missing required fields.',
            importWrongPassword: 'Wrong password or corrupt file.',
            autoSafetySaved: 'Automatic safety snapshot saved before clearing archive.',
            autoSafetyMissing: 'No safety snapshot available.',
            autoSafetyRestored: '✅ Safety snapshot restored ({count} archived items).',
            importPreviewTitle: 'Import preview',
            importPreviewContinue: 'Continue import?',
            importCancelled: 'Import cancelled before writing data.',
            replacePrompt: 'Type REPLACE to confirm full replacement:',
            replacePromptFailed: 'Replacement cancelled because confirmation phrase did not match.',
            duplicateSkipped: 'Skipped {count} duplicate archive items during import.'
        };
    }
    return {
        importDryRun: 'Torrkör import',
        validateBackup: 'Validera backup',
        restoreSafety: 'Återställ safety',
        backupToggleShow: 'Visa backupstatus',
        backupToggleHide: 'Dölj backupstatus',
        recoveryCenterTitle: 'Recovery Center',
        recoveryToggleShow: 'Visa Recovery Center',
        recoveryToggleHide: 'Dölj Recovery Center',
        recoveryLastExport: 'Senaste export',
        recoveryLastImport: 'Senaste import',
        recoverySafetySnapshot: 'Safety snapshot',
        recoveryNoData: 'Ingen data',
        healthTitle: 'Backupstatus',
        crypto: 'Crypto',
        storage: 'Lagring',
        exportStatus: 'Export',
        importStatus: 'Import',
        ok: 'OK',
        warn: 'Varning',
        error: 'Fel',
        unknown: 'Okänd',
        dryRunSummary: 'Torrkörning: {type} med {active} aktiva, {done} färdiga, {archived} arkiverade.',
        dryRunVaultSummary: 'Torrkörning: arkiv-vault med {archived} arkiverade poster.',
        validateBackupSuccess: '✅ Backupvalidering lyckades.',
        importInvalidVersion: 'Backupfilens version stöds inte.',
        importInvalidStructure: 'Backupfilen saknar nödvändiga fält.',
        importWrongPassword: 'Fel lösenord eller korrupt fil.',
        autoSafetySaved: 'Automatisk säkerhetskopia sparades före arkivrensning.',
        autoSafetyMissing: 'Ingen safety-snapshot tillgänglig.',
        autoSafetyRestored: '✅ Safety-snapshot återställd ({count} arkiverade poster).',
        importPreviewTitle: 'Importförhandsgranskning',
        importPreviewContinue: 'Fortsätt importen?',
        importCancelled: 'Importen avbröts innan data skrevs.',
        replacePrompt: 'Skriv ERSÄTT för att bekräfta total ersättning:',
        replacePromptFailed: 'Ersättning avbröts eftersom bekräftelsetexten inte stämde.',
        duplicateSkipped: 'Hoppade över {count} dubbletter vid arkivimport.'
    };
}

function getImportExportModule() {
    if (typeof window !== 'undefined' && window.ImportExportModule) {
        return window.ImportExportModule;
    }
    return null;
}

function readBackupHealthState() {
    try {
        var raw = localStorage.getItem(BACKUP_HEALTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        return {};
    }
}

function writeBackupHealthState(state) {
    try {
        localStorage.setItem(BACKUP_HEALTH_STORAGE_KEY, JSON.stringify(state || {}));
    } catch (error) {
        // ignore localStorage write failures
    }
}

function setBackupHealthStatus(key, status, detail) {
    var current = readBackupHealthState();
    current[key] = {
        status: status,
        detail: detail || '',
        at: new Date().toISOString()
    };
    writeBackupHealthState(current);
    updateBackupHealthPanel();
}

function testStorageAvailability() {
    try {
        var probeKey = '__apexcore_backup_probe__';
        localStorage.setItem(probeKey, '1');
        localStorage.removeItem(probeKey);
        return true;
    } catch (error) {
        return false;
    }
}

function updateHealthChip(id, label, statusEntry) {
    var el = document.getElementById(id);
    if (!el) return;

    var text = getBackupUiText();
    var status = statusEntry && statusEntry.status ? statusEntry.status : 'unknown';
    var detail = statusEntry && statusEntry.detail ? statusEntry.detail : '';

    var statusText = text.unknown;
    if (status === 'ok') statusText = text.ok;
    if (status === 'warn') statusText = text.warn;
    if (status === 'error') statusText = text.error;

    el.className = 'health-chip ' + status;
    el.textContent = label + ': ' + statusText + (detail ? ' - ' + detail : '');
}

function updateBackupHealthPanel() {
    var panel = document.getElementById('backupHealthPanel');
    if (!panel) return;

    var text = getBackupUiText();
    var title = panel.querySelector('.backup-health-title');
    if (title) title.textContent = text.healthTitle;

    var state = readBackupHealthState();

    updateHealthChip('healthCrypto', text.crypto, state.crypto);
    updateHealthChip('healthStorage', text.storage, state.storage);
    updateHealthChip('healthExport', text.exportStatus, state.export);
    updateHealthChip('healthImport', text.importStatus, state.import);

    updateBackupHealthToggleButton();
}

function initBackupHealthPanel() {
    var storageOk = testStorageAvailability();
    setBackupHealthStatus('crypto', typeof CryptoJS !== 'undefined' ? 'ok' : 'error', typeof CryptoJS !== 'undefined' ? '' : 'CryptoJS');
    setBackupHealthStatus('storage', storageOk ? 'ok' : 'error', storageOk ? '' : 'localStorage');
    updateBackupHealthPanel();
}

function updateBackupHealthToggleButton() {
    var button = document.getElementById('backupHealthToggleBtn');
    if (!button) return;

    var text = getBackupUiText();
    button.textContent = isBackupHealthOpen
        ? text.backupToggleHide
        : text.backupToggleShow;
}

function setBackupHealthOpenState(nextOpen) {
    isBackupHealthOpen = !!nextOpen;

    var panel = document.getElementById('backupHealthPanel');
    if (panel) {
        panel.classList.toggle('hidden', !isBackupHealthOpen);
    }

    updateBackupHealthToggleButton();
}

function toggleBackupHealthPanel() {
    setBackupHealthOpenState(!isBackupHealthOpen);
}

function formatRecoveryEntry(entry, fallback) {
    if (!entry) return fallback;

    var atText = entry.at ? new Date(entry.at).toLocaleString() : '-';
    var detail = '';

    if (entry.kind) detail = entry.kind;
    if (entry.mode) detail = entry.mode;
    if (entry.action) detail = entry.action;
    if (typeof entry.count === 'number') detail = (detail ? detail + ', ' : '') + entry.count;
    if (entry.counts && typeof entry.counts === 'object') {
        var c = entry.counts;
        detail = (detail ? detail + ', ' : '') + [c.active || 0, c.done || 0, c.archived || 0].join('/');
    }

    return atText + (detail ? ' - ' + detail : '');
}

function updateRecoveryCenterPanel() {
    var panel = document.getElementById('recoveryCenterPanel');
    if (!panel) return;

    var text = getBackupUiText();
    var moduleApi = getImportExportModule();
    var state = moduleApi && typeof moduleApi.readRecoveryState === 'function'
        ? moduleApi.readRecoveryState()
        : {};

    var title = document.getElementById('recoveryCenterTitle');
    if (title) title.textContent = text.recoveryCenterTitle;

    var exportLine = document.getElementById('recoveryLastExport');
    if (exportLine) {
        exportLine.textContent = text.recoveryLastExport + ': ' + formatRecoveryEntry(state.lastExport, text.recoveryNoData);
    }

    var importLine = document.getElementById('recoveryLastImport');
    if (importLine) {
        importLine.textContent = text.recoveryLastImport + ': ' + formatRecoveryEntry(state.lastImport, text.recoveryNoData);
    }

    var safetyLine = document.getElementById('recoverySafetySnapshot');
    if (safetyLine) {
        safetyLine.textContent = text.recoverySafetySnapshot + ': ' + formatRecoveryEntry(state.safetySnapshot, text.recoveryNoData);
    }

    updateRecoveryCenterToggleButton();
}

function updateRecoveryCenterToggleButton() {
    var button = document.getElementById('recoveryToggleBtn');
    if (!button) return;

    var text = getBackupUiText();
    button.textContent = isRecoveryCenterOpen
        ? text.recoveryToggleHide
        : text.recoveryToggleShow;
}

function setRecoveryCenterOpenState(nextOpen) {
    isRecoveryCenterOpen = !!nextOpen;

    var panel = document.getElementById('recoveryCenterPanel');
    if (panel) {
        panel.classList.toggle('hidden', !isRecoveryCenterOpen);
    }

    updateRecoveryCenterToggleButton();
}

function toggleRecoveryCenterPanel() {
    setRecoveryCenterOpenState(!isRecoveryCenterOpen);
}

function hasAutoSafetySnapshot() {
    try {
        var raw = localStorage.getItem('archiveAutoSafetyBackup');
        if (!raw) return false;
        var parsed = JSON.parse(raw);
        return parsed && Array.isArray(parsed.archivedItems);
    } catch (error) {
        return false;
    }
}

function updateAutoSafetyRestoreButtons() {
    var hasSnapshot = hasAutoSafetySnapshot();
    ['archiveRestoreSafetyBtn', 'sideArchiveRestoreSafetyBtn'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (!btn) return;
        btn.disabled = false;
        btn.style.opacity = hasSnapshot ? '1' : '0.65';
        btn.title = hasSnapshot
            ? (getLang() === 'en' ? 'Restore saved safety snapshot' : 'Återställ sparad safety-snapshot')
            : (getLang() === 'en' ? 'No snapshot available yet. Clear archive once to create one.' : 'Ingen snapshot finns ännu. Rensa arkivet en gång för att skapa en.');
    });
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

    var backupText = getBackupUiText();
    var importDryRunBtn = document.getElementById('importDryRunBtn');
    if (importDryRunBtn) importDryRunBtn.textContent = backupText.importDryRun;
    var validateBackupBtn = document.getElementById('validateBackupBtn');
    if (validateBackupBtn) validateBackupBtn.textContent = backupText.validateBackup;
    updateBackupHealthPanel();
    updateBackupHealthToggleButton();
    updateRecoveryCenterPanel();

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
    var backupLabels = getBackupUiText();
    var archiveRestoreSafetyBtn = document.getElementById('archiveRestoreSafetyBtn');
    if (archiveRestoreSafetyBtn) archiveRestoreSafetyBtn.textContent = backupLabels.restoreSafety;
    var sideArchiveRestoreSafetyBtn = document.getElementById('sideArchiveRestoreSafetyBtn');
    if (sideArchiveRestoreSafetyBtn) sideArchiveRestoreSafetyBtn.textContent = backupLabels.restoreSafety;
    setText('archiveClearBtn', 'archiveClear');
    setText('sideArchiveClearBtn', 'archiveClear');
    setText('archiveCloseBtn', 'archiveClose');
    updateAutoSafetyRestoreButtons();
    updateRecoveryCenterPanel();
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
        version: LEGACY_BACKUP_VERSION,
        formatVersion: BACKUP_FORMAT_VERSION,
        totalItems: items.length + doneItems.length + archivedItems.length
    };
}

function getBackupFileType(data) {
    if (data && data.source === 'archive-vault') return 'vault';
    return 'full-backup';
}

function getPayloadFormatVersion(data) {
    if (!data || typeof data !== 'object') return '';
    return String(data.formatVersion || data.version || '').trim();
}

function isSupportedBackupVersion(version) {
    return version === BACKUP_FORMAT_VERSION || version === LEGACY_BACKUP_VERSION;
}

function migrateImportedPayload(rawData) {
    if (!rawData || typeof rawData !== 'object') {
        return { ok: false, code: 'invalid-structure' };
    }

    var migrated = Object.assign({}, rawData);
    var version = getPayloadFormatVersion(migrated);

    if (!version) {
        // Legacy backups may miss explicit versioning.
        version = LEGACY_BACKUP_VERSION;
    }

    if (!isSupportedBackupVersion(version)) {
        return { ok: false, code: 'invalid-version', version: version };
    }

    migrated.formatVersion = version === LEGACY_BACKUP_VERSION ? BACKUP_FORMAT_VERSION : version;
    migrated.version = version;

    if (migrated.source === 'archive-vault') {
        if (!Array.isArray(migrated.archivedItems)) {
            return { ok: false, code: 'invalid-structure' };
        }
        if (!Array.isArray(migrated.adminUpdates)) migrated.adminUpdates = [];
        return { ok: true, data: migrated };
    }

    if (!Array.isArray(migrated.items) || !Array.isArray(migrated.doneItems) || !Array.isArray(migrated.archivedItems)) {
        return { ok: false, code: 'invalid-structure' };
    }

    if (!Array.isArray(migrated.adminUpdates)) migrated.adminUpdates = [];
    return { ok: true, data: migrated };
}

function getImportDiagnosticsMessage(code) {
    var text = getBackupUiText();
    if (code === 'invalid-version') return text.importInvalidVersion;
    if (code === 'invalid-structure') return text.importInvalidStructure;
    if (code === 'wrong-password') return text.importWrongPassword;
    return t('msgImportError');
}

function parseImportJsonContent(content) {
    var parsed;
    try {
        parsed = JSON.parse(content);
    } catch (parseError) {
        if (/^<!doctype html/i.test(content) || /^<html/i.test(content)) {
            return { ok: false, code: 'wrong-file-type', error: parseError };
        }
        return { ok: false, code: 'parse-failed', error: parseError };
    }

    return { ok: true, data: parsed };
}

function exportJSON() {
    const data = getExportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const fileName = requestExportFileName('apexcore-backup-' + new Date().toISOString().split('T')[0], '.json');
    if (!fileName) return;
    downloadBlob(blob, fileName);
    setBackupHealthStatus('export', 'ok', 'json');
    var moduleApi = getImportExportModule();
    if (moduleApi && typeof moduleApi.markExportSuccess === 'function') {
        moduleApi.markExportSuccess('json', data.totalItems);
        updateRecoveryCenterPanel();
    }
    showMessage(t('msgExported').replace('{count}', data.totalItems), 'success');
}

function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Keep URL alive longer to avoid intermittent truncated downloads on slower systems.
    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 60000);
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
    const passwordRaw = prompt(t('msgEncryptedPassword'));
    const password = (passwordRaw || '').trim();
    if (!password) return null;

    if (password.length < 4) {
        showMessage(t('msgEncryptedPasswordShort'), 'error');
        return null;
    }

    const confirmRaw = prompt('🔐 ' + (getLang() === 'sv' ? 'Bekräfta lösenordet:' : 'Confirm password:'));
    const confirmPassword = (confirmRaw || '').trim();
    if (password !== confirmPassword) {
        showMessage(t('msgPasswordMismatch'), 'error');
        return null;
    }

    return password;
}

function createEncryptedExportBlob(data, password) {
    const json = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(json, password).toString();

    // Verify immediately with the same decrypt path used at import time.
    try {
        const roundtripText = decryptEncryptedPayload(encrypted, password);
        JSON.parse(roundtripText);
    } catch (error) {
        throw new Error(getLang() === 'sv'
            ? 'Krypterad export kunde inte verifieras internt.'
            : 'Encrypted export could not be verified internally.');
    }

    const exportData = {
        encrypted: encrypted,
        algorithm: 'AES',
        version: LEGACY_BACKUP_VERSION,
        formatVersion: BACKUP_FORMAT_VERSION,
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
        setBackupHealthStatus('export', 'ok', 'encrypted');
        var moduleApi = getImportExportModule();
        if (moduleApi && typeof moduleApi.markExportSuccess === 'function') {
            moduleApi.markExportSuccess('encrypted', data.totalItems);
            updateRecoveryCenterPanel();
        }
        showMessage(t('msgEncrypted').replace('{count}', data.totalItems), 'success');
    } catch (error) {
        hideProgress();
        setBackupHealthStatus('export', 'error', 'encrypted failed');
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
        setBackupHealthStatus('export', 'ok', 'csv');
        var moduleApi = getImportExportModule();
        if (moduleApi && typeof moduleApi.markExportSuccess === 'function') {
            moduleApi.markExportSuccess('csv', items.length + doneItems.length + archivedItems.length);
            updateRecoveryCenterPanel();
        }
        showMessage(t('msgCsvExported').replace('{count}', items.length + doneItems.length + archivedItems.length), 'success');
    } catch (error) {
        hideProgress();
        setBackupHealthStatus('export', 'error', 'csv failed');
        showMessage('❌ ' + (getLang() === 'sv' ? 'Fel vid CSV-export: ' : 'CSV export error: ') + error.message, 'error');
    }
}

function getPasswordCandidates(password) {
    const base = String(password || '');
    const candidates = [base];

    try {
        candidates.push(base.normalize('NFC'));
        candidates.push(base.normalize('NFD'));
    } catch (e) {
        // String.normalize may be unavailable in very old runtimes.
    }

    const trimmed = base.trim();
    if (trimmed && trimmed !== base) {
        candidates.push(trimmed);
        try {
            candidates.push(trimmed.normalize('NFC'));
            candidates.push(trimmed.normalize('NFD'));
        } catch (e) {
            // ignore
        }
    }

    return candidates.filter(function(value, index, arr) {
        return arr.indexOf(value) === index;
    });
}

function decryptEncryptedPayload(encryptedValue, password) {
    if (typeof CryptoJS === 'undefined') {
        throw new Error('CryptoJS not loaded');
    }

    const encrypted = String(encryptedValue || '').trim();
    if (!encrypted) {
        throw new Error('Encrypted payload missing');
    }

    const encryptedNoWhitespace = encrypted.replace(/\s+/g, '');
    const candidates = getPasswordCandidates(password);

    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const decrypted = CryptoJS.AES.decrypt(encryptedNoWhitespace, candidate);
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8).replace(/^\uFEFF/, '').trim();
        if (decryptedText) {
            return decryptedText;
        }
    }

    throw new Error('Wrong password or corrupt encrypted payload');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        pendingImportAction = 'import';
        return;
    }

    var action = pendingImportAction || 'import';
    pendingImportAction = 'import';

    showProgress('📥 ' + (getLang() === 'sv' ? 'Läser fil...' : 'Reading file...'));

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const contentRaw = typeof e.target.result === 'string' ? e.target.result : '';
            const content = contentRaw.replace(/^\uFEFF/, '').trim();

            if (!content) {
                hideProgress();
                setBackupHealthStatus('import', 'error', 'empty file');
                showMessage('❌ ' + (getLang() === 'sv' ? 'Filen är tom eller oläsbar.' : 'The file is empty or unreadable.'), 'error');
                return;
            }

            var parsed = parseImportJsonContent(content);
            if (!parsed.ok) {
                hideProgress();
                setBackupHealthStatus('import', 'error', parsed.code);
                if (parsed.code === 'wrong-file-type') {
                    showMessage('❌ ' + (getLang() === 'sv' ? 'Fel filtyp: välj en backupfil (.json eller .enc), inte en HTML-sida.' : 'Wrong file type: select a backup file (.json or .enc), not an HTML page.'), 'error');
                } else {
                    showMessage(getImportDiagnosticsMessage('invalid-structure'), 'error');
                }
                console.error('Import parse error:', parsed.error);
                return;
            }

            handleParsedImportData(parsed.data, action);
        } catch (error) {
            hideProgress();
            setBackupHealthStatus('import', 'error', 'runtime');
            showMessage(t('msgImportError'), 'error');
            console.error('Import error:', error);
        }
    };

    reader.readAsText(file, 'utf-8');
    event.target.value = '';
}

function handleParsedImportData(data, action) {
    if (data && data.encrypted && data.algorithm === 'AES') {
        hideProgress();
        showArchivePasswordModal(function(password) {
            showProgress('📥 ' + (getLang() === 'sv' ? 'Läser fil...' : 'Reading file...'));
            decryptAndHandleImport(data, password, action);
        }, {
            requireConfirm: false,
            labels: getImportPasswordTexts(),
            fallbackPromptText: t('msgEncryptedPassword')
        });
        return;
    }

    applyImportAction(data, action);
}

function decryptAndHandleImport(encryptedWrapper, password, action) {
    if (!password) {
        hideProgress();
        setBackupHealthStatus('import', 'error', 'password missing');
        showMessage('❌ ' + (getLang() === 'sv' ? 'Lösenord krävs för att importera!' : 'Password required to import!'), 'error');
        return;
    }

    var decryptedData;
    try {
        const decryptedText = decryptEncryptedPayload(encryptedWrapper.encrypted, password);
        decryptedData = JSON.parse(decryptedText);
    } catch (error) {
        hideProgress();
        setBackupHealthStatus('import', 'error', 'decrypt failed');
        showMessage('❌ ' + getImportDiagnosticsMessage('wrong-password'), 'error');
        return;
    }

    applyImportAction(decryptedData, action);
}

function applyImportAction(rawData, action) {
    var migration = migrateImportedPayload(rawData);
    if (!migration.ok) {
        hideProgress();
        setBackupHealthStatus('import', 'error', migration.code);
        showMessage('❌ ' + getImportDiagnosticsMessage(migration.code), 'error');
        return;
    }

    var data = migration.data;

    if (action === 'dry-run') {
        runImportDryRun(data);
        return;
    }

    if (action === 'validate') {
        runBackupValidation(data);
        return;
    }

    try {
        importProcess(data);
        setBackupHealthStatus('import', 'ok', data.version || BACKUP_FORMAT_VERSION);
    } catch (error) {
        hideProgress();
        setBackupHealthStatus('import', 'error', 'process failed');
        showMessage(t('msgImportError'), 'error');
        console.error('Import process error:', error);
    }
}

function runImportDryRun(data) {
    var text = getBackupUiText();
    var fileType = getBackupFileType(data);

    if (fileType === 'vault') {
        hideProgress();
        setBackupHealthStatus('import', 'ok', 'dry-run vault');
        showMessage(text.dryRunVaultSummary.replace('{archived}', data.archivedItems.length), 'info');
        return;
    }

    hideProgress();
    setBackupHealthStatus('import', 'ok', 'dry-run full');
    showMessage(text.dryRunSummary
        .replace('{type}', fileType)
        .replace('{active}', data.items.length)
        .replace('{done}', data.doneItems.length)
        .replace('{archived}', data.archivedItems.length), 'info');
}

function runBackupValidation(data) {
    var text = getBackupUiText();

    // Validate that every item can be normalized without runtime exceptions.
    if (data.source === 'archive-vault') {
        prepareVaultItemsForArchive(data.archivedItems);
    } else {
        data.items.map(normalizeItemData);
        data.doneItems.map(normalizeItemData);
        data.archivedItems.map(normalizeItemData);
    }

    hideProgress();
    setBackupHealthStatus('import', 'ok', 'validated');
    showMessage(text.validateBackupSuccess, 'success');
}

function openImportFilePicker(action) {
    pendingImportAction = action || 'import';
    var fileInput = document.getElementById('fileInput');
    if (!fileInput) {
        pendingImportAction = 'import';
        return;
    }
    fileInput.click();
}

function startDryRunImport() {
    openImportFilePicker('dry-run');
}

function startBackupValidation() {
    openImportFilePicker('validate');
}

function startStandardImport() {
    openImportFilePicker('import');
}

function generateImportedItemId(usedIds) {
    var nextId = Date.now();
    while (usedIds.has(nextId)) {
        nextId += 1;
    }
    usedIds.add(nextId);
    return nextId;
}

function prepareVaultItemsForArchive(vaultItems) {
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

function getArchiveItemFingerprint(item) {
    return [
        String(item.name || '').trim().toLowerCase(),
        String(item.age === undefined ? '' : item.age).trim(),
        String(item.task || '').trim().toLowerCase(),
        String(item.note || '').trim().toLowerCase(),
        normalizePriorityValue(item.priority),
        normalizeCategoryValue(item.category),
        String(item.updated || '').trim()
    ].join('|');
}

function splitNewAndDuplicateArchiveItems(importedItems) {
    var existingFingerprints = new Set(
        archivedItems.map(getArchiveItemFingerprint)
    );
    var seenIncoming = new Set();

    var uniqueItems = [];
    var duplicateCount = 0;

    importedItems.forEach(function(item) {
        var fp = getArchiveItemFingerprint(item);
        if (existingFingerprints.has(fp) || seenIncoming.has(fp)) {
            duplicateCount += 1;
            return;
        }
        seenIncoming.add(fp);
        uniqueItems.push(item);
    });

    return {
        uniqueItems: uniqueItems,
        duplicateCount: duplicateCount
    };
}

function buildVaultImportPreviewMessage(deduped, incomingCount) {
    var moduleApi = getImportExportModule();
    if (moduleApi && typeof moduleApi.buildVaultPreviewMessage === 'function') {
        return moduleApi.buildVaultPreviewMessage({
            lang: getLang(),
            title: getBackupUiText().importPreviewTitle,
            continueText: getBackupUiText().importPreviewContinue,
            beforeArchive: archivedItems.length,
            incomingCount: incomingCount,
            uniqueCount: deduped.uniqueItems.length,
            duplicateCount: deduped.duplicateCount,
            afterArchive: archivedItems.length + deduped.uniqueItems.length
        });
    }

    var lang = getLang();
    var beforeArchive = archivedItems.length;
    var afterArchive = beforeArchive + deduped.uniqueItems.length;

    if (lang === 'en') {
        return '🔎 ' + getBackupUiText().importPreviewTitle + '\n\n'
            + 'Vault import:\n'
            + '📦 Current archive: ' + beforeArchive + '\n'
            + '📥 Incoming archived: ' + incomingCount + '\n'
            + '➕ Unique to add: ' + deduped.uniqueItems.length + '\n'
            + '⚠️ Duplicates skipped: ' + deduped.duplicateCount + '\n'
            + '📊 Archive after import: ' + afterArchive + '\n\n'
            + getBackupUiText().importPreviewContinue;
    }

    return '🔎 ' + getBackupUiText().importPreviewTitle + '\n\n'
        + 'Vault-import:\n'
        + '📦 Nuvarande arkiv: ' + beforeArchive + '\n'
        + '📥 Inkommande arkivposter: ' + incomingCount + '\n'
        + '➕ Unika att lägga till: ' + deduped.uniqueItems.length + '\n'
        + '⚠️ Dubbletter som hoppas över: ' + deduped.duplicateCount + '\n'
        + '📊 Arkiv efter import: ' + afterArchive + '\n\n'
        + getBackupUiText().importPreviewContinue;
}

function buildFullImportPreviewMessage(data) {
    var moduleApi = getImportExportModule();
    if (moduleApi && typeof moduleApi.buildFullPreviewMessage === 'function') {
        return moduleApi.buildFullPreviewMessage({
            lang: getLang(),
            title: getBackupUiText().importPreviewTitle,
            continueText: getBackupUiText().importPreviewContinue,
            currentActive: items.length,
            currentDone: doneItems.length,
            currentArchived: archivedItems.length,
            incomingActive: data.items.length,
            incomingDone: data.doneItems.length,
            incomingArchived: data.archivedItems.length,
            addActive: items.length + data.items.length,
            addDone: doneItems.length + data.doneItems.length,
            addArchived: archivedItems.length + data.archivedItems.length
        });
    }

    var lang = getLang();
    var currentActive = items.length;
    var currentDone = doneItems.length;
    var currentArchived = archivedItems.length;
    var incomingActive = data.items.length;
    var incomingDone = data.doneItems.length;
    var incomingArchived = data.archivedItems.length;

    var addActive = currentActive + incomingActive;
    var addDone = currentDone + incomingDone;
    var addArchived = currentArchived + incomingArchived;

    if (lang === 'en') {
        return '🔎 ' + getBackupUiText().importPreviewTitle + '\n\n'
            + 'Current data:\n'
            + '📋 Active: ' + currentActive + '\n'
            + '✅ Done: ' + currentDone + '\n'
            + '📦 Archive: ' + currentArchived + '\n\n'
            + 'Incoming backup:\n'
            + '📋 Active: ' + incomingActive + '\n'
            + '✅ Done: ' + incomingDone + '\n'
            + '📦 Archive: ' + incomingArchived + '\n\n'
            + 'If you later choose REPLACE in next step:\n'
            + '📊 Result: ' + incomingActive + ' / ' + incomingDone + ' / ' + incomingArchived + '\n\n'
            + 'If you later choose ADD in next step:\n'
            + '📊 Result: ' + addActive + ' / ' + addDone + ' / ' + addArchived + '\n\n'
            + getBackupUiText().importPreviewContinue;
    }

    return '🔎 ' + getBackupUiText().importPreviewTitle + '\n\n'
        + 'Nuvarande data:\n'
        + '📋 Aktiv: ' + currentActive + '\n'
        + '✅ Färdig: ' + currentDone + '\n'
        + '📦 Arkiv: ' + currentArchived + '\n\n'
        + 'Inkommande backup:\n'
        + '📋 Aktiv: ' + incomingActive + '\n'
        + '✅ Färdig: ' + incomingDone + '\n'
        + '📦 Arkiv: ' + incomingArchived + '\n\n'
        + 'Om du väljer ERSÄTT i nästa steg:\n'
        + '📊 Resultat: ' + incomingActive + ' / ' + incomingDone + ' / ' + incomingArchived + '\n\n'
        + 'Om du väljer LÄGG TILL i nästa steg:\n'
        + '📊 Resultat: ' + addActive + ' / ' + addDone + ' / ' + addArchived + '\n\n'
        + getBackupUiText().importPreviewContinue;
}

function requestReplaceConfirmationPhrase() {
    var moduleApi = getImportExportModule();
    var token = moduleApi && typeof moduleApi.getReplaceToken === 'function'
        ? moduleApi.getReplaceToken(getLang())
        : (getLang() === 'sv' ? 'ERSÄTT' : 'REPLACE');
    var typed = prompt(getBackupUiText().replacePrompt + ' [' + token + ']');
    if (typed === null) return false;
    return typed.trim().toUpperCase() === token;
}

function importProcess(data) {
    if (data.source === 'archive-vault' && Array.isArray(data.archivedItems)) {
        const importedItems = prepareVaultItemsForArchive(data.archivedItems);
        const deduped = splitNewAndDuplicateArchiveItems(importedItems);

        if (!confirm(buildVaultImportPreviewMessage(deduped, data.archivedItems.length))) {
            hideProgress();
            showMessage(getBackupUiText().importCancelled, 'info');
            return;
        }

        if (Array.isArray(data.adminUpdates)) {
            const mergedUpdates = mergeAdminUpdates(data.adminUpdates, getAdminUpdates());
            saveAdminUpdates(mergedUpdates);
            if (typeof renderInfoContent === 'function') {
                renderInfoContent();
            }
            if (typeof renderAdminList === 'function') {
                renderAdminList();
            }
        }
        archivedItems = archivedItems.concat(deduped.uniqueItems);
        saveData();
        render();
        renderArchive();
        updateAutoSafetyRestoreButtons();
        var moduleApi = getImportExportModule();
        if (moduleApi && typeof moduleApi.markImportSuccess === 'function') {
            moduleApi.markImportSuccess('vault', {
                active: items.length,
                done: doneItems.length,
                archived: archivedItems.length
            });
            updateRecoveryCenterPanel();
        }
        hideProgress();
        showMessage(getLang() === 'sv'
            ? '✅ ' + deduped.uniqueItems.length + ' arkivposter importerades till arkivet.'
            : '✅ ' + deduped.uniqueItems.length + ' archived items were imported to Archive.', 'success');
        if (deduped.duplicateCount > 0) {
            showMessage(getBackupUiText().duplicateSkipped.replace('{count}', deduped.duplicateCount), 'info');
        }
        return;
    }

    if (!data.items || !data.doneItems || !data.archivedItems) {
        hideProgress();
        showMessage('❌ ' + (getLang() === 'sv' ? 'Ogiltig datafil!' : 'Invalid data file!'), 'error');
        return;
    }

    if (!confirm(buildFullImportPreviewMessage(data))) {
        hideProgress();
        showMessage(getBackupUiText().importCancelled, 'info');
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
        if (!requestReplaceConfirmationPhrase()) {
            hideProgress();
            showMessage(getBackupUiText().replacePromptFailed, 'error');
            return;
        }

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
        var replaceModuleApi = getImportExportModule();
        if (replaceModuleApi && typeof replaceModuleApi.markImportSuccess === 'function') {
            replaceModuleApi.markImportSuccess('replace', {
                active: items.length,
                done: doneItems.length,
                archived: archivedItems.length
            });
            updateRecoveryCenterPanel();
        }
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
        var addModuleApi = getImportExportModule();
        if (addModuleApi && typeof addModuleApi.markImportSuccess === 'function') {
            addModuleApi.markImportSuccess('add', {
                active: items.length,
                done: doneItems.length,
                archived: archivedItems.length
            });
            updateRecoveryCenterPanel();
        }
    }

    saveData();
    render();
    updateAutoSafetyRestoreButtons();
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

    setEditorInlineMode(true);
    document.getElementById('editor').style.display = 'block';
}

function setEditorInlineMode(isInline) {
    var editor = document.getElementById('editor');
    var activeColumn = document.getElementById('activeDrop');
    if (!editor || !activeColumn) return;

    if (isInline) {
        if (!editorOriginalParent) {
            editorOriginalParent = editor.parentNode;
        }
        editorOriginalNextSibling = editor.nextSibling;

        activeColumn.classList.add('is-editing');
        editor.classList.add('inline-editor');
        activeColumn.appendChild(editor);
        return;
    }

    activeColumn.classList.remove('is-editing');
    editor.classList.remove('inline-editor');

    if (!editorOriginalParent) return;

    if (editorOriginalNextSibling && editorOriginalNextSibling.parentNode === editorOriginalParent) {
        editorOriginalParent.insertBefore(editor, editorOriginalNextSibling);
        return;
    }

    editorOriginalParent.appendChild(editor);
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
    closeReminderEditor('editNotification');
    document.getElementById('editor').style.display = 'none';
    setEditorInlineMode(false);
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
            <button type="button" class="active-group-toggle category-${groupKey}" data-group-key="${groupKey}" onclick="event.stopPropagation(); toggleActiveGroup('${groupKey}')">
                <span class="group-left"><span class="group-arrow">${collapsed ? '▸' : '▾'}</span>${escapeHTML(groupTitle)}</span>
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
    var collapsed = !(activeGroupsCollapsed[groupKey] === true);
    activeGroupsCollapsed[groupKey] = collapsed;
    saveData();

    var toggle = document.querySelector('.active-group-toggle[data-group-key="' + groupKey + '"]');
    if (!toggle) {
        render();
        return;
    }

    var groupList = toggle.parentElement ? toggle.parentElement.querySelector('.active-group-items') : null;
    if (!groupList) {
        render();
        return;
    }

    groupList.classList.toggle('collapsed', collapsed);
    var arrow = toggle.querySelector('.group-arrow');
    if (arrow) {
        arrow.textContent = collapsed ? '▸' : '▾';
    }
}

function renderDebounced() {
    if (renderDebounceTimer !== null) {
        clearTimeout(renderDebounceTimer);
    }
    renderDebounceTimer = setTimeout(function() {
        renderDebounceTimer = null;
        render();
    }, 120);
}

function renderArchiveDebounced() {
    if (renderArchiveDebounceTimer !== null) {
        clearTimeout(renderArchiveDebounceTimer);
    }
    renderArchiveDebounceTimer = setTimeout(function() {
        renderArchiveDebounceTimer = null;
        renderArchive();
    }, 120);
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

    function canScrollInDirection(element, deltaY) {
        if (!isScrollableElement(element)) return false;
        if (deltaY < 0) return element.scrollTop > 0;
        if (deltaY > 0) return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
        return false;
    }

    function getGroupListFromTarget(target) {
        if (!target || !target.closest) return null;
        var group = target.closest('.active-group');
        if (!group) return null;
        return group.querySelector('.active-group-items');
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

        var groupListFromHeader = getGroupListFromTarget(event.target);
        if (groupListFromHeader) {
            event.preventDefault();
            if (canScrollInDirection(groupListFromHeader, event.deltaY)) {
                groupListFromHeader.scrollTop += event.deltaY;
            }
            return;
        }

        var nestedList = event.target.closest('.active-group-items');
        if (nestedList && isScrollableElement(nestedList)) {
            event.preventDefault();
            if (canScrollInDirection(nestedList, event.deltaY)) {
                nestedList.scrollTop += event.deltaY;
            }
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

function vaultArchive(options) {
    options = options || {};
    if (archivedItems.length === 0) {
        showMessage(t('archiveEmpty'), 'info');
        updateArchiveVaultButton();
        return;
    }

    var archiveCount = archivedItems.length;
    var skipConfirm = options.skipConfirm === true;
    var clearAfterExport = options.clearAfterExport !== false;
    if (!skipConfirm && !confirm(t('archiveVaultConfirm').replace('{count}', archiveCount))) return;

    var password = options.password || requestEncryptionPassword();
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
        var fileName = options.fileName || requestExportFileName('apexcore-archive-vault-' + new Date().toISOString().split('T')[0], '.enc');
        if (!fileName) {
            hideProgress();
            return;
        }
        downloadBlob(blob, fileName);

        if (clearAfterExport) {
            archivedItems = [];
            saveData();
            render();
            renderArchive();
        }
        hideProgress();
        if (clearAfterExport) {
            showMessage(t('archiveVaultSuccess').replace('{count}', archiveCount), 'success');
        } else {
            showMessage(t('msgEncrypted').replace('{count}', archiveCount), 'success');
        }
    } catch (error) {
        hideProgress();
        showMessage('❌ ' + (getLang() === 'sv' ? 'Fel vid kryptering: ' : 'Encryption error: ') + error.message, 'error');
    }
}

function getArchiveSaveBeforeClearPrompt() {
    var lang = getLang();
    if (lang === 'en') {
        return 'Do you want to save an encrypted backup file before clearing the archive?\n\nOK = Save encrypted file, then clear archive\nCancel = Continue without backup';
    }
    if (lang === 'da') {
        return 'Vil du gemme en krypteret backupfil, før arkivet ryddes?\n\nOK = Gem krypteret fil og ryd arkivet\nAnnuller = Fortsæt uden backup';
    }
    if (lang === 'no') {
        return 'Vil du lagre en kryptert backupfil før arkivet tømmes?\n\nOK = Lagre kryptert fil og tøm arkivet\nAvbryt = Fortsett uten backup';
    }
    if (lang === 'fi') {
        return 'Haluatko tallentaa salatun varmuuskopiotiedoston ennen arkiston tyhjennystä?\n\nOK = Tallenna salattu tiedosto ja tyhjennä arkisto\nPeruuta = Jatka ilman varmuuskopiota';
    }
    return 'Vill du spara en krypterad backup-fil innan arkivet rensas?\n\nOK = Spara krypterad fil och rensa arkivet\nAvbryt = Fortsätt utan backup';
}

function getArchiveCleanupTexts() {
    var lang = getLang();
    if (lang === 'en') {
        return {
            title: '🧹 Clear archive',
            text: 'Do you want to save an encrypted backup file before clearing the archive?',
            cancel: '❌ Cancel',
            clear: '🗑️ Clear without backup',
            save: '🗄️ Save encrypted file'
        };
    }
    if (lang === 'da') {
        return {
            title: '🧹 Ryd arkiv',
            text: 'Vil du gemme en krypteret backupfil, før arkivet ryddes?',
            cancel: '❌ Annuller',
            clear: '🗑️ Ryd uden backup',
            save: '🗄️ Gem krypteret fil'
        };
    }
    if (lang === 'no') {
        return {
            title: '🧹 Tøm arkiv',
            text: 'Vil du lagre en kryptert backupfil før arkivet tømmes?',
            cancel: '❌ Avbryt',
            clear: '🗑️ Tøm uten backup',
            save: '🗄️ Lagre kryptert fil'
        };
    }
    if (lang === 'fi') {
        return {
            title: '🧹 Tyhjennä arkisto',
            text: 'Haluatko tallentaa salatun varmuuskopiotiedoston ennen arkiston tyhjennystä?',
            cancel: '❌ Peruuta',
            clear: '🗑️ Tyhjennä ilman varmuuskopiota',
            save: '🗄️ Tallenna salattu tiedosto'
        };
    }
    return {
        title: '🧹 Rensa arkiv',
        text: 'Vill du spara en krypterad backup-fil innan arkivet rensas?',
        cancel: '❌ Avbryt',
        clear: '🗑️ Rensa utan backup',
        save: '🗄️ Spara krypterad fil'
    };
}

function getArchivePasswordTexts() {
    var lang = getLang();
    if (lang === 'en') {
        return {
            title: '🔐 Encrypted backup',
            text: 'Enter a password for the backup file.',
            placeholder: 'Password',
            placeholderConfirm: 'Confirm password',
            cancel: '❌ Cancel',
            save: '💾 Save backup'
        };
    }
    if (lang === 'da') {
        return {
            title: '🔐 Krypteret backup',
            text: 'Angiv et kodeord til backupfilen.',
            placeholder: 'Kodeord',
            placeholderConfirm: 'Bekræft kodeord',
            cancel: '❌ Annuller',
            save: '💾 Gem backup'
        };
    }
    if (lang === 'no') {
        return {
            title: '🔐 Kryptert backup',
            text: 'Angi passord for backupfilen.',
            placeholder: 'Passord',
            placeholderConfirm: 'Bekreft passord',
            cancel: '❌ Avbryt',
            save: '💾 Lagre backup'
        };
    }
    if (lang === 'fi') {
        return {
            title: '🔐 Salattu varmuuskopio',
            text: 'Anna salasana varmuuskopiotiedostolle.',
            placeholder: 'Salasana',
            placeholderConfirm: 'Vahvista salasana',
            cancel: '❌ Peruuta',
            save: '💾 Tallenna varmuuskopio'
        };
    }
    return {
        title: '🔐 Krypterad backup',
        text: 'Ange lösenord för backup-filen.',
        placeholder: 'Lösenord',
        placeholderConfirm: 'Bekräfta lösenord',
        cancel: '❌ Avbryt',
        save: '💾 Spara backup'
    };
}

function getImportPasswordTexts() {
    var lang = getLang();
    if (lang === 'en') {
        return {
            title: '🔓 Import encrypted file',
            text: 'Enter the password for the encrypted import file.',
            placeholder: 'Password',
            placeholderConfirm: '',
            cancel: '❌ Cancel',
            save: '📥 Import'
        };
    }
    if (lang === 'da') {
        return {
            title: '🔓 Importér krypteret fil',
            text: 'Indtast kodeordet til den krypterede importfil.',
            placeholder: 'Kodeord',
            placeholderConfirm: '',
            cancel: '❌ Annuller',
            save: '📥 Importér'
        };
    }
    if (lang === 'no') {
        return {
            title: '🔓 Importer kryptert fil',
            text: 'Skriv inn passordet for den krypterte importfilen.',
            placeholder: 'Passord',
            placeholderConfirm: '',
            cancel: '❌ Avbryt',
            save: '📥 Importer'
        };
    }
    if (lang === 'fi') {
        return {
            title: '🔓 Tuo salattu tiedosto',
            text: 'Anna salatun tuontitiedoston salasana.',
            placeholder: 'Salasana',
            placeholderConfirm: '',
            cancel: '❌ Peruuta',
            save: '📥 Tuo'
        };
    }
    return {
        title: '🔓 Importera krypterad fil',
        text: 'Ange lösenordet för den krypterade importfilen.',
        placeholder: 'Lösenord',
        placeholderConfirm: '',
        cancel: '❌ Avbryt',
        save: '📥 Importera'
    };
}

function closeArchiveCleanupModal() {
    var modal = document.getElementById('archiveCleanupModal');
    if (!modal) return;
    modal.style.display = 'none';
    isArchiveCleanupModalOpen = false;
}

function closeArchivePasswordModal() {
    var modal = document.getElementById('archivePasswordModal');
    if (!modal) return;
    modal.style.display = 'none';
    isArchivePasswordModalOpen = false;
}

function showArchivePasswordModal(onConfirm, options) {
    options = options || {};
    var modal = document.getElementById('archivePasswordModal');
    var title = document.getElementById('archivePasswordTitle');
    var text = document.getElementById('archivePasswordText');
    var passwordInput = document.getElementById('archivePasswordInput');
    var confirmInput = document.getElementById('archivePasswordConfirmInput');
    var cancelBtn = document.getElementById('archivePasswordCancelBtn');
    var okBtn = document.getElementById('archivePasswordOkBtn');
    var requireConfirm = options.requireConfirm !== false;
    var labels = options.labels || getArchivePasswordTexts();

    if (!modal || !title || !text || !passwordInput || !confirmInput || !cancelBtn || !okBtn) {
        var fallbackPassword = null;
        if (requireConfirm) {
            fallbackPassword = requestEncryptionPassword();
        } else {
            var fallbackPromptText = options.fallbackPromptText || t('msgEncryptedPassword');
            try {
                fallbackPassword = prompt(fallbackPromptText);
            } catch (fallbackPromptError) {
                fallbackPassword = null;
            }
        }
        if (!fallbackPassword) return;
        onConfirm(fallbackPassword);
        return;
    }

    title.textContent = labels.title;
    text.textContent = labels.text;
    passwordInput.placeholder = labels.placeholder;
    confirmInput.placeholder = labels.placeholderConfirm || '';
    confirmInput.style.display = requireConfirm ? '' : 'none';
    cancelBtn.textContent = labels.cancel;
    okBtn.textContent = labels.save;
    passwordInput.value = '';
    confirmInput.value = '';

    isArchivePasswordModalOpen = true;
    modal.style.display = 'flex';

    function cleanup() {
        closeArchivePasswordModal();
        modal.onclick = null;
        cancelBtn.onclick = null;
        okBtn.onclick = null;
    }

    function cancel() {
        cleanup();
    }

    function submit() {
        var password = (passwordInput.value || '').trim();
        var confirmPassword = (confirmInput.value || '').trim();

        if (!password || password.length < 4) {
            showMessage(t('msgEncryptedPasswordShort'), 'error');
            return;
        }
        if (requireConfirm && password !== confirmPassword) {
            showMessage(t('msgPasswordMismatch'), 'error');
            return;
        }

        cleanup();
        onConfirm(password);
    }

    modal.onclick = function(event) {
        if (event.target === modal) cancel();
    };

    cancelBtn.onclick = function(event) {
        event.preventDefault();
        cancel();
    };

    okBtn.onclick = function(event) {
        event.preventDefault();
        submit();
    };

    passwordInput.onkeydown = function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (requireConfirm) {
                confirmInput.focus();
            } else {
                submit();
            }
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            cancel();
        }
    };

    confirmInput.onkeydown = function(event) {
        if (!requireConfirm) return;
        if (event.key === 'Enter') {
            event.preventDefault();
            submit();
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            cancel();
        }
    };

    setTimeout(function() {
        passwordInput.focus();
    }, 0);
}

function saveAutoSafetySnapshot() {
    var snapshot = {
        archivedItems: archivedItems,
        adminUpdates: getAdminUpdates(),
        exportedAt: new Date().toISOString(),
        version: LEGACY_BACKUP_VERSION,
        formatVersion: BACKUP_FORMAT_VERSION,
        source: 'auto-safety-archive-clear'
    };

    try {
        localStorage.setItem('archiveAutoSafetyBackup', JSON.stringify(snapshot));
        setBackupHealthStatus('export', 'warn', 'auto safety backup');
        updateAutoSafetyRestoreButtons();
        var moduleApi = getImportExportModule();
        if (moduleApi && typeof moduleApi.markSafetySnapshot === 'function') {
            moduleApi.markSafetySnapshot('created', archivedItems.length);
            updateRecoveryCenterPanel();
        }
        showMessage(getBackupUiText().autoSafetySaved, 'info');
    } catch (error) {
        setBackupHealthStatus('export', 'error', 'auto safety backup failed');
        console.warn('Auto safety snapshot failed:', error);
    }
}

function restoreAutoSafetySnapshot() {
    var raw = localStorage.getItem('archiveAutoSafetyBackup');
    if (!raw) {
        showMessage(getBackupUiText().autoSafetyMissing, 'info');
        updateAutoSafetyRestoreButtons();
        return;
    }

    var parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (error) {
        showMessage(getBackupUiText().autoSafetyMissing, 'error');
        updateAutoSafetyRestoreButtons();
        return;
    }

    if (!parsed || !Array.isArray(parsed.archivedItems)) {
        showMessage(getBackupUiText().autoSafetyMissing, 'error');
        updateAutoSafetyRestoreButtons();
        return;
    }

    var exportedAtText = parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString() : '-';
    var confirmText = (getLang() === 'en'
        ? 'Restore safety snapshot from ' + exportedAtText + '?\n\nArchived items: ' + parsed.archivedItems.length
        : 'Återställ safety-snapshot från ' + exportedAtText + '?\n\nArkiverade poster: ' + parsed.archivedItems.length);

    if (!confirm(confirmText)) {
        return;
    }

    archivedItems = parsed.archivedItems.map(normalizeItemData);
    if (Array.isArray(parsed.adminUpdates)) {
        saveAdminUpdates(dedupeAdminUpdates(parsed.adminUpdates));
        if (typeof renderInfoContent === 'function') {
            renderInfoContent();
        }
        if (typeof renderAdminList === 'function') {
            renderAdminList();
        }
    }

    saveData();
    render();
    renderArchive();
    setBackupHealthStatus('import', 'ok', 'safety restored');
    updateAutoSafetyRestoreButtons();
    var moduleApi = getImportExportModule();
    if (moduleApi && typeof moduleApi.markSafetySnapshot === 'function') {
        moduleApi.markSafetySnapshot('restored', archivedItems.length);
    }
    if (moduleApi && typeof moduleApi.markImportSuccess === 'function') {
        moduleApi.markImportSuccess('safety-restore', {
            active: items.length,
            done: doneItems.length,
            archived: archivedItems.length
        });
    }
    updateRecoveryCenterPanel();
    showMessage(getBackupUiText().autoSafetyRestored.replace('{count}', archivedItems.length), 'success');
}

function showArchiveCleanupModal() {
    var modal = document.getElementById('archiveCleanupModal');
    var title = document.getElementById('archiveCleanupTitle');
    var text = document.getElementById('archiveCleanupText');
    var cancelBtn = document.getElementById('archiveCleanupCancelBtn');
    var clearBtn = document.getElementById('archiveCleanupClearBtn');
    var backupBtn = document.getElementById('archiveCleanupBackupBtn');

    if (!modal || !title || !text || !cancelBtn || !clearBtn || !backupBtn) {
        var wantsBackupFallback = confirm(getArchiveSaveBeforeClearPrompt());
        if (wantsBackupFallback) {
            vaultArchive({ skipConfirm: true, clearAfterExport: true });
            return;
        }
        if (!confirm(t('archiveConfirmClear'))) return;
        saveAutoSafetySnapshot();
        archivedItems = [];
        saveData();
        render();
        renderArchive();
        updateAutoSafetyRestoreButtons();
        showMessage(t('archiveCleared'), 'info');
        return;
    }

    var labels = getArchiveCleanupTexts();
    title.textContent = labels.title;
    text.textContent = labels.text;
    cancelBtn.textContent = labels.cancel;
    clearBtn.textContent = labels.clear;
    backupBtn.textContent = labels.save;

    isArchiveCleanupModalOpen = true;
    modal.style.display = 'flex';

    function cleanup() {
        closeArchiveCleanupModal();
        modal.onclick = null;
        cancelBtn.onclick = null;
        clearBtn.onclick = null;
        backupBtn.onclick = null;
    }

    function cancel() {
        cleanup();
    }

    function clearWithoutBackup() {
        cleanup();
        saveAutoSafetySnapshot();
        archivedItems = [];
        saveData();
        render();
        renderArchive();
        updateAutoSafetyRestoreButtons();
        showMessage(t('archiveCleared'), 'info');
    }

    function saveBackupThenClear() {
        cleanup();
        showArchivePasswordModal(function(password) {
            var fileName = 'apexcore-archive-vault-' + new Date().toISOString().split('T')[0] + '.enc';
            vaultArchive({
                skipConfirm: true,
                clearAfterExport: true,
                password: password,
                fileName: fileName
            });
        });
    }

    modal.onclick = function(event) {
        if (event.target === modal) cancel();
    };

    cancelBtn.onclick = function(event) {
        event.preventDefault();
        cancel();
    };

    clearBtn.onclick = function(event) {
        event.preventDefault();
        clearWithoutBackup();
    };

    backupBtn.onclick = function(event) {
        event.preventDefault();
        saveBackupThenClear();
    };
}

function clearArchiveWithBackupPrompt() {
    if (archivedItems.length === 0) {
        showMessage(t('archiveEmpty'), 'info');
        return;
    }
    showArchiveCleanupModal();
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
    clearArchiveWithBackupPrompt();
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
initBackupHealthPanel();
setBackupHealthOpenState(false);
setRecoveryCenterOpenState(false);
updateRecoveryCenterPanel();
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

