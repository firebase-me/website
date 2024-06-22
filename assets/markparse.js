let currentLanguage = 'js'; // Default language

function renderMarkdown(text, url) {
    const container = document.getElementById('markdown-content');
    const titleContainer = document.getElementById('document-title');

    // Extract and set the document title
    const titleMatch = text.match(/^#\s(.+)/m);
    if (titleMatch) {
        titleContainer.textContent = titleMatch[1];
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

    // Generate TOC from custom anchors
    const tocContainer = document.querySelector('.toc');
    tocContainer.innerHTML = '';
    const anchorRegex = /{{anchor:([^}]+)}}/g;
    let match;
    while ((match = anchorRegex.exec(text)) !== null) {
        const label = match[1].trim();
        const anchorId = label.toLowerCase().replace(/\s+/g, '-');
        const anchorLink = document.createElement('a');
        anchorLink.href = `#${anchorId}`;
        anchorLink.textContent = label;
        anchorLink.addEventListener('click', function () {
            document.querySelectorAll('.toc li a').forEach(a => a.classList.remove('active'));
            anchorLink.classList.add('active');
        });
        const listItem = document.createElement('li');
        listItem.appendChild(anchorLink);
        tocContainer.appendChild(listItem);

        const anchorElement = document.createElement('a');
        anchorElement.id = anchorId;
        container.innerHTML = container.innerHTML.replace(match[0], anchorElement.outerHTML);
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
        return `<div class="center-images">${marked.parse(content)}</div>`;
    } else if (type === 'carousel') {
        return `<div class="carousel">${marked.parse(content)}</div>`;
    }
    return content;
}

function renderCodeGroup(groupContent) {
    const languages = ['js', 'node', 'python'];
    const languageOptions = languages.map(lang => `<option value="${lang}">${lang.toUpperCase()}</option>`).join('');
    let result = `<div class="code-group"><select class="language-selector">${languageOptions}</select>\n`;

    languages.forEach(lang => {
        const regex = new RegExp(`^\\s*\\\`\\\`\\\`${lang}([\\s\\S]*?)\\\`\\\`\\\``, 'm');
        const match = groupContent.match(regex);
        if (match) {
            result += `<pre><code class="language-${lang}" style="display: none;">${match[1].trim()}</code></pre>\n`;
        }
    });

    result += `<div class="language-warning" style="display: none;"></div></div>`;
    return result;
}

function updateCodeGroupVisibility() {
    document.querySelectorAll('.code-group').forEach(group => {
        const codeBlocks = group.querySelectorAll('pre code');
        let languageFound = false;

        codeBlocks.forEach(block => {
            if (block.className.includes(`language-${currentLanguage}`)) {
                block.style.display = 'block';
                languageFound = true;
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
    });

    document.querySelectorAll('.language-selector').forEach(selector => {
        selector.value = currentLanguage;
    });
}