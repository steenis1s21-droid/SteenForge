# App Dock Starter

A simple starter site for hosting your app downloads and release notes.

## Quick Start

1. Open `index.html` in your browser.
2. Edit app data in `app.js`:
   - `downloadUrl`: put real links to installers/store pages
   - `notes`: update release notes per version
   - `platform`, `version`, `released`, and `size`
3. Customize colors and typography in `styles.css`.

## Files

- `index.html` - Page structure
- `styles.css` - Visual design and responsive layout
- `app.js` - App/release note data and rendering logic

## ApexCore Web Workflow

- `ApexCore_3.0.3_stable/` is the ApexCore source project in this workspace.
- The website publishes ApexCore from `dist-web/index.html`.
- Run `npm run build:web` inside `ApexCore_3.0.3_stable/` to sync the current ApexCore source into the website `dist-web/` folder.
- The sync command also updates the ApexCore version shown on the main website from `ApexCore_3.0.3_stable/package.json`.
- Update ApexCore in `ApexCore_3.0.3_stable/`, then run the sync command to publish the latest web version.
- `dist-web/` should now be treated as generated publish output, not the primary edit location.

## ApexCore Release Checklist

1. Update ApexCore in `ApexCore_3.0.3_stable/`.
2. Bump the version in `ApexCore_3.0.3_stable/package.json` when the release changes.
3. Run `npm run build:web` inside `ApexCore_3.0.3_stable/`.
4. Verify that `dist-web/index.html` opens and that ApexCore on the main site shows the expected version.

## ApexCore Module Map

- `assets/js/app.js` now acts mainly as orchestration and wrapper glue.
- `assets/js/modules/state-helpers.js` owns save/load and state normalization.
- `assets/js/modules/active-rendering.js` owns the Active list and group rendering.
- `assets/js/modules/archive-ui.js` owns archive actions and archive dialogs.
- `assets/js/modules/import-export-core.js` owns backup import/export logic.
- `assets/js/modules/admin-updates.js` owns the info/admin panel.
- `assets/js/modules/item-actions.js` owns move, delete, undo, and drag/drop.
- `assets/js/modules/item-form.js` owns the add-item form and category entry flow.
- `assets/js/modules/login-session.js` owns login, logout, and password changes.
- `assets/js/modules/ui-feedback.js` owns messages and progress overlays.

Keep new behavior in the narrowest matching module first. If a change affects the HTML onclick handlers or startup order, preserve the wrapper function names in `app.js`.

## Sleep Journal Web Workflow

- `Sleep journal wip/` is the current Sleep Journal source folder.
- Run `npm run build:sleep-journal-web` from the workspace root to publish it into `sleep-journal-web/`.
- The publish step rebuilds `sleep-journal-web/` from scratch each time.
- The website links to the published web version at `sleep-journal-web/index.html`.

## Combined Publish Command

- `npm run build:web` publishes only ApexCore.
- `npm run build:sleep-journal-web` publishes only Sleep Journal.
- `npm run build:all-web` publishes both apps in sequence from the workspace root.

## Next Improvements

- Replace `#` download links with real URLs.
- Add a dedicated page per app.
- Add screenshots and changelog search.
- Deploy on GitHub Pages or Netlify.
