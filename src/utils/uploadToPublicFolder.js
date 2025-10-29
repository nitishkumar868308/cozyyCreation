// // utils/uploadLocal.js
// import fs from "fs";
// import path from "path";

// /**
//  * Save a single file to the public folder and return its URL.
//  * @param {File} file - File from input
//  * @param {string} folderName - folder inside /public/uploads
//  * @returns {string} - URL to use in frontend / DB
//  */
// export async function saveFileToPublic(file, folderName = "products") {
//     if (!file) throw new Error("No file provided");

//     const uploadDir = path.join(process.cwd(), "public", "uploads", folderName);

//     if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const fileName = `${Date.now()}-${file.name || file.originalFilename}`;
//     const filePath = path.join(uploadDir, fileName);

//     // If file is a buffer (from FormData in Node) or path
//     if (file.arrayBuffer) {
//         const buffer = Buffer.from(await file.arrayBuffer());
//         fs.writeFileSync(filePath, buffer);
//     } else if (file.filepath) {
//         // For formidable File object
//         fs.renameSync(file.filepath, filePath);
//     } else if (file.buffer) {
//         fs.writeFileSync(filePath, file.buffer);
//     } else {
//         throw new Error("Unsupported file format");
//     }

//     return `/uploads/${folderName}/${fileName}`;
// }
