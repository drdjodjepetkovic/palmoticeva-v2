
const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
    {
        name: 'logo.svg',
        url: 'https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2FPalmoticevaLogobezsenki.svg?alt=media&token=5ab51b5a-56e1-46fe-ad25-102301921525'
    },
    {
        name: 'djordje.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fdjordje.png?alt=media&token=434e8bc5-bc35-4441-9a70-70857362c5f6'
    },
    {
        name: 'boba.webp',
        url: 'https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fboba.webp?alt=media&token=06a53980-252c-4e4d-b6f7-9fadc327a12a'
    }
];

const downloadDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

assets.forEach(asset => {
    const file = fs.createWriteStream(path.join(downloadDir, asset.name));
    https.get(asset.url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(() => console.log(`Downloaded ${asset.name}`));
        });
    }).on('error', function (err) {
        fs.unlink(path.join(downloadDir, asset.name));
        console.error(`Error downloading ${asset.name}: ${err.message}`);
    });
});
