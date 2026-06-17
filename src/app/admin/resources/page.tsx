"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, Loader2, Search, FileText } from "lucide-react";
import { useAlert } from "@/components/providers/AlertProvider";

export default function AdminResources() {
  const { showAlert } = useAlert();
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: "",
    category: "Past Questions",
    type: "PDF",
    fileUrl: "",
  });

  const fetchResources = async () => {
    try {
      const res = await axios.get("/api/resources");
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      // In a real app, authorId comes from session
      await axios.post("/api/resources", { ...newResource, authorId: "admin-id" });
      setNewResource({ title: "", category: "Past Questions", type: "PDF", fileUrl: "" });
      setIsAdding(false);
      fetchResources();
      showAlert("Resource Added", "The new resource has been uploaded successfully.", "success");
    } catch (err) {
      showAlert("Operation Failed", "Failed to add the resource. Please verify the file details.", "error");
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`/api/resources/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchResources();
      showAlert("Deleted", "Resource successfully deleted.", "success");
    } catch (err) {
      setConfirmDeleteId(null);
      showAlert("Operation Failed", "Failed to delete resource.", "error");
    }
  };

  return (
    <>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Resource Management</h1>
          <p className="text-muted-foreground">Add, update, or remove academic materials.</p>
        </div>
        <button 
           className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
           <Plus size={20} />
           New Resource
        </button>
      </div>

      {/* Add Form (Simplified for this demo) */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-border">
         <h3 className="text-xl font-bold mb-6">Quick Add</h3>
         <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Title" 
              required
              className="px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 outline-none"
              value={newResource.title}
              onChange={(e) => setNewResource({...newResource, title: e.target.value})}
            />
            <select 
              className="px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 outline-none"
              value={newResource.category}
              onChange={(e) => setNewResource({...newResource, category: e.target.value})}
            >
               <option>Past Questions</option>
               <option>Textbooks</option>
               <option>Lectures</option>
            </select>
            <input 
              type="text" 
              placeholder="File URL (Link)" 
              required
              className="px-4 py-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 outline-none"
              value={newResource.fileUrl}
              onChange={(e) => setNewResource({...newResource, fileUrl: e.target.value})}
            />
            <button 
              type="submit"
              disabled={isAdding}
              className="bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
               {isAdding ? <Loader2 className="animate-spin" /> : "Add Item"}
            </button>
         </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-border overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                     <td className="px-6 py-4 font-medium">{res.title}</td>
                     <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold">
                           {res.category}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">{res.type}</td>
                     <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-all">
                           <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(res.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-all"
                        >
                           <Trash2 size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
               {resources.length === 0 && !isLoading && (
                  <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No resources found.</td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>

    {/* Delete Confirmation Modal */}
    {confirmDeleteId && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 size={28} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Delete Resource?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            This action is permanent and cannot be undone. The resource will be removed from the system.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-foreground py-3.5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-border"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
