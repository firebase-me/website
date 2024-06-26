// Function to show the theme dialog
function showThemeDialog() {
    document.getElementById('theme-dialog').style.display = 'block';
    loadThemes();
}

// Function to change the theme
function changeTheme(asset) {
    const themeLink = document.getElementById('theme-link');
    themeLink.href = asset;
    localStorage.setItem('selectedTheme', asset); // Store the theme in local storage
    closeThemeDialog();
}

// Function to close the theme dialog
function closeThemeDialog() {
    document.getElementById('theme-dialog').style.display = 'none';
}

// Function to load themes from the JSON file and populate the theme dialog
function loadThemes() {
    fetch('/themes.json')
        .then(response => response.json())
        .then(data => {
            const themeList = document.getElementById('theme-list');
            themeList.innerHTML = ''; // Clear existing themes
            data.forEach(theme => {
                const button = document.createElement('button');
                button.textContent = `${theme.name} by ${theme.creator}`;
                button.onclick = () => changeTheme(theme.asset);
                themeList.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading themes:', error));
}

// Function to apply the stored theme on page load
function applyStoredTheme() {
    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
        const themeLink = document.getElementById('theme-link');
        themeLink.href = storedTheme;
    }
}

// Call the applyStoredTheme function on page load
window.addEventListener('DOMContentLoaded', applyStoredTheme);
