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
