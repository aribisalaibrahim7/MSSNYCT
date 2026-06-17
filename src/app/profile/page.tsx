"use client";

import Navbar from "@/components/layout/Navbar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { User, Mail, Shield, Download, MapPin, GraduationCap, Phone, Edit3, Save, X, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { useAlert } from "@/components/providers/AlertProvider";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    department: "",
    level: "",
    matricNo: "",
    skills: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phoneNumber: (session.user as any).profile?.phoneNumber || "",
        department: (session.user as any).profile?.department || "",
        level: (session.user as any).profile?.level || "",
        matricNo: (session.user as any).profile?.matricNo || "",
        skills: (session.user as any).profile?.skills || ""
      });
    }
  }, [status, router, session]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axios.post("/api/profile/update", formData);
      await update({
        name: formData.name,
        profile: res.data
      }); // Refresh session with new data
      setIsEditing(false);
      showAlert("Profile Updated", "Your changes have been saved successfully and your session is in sync.", "success");
    } catch (err) {
      showAlert("Save Failed", "Failed to update profile. Please verify your fields.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-border overflow-hidden shadow-2xl relative">
            <div className="h-40 bg-gradient-to-r from-primary via-emerald-800 to-slate-900" />
            
            <div className="px-8 pb-12 relative">
               <div className="absolute -top-20 left-8">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-white dark:bg-slate-800 border-8 border-white dark:border-slate-900 flex items-center justify-center text-5xl font-bold text-primary shadow-2xl relative group">
                    {session?.user?.name?.[0] || "U"}
                    <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                       <Camera className="text-white" size={32} />
                    </div>
                  </div>
               </div>
               
               <div className="pt-24 flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1">
                     {isEditing ? (
                       <input 
                         className="text-4xl font-heading font-bold mb-2 bg-slate-50 dark:bg-slate-800 border-b-2 border-primary outline-none w-full px-2"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                     ) : (
                       <h1 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3">
                         {session?.user?.name}
                         <Sparkles className="text-amber-400" size={24} />
                       </h1>
                     )}
                     
                     <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                           <Shield size={14} />
                           {(session?.user as any)?.role || "STUDENT"}
                        </span>
                        <span className="flex items-center gap-1.5">
                           <Mail size={16} />
                           {session?.user?.email}
                        </span>
                     </div>
                  </div>
                  
                  <div className="flex gap-3">
                     {isEditing ? (
                       <>
                         <button 
                           onClick={handleSave}
                           disabled={isSaving}
                           className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                         >
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Changes
                         </button>
                         <button 
                           onClick={() => setIsEditing(false)}
                           className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl font-bold"
                         >
                            <X size={18} />
                         </button>
                       </>
                     ) : (
                       <>
                         <button 
                           onClick={() => setIsEditing(true)}
                           className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-border px-6 py-3 rounded-2xl font-bold hover:border-primary/50 transition-all shadow-sm"
                         >
                            <Edit3 size={18} className="text-primary" />
                            Edit Profile
                         </button>
                         <button 
                           onClick={() => signOut()}
                           className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-all shadow-sm"
                         >
                            Log Out
                         </button>
                       </>
                     )}
                  </div>
               </div>
               
               <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Contact & Academic */}
                  <div className="lg:col-span-2 space-y-8">
                     <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-border">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                           <User className="text-primary" size={20} />
                           Academic & Contact
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <EditableItem 
                             icon={Phone} 
                             label="Phone Number" 
                             value={formData.phoneNumber} 
                             isEditing={isEditing}
                             onChange={(v: string) => setFormData({...formData, phoneNumber: v})}
                           />
                           <EditableItem 
                             icon={GraduationCap} 
                             label="Department" 
                             value={formData.department} 
                             placeholder="e.g. Computer Science"
                             isEditing={isEditing}
                             onChange={(v: string) => setFormData({...formData, department: v})}
                           />
                           <EditableItem 
                             icon={Shield} 
                             label="Level" 
                             value={formData.level} 
                             placeholder="e.g. 400L"
                             isEditing={isEditing}
                             onChange={(v: string) => setFormData({...formData, level: v})}
                           />
                           <EditableItem 
                             icon={Mail} 
                             label="Matric No" 
                             value={formData.matricNo} 
                             placeholder="e.g. F/HD/21/..."
                             isEditing={isEditing}
                             onChange={(v: string) => setFormData({...formData, matricNo: v})}
                           />
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-border/50">
                           <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 block">Interests & Skills</label>
                           {isEditing ? (
                             <input 
                               className="w-full bg-white dark:bg-slate-900 border border-border p-3 rounded-xl outline-none focus:ring-1 focus:ring-primary"
                               value={formData.skills}
                               onChange={(e) => setFormData({...formData, skills: e.target.value})}
                               placeholder="e.g. UI Design, Dawah, Public Speaking"
                             />
                           ) : (
                             <div className="flex flex-wrap gap-2">
                                {formData.skills ? formData.skills.split(',').map(s => (
                                  <span key={s} className="bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-border text-xs font-medium">
                                    {s.trim()}
                                  </span>
                                )) : <p className="text-sm italic text-muted-foreground">No skills added yet.</p>}
                             </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Right: Digital ID Card */}
                  <div className="space-y-6">
                     <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-border shadow-xl text-center flex flex-col items-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-muted-foreground">Digital ID Card</p>
                        <div className="p-4 bg-white rounded-3xl mb-6 shadow-inner border border-slate-100">
                           <QRCodeSVG 
                             value={(session?.user as any)?.id || "unknown"} 
                             size={160}
                             level="H"
                           />
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground mb-6 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-border">
                          ID: {(session?.user as any)?.id?.slice(-12).toUpperCase()}
                        </p>
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-black px-6 py-4 rounded-2xl text-sm font-bold hover:opacity-90 transition-all">
                           <Download size={18} />
                           Download Card
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function EditableItem({ icon: Icon, label, value, isEditing, onChange, placeholder }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-border/50">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</p>
        {isEditing ? (
          <input 
            className="w-full bg-transparent border-b border-primary outline-none py-1 font-bold"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <p className="font-bold">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}

function Camera(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
