const { createWorker } = require('tesseract.js');
const path = require('path');

async function test() {
  try {
    const worker = await createWorker('eng', 1, {
      langPath: process.cwd(),
      logger: m => console.log(m.status)
    });
    console.log("Worker created successfully");
    await worker.terminate();
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
