
const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
    {
        name: 'mural.webp',
        url: 'https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fpalmoticeva-cekaonica-mural.webp?alt=media&token=2f09537c-148e-419b-aeb7-e8b5030ead23'
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
