document.addEventListener('DOMContentLoaded', () => {
    const notificationsContainer = document.getElementById('notifications-container');
    const projectDropdown = document.getElementById('project-dropdown');
    const contentBody = document.getElementById('content-body');
    let settings = [];  // Assuming settings are loaded from somewhere
    let lastPassword = '';  // Assuming the last known password is managed elsewhere

    // Notification function
    const showNotification = (message, color) => {
        const notification = document.createElement('div');
        notification.className = `notification ${color}`;
        notification.innerHTML = `
            <span>${message}</span>
            <span class="close-btn">&times;</span>
        `;

        notificationsContainer.appendChild(notification);

        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            notificationsContainer.removeChild(notification);
        });

        setTimeout(() => {
            if (notificationsContainer.contains(notification)) {
                notificationsContainer.removeChild(notification);
            }
        }, 120000); // 2 minutes
    };

    const loadContent = async (path) => {
        try {
            const response = await fetch(`/assets/tools/${path}.md`);
            const markdownText = await response.text();
            renderMarkdown(markdownText)
            // contentBody.innerHTML = marked(markdownText);
        } catch (e) {
            console.error(e)
            showNotification('Error loading content', 'red');
        }
    };

    window.loadContent = loadContent;

    window.loadProject = () => {
        try {
            const selectedIndex = projectDropdown.value;
            if (selectedIndex) {
                const selectedSetting = settings[selectedIndex];
                if (selectedSetting) {
                    const firebaseConfig = JSON.parse(selectedSetting.credentials);
                    firebase.initializeApp(firebaseConfig);
                    console.log('Firebase project loaded:', selectedSetting);
                    showNotification('Firebase project loaded successfully', 'blue');
                } else {
                    showNotification('Invalid project selection', 'red');
                }
            }
        } catch (e) {
            showNotification('Error loading project', 'red');
        }
    };

    window.deleteProject = async () => {
        try {
            const selectedIndex = projectDropdown.value;
            if (selectedIndex !== null && selectedIndex >= 0) {
                settings.splice(selectedIndex, 1);
                const encrypted = CryptoJS.AES.encrypt(JSON.stringify(settings), lastPassword).toString();
                localStorage.setItem('projectSettings', encrypted);

                populateProjectDropdown();
                showNotification('Project deleted successfully', 'blue');
            } else {
                showNotification('No project selected to delete', 'yellow');
            }
        } catch (e) {
            showNotification('Error deleting project', 'red');
        }
    };

    const populateProjectDropdown = () => {
        projectDropdown.innerHTML = '<option value="" disabled selected>No project selected</option>';
        settings.forEach((setting, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = setting.projectName || `Project ${index + 1}`;
            projectDropdown.appendChild(option);
        });
    };

    const runFirestoreQuery = async () => {
        const collection = document.getElementById('firestore-collection').value;
        if (collection) {
            const db = firebase.firestore();
            try {
                const snapshot = await db.collection(collection).get();
                renderResults(snapshot.docs.map(doc => doc.data()), document.getElementById('firestore-results'));
                showNotification('Firestore query executed successfully', 'blue');
            } catch (e) {
                showNotification('Error executing Firestore query', 'red');
            }
        } else {
            showNotification('Please enter a Firestore collection', 'yellow');
        }
    };

    const runRealtimeQuery = async () => {
        const path = document.getElementById('realtime-db-path').value;
        if (path) {
            const db = firebase.database();
            try {
                const snapshot = await db.ref(path).once('value');
                renderResults([snapshot.val()], document.getElementById('realtime-results'));
                showNotification('Realtime Database query executed successfully', 'blue');
            } catch (e) {
                showNotification('Error executing Realtime Database query', 'red');
            }
        } else {
            showNotification('Please enter a Realtime Database path', 'yellow');
        }
    };

    const renderResults = (data, container) => {
        container.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headers = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                td.addEventListener('click', () => toggleNestedRow(tr, row));
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    };

    const toggleNestedRow = (rowElement, data) => {
        const nestedRow = rowElement.nextElementSibling;
        if (nestedRow && nestedRow.classList.contains('nested-row')) {
            nestedRow.remove();
        } else {
            const nestedRow = document.createElement('tr');
            nestedRow.className = 'nested-row';
            const nestedCell = document.createElement('td');
            nestedCell.colSpan = rowElement.children.length;

            const nestedTableContainer = document.createElement('div');
            nestedTableContainer.className = 'nested-table-container';
            renderNestedData(nestedTableContainer, data);

            nestedCell.appendChild(nestedTableContainer);
            nestedRow.appendChild(nestedCell);
            rowElement.parentNode.insertBefore(nestedRow, rowElement.nextSibling);
        }
    };

    const renderNestedData = (container, data) => {
        if (typeof data === 'object' && data !== null) {
            const nestedTable = document.createElement('table');
            const tbody = document.createElement('tbody');

            Object.keys(data).forEach(key => {
                const tr = document.createElement('tr');
                const keyTd = document.createElement('td');
                keyTd.textContent = key;
                const valueTd = document.createElement('td');
                valueTd.textContent = data[key];
                valueTd.setAttribute('contenteditable', 'true');
                valueTd.addEventListener('blur', () => {
                    data[key] = valueTd.textContent;
                });
                tr.appendChild(keyTd);
                tr.appendChild(valueTd);
                tbody.appendChild(tr);
            });

            nestedTable.appendChild(tbody);
            container.appendChild(nestedTable);
        }
    };

    // Initial call to populate the dropdown if settings are already loaded
    populateProjectDropdown();
});
