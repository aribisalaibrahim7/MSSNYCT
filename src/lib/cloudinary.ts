import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Fetch all images from Cloudinary, prioritizing the gallery folder but falling back to root.
 */
export async function getGalleryImages(folder: string = '') {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
    });
    
    const uniqueBases = new Set();
    const filtered = result.resources.filter((res: any) => {
      const name = res.public_id.toUpperCase();
      
      // Filter out Cloudinary default sample files
      if (name.includes('SAMPLE')) return false;

      // Filter out document files
      const isDoc = name.includes('DOC') || name.includes('COM') || name.includes('EXAM') || name.includes('NOTE') || name.includes('ENGR') || name.includes('REPORT');
      if (isDoc || (res.folder && res.folder.includes('docs'))) return false;

      // Deduplicate multiple uploads (Cloudinary appends _xxxxxx to duplicates)
      const baseName = name.replace(/_[A-Z0-9]{6}$/, '');
      if (uniqueBases.has(baseName)) return false;
      uniqueBases.add(baseName);

      return true;
    });

    return filtered.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
    }));
  } catch (error) {
    console.error('Cloudinary Fetch Error:', error);
    return [];
  }
}

/**
 * Fetch documents and videos from Cloudinary, parsing them from root if needed.
 */
export async function getCloudinaryResources() {
  try {
    const allResources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
    });

    const videosResult = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 100,
    });

    const formatBytes = (bytes: number) => {
      if (!bytes) return "Unknown Size";
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const docs: any[] = [];
    const uniqueDocBases = new Set();
    
    allResources.resources.forEach((res: any) => {
      const name = res.public_id.toUpperCase();
      
      // Filter out Cloudinary default sample files
      if (name.includes('SAMPLE')) return;

      const isDoc = name.includes('DOC') || name.includes('COM') || name.includes('EXAM') || name.includes('NOTE') || name.includes('ENGR') || name.includes('REPORT') || (res.folder && res.folder.includes('docs'));
      
      if (isDoc) {
        // Deduplicate multiple uploads
        const baseName = name.replace(/_[A-Z0-9]{6}$/, '');
        if (uniqueDocBases.has(baseName)) return;
        uniqueDocBases.add(baseName);

        const forceDownloadUrl = res.secure_url.replace('/upload/', '/upload/fl_attachment/');
        docs.push({
          id: res.public_id,
          title: res.public_id.split('/').pop()?.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\.[^/.]+$/, "").replace(/_[a-zA-Z0-9]{6}$/, "") || "Document",
          category: "Textbooks",
          type: "PDF",
          size: formatBytes(res.bytes),
          fileUrl: forceDownloadUrl,
          downloads: 0,
          createdAt: res.created_at,
        });
      }
    });

    const uniqueVideoBases = new Set();
    const videos = [];
    videosResult.resources.forEach((res: any) => {
      const name = res.public_id.toUpperCase();
      if (name.includes('SAMPLE')) return;

      const baseName = name.replace(/_[A-Z0-9]{6}$/, '');
      if (uniqueVideoBases.has(baseName)) return;
      uniqueVideoBases.add(baseName);

      const forceDownloadUrl = res.secure_url.replace('/upload/', '/upload/fl_attachment/');
      videos.push({
        id: res.public_id,
        title: res.public_id.split('/').pop()?.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\.[^/.]+$/, "").replace(/_[a-zA-Z0-9]{6}$/, "") || "Video",
        category: "Lectures",
        type: "Video",
        size: formatBytes(res.bytes),
        fileUrl: forceDownloadUrl,
        downloads: 0,
        createdAt: res.created_at,
      });
    });

    return [...docs, ...videos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Cloudinary Resources Fetch Error:', error);
    return [];
  }
}
