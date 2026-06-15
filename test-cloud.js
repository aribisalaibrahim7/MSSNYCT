require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function test() {
  try {
    const result = await cloudinary.api.resources({ max_results: 10 });
    console.log("All recent resources:");
    result.resources.forEach(r => console.log(r.public_id, r.resource_type));
    
    console.log("\nFolders in root:");
    const rootFolders = await cloudinary.api.root_folders();
    for (const f of rootFolders.folders) {
      console.log("- " + f.path);
      const sub = await cloudinary.api.sub_folders(f.path);
      for (const sf of sub.folders) {
        console.log("  - " + sf.path);
        try {
          const subsub = await cloudinary.api.sub_folders(sf.path);
          for (const ssf of subsub.folders) {
            console.log("    - " + ssf.path);
          }
        } catch(e) {}
      }
    }

  } catch (err) {
    console.error(err);
  }
}

test();
