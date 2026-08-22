const fs = require('fs');
async function run() {
    try {
        const formData = new FormData();
        // create a dummy PDF buffer that has no text layer to trigger the OCR route
        // or just use a small image and name it .pdf? No, unpdf will reject a non-pdf.
        // We can create a simple PDF with pdf-lib.
    } catch(e) {}
}
