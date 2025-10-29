// import { v2 as cloudinary } from 'cloudinary';

// export const config = {
//     api: { bodyParser: false },
// };

// // Cloudinary config
// cloudinary.config({
//     cloud_name: 'dvm4h2d2h',
//     api_key: '395968122253792',
//     api_secret: 'GHYbpPIPjc8KNi9LtGvhhTaR-5o',
// });

// export async function POST(req) {
//     try {
//         const url = new URL(req.url);
//         const paths = url.pathname.split('/').filter(Boolean);
//         const folderName = paths[2] || 'default'; // folder name API route se

//         const data = await req.formData();
//         const file = data.get('file');

//         if (!file) {
//             return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
//         }

//         // Convert file to buffer
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         // Upload to Cloudinary
//         const uploadResult = await cloudinary.uploader.upload_stream(
//             {
//                 folder: folderName,
//                 resource_type: 'auto', // image, video, etc.
//             },
//             (error, result) => {
//                 if (error) throw error;
//                 return result;
//             }
//         );
//         const uniqueFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//         // Using a promise wrapper for stream
//         const streamUpload = (buffer) => {
//             return new Promise((resolve, reject) => {
//                 const stream = cloudinary.uploader.upload_stream(
//                     { folder: folderName, resource_type: 'auto', public_id: uniqueFilename, },
//                     (error, result) => {
//                         if (result) resolve(result);
//                         else reject(error);
//                     }
//                 );
//                 stream.end(buffer);
//             });
//         };

//         const result = await streamUpload(buffer);

//         return new Response(JSON.stringify({ message: 'File uploaded successfully', url: result.secure_url }), { status: 200 });
//     } catch (err) {
//         return new Response(JSON.stringify({ message: 'Upload failed', error: err.message }), { status: 500 });
//     }
// }


// // app/api/upload/route.js
// import fs from "fs";
// import path from "path";

// export const config = { api: { bodyParser: false } };

// export async function POST(req) {
//     try {
//         const formData = await req.formData();
//         const files = formData.getAll("image");
//         const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
//         if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//         const imageUrls = [];

//         for (const file of files) {
//             // file is of type File (Web API)
//             const arrayBuffer = await file.arrayBuffer();
//             const buffer = Buffer.from(arrayBuffer);
//             const fileName = `${Date.now()}-${file.name}`;
//             const filePath = path.join(uploadDir, fileName);
//             fs.writeFileSync(filePath, buffer);
//             imageUrls.push(`/uploads/products/${fileName}`);
//         }

//         return new Response(JSON.stringify({ urls: imageUrls.length === 1 ? imageUrls[0] : imageUrls }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (err) {
//         console.error("Upload error:", err);
//         return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
//     }
// }

import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: { sizeLimit: "200mb" } } };


export async function POST(req) {
    try {
        const formData = await req.formData();
        // console.log("formData", formData)
        // Accept both 'image' and 'video' keys
        const files = formData.getAll("image").length
            ? formData.getAll("image")
            : formData.getAll("video");
        // console.log("Number of files:", files.length);
        if (!files.length) throw new Error("No file uploaded");

        const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const urls = [];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, buffer);
            urls.push(`/uploads/products/${fileName}`);
        }

        return new Response(
            JSON.stringify({ urls: urls.length === 1 ? urls[0] : urls }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Upload error:", err);
        return new Response(
            JSON.stringify({ message: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}




