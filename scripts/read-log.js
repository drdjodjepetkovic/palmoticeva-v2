
const fs = require('fs');

function processContent(content) {
    const lines = content.split('\n');
    const keywords = ['djordje', 'slobodanka', 'logo', 'ordinacija'];
    const found = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (keywords.some(k => line.toLowerCase().includes(k))) {
            found.push(line.trim());
            // Print next line if it contains URL
            if (i + 1 < lines.length && lines[i + 1].includes('URL:')) {
                found.push(lines[i + 1].trim());
            }
        }
    }
    fs.writeFileSync('filtered_urls.txt', found.join('\n'), 'utf8');
    console.log('Wrote ' + found.length + ' lines to filtered_urls.txt');
}

try {
    // Try reading as UTF-16LE (default for PowerShell >)
    let content = fs.readFileSync('storage_files.txt', 'utf16le');
    processContent(content);
} catch (e) {
    console.error("Error reading file:", e);
    // Fallback to utf8
    try {
        let content = fs.readFileSync('storage_files.txt', 'utf8');
        processContent(content);
    } catch (e2) {
        console.error("Error reading file as utf8:", e2);
    }
}
