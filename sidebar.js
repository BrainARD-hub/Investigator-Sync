// sidebar.js
let allTools = [];

async function loadTools() {
  try {
    // First try to get from storage (synced from GitHub)
    const result = await chrome.storage.local.get(['tools']);
    if (result.tools && result.tools.length) {
      allTools = result.tools;
    } else {
      // Fallback: fetch directly from GitHub raw URL
      const response = await fetch('https://raw.githubusercontent.com/BrainARD-hub/Investigator-Sync/main/tools.json');
      allTools = await response.json();
      // Save for next time
      chrome.storage.local.set({ tools: allTools });
    }
    populateCategoryFilter();
    renderBookmarks('all');
  } catch (err) {
    document.getElementById('bookmarkContainer').innerHTML = 'Error loading tools.';
    console.error(err);
  }
}

function populateCategoryFilter() {
  const categories = new Set();
  categories.add('all');
  allTools.forEach(tool => {
    if (tool.category) categories.add(tool.category);
  });
  const select = document.getElementById('categoryFilter');
  select.innerHTML = '';
  for (let cat of categories) {
    const option = document.createElement('option');
    option.value = cat === 'all' ? 'all' : cat;
    option.textContent = cat === 'all' ? 'All categories' : cat;
    select.appendChild(option);
  }
}

function renderBookmarks(category) {
  const filtered = category === 'all' 
    ? allTools 
    : allTools.filter(tool => tool.category === category);
  
  const container = document.getElementById('bookmarkContainer');
  if (filtered.length === 0) {
    container.innerHTML = '<p>No bookmarks in this category.</p>';
    return;
  }
  
  container.innerHTML = filtered.map(tool => `
    <div class="bookmark-item">
      <a href="${tool.url}" target="_blank">${escapeHtml(tool.name)}</a>
      ${tool.category ? `<span class="category-badge">${escapeHtml(tool.category)}</span>` : ''}
    </div>
  `).join('');
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

document.getElementById('categoryFilter').addEventListener('change', (e) => {
  renderBookmarks(e.target.value);
});

loadTools();