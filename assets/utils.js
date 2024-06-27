// Function to format file names
function sanitizeName(input) {
    const baseName = input.replace(/\.(md)$/i, '');
    // const baseName = input.replace(/\.(html|md|js|yaml|yml|json)$/i, '');// 
    const withSpaces = baseName.replace(/[_-]/g, ' ');

    // List of filler words to exclude from capitalization
    const fillerWords = ['in', 'of', 'the', 'and', 'a', 'to', 'for', 'with'];

    const words = withSpaces.split(' ');
    const formattedWords = words.map((word, index) => {
        if (index === 0 || !fillerWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
    });
    return formattedWords.join(' ');
}

function getQueryParams(item) {
    const params = new URLSearchParams(window.location.search);
    const path = params.get(item);
    return path;
}

function findCategory(path) {
    if (path.startsWith('/')) path = path.slice(1);
    const values = path.split('/')

    let cat = jsonData.find(i => i.name === (values[0] ? values[0] : values[1]))
    console.log('FIND CAT', path, cat, values)
    return cat;
}

function findSource(path) {
    if (path && path.endsWith('.md')) return path;
    if (path.startsWith('/')) path = path.slice(1);

    let source;
    switch (path) {
        case 'privacy': source = '/assets/privacy.md'; break;
        case 'contact': source = '/assets/contact.md'; break;
        case '404.html':
        case '404': source = '/assets/404.md'; break;
        case 'markdown': source = '/assets/markdown.md'; break;
        case '':
        case 'home':
        case 'index.html':
        case null: source = '/assets/welcome.md'; break;
        default: source = `/pages/${path}.md`; break;
    }

    if (!source) throw new Error("No source found for path: " + path);
    return source.replace('//', '/');
}