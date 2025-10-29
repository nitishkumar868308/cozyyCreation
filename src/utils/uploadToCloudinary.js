export async function uploadToCloudinary(files, folderName = 'default') {
    if (!files) throw new Error('No files provided');

    const fileArray = Array.isArray(files) ? files : [files]; // ensure iterable

    const uploadedUrls = [];

    for (const file of fileArray) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Upload failed');
        uploadedUrls.push(data.url);
    }
    console.log("uploadedUrls", uploadedUrls)
    return uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls; // return single URL if one file
}
