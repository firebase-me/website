# Generate Data

## JSON Input
We support several generated parameters (and comments)

> **$number(N)**
> N = 5 generates a 5 digit length number
> N = 10-100 - generates number in range between 10 to 100
> empty/default = 0

> **$string(N)**
> N = string character length in A-Za-z format
> empty/default = ""

> **$bool(N)**
> N = percentage chance of being false or true
> 0 = false
> 100 = true
> empty/default = false

<textarea id="json-input" placeholder="Enter JSON object here" rows="10" cols="50">{
    "id": "$number(5)",
    "name": "$string(10)",
    "age": "$number(20-50)",
    "isActive": "$bool(70)",
    "address": {
        "street": "$string(15)",
        "number": "$number(3)",
        "zip": "$number(5)"
    },
    "tags": [
        "$string(8)",
        "$string(6)",
        "$string(12)"
    ],
    "metadata": {
        "createdAt": "$number(13)",  // Example timestamp in milliseconds
        "updatedAt": "$number(13)"
    },
    "preferences": {
        "newsletter": "$bool(50)",
        "notifications": "$bool(30)"
    }
}</textarea>

## Count
<input type="number" id="object-count" placeholder="Enter count" min="1" value="1">

<button id="generate-button" class="button-styled">Generate Data</button>

## Generated Output
<div id="output-container" style="font-size: small;">
    <pre class="code-output limited-height"></pre>
    <button id="copy-button" class="button-styled">Copy</button>
    <button id="download-button" class="button-styled">Download</button>
</div>


<script>
    function showNotification(message, color) {
        const notificationsContainer = document.getElementById('notifications-container');
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
    }

    function stripJsonComments(jsonString) {
        return jsonString.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    }

    function generateData() {
        const jsonInput = document.querySelector('textarea#json-input').value;
        const count = document.getElementById('object-count').value;
        let parsedData;

        try {
            const strippedJson = stripJsonComments(jsonInput);
            parsedData = JSON.parse(strippedJson);
        } catch (error) {
            showNotification('Invalid JSON input', 'red');
            return;
        }

        const generatedData = [];
        for (let i = 0; i < count; i++) {
            generatedData.push(processObject(parsedData));
        }

        const output = JSON.stringify(generatedData, null, 2);
        const outputContainer = document.getElementById('output-container');
        const outputElement = outputContainer.querySelector('pre.code-output');
        outputElement.textContent = output;
        console.log('Output Element:', outputElement);
        console.log('Generated Output:', output);
    }

    function processObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => processObject(item));
        } else if (typeof obj === 'object' && obj !== null) {
            const result = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = processValue(obj[key]);
                }
            }
            return result;
        } else {
            return obj;
        }
    }

    function processValue(value) {
        if (typeof value === 'string') {
            const numberMatch = value.match(/^\$number\(([^)]*)\)$/);
            const boolMatch = value.match(/^\$bool\(([^)]*)\)$/);
            const stringMatch = value.match(/^\$string\(([^)]*)\)$/);

            if (numberMatch) {
                return generateNumber(numberMatch[1]);
            } else if (boolMatch) {
                return generateBool(boolMatch[1]);
            } else if (stringMatch) {
                return generateString(stringMatch[1]);
            }
        } else if (Array.isArray(value)) {
            return value.map(item => processValue(item));
        } else if (typeof value === 'object' && value !== null) {
            return processObject(value);
        }
        return value;
    }

    function generateNumber(params) {
        if (params.includes('-')) {
            const [min, max] = params.split('-').map(Number);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else if (params.length > 0) {
            return Math.floor(Math.random() * Math.pow(10, params.length));
        } else {
            return 0;
        }
    }

    function generateBool(params) {
        const probability = Number(params);
        return Math.random() * 100 < probability;
    }

    function generateString(params) {
        const length = Number(params) || 0;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function copyToClipboard() {
        const outputContainer = document.getElementById('output-container');
        const outputElement = outputContainer.querySelector('pre.code-output').textContent;
        navigator.clipboard.writeText(outputElement).then(() => {
            showNotification('Copied to clipboard', 'blue');
        }, (err) => {
            showNotification('Failed to copy', 'red');
        });
    }

    function downloadOutput() {
        const outputContainer = document.getElementById('output-container');
        const outputElement = outputContainer.querySelector('pre.code-output').textContent;
        const blob = new Blob([outputElement], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    document.getElementById('generate-button').addEventListener('click', generateData);
    document.getElementById('copy-button').addEventListener('click', copyToClipboard);
    document.getElementById('download-button').addEventListener('click', downloadOutput);
</script>