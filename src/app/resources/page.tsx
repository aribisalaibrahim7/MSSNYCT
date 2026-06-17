"use client";

import Navbar from "@/components/layout/Navbar";
import { Search, Download, FileText, Music, Video, BookOpen, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const categories = ["All", "Past Questions", "Textbooks", "Lectures", "Newsletters"];

export default function ResourceVaultPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("/api/resources");
        // Guard: only set if the response is an array, not an error object
        const data = res.data;
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          console.error("Resources API returned non-array:", data);
        }
      } catch (err) {
        console.error("Failed to fetch resources");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter((res) => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-4">Resource Vault</h1>
            <p className="text-muted-foreground text-lg">
              A comprehensive library of academic and spiritual materials available 24/7.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-border px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-slate-900 border border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, index) => {
            const Icon = res.type === "PDF" ? FileText : res.type === "Audio" ? Music : res.type === "Video" ? Video : BookOpen;
            return (
              <div key={index} className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-border hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon size={28} />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {res.type}
                  </div>
                </div>
                
                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{res.category} • {res.size || "Unknown Size"}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Download size={14} />
                    {res.downloads || 0} downloads
                  </div>
                  <a 
                    href={res.fileUrl} 
                    target="_blank"
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                  >
                    Download
                    <Download size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}
