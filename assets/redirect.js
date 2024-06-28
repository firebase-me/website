// // Redirect is for updating the content based on the url
// // for a page load we check if there is a path redirect (?path=value)
// // when the url location changes, we repeat the process for the new path
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
        generateCategories(data);

        goto(target)

    })
    .catch(error => console.error('Error loading JSON:', error));
