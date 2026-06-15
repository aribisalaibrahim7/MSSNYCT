"use client";

import Navbar from "@/components/layout/Navbar";
import { Image as ImageIcon, Camera, Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/gallery");
        setImages(res.data);
      } catch (err) {
        console.error("Failed to fetch gallery");
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-4">Branch Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A visual journey through the activities, milestones, and people of MSSN Yabatech.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
             <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
             <p className="text-muted-foreground font-medium italic">Fetching latest memories...</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((item, index) => (
              <div key={index} className="break-inside-avoid relative group rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex flex-col justify-end p-6">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                      {item.id.split('/').pop().replace(/-/g, ' ')}
                    </span>
                    <h3 className="text-white text-xl font-bold">MSSN Yabatech Activity</h3>
                    <div className="flex gap-4 mt-4 text-white/80">
                      <Heart size={18} className="hover:text-red-500 transition-colors" />
                      <Camera size={18} className="hover:text-primary transition-colors" />
                    </div>
                </div>
                
                <img 
                  src={item.url} 
                  alt="Gallery Image"
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <ImageIcon className="text-white" size={20} />
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full text-center py-24 border-2 border-dashed border-border rounded-[3rem]">
                 <ImageIcon className="mx-auto w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                 <p className="text-muted-foreground">No images found in the gallery yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
