
function findCategory(path) {
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