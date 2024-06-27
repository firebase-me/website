// // Redirect is for updating the content based on the url
// // for a page load we check if there is a path redirect (?path=value)
// // when the url location changes, we repeat the process for the new path


// Fetch the JSON data and initialize the navbar and header
fetch('/structure.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;

        // Initialize selection based on URL query parameter
        const params = getQueryParams('path');
        const target = params.path ? params.path : "home";
        const cat = findCategory(target)
        current = findSource(target);
        category = cat ? cat.name : jsonData[0].name;
        generateCategories(data, category);
        
        goto(target)

        // // handle in the case of 404 redirects
        // console.log("REDIRECT4", category, current)

        // highlightNavPath();


    })
    .catch(error => console.error('Error loading JSON:', error));

// function getSource(path) {
//     if (path && path.startsWith('/'))
//         path = path.slice(1);
//     console.log("GET SOURCE", path)

//     let source;
//     switch (path) {
//         case 'privacy': source = 'assets/privacy.md'; break;
//         case 'contact': source = 'assets/contact.md'; break;
//         case '404': source = 'assets/404.md'; break;
//         case 'markdown': source = 'assets/markdown.md'; break;
//         case '':
//         case 'home':
//         case 'index.html':
//         case null: source = 'assets/welcome.md'; break;
//         default:
//             source = `pages/${path}.md`
//             break;
//     }
//     if (!source) throw new Error("No source found for path: " + path);
//     return source.replace('//', '/');
// }
// document.addEventListener("DOMContentLoaded", function () {
//     function loadContent(input) {
//         const source = getSource(input)
//         const target = `${window.location.origin}/${source}`;
//         console.log("source url:", source)
//         // console.log("current location:", current)
//         console.log("current target:", target)

//         history.replaceState(null, '', input);
//         fetch(target)
//             .then(response => {
//                 if (!response.ok) throw new Error('Content not found');
//                 return response.text();
//             })
//             .then(text => {
//                 renderMarkdown(text, source);
//             })
//             .catch(error => {
//                 console.error('Error loading content:', error);
//                 fetch(getSource("404"))
//                     .then(response => response.text())
//                     .then(text => {
//                         renderMarkdown(text, 'assets/404.md');
//                     })
//                     .catch(error => renderMarkdown("# FATAL 404 ERROR\n > Something went wrong.\n" + JSON.stringify(err)))
//             });
//     }
//     // Handle browser navigation events
//     window.addEventListener('popstate', function (state) {
//         // console.info("POPSTATE", state)
//         loadContent(window.location.pathname);
//     });

//     // Initial load
//     let restore = getQueryParams('path');
//     loadContent(restore ? restore : window.location.pathname);

// });
