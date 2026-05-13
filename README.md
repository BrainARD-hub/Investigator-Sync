# Investigator Sync

Investigator Sync is a browser extension for Google Chrome and Mozilla Firefox that automatically synchronizes a curated collection of OSINT, cybersecurity, and investigative bookmarks directly into your browser.

The project is maintained in this repository:
https://github.com/BrainARD-hub/Investigator-Sync

---

## Features

- Automatically imports 1,500+ curated OSINT and cybersecurity resources
- Preserves categories and subcategories
- Updates bookmarks from GitHub
- Supports Chrome and Firefox
- Organizes tools into a dedicated bookmark folder
- Synchronizes new tools automatically
- Works entirely from a simple `tools.json` file

---

## Categories Included

The bookmark library includes resources for:

- Domain Intelligence
- Username Search
- Email Investigation
- Password and Data Breaches
- Business Research
- Monitoring and Alerts
- Privacy and OPSEC
- Image Analysis
- Video Investigation
- Search Tools
- Vehicle and License Verification
- People Search
- Phone Intelligence
- Metadata Analysis
- Social Media Intelligence (SOCMINT)
- Geolocation and GEOINT
- Training and Courses
- Flight Tracking
- Government Records
- Archives
- Dark Web Research

---

## How It Works

1. You install the extension.
2. The extension downloads `tools.json` from GitHub.
3. A bookmark folder named **Investigator Sync** is created.
4. Categories and subcategories are recreated automatically.
5. The extension checks for updates every 6 hours.
6. New bookmarks are synchronized automatically whenever the repository is updated.

---

## Repository Structure

```text
Investigator-Sync/
├── manifest.json
├── background.js
├── tools.json
├── README.md
├── favicon/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── favicon.ico
│   └── site.webmanifest
└── .github/
    └── workflows/
        └── validate.yml
