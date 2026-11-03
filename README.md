# Gather – Event Management Website

A responsive event management website built for the **K Explore – Web Designing** task ("Design and Develop an Event Management Website").

**Live demo:** _add your Netlify / Vercel / GitHub Pages link here_
**Repository:** _add your GitHub repo link here_

## Features
- Hero section with a live countdown to the next event
- Event cards with name, date, venue, image and short description
- Search by keyword and filter by category
- Event detail pop-up with a registration form (name, email, phone, selected event)
- JavaScript validation with inline error messages and a confirmation message on success
- Fully responsive for mobile, tablet and desktop (mobile menu included)
- **Bonus:** dark/light mode (remembers your choice), countdown timers, animations, and Local Storage registration management (view and cancel registrations, duplicate prevention)
- Accessibility: keyboard navigation, visible focus, Escape to close dialogs, reduced-motion support

## Tech stack
HTML5, CSS3 (custom properties, grid, flexbox) and vanilla JavaScript. No frameworks or build step.

## Project structure
```
index.html   page structure
style.css    styling, themes, responsive rules
script.js    event data, search/filter, validation, countdown, Local Storage
```

## How it works
- `events` array in `script.js` holds all event data. Add or edit entries to change the events.
- Search and category filters re-render the cards on every change.
- The form validates on blur and on submit (name: letters only; email: standard pattern; phone: 10-digit Indian mobile).
- Registrations and the theme are saved in `localStorage`.

## Run locally
Open `index.html` in a browser, or run `npx serve .`.

## Deploy
- **GitHub Pages:** Settings → Pages → deploy from `main` branch, root folder.
- **Netlify / Vercel:** import the GitHub repo; no build command, publish directory is the root.

## Git workflow
```
git init
git add .
git commit -m "Add event management website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
