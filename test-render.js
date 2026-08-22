const fs = require('fs');
async function run() {
    try {
        const { renderPageAsImage } = await import('unpdf');
        const buffer = fs.readFileSync('package.json');
        await renderPageAsImage(new Uint8Array(buffer), 1, {
            canvasImport: () => import('@napi-rs/canvas')
        });
    } catch(e) {
        console.error("ERROR:", e);
    }
}
run();
