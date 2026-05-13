const CONFIG_URL =
  "https://raw.githubusercontent.com/BrainARD-hub/Investigator-Sync/main/tools.json";

const DEFAULT_ROOT_FOLDER = "Investigator Sync";
const SYNC_ALARM = "syncBookmarks";
const SYNC_INTERVAL_MINUTES = 360; // Sync every 6 hours

// Initial installation
chrome.runtime.onInstalled.addListener(async () => {
  await syncBookmarks();

  chrome.alarms.create(SYNC_ALARM, {
    periodInMinutes: SYNC_INTERVAL_MINUTES,
  });
});

// Periodic synchronization
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === SYNC_ALARM) {
    await syncBookmarks();
  }
});

// Main sync function
async function syncBookmarks() {
  try {
    const response = await fetch(CONFIG_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tools.json (HTTP ${response.status})`);
    }

    const data = await response.json();

    const remoteVersion = data.version || "0.0.0";
    const rootFolderName = data.rootFolder || DEFAULT_ROOT_FOLDER;

    // Check currently installed version
    const stored = await chrome.storage.local.get([
      "version",
      "lastUpdated",
    ]);

    if (stored.version === remoteVersion) {
      console.log(`Investigator Sync is already up to date (${remoteVersion}).`);
      return;
    }

    console.log(`Updating Investigator Sync to version ${remoteVersion}...`);

    // Ensure root folder exists
    const rootId = await ensureRootFolder(rootFolderName);

    // Remove all managed bookmarks
    await clearFolder(rootId);

    // Rebuild folder structure recursively
    for (const category of data.categories || []) {
      await createCategory(rootId, category);
    }

    // Save installed version
    await chrome.storage.local.set({
      version: remoteVersion,
      lastUpdated: data.updated || new Date().toISOString(),
    });

    console.log(`Investigator Sync successfully updated to ${remoteVersion}.`);
  } catch (error) {
    console.error("Investigator Sync sync failed:", error);
  }
}

// Recursively create categories, bookmarks, and subcategories
async function createCategory(parentId, category) {
  if (!category || !category.name) return;

  const folder = await chrome.bookmarks.create({
    parentId,
    title: category.name,
  });

  // Create bookmarks
  for (const bookmark of category.bookmarks || []) {
    if (!bookmark.title || !bookmark.url) continue;

    await chrome.bookmarks.create({
      parentId: folder.id,
      title: bookmark.title,
      url: bookmark.url,
    });
  }

  // Process subcategories recursively
  for (const subcategory of category.subcategories || []) {
    await createCategory(folder.id, subcategory);
  }
}

// Find or create the root folder
async function ensureRootFolder(name) {
  const matches = await chrome.bookmarks.search({ title: name });

  const existingFolder = matches.find(
    (item) => !item.url && item.title === name
  );

  if (existingFolder) {
    return existingFolder.id;
  }

  const createdFolder = await chrome.bookmarks.create({
    title: name,
  });

  return createdFolder.id;
}

// Delete all child folders/bookmarks inside the root folder
async function clearFolder(folderId) {
  const tree = await chrome.bookmarks.getSubTree(folderId);

  if (!tree || !tree[0]) return;

  const children = tree[0].children || [];

  for (const child of children) {
    await chrome.bookmarks.removeTree(child.id);
  }
}
