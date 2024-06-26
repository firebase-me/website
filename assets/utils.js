// Function to format file names
function sanitizeName(input) {
    // const baseName = input.replace(/\.(md)$/i, '');
    const baseName = input.replace('.md','')//input.replace(/\.(html|md)$/i, '');// |js|yaml|yml|json
    const withSpaces = baseName.replace('_',' ')//(/[_-]/g, ' ');

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
    // Create a URLSearchParams object from the query string
    const params = new URLSearchParams(window.location.search);
    // Get the value of the 'path' query parameter
    const path = params.get(item);
    return path;
}

// // Function to load and parse a JSON file
// async function loadJson(url) {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
// }

// // Function to load and parse a Markdown file
// async function loadURL(url) {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.text();
// }
