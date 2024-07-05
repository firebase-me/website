const approvedFiles = ['md'];

function goto(dest, stub = false) {
    if (window.location.hostname === 'localhost') {
        if (dest == '/' || dest == 'home')
            dest = 'index.html'
    }
    

    let loc = dest.startsWith('pages/') ? dest.match(/pages\/(.+)\.md/)[1] : dest
    if (!loc.startsWith('/')) {
        loc = '/' + loc;
    } if (loc.endsWith('/')) {
        loc = loc.slice(0, -1);
    }
    // this triggers redirect to load the page content
    console.log("GOTO:", loc,)
    if (window.location.origin.includes('localhost')) {
        console.error("GOTO", "LOCALHOST", loc);
        // Ensure the loc does not start with a slash
        const newLoc = loc.startsWith('/') ? loc.substring(1) : loc;
        // Update the URL using replaceState for localhost
        history.replaceState(null, '', `${window.location.origin}/index.html?path=${newLoc}`);
    } else {
        // Update the URL using pushState for production
        history.pushState(null, '', `${window.location.origin}${loc}`);
    }
    
    const source = findSource(dest)
    const cat = findCategory(source)
    console.log("GOTO2", source, cat)
    current = source;
    loadContent(source);
    highlightNavPath();
}


// Function to get query parameters from the URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queryArray = queryString.split('&');
    queryArray.forEach(query => {
        const [key, value] = query.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}

// Function to generate categories for header buttons
function generateCategories(data) {
    const headerButtons = document.getElementById('category-list');
    headerButtons.innerHTML = ''; // Clear existing buttons
    for (const item of data) {
        console.log("GEN CAT", category, item)
        const button = document.createElement('button');
        button.textContent = item.name;
        button.addEventListener('click', () => {
            switchCategory(item.children, item.name);
        });
        headerButtons.appendChild(button);
        if (category == null) {
            category = item.name;
        }
        if (category == item.name) {
            switchCategory(item.children, item.name);
        }
    }
}

// Function to switch the content in the navbar based on the selected header tab
function switchCategory(data, source) {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = ''; // Clear existing content
    generateNavbar(data, navbar);
    console.log("CHANGING CATEGORY", category, source, current)
    highlightNavPath()
    // if (typeof current === 'string' && category == source) {
    // highlightNavPath()
    // }
}

// Function to generate the navbar HTML based on JSON data
function generateNavbar(data, parentElement, depth = 0) {
    // Limit the depth to prevent infinite recursion
    if (depth > 20) {
        console.warn('Maximum depth exceeded', data);
        return;
    }
    for (const item of data) {
        if (item.type === "category" || item.type === "dir") {
            const btn = document.createElement("button");
            btn.className = `dropdown-btn ${item.children.length ? 'has-children' : 'no-children'} non-selectable`;
            btn.textContent = sanitizeName(item.name);
            btn.style.paddingLeft = `${16 + depth * 12}px`;
            btn.setAttribute('data-path', item.path); // Add data-path attribute

            if (item.children.length) {
                btn.addEventListener("click", function () {
                    this.classList.toggle("open");
                    const dropdownContent = this.nextElementSibling;
                    if (dropdownContent) {
                        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
                    }
                });

                const dropdownContainer = document.createElement("div");
                dropdownContainer.className = "dropdown-container";
                parentElement.appendChild(btn);
                parentElement.appendChild(dropdownContainer);
                generateNavbar(item.children, dropdownContainer, depth + 1);
            } else {
                parentElement.appendChild(btn);
            }
        } else if (item.type === "file") {
            const fileExtension = item.name.split('.').pop();
            if (approvedFiles.includes(fileExtension)) {
                const link = document.createElement("a");
                link.textContent = sanitizeName(item.name);
                link.className = 'file-link non-selectable';
                link.style.paddingLeft = `${16 + depth * 12}px`;
                link.setAttribute('data-path', item.path); // Add data-path attribute
                link.addEventListener("click", function () {
                    console.log("ITEM CLICK", item.path);
                    current = item.path
                    goto(item.path)
                    loadContent(this.getAttribute('data-path'))
                });
                parentElement.appendChild(link);
            }
        }
    }
}



function clearNavHighlights() {
    document.querySelectorAll('.selected, .selected-file').forEach(btn => {
        btn.classList.remove('selected', 'selected-file');
    });
}
// Function to initialize the selection based on the query parameter
function highlightNavPath() {
    console.warn("HIGHLIGHT", category, current);
    clearNavHighlights()
    if (!current) return;
    if (!category) return;
    // switchCategory(newcat.name)
    // history.replaceState(null, 'Firebase Me: ' + paths[paths.length - 1], '/' + paths.join('/'))


    // find target button and iterate through parents
    const target = findNavButtonByPath(current)

    console.log("HIGHLIGHT NAV TARGET", target, 'category', category, 'current', current)

    if (target) {
        target.classList.add('selected', 'selected-file');
        let parent = target.parentElement;
        while (parent && parent.classList.contains('dropdown-container')) {
            const siblingButton = parent.previousElementSibling;
            if (siblingButton) {
                siblingButton.classList.add('selected', 'open');
            }
            parent.style.display = "block";
            parent = parent.parentElement;
        }
    }
    // trigger content
    console.log("NAV current")
    loadContent(current)
        .finally(() => console.log("rehydrated and loaded document"));

}

// Function to find a button with a specific data-path in the navbar
function findNavButtonByPath(path) {
    if (path.startsWith('/'))
        path = path.slice(1)
    const navButtons = document.querySelectorAll('#navbar button, #navbar a');
    for (const button of navButtons) {
        if (button.getAttribute('data-path') === path) {
            return button;
        }
    }
    return null; // Return null if no button with the matching data-path is found
}

// Function to generate random crumbs for crumbtray


// Toggle the visibility of the sidebar on mobile
function toggleNav() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Handle active crumb highlighting
function highlightActiveCrumb(button) {
    const allCrumbs = document.querySelectorAll('.crumbs button');
    for (const crumb of allCrumbs) {
        crumb.classList.remove('active');
    }
    button.classList.add('active');
}
function generateCrumbs(newCrumbs) {
    const crumbs = document.getElementById('crumbtray');
    crumbs.innerHTML = ''; // Clear existing items

    if (!newCrumbs || newCrumbs.length === 0) {
        crumbs.classList.remove('has-content');
        return;
    }

    crumbs.classList.add('has-content');

    for (const crumb of newCrumbs) {
        const button = document.createElement('button');
        button.textContent = crumb.label;
        button.addEventListener('click', function () {
            document.querySelectorAll('#crumbtray button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(crumb.crumbId).scrollIntoView({ behavior: 'smooth' });
        });
        crumbs.appendChild(button);
    }

}