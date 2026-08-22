const fs = require('fs');
async function run() {
    const { renderPageAsImage } = await import('unpdf');
    // We don't have a PDF, let's just make a simple 1-page PDF using pdf-lib if available or just check what error it gives with invalid data.
    // Actually we just need to see if @napi-rs/canvas works.
    try {
        const c = await import('@napi-rs/canvas');
        console.log("Canvas loaded!", c.createCanvas);
    } catch(e) {
        console.error("Canvas error:", e);
    }
}
run();
