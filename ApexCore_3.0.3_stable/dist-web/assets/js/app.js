
// ============================================
// MODULERAT BASLAGER
// ============================================
// Ljud, tema och hash-hjälpare laddas från assets/js/modules/*.js


// ============================================
// ⚠️ VIKTIGT: Deklarera ALLA variabler FÖRST!
// ============================================

let items = []
let doneItems = []
let deletedItem = null
let archivedItems = []

let dragId = null
let isDragging = false
let currentLanguage = 'sv';
let activeGroupsCollapsed = {};
let renderArchiveDebounceTimer = null;
let pendingImportAction = 'import';

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

window.ApexTranslations = translations;

function getLanguageModule() {
    return window.ApexLanguageModule || {};
}

function getBackupRecoveryModule() {
    return window.ApexBackupRecoveryModule || {};
}

function getEditorModule() {
    return window.ApexEditorModule || {};
}

function getRemindersModule() {
    return window.ApexRemindersModule || {};
}

function getArchiveModule() {
    return window.ApexArchiveModule || {};
}

function getImportExportCoreModule() {
    return window.ApexImportExportCoreModule || {};
}

function getActiveRenderingModule() {
    return window.ApexActiveRenderingModule || {};
}

function getAdminModule() {
    return window.ApexAdminUpdatesModule || {};
}

function getReminderContext() {
    return {
        t: t,
        getItems: function() { return items; },
        saveData: saveData,
        playNotificationSound: playNotificationSound,
        getPriorityBadgeText: getPriorityBadgeText
    };
}

function getArchiveContext() {
    return {
        t: t,
        getLang: getLang,
        escapeHTML: escapeHTML,
        formatTime: formatTime,
        showMessage: showMessage,
        showProgress: showProgress,
        hideProgress: hideProgress,
        saveData: saveData,
        render: render,
        getItems: function() { return items; },
        setItems: function(nextItems) { items = nextItems; },
        getDoneItems: function() { return doneItems; },
        setDoneItems: function(nextItems) { doneItems = nextItems; },
        getArchivedItems: function() { return archivedItems; },
        setArchivedItems: function(nextItems) { archivedItems = nextItems; },
        requestEncryptionPassword: requestEncryptionPassword,
        getAdminUpdates: getAdminUpdates,
        createEncryptedExportBlob: createEncryptedExportBlob,
        requestExportFileName: requestExportFileName,
        downloadBlob: downloadBlob,
        saveAutoSafetySnapshot: saveAutoSafetySnapshot,
        updateAutoSafetyRestoreButtons: updateAutoSafetyRestoreButtons
    };
}

function getImportExportContext() {
    return {
        CryptoJS: typeof CryptoJS !== 'undefined' ? CryptoJS : null,
        t: t,
        getLang: getLang,
        getBackupUiText: getBackupUiText,
        getImportExportModule: getImportExportModule,
        getBackupFormatVersion: function() { return BACKUP_FORMAT_VERSION; },
        getLegacyBackupVersion: function() { return LEGACY_BACKUP_VERSION; },
        showMessage: showMessage,
        showProgress: showProgress,
        hideProgress: hideProgress,
        setBackupHealthStatus: setBackupHealthStatus,
        updateRecoveryCenterPanel: updateRecoveryCenterPanel,
        getPriorityLabel: getPriorityLabel,
        normalizeItemData: normalizeItemData,
        normalizePriorityValue: normalizePriorityValue,
        normalizeCategoryValue: normalizeCategoryValue,
        mergeAdminUpdates: mergeAdminUpdates,
        dedupeAdminUpdates: dedupeAdminUpdates,
        getAdminUpdates: getAdminUpdates,
        saveAdminUpdates: saveAdminUpdates,
        renderInfoContent: renderInfoContent,
        renderAdminList: renderAdminList,
        renderArchive: renderArchive,
        saveData: saveData,
        render: render,
        updateAutoSafetyRestoreButtons: updateAutoSafetyRestoreButtons,
        getImportPasswordTexts: getImportPasswordTexts,
        showArchivePasswordModal: function(onConfirm, options) {
            showArchivePasswordModal(onConfirm, options);
        },
        getItems: function() { return items; },
        setItems: function(nextItems) { items = nextItems; },
        getDoneItems: function() { return doneItems; },
        setDoneItems: function(nextItems) { doneItems = nextItems; },
        getArchivedItems: function() { return archivedItems; },
        setArchivedItems: function(nextItems) { archivedItems = nextItems; },
        getPendingImportAction: function() { return pendingImportAction; },
        setPendingImportAction: function(nextAction) { pendingImportAction = nextAction || 'import'; }
    };
}

function getActiveRenderingContext() {
    return {
        t: t,
        escapeHTML: escapeHTML,
        getItems: function() { return items; },
        getArchivedItems: function() { return archivedItems; },
        normalizeCategoryValue: normalizeCategoryValue,
        normalizePriorityValue: normalizePriorityValue,
        getCategoryTexts: getCategoryTexts,
        getCategoryIcon: getCategoryIcon,
        getPriorityLabel: getPriorityLabel,
        getStoredActiveSortMode: getStoredActiveSortMode,
        sortActiveItems: sortActiveItems,
        moveToDoneById: moveToDoneById,
        deleteItem: deleteItem,
        restoreArchive: restoreArchive,
        deleteArchiveItem: deleteArchiveItem,
        startDrag: startDrag,
        reorderActiveItems: reorderActiveItems,
        editItem: editItem,
        getDragId: function() { return dragId; },
        setDragId: function(nextId) { dragId = nextId; },
        getIsDragging: function() { return isDragging; },
        getActiveGroupsCollapsed: function() { return activeGroupsCollapsed; },
        setActiveGroupsCollapsed: function(nextGroups) { activeGroupsCollapsed = nextGroups || {}; },
        saveData: saveData,
        updateArchiveVaultButton: updateArchiveVaultButton,
        renderSelf: function() { render(); }
    };
}

function getAdminContext() {
    return {
        t: t,
        showMessage: showMessage,
        getAdminUpdates: getAdminUpdates,
        saveAdminUpdates: saveAdminUpdates,
        sortUpdatesByType: sortUpdatesByType,
        getUpdateBadgeClass: getUpdateBadgeClass,
        getUpdateBadgeText: getUpdateBadgeText,
        escapeHTML: escapeHTML
    };
}

function getLang() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.getLang === 'function') {
        return moduleApi.getLang();
    }
    return localStorage.getItem('appLanguage') || 'sv';
}

function setLang(lang) {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.setLang === 'function') {
        moduleApi.setLang(lang, function(nextLang) {
            currentLanguage = nextLang;
        });
        return;
    }
    localStorage.setItem('appLanguage', lang);
    currentLanguage = lang;
}

function getCategoryTexts() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.getCategoryTexts === 'function') {
        return moduleApi.getCategoryTexts(getLang());
    }
    return { label: 'Kategori:' };
}

function getSortTexts() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.getSortTexts === 'function') {
        return moduleApi.getSortTexts(getLang());
    }
    return {
        dateDesc: 'Nyast först',
        dateAsc: 'Äldst först',
        nameAsc: 'Namn A-Ö',
        nameDesc: 'Namn Ö-A'
    };
}

function updateSortLanguageText() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.updateSortLanguageText === 'function') {
        moduleApi.updateSortLanguageText(getLang());
    }
}

function getCategoryIcon(categoryKey) {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.getCategoryIcon === 'function') {
        return moduleApi.getCategoryIcon(categoryKey, normalizeCategoryValue);
    }
    return '📌';
}

function updateCategoryLanguageText() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.updateCategoryLanguageText === 'function') {
        moduleApi.updateCategoryLanguageText({ normalizeCategoryValue: normalizeCategoryValue });
    }
}

function t(key) {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.t === 'function') {
        return moduleApi.t(key);
    }
    return key;
}

function getBackupUiText() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.getBackupUiText === 'function') {
        return moduleApi.getBackupUiText(getLang());
    }
    return {
        backupToggleShow: 'Visa backupstatus',
        backupToggleHide: 'Dölj backupstatus',
        recoveryToggleShow: 'Visa Recovery Center',
        recoveryToggleHide: 'Dölj Recovery Center'
    };
}

function getImportExportModule() {
    if (typeof window !== 'undefined' && window.ImportExportModule) {
        return window.ImportExportModule;
    }
    return null;
}

function getBackupRecoveryContext() {
    return {
        backupHealthStorageKey: BACKUP_HEALTH_STORAGE_KEY,
        backupFormatVersion: BACKUP_FORMAT_VERSION,
        legacyBackupVersion: LEGACY_BACKUP_VERSION,
        getLang: getLang,
        getBackupUiText: getBackupUiText,
        getImportExportModule: getImportExportModule,
        showMessage: showMessage,
        getItems: function() { return items; },
        getDoneItems: function() { return doneItems; },
        getArchivedItems: function() { return archivedItems; },
        setArchivedItems: function(nextItems) { archivedItems = nextItems; },
        normalizeItemData: normalizeItemData,
        getAdminUpdates: getAdminUpdates,
        saveAdminUpdates: saveAdminUpdates,
        dedupeAdminUpdates: dedupeAdminUpdates,
        renderInfoContent: renderInfoContent,
        renderAdminList: renderAdminList,
        saveData: saveData,
        render: render,
        renderArchive: renderArchive
    };
}

function readBackupHealthState() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.readBackupHealthState === 'function') {
        return moduleApi.readBackupHealthState(BACKUP_HEALTH_STORAGE_KEY);
    }
    return {};
}

function writeBackupHealthState(state) {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.writeBackupHealthState === 'function') {
        moduleApi.writeBackupHealthState(state, BACKUP_HEALTH_STORAGE_KEY);
    }
}

function setBackupHealthStatus(key, status, detail) {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.setBackupHealthStatus === 'function') {
        moduleApi.setBackupHealthStatus(getBackupRecoveryContext(), key, status, detail);
        return;
    }
    var current = readBackupHealthState();
    current[key] = { status: status, detail: detail || '', at: new Date().toISOString() };
    writeBackupHealthState(current);
}

function testStorageAvailability() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.testStorageAvailability === 'function') {
        return moduleApi.testStorageAvailability();
    }
    return false;
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
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.updateBackupHealthPanel === 'function') {
        moduleApi.updateBackupHealthPanel(getBackupRecoveryContext());
    }
}

function initBackupHealthPanel() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.initBackupHealthPanel === 'function') {
        moduleApi.initBackupHealthPanel(getBackupRecoveryContext());
    }
}

function updateBackupHealthToggleButton() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.updateBackupHealthToggleButton === 'function') {
        moduleApi.updateBackupHealthToggleButton(getBackupRecoveryContext());
    }
}

function setBackupHealthOpenState(nextOpen) {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.setBackupHealthOpenState === 'function') {
        moduleApi.setBackupHealthOpenState(getBackupRecoveryContext(), nextOpen);
    }
}

function toggleBackupHealthPanel() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.toggleBackupHealthPanel === 'function') {
        moduleApi.toggleBackupHealthPanel(getBackupRecoveryContext());
    }
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
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.updateRecoveryCenterPanel === 'function') {
        moduleApi.updateRecoveryCenterPanel(getBackupRecoveryContext());
    }
}

function updateRecoveryCenterToggleButton() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.updateRecoveryCenterToggleButton === 'function') {
        moduleApi.updateRecoveryCenterToggleButton(getBackupRecoveryContext());
    }
}

function setRecoveryCenterOpenState(nextOpen) {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.setRecoveryCenterOpenState === 'function') {
        moduleApi.setRecoveryCenterOpenState(getBackupRecoveryContext(), nextOpen);
    }
}

function toggleRecoveryCenterPanel() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.toggleRecoveryCenterPanel === 'function') {
        moduleApi.toggleRecoveryCenterPanel(getBackupRecoveryContext());
    }
}

function hasAutoSafetySnapshot() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.hasAutoSafetySnapshot === 'function') {
        return moduleApi.hasAutoSafetySnapshot();
    }
    return false;
}

function updateAutoSafetyRestoreButtons() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.updateAutoSafetyRestoreButtons === 'function') {
        moduleApi.updateAutoSafetyRestoreButtons(getBackupRecoveryContext());
    }
}

function toggleLanguageMenu() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.toggleLanguageMenu === 'function') {
        moduleApi.toggleLanguageMenu();
    }
}

function updateLanguageMenu() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.updateLanguageMenu === 'function') {
        moduleApi.updateLanguageMenu(getLang());
    }
}

function changeLanguage(lang) {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.changeLanguage === 'function') {
        moduleApi.changeLanguage(lang, {
            setLang: setLang,
            updateLanguageMenu: updateLanguageMenu,
            applyLanguage: applyLanguage
        });
        return;
    }
    setLang(lang);
    updateLanguageMenu();
    applyLanguage();
}

function applyLanguage() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.applyLanguage === 'function') {
        moduleApi.applyLanguage({
            t: t,
            getBackupUiText: getBackupUiText,
            updateBackupHealthPanel: updateBackupHealthPanel,
            updateBackupHealthToggleButton: updateBackupHealthToggleButton,
            updateRecoveryCenterPanel: updateRecoveryCenterPanel,
            updateAdminPanelLanguage: updateAdminPanelLanguage,
            renderInfoContent: renderInfoContent,
            getArchivedItemsCount: function() { return archivedItems.length; },
            updateAutoSafetyRestoreButtons: updateAutoSafetyRestoreButtons,
            updateReminderLanguageText: updateReminderLanguageText,
            updateCategoryLanguageText: updateCategoryLanguageText,
            updateSortLanguageText: updateSortLanguageText,
            isFirstTimeUser: isFirstTimeUser,
            isAppHidden: function() {
                var app = document.getElementById('app');
                return app ? app.classList.contains('hidden') : true;
            },
            render: render
        });
    }
}

function updateAdminPanelLanguage() {
    var moduleApi = getLanguageModule();
    if (typeof moduleApi.updateAdminPanelLanguage === 'function') {
        moduleApi.updateAdminPanelLanguage({
            t: t,
            renderAdminList: renderAdminList
        });
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
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.checkNotifications === 'function') {
        moduleApi.checkNotifications(getReminderContext());
    }
}

function showNotificationPopup(item) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.showNotificationPopup === 'function') {
        moduleApi.showNotificationPopup(getReminderContext(), item);
    }
}

function closeNotificationPopup() {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.closeNotificationPopup === 'function') {
        moduleApi.closeNotificationPopup();
    }
}

// ============================================
// EXPORT / IMPORT
// ============================================

function getExportData() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.getExportData === 'function') {
        return moduleApi.getExportData(getImportExportContext());
    }
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
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.getBackupFileType === 'function') {
        return moduleApi.getBackupFileType(data);
    }
    if (data && data.source === 'archive-vault') return 'vault';
    return 'full-backup';
}

function getPayloadFormatVersion(data) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.getPayloadFormatVersion === 'function') {
        return moduleApi.getPayloadFormatVersion(data);
    }
    if (!data || typeof data !== 'object') return '';
    return String(data.formatVersion || data.version || '').trim();
}

function isSupportedBackupVersion(version) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.isSupportedBackupVersion === 'function') {
        return moduleApi.isSupportedBackupVersion(getImportExportContext(), version);
    }
    return version === BACKUP_FORMAT_VERSION || version === LEGACY_BACKUP_VERSION;
}

function migrateImportedPayload(rawData) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.migrateImportedPayload === 'function') {
        return moduleApi.migrateImportedPayload(getImportExportContext(), rawData);
    }
    return { ok: false, code: 'invalid-structure' };
}

function getImportDiagnosticsMessage(code) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.getImportDiagnosticsMessage === 'function') {
        return moduleApi.getImportDiagnosticsMessage(getImportExportContext(), code);
    }
    return t('msgImportError');
}

function parseImportJsonContent(content) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.parseImportJsonContent === 'function') {
        return moduleApi.parseImportJsonContent(content);
    }
    return { ok: false, code: 'parse-failed' };
}

function exportJSON() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.exportJSON === 'function') {
        moduleApi.exportJSON(getImportExportContext());
    }
}

function downloadBlob(blob, fileName) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.downloadBlob === 'function') {
        moduleApi.downloadBlob(blob, fileName);
    }
}

function requestExportFileName(defaultBaseName, extension) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.requestExportFileName === 'function') {
        return moduleApi.requestExportFileName(getImportExportContext(), defaultBaseName, extension);
    }
    return null;
}

function requestEncryptionPassword() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.requestEncryptionPassword === 'function') {
        return moduleApi.requestEncryptionPassword(getImportExportContext());
    }
    return null;
}

function createEncryptedExportBlob(data, password) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.createEncryptedExportBlob === 'function') {
        return moduleApi.createEncryptedExportBlob(getImportExportContext(), data, password);
    }
    return null;
}

function exportEncrypted() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.exportEncrypted === 'function') {
        moduleApi.exportEncrypted(getImportExportContext());
    }
}

function exportCSV() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.exportCSV === 'function') {
        moduleApi.exportCSV(getImportExportContext());
    }
}

function getPasswordCandidates(password) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.getPasswordCandidates === 'function') {
        return moduleApi.getPasswordCandidates(password);
    }
    return [String(password || '')];
}

function decryptEncryptedPayload(encryptedValue, password) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.decryptEncryptedPayload === 'function') {
        return moduleApi.decryptEncryptedPayload(getImportExportContext(), encryptedValue, password);
    }
    throw new Error('Import/export core module not loaded');
}

function importData(event) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.importData === 'function') {
        moduleApi.importData(getImportExportContext(), event);
    }
}

function handleParsedImportData(data, action) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.handleParsedImportData === 'function') {
        moduleApi.handleParsedImportData(getImportExportContext(), data, action);
    }
}

function decryptAndHandleImport(encryptedWrapper, password, action) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.decryptAndHandleImport === 'function') {
        moduleApi.decryptAndHandleImport(getImportExportContext(), encryptedWrapper, password, action);
    }
}

function applyImportAction(rawData, action) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.applyImportAction === 'function') {
        moduleApi.applyImportAction(getImportExportContext(), rawData, action);
    }
}

function runImportDryRun(data) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.runImportDryRun === 'function') {
        moduleApi.runImportDryRun(getImportExportContext(), data);
    }
}

function runBackupValidation(data) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.runBackupValidation === 'function') {
        moduleApi.runBackupValidation(getImportExportContext(), data);
    }
}

function openImportFilePicker(action) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.openImportFilePicker === 'function') {
        moduleApi.openImportFilePicker(getImportExportContext(), action);
    }
}

function startDryRunImport() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.startDryRunImport === 'function') {
        moduleApi.startDryRunImport(getImportExportContext());
    }
}

function startBackupValidation() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.startBackupValidation === 'function') {
        moduleApi.startBackupValidation(getImportExportContext());
    }
}

function startStandardImport() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.startStandardImport === 'function') {
        moduleApi.startStandardImport(getImportExportContext());
    }
}

function generateImportedItemId(usedIds) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.generateImportedItemId === 'function') {
        return moduleApi.generateImportedItemId(usedIds);
    }
    return Date.now();
}

function prepareVaultItemsForArchive(vaultItems) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.prepareVaultItemsForArchive === 'function') {
        return moduleApi.prepareVaultItemsForArchive(getImportExportContext(), vaultItems);
    }
    return [];
}

function getArchiveItemFingerprint(item) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.getArchiveItemFingerprint === 'function') {
        return moduleApi.getArchiveItemFingerprint(getImportExportContext(), item);
    }
    return '';
}

function splitNewAndDuplicateArchiveItems(importedItems) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.splitNewAndDuplicateArchiveItems === 'function') {
        return moduleApi.splitNewAndDuplicateArchiveItems(getImportExportContext(), importedItems);
    }
    return { uniqueItems: [], duplicateCount: 0 };
}

function buildVaultImportPreviewMessage(deduped, incomingCount) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.buildVaultImportPreviewMessage === 'function') {
        return moduleApi.buildVaultImportPreviewMessage(getImportExportContext(), deduped, incomingCount);
    }
    return '';
}

function buildFullImportPreviewMessage(data) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.buildFullImportPreviewMessage === 'function') {
        return moduleApi.buildFullImportPreviewMessage(getImportExportContext(), data);
    }
    return '';
}

function requestReplaceConfirmationPhrase() {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.requestReplaceConfirmationPhrase === 'function') {
        return moduleApi.requestReplaceConfirmationPhrase(getImportExportContext());
    }
    return false;
}

function importProcess(data) {
    var moduleApi = getImportExportCoreModule();
    if (typeof moduleApi.importProcess === 'function') {
        moduleApi.importProcess(getImportExportContext(), data);
    }
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
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.fillReminderSelect === 'function') {
        moduleApi.fillReminderSelect(selectId, start, end);
    }
}

function formatReminderValue(value) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.formatReminderValue === 'function') {
        return moduleApi.formatReminderValue(getReminderContext(), value);
    }
    return value || '';
}

function getTodayReminderDate() {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.getTodayReminderDate === 'function') {
        return moduleApi.getTodayReminderDate();
    }
    return '';
}

function getCurrentReminderTime() {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.getCurrentReminderTime === 'function') {
        return moduleApi.getCurrentReminderTime();
    }
    return { hour: '00', minute: '00' };
}

function getReminderElements(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.getReminderElements === 'function') {
        return moduleApi.getReminderElements(prefix);
    }
    return { hidden: null, dateInput: null, hourSelect: null, minuteSelect: null, display: null };
}

function populateReminderFields(prefix, value) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.populateReminderFields === 'function') {
        moduleApi.populateReminderFields(getReminderContext(), prefix, value);
    }
}

function syncReminderValue(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.syncReminderValue === 'function') {
        moduleApi.syncReminderValue(getReminderContext(), prefix);
    }
}

function prepareReminderPicker(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.prepareReminderPicker === 'function') {
        moduleApi.prepareReminderPicker(getReminderContext(), prefix);
    }
}

function openReminderEditor(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.openReminderEditor === 'function') {
        moduleApi.openReminderEditor(getReminderContext(), prefix);
    }
}

function toggleReminderEditor(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.toggleReminderEditor === 'function') {
        moduleApi.toggleReminderEditor(getReminderContext(), prefix);
    }
}

function closeReminderEditor(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.closeReminderEditor === 'function') {
        moduleApi.closeReminderEditor(prefix);
    }
}

function applyReminderValue(prefix) {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.applyReminderValue === 'function') {
        moduleApi.applyReminderValue(getReminderContext(), prefix);
    }
}

function updateReminderLanguageText() {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.updateReminderLanguageText === 'function') {
        moduleApi.updateReminderLanguageText(getReminderContext());
    }
}

function initReminderInputs() {
    var moduleApi = getRemindersModule();
    if (typeof moduleApi.initReminderInputs === 'function') {
        moduleApi.initReminderInputs(getReminderContext());
    }
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
    var moduleApi = getEditorModule();
    if (typeof moduleApi.editItem === 'function') {
        moduleApi.editItem(getEditorContext(), id);
    }
}

function setEditorInlineMode(isInline) {
    var moduleApi = getEditorModule();
    if (typeof moduleApi.setEditorInlineMode === 'function') {
        moduleApi.setEditorInlineMode(isInline);
    }
}

function showSaveEditConfirm(onConfirm) {
    var moduleApi = getEditorModule();
    if (typeof moduleApi.showSaveEditConfirm === 'function') {
        moduleApi.showSaveEditConfirm(getEditorContext(), onConfirm);
    }
}

function saveEdit() {
    var moduleApi = getEditorModule();
    if (typeof moduleApi.saveEdit === 'function') {
        moduleApi.saveEdit(getEditorContext());
    }
}

function closeEdit() {
    var moduleApi = getEditorModule();
    if (typeof moduleApi.closeEdit === 'function') {
        moduleApi.closeEdit(getEditorContext());
    }
}

function getEditorContext() {
    return {
        t: t,
        getItems: function() { return items; },
        normalizeCategoryValue: normalizeCategoryValue,
        populateReminderFields: populateReminderFields,
        closeReminderEditor: closeReminderEditor,
        saveData: saveData,
        render: render
    };
}

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
    var moduleApi = getActiveRenderingModule();
    if (typeof moduleApi.formatTime === 'function') {
        return moduleApi.formatTime(date);
    }
    return new Date(date).toLocaleString('sv-SE');
}

function render() {
    var moduleApi = getActiveRenderingModule();
    if (typeof moduleApi.render === 'function') {
        moduleApi.render(getActiveRenderingContext());
    }
}

function toggleActiveGroup(groupKey) {
    var moduleApi = getActiveRenderingModule();
    if (typeof moduleApi.toggleActiveGroup === 'function') {
        moduleApi.toggleActiveGroup(getActiveRenderingContext(), groupKey);
    }
}

function renderDebounced() {
    var moduleApi = getActiveRenderingModule();
    if (typeof moduleApi.renderDebounced === 'function') {
        moduleApi.renderDebounced(getActiveRenderingContext());
    }
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
    var moduleApi = getActiveRenderingModule();
    if (typeof moduleApi.setupActiveColumnWheelScroll === 'function') {
        moduleApi.setupActiveColumnWheelScroll();
    }
}

// ============================================
// ARKIV FUNKTIONER
// ============================================

function archiveItem(id) {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.archiveItem === 'function') {
        moduleApi.archiveItem(getArchiveContext(), id);
    }
}

function archiveAll() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.archiveAll === 'function') {
        moduleApi.archiveAll(getArchiveContext());
    }
}

function showArchiveInfo() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.showArchiveInfo === 'function') {
        moduleApi.showArchiveInfo(getArchiveContext());
    }
}

function closeArchiveModal() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.closeArchiveModal === 'function') {
        moduleApi.closeArchiveModal(getArchiveContext());
    }
}

function updateArchiveVaultButton() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.updateArchiveVaultButton === 'function') {
        moduleApi.updateArchiveVaultButton(getArchiveContext());
    }
}

function renderArchive() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.renderArchive === 'function') {
        moduleApi.renderArchive(getArchiveContext());
    }
}

function vaultArchive(options) {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.vaultArchive === 'function') {
        moduleApi.vaultArchive(getArchiveContext(), options);
    }
}

function getArchiveSaveBeforeClearPrompt() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.getArchiveSaveBeforeClearPrompt === 'function') {
        return moduleApi.getArchiveSaveBeforeClearPrompt(getArchiveContext());
    }
    return '';
}

function getArchiveCleanupTexts() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.getArchiveCleanupTexts === 'function') {
        return moduleApi.getArchiveCleanupTexts(getArchiveContext());
    }
    return {};
}

function getArchivePasswordTexts() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.getArchivePasswordTexts === 'function') {
        return moduleApi.getArchivePasswordTexts(getArchiveContext());
    }
    return {};
}

function getImportPasswordTexts() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.getImportPasswordTexts === 'function') {
        return moduleApi.getImportPasswordTexts(getArchiveContext());
    }
    return {};
}

function closeArchiveCleanupModal() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.closeArchiveCleanupModal === 'function') {
        moduleApi.closeArchiveCleanupModal(getArchiveContext());
    }
}

function closeArchivePasswordModal() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.closeArchivePasswordModal === 'function') {
        moduleApi.closeArchivePasswordModal(getArchiveContext());
    }
}

function showArchivePasswordModal(onConfirm, options) {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.showArchivePasswordModal === 'function') {
        moduleApi.showArchivePasswordModal(getArchiveContext(), onConfirm, options);
    }
}

function saveAutoSafetySnapshot() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.saveAutoSafetySnapshot === 'function') {
        moduleApi.saveAutoSafetySnapshot(getBackupRecoveryContext());
    }
}

function restoreAutoSafetySnapshot() {
    var moduleApi = getBackupRecoveryModule();
    if (typeof moduleApi.restoreAutoSafetySnapshot === 'function') {
        moduleApi.restoreAutoSafetySnapshot(getBackupRecoveryContext());
    }
}

function showArchiveCleanupModal() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.showArchiveCleanupModal === 'function') {
        moduleApi.showArchiveCleanupModal(getArchiveContext());
    }
}

function clearArchiveWithBackupPrompt() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.clearArchiveWithBackupPrompt === 'function') {
        moduleApi.clearArchiveWithBackupPrompt(getArchiveContext());
    }
}

function restoreArchive(id) {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.restoreArchive === 'function') {
        moduleApi.restoreArchive(getArchiveContext(), id);
    }
}

function deleteArchiveItem(id) {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.deleteArchiveItem === 'function') {
        moduleApi.deleteArchiveItem(getArchiveContext(), id);
    }
}

function clearArchive() {
    var moduleApi = getArchiveModule();
    if (typeof moduleApi.clearArchive === 'function') {
        moduleApi.clearArchive(getArchiveContext());
    }
}

// ============================================
// 🆕 ADMIN FUNKTIONER
// ============================================

function getAdminPasswordHash() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.getAdminPasswordHash === 'function') {
        return moduleApi.getAdminPasswordHash(getAdminContext());
    }
    return hashPassword('admin123');
}

function showAdminLogin() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.showAdminLogin === 'function') {
        moduleApi.showAdminLogin(getAdminContext());
    }
}

function closeAdminLogin() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.closeAdminLogin === 'function') {
        moduleApi.closeAdminLogin(getAdminContext());
    }
}

function adminLogin() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.adminLogin === 'function') {
        moduleApi.adminLogin(getAdminContext());
    }
}

function openAdminPanel() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.openAdminPanel === 'function') {
        moduleApi.openAdminPanel(getAdminContext());
    }
}

function closeAdminPanel() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.closeAdminPanel === 'function') {
        moduleApi.closeAdminPanel(getAdminContext());
    }
}

function addAdminItem() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.addAdminItem === 'function') {
        moduleApi.addAdminItem(getAdminContext());
    }
}

function deleteAdminItem(index) {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.deleteAdminItem === 'function') {
        moduleApi.deleteAdminItem(getAdminContext(), index);
    }
}

function editAdminItem(index) {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.editAdminItem === 'function') {
        moduleApi.editAdminItem(getAdminContext(), index);
    }
}

function clearAdminForm() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.clearAdminForm === 'function') {
        moduleApi.clearAdminForm(getAdminContext());
    }
}

function renderAdminList() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.renderAdminList === 'function') {
        moduleApi.renderAdminList(getAdminContext());
    }
}

function renderInfoContent() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.renderInfoContent === 'function') {
        moduleApi.renderInfoContent(getAdminContext());
    }
}

function saveAdminChanges() {
    var moduleApi = getAdminModule();
    if (typeof moduleApi.saveAdminChanges === 'function') {
        moduleApi.saveAdminChanges(getAdminContext());
    }
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
var editorModule = getEditorModule();
if (typeof editorModule.initEditorAutoClose === 'function') {
    editorModule.initEditorAutoClose(getEditorContext());
}
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

