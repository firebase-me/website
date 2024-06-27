let currentLanguage = 'js'; // Default language

const languages = [
    'js', 'swift', 'kotlin', 'java', 'ts', 'node', 
    'dart', 'cpp', 'unity', 'restapi', 'objc', 'go', 
    'php', 'python', 'ruby'
];

function unpackLanguage(input) {
    switch (input) {
        case 'js':
            return "JavaScript";
        case 'swift':
            return "Swift";
        case 'kotlin':
            return "Kotlin";
        case 'java':
            return "Java";
        case 'ts':
            return "TypeScript";
        case 'node':
            return "Node.js";
        case 'dart':
            return "Dart";
        case 'cpp':
            return "C++";
        case 'unity':
            return "Unity";
        case 'restapi':
            return "REST API";
        case 'objc':
            return "Objective-C";
        case 'go':
            return "Go";
        case 'php':
            return "PHP";
        case 'python':
            return "Python";
        case 'ruby':
            return "Ruby";
        default:
            return "Missing";
    }
}

async function loadContent(url) {
    console.log("Loading content 1:", url)
    let text = ''
    if (!url.startsWith('http')) url = `${window.location.origin}/${url}`
    console.log("Loading content 2:", url)
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log("Loading content 3 :", "OK")
            text = await response.text();
        } else {
            console.log("Loading content 4:", "ERROR")
            throw new Error('Not found');
        }
    } catch (_error) {
        try {
            console.log("Loading content 55:", "404")
            const response = await fetch('assets/404.md');
            if (response.ok) {
                console.log("Loading content: 6", "OK 404")
                text = await response.text();
            } else {
                console.log("Loading content: 7", "ERROR FATAL")
                throw new Error('Not found');
            }
        } catch (_error) {
            console.log("Loading content:8", "FINAL ERROR")
            text = "# Not Found\n # 404\n _resources not found_";
        }
    }
    renderMarkdown(text, url);
}
function renderMarkdown(input, url, update) {
    // Sanitize content for reader
    console.log("RENDER", url)
    let text = input ? input : '';
    // if (url)
    //     window.history.replaceState(null, 'Firebase Me: ', window.location.origin);

    if (update) {
        // Update the URL without reloading the page
        const relativePath = url.match(/pages\/(.+)\.md/)[1];
        console.log("PATH", relativePath)
        const newUrl = `${window.location.origin}/${relativePath}`;
        // window.history.replaceState(null, '', newUrl);
    }

    const titleContainer = document.getElementById('document-title');
    const container = document.getElementById('content-body');

    // Extract and set the document title, ensuring it's the first # in the document
    const titleMatch = text.match(/^#\s(.+)/m);
    if (titleMatch) {
        titleContainer.textContent = titleMatch[1];
        text = text.replace(titleMatch[0], ''); // Remove the title line from the content
    } else {
        titleContainer.textContent = 'Document';
    }

    // Process the markdown content
    const lines = text.split('\n');
    const finalText = [];
    let inGroup = false;
    let groupType = '';
    let groupContent = '';

    lines.forEach(line => {
        if (line.startsWith('{{group:')) {
            inGroup = true;
            groupType = line.match(/{{group:(\w+)}}/)[1];
            groupContent = '';
        } else if (line.trim() === '{{endgroup}}') {
            inGroup = false;
            finalText.push(renderGroup(groupContent, groupType));
        } else if (inGroup) {
            groupContent += line + '\n';
        } else {
            finalText.push(line);
        }
    });

    container.innerHTML = marked.parse(finalText.join('\n'));

    // Ensure default images are not centered
    container.querySelectorAll('img').forEach(img => {
        const parent = img.parentElement;
        if (parent.tagName !== 'P') {
            const p = document.createElement('p');
            parent.insertBefore(p, img);
            p.appendChild(img);
        }
    });

    // FIND Crumbs from custom anchors
    console.log("ADDING CRUMBS")
    const tocContainer = document.querySelector('.crumbs');
    const crumbRegex = /{{crumb:([^}]+)}}/g;
    const crumbs = [];

    let match;

    while ((match = crumbRegex.exec(text)) !== null) {
        const label = match[1].trim();
        const crumbId = label.toLowerCase().replace(/\s+/g, '-');
        crumbs.push({ label, crumbId, match: match[0] });
    }
    generateCrumbs(crumbs);
    for (const crumb of crumbs) {
        const anchorElement = document.createElement('a');
        anchorElement.id = crumb.crumbId;
        container.innerHTML = container.innerHTML.replace(crumb.match, anchorElement.outerHTML);
    }

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });

    // Initialize code group visibility
    document.querySelectorAll('.code-group').forEach(group => {
        const selector = group.querySelector('.language-selector');
        selector.value = currentLanguage; // Set the current global language
        selector.addEventListener('change', function () {
            currentLanguage = this.value; // Update the global language
            updateCodeGroupVisibility();
        });
        updateCodeGroupVisibility();
    });

    // Add click event for carousel images
    document.querySelectorAll('.carousel img').forEach(img => {
        img.addEventListener('click', function () {
            if (img.classList.contains('pop-out')) {
                img.classList.remove('pop-out');
            } else {
                document.querySelectorAll('.carousel img').forEach(otherImg => {
                    otherImg.classList.remove('pop-out');
                });
                img.classList.add('pop-out');
            }
        });
    });
}

function renderGroup(content, type) {
    if (type === 'code') {
        return renderCodeGroup(content);
    } else if (type === 'center') {
        return `<div class="centered-content">${marked.parse(content)}</div>`;
    } else if (type === 'carousel') {
        return renderCarousel(content);
    }
    return marked.parse(content);
}

function renderCarousel(content) {
    const lines = content.split('\n');
    let result = '<div class="centered-content"><div class="carousel">';
    lines.forEach(line => {
        if (line.startsWith('![')) {
            result += marked.parse(line).replace('<p>', '').replace('</p>', '') + '\n';
        } else {
            result += '</div>\n' + marked.parse(line) + '\n<div class="carousel">';
        }
    });

    result += '</div></div>';
    return result;
}

function renderCodeGroup(groupContent) {
    const languages = ['js', 'node', 'python'];
    const languageOptions = languages.map(lang => `<option value="${lang}">${lang.toUpperCase()}</option>`).join('');
    let result = `<div class="code-group">
    <h4 class="inline">Language</h4>
    <select class="language-selector">${languageOptions}</select>\n`;

    languages.forEach(lang => {
        const regex = new RegExp(`^\\s*\\\`\\\`\\\`${lang}([\\s\\S]*?)\\\`\\\`\\\``, 'm');
        const match = groupContent.match(regex);
        if (match) {
            result += `<pre><code class="language-${lang}">${match[1].trim()}</code></pre>\n`;
        }
    });

    result += `<div class="language-warning" style="display: none;"></div></div>`;
    return result;
}
function renderCodeGroup(groupContent) {
    const allLanguages = ['js', 'node', 'python'];
    let availableLanguages = [];
    const codeBlocks = {};

    // Create the main code group container
    const codeGroupDiv = document.createElement('div');
    codeGroupDiv.className = 'code-group';

    // Create the header
    const header = document.createElement('h4');
    header.className = 'inline';
    header.textContent = 'Code';
    codeGroupDiv.appendChild(header);

    // Create the select dropdown
    const select = document.createElement('select');
    select.className = 'language-selector';
    codeGroupDiv.appendChild(select);

    // Iterate through all languages to find available ones
    allLanguages.forEach(lang => {
        const regex = new RegExp(`^\\s*\\\`\\\`\\\`${lang}([\\s\\S]*?)\\\`\\\`\\\``, 'm');
        const match = groupContent.match(regex);
        if (match) {
            availableLanguages.push(lang);
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${lang}`;
            code.textContent = match[1].trim();
            pre.appendChild(code);
            codeBlocks[lang] = pre;
        }
    });

    // Provide a fallback if no languages are available
    if (availableLanguages.length === 0) {
        availableLanguages = ['none'];
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = 'language-none';
        code.textContent = 'No content available';
        pre.appendChild(code);
        codeBlocks['none'] = pre;
    }

    // Create the select dropdown with available languages only
    const availableLanguageOptions = availableLanguages.map(lang => `<option value="${lang}">${lang.toUpperCase()}</option>`).join('');
    select.innerHTML = availableLanguageOptions;

    // Append the code blocks last
    Object.keys(codeBlocks).forEach(lang => {
        codeGroupDiv.appendChild(codeBlocks[lang]);
    });

    // Add warning div
    const warningDiv = document.createElement('div');
    warningDiv.className = 'language-warning';
    warningDiv.style.display = 'none';
    codeGroupDiv.appendChild(warningDiv);

    return codeGroupDiv.outerHTML;
}

function updateCodeGroupVisibility() {
    document.querySelectorAll('.code-group').forEach(group => {
        const codeBlocks = group.querySelectorAll('pre');
        let languageFound = false;

        codeBlocks.forEach(block => {
            const code = block.querySelector('code');
            if (code.className.includes(`language-${currentLanguage}`)) {
                block.style.display = 'block';
                languageFound = true;
                hljs.highlightElement(code); // Highlight the visible code block
            } else {
                block.style.display = 'none';
            }
        });

        const warning = group.querySelector('.language-warning');
        if (languageFound) {
            warning.style.display = 'none';
        } else {
            warning.style.display = 'block';
            warning.textContent = `${currentLanguage.toUpperCase()} does not support this feature.`;
        }

        const header = group.querySelector('h4.inline');
        if (header) {
            header.textContent = "Code: " + unpackLanguage(currentLanguage);
        }
    });

    document.querySelectorAll('.language-selector').forEach(selector => {
        selector.value = currentLanguage;
    });
}

// Add event listeners to all language selectors
function addLanguageChangeListeners() {
    document.querySelectorAll('.language-selector').forEach(selector => {
        selector.addEventListener('change', (event) => {
            currentLanguage = event.target.value;
            updateCodeGroupVisibility();
        });
    });
}