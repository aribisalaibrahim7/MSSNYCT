"use client";

import Navbar from "@/components/layout/Navbar";
import { Calendar as CalendarIcon, MapPin, Clock, Bell, ChevronRight, Share2, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const events = [
  {
    id: "evt_1",
    month: "MAY",
    day: "15",
    title: "Special Academic Seminar",
    time: "10:00 AM",
    location: "Masjid Hall",
    category: "Academic",
    desc: "A workshop on 'Thriving in Yabatech: Balancing Academics and Deen'.",
  },
  {
    id: "evt_2",
    month: "JUN",
    day: "02",
    title: "Jumah Special: Ramadan Prep",
    time: "1:30 PM",
    location: "Masjid Al-Ihsan",
    category: "Spiritual",
    desc: "A series of lectures focusing on spiritual and physical preparation for the holy month.",
  },
  {
    id: "evt_3",
    month: "JUL",
    day: "10",
    title: "Islamic Orientation Week (IOW)",
    time: "8:00 AM",
    location: "Campus Wide",
    category: "Major Event",
    desc: "A week-long celebration welcoming new students with various activities.",
  },
  {
    id: "evt_4",
    month: "AUG",
    day: "22",
    title: "Skills Acquisition Workshop",
    time: "11:00 AM",
    location: "ICT Center",
    category: "Tech",
    desc: "Learn UI/UX Design and Web Development basics from industry professionals.",
  },
];

export default function CalendarPage() {
  const { data: session } = useSession();
  const [loadingId, setLoadingId] = useState("");
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);

  const handleNotifyMe = async (eventId: string = "GENERAL") => {
    if (!session) {
      alert("Please login to enable notifications");
      return;
    }

    setLoadingId(eventId);
    try {
      await axios.post("/api/notifications/subscribe", {
        eventId: eventId === "GENERAL" ? null : eventId,
        type: eventId === "GENERAL" ? "GENERAL" : "SPECIFIC_EVENT"
      });
      setSubscribedIds(prev => [...prev, eventId]);
      alert(eventId === "GENERAL" ? "General notifications enabled!" : "You will be notified before this event starts.");
    } catch (err) {
      alert("Failed to enable notifications");
    } finally {
      setLoadingId("");
    }
  };

  const handleShare = async (event: any) => {
    const shareData = {
      title: event.title,
      text: `Join us for ${event.title} at ${event.location} on ${event.month} ${event.day}!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text + " " + shareData.url);
        alert("Event details copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleLearnMore = (event: any) => {
    alert(`More details about ${event.title}:\n\n${event.desc}\n\nVenue: ${event.location}\nTime: ${event.time}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-4">Smart Calendar</h1>
            <p className="text-muted-foreground text-lg">
              Stay updated with branch activities and yearly timelines.
            </p>
          </div>
          <button 
            disabled={loadingId === "GENERAL"}
            onClick={() => handleNotifyMe("GENERAL")}
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all self-start disabled:opacity-70"
          >
            {loadingId === "GENERAL" ? <Loader2 className="animate-spin" /> : subscribedIds.includes("GENERAL") ? <CheckCircle2 /> : <Bell size={20} />}
            {subscribedIds.includes("GENERAL") ? "Notifications On" : "Notify Me"}
          </button>
        </div>

        <div className="space-y-8 relative before:absolute before:left-[45px] md:before:left-[60px] before:top-0 before:bottom-0 before:w-px before:bg-border">
          {events.map((event, index) => (
            <div key={index} className="flex gap-6 md:gap-12 relative group">
              <div className="flex flex-col items-center justify-start z-10">
                <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] bg-white dark:bg-slate-900 border border-border rounded-3xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary/50 transition-colors">
                  <span className="text-xs font-bold text-primary tracking-widest">{event.month}</span>
                  <span className="text-3xl md:text-4xl font-heading font-bold">{event.day}</span>
                </div>
              </div>

              <div className="flex-1 pb-12">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-border shadow-sm group-hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      event.category === "Major Event" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                    )}>
                      {event.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={14} />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{event.desc}</p>
                  
                  <div className="flex items-center justify-between">
                     <button 
                       onClick={() => handleLearnMore(event)}
                       className="text-primary font-bold flex items-center gap-2 group/btn"
                     >
                        Learn More <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleNotifyMe(event.id)}
                          disabled={loadingId === event.id}
                          className={cn(
                            "p-3 rounded-xl transition-all",
                            subscribedIds.includes(event.id) ? "bg-green-100 text-green-600" : "bg-slate-50 dark:bg-slate-800 text-muted-foreground hover:text-primary"
                          )}
                        >
                           {loadingId === event.id ? <Loader2 className="animate-spin" size={18} /> : subscribedIds.includes(event.id) ? <CheckCircle2 size={18} /> : <Bell size={18} />}
                        </button>
                        <button 
                          onClick={() => handleShare(event)}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-muted-foreground hover:text-primary transition-colors"
                        >
                           <Share2 size={18} />
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-12 rounded-[3rem] border border-dashed border-border flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <CalendarIcon size={32} className="text-muted-foreground" />
           </div>
           <h3 className="text-2xl font-bold mb-2">More Events Coming Soon</h3>
           <p className="text-muted-foreground max-w-md">We are currently planning more activities for the second semester. Stay tuned for updates.</p>
        </div>
      </div>
    </main>
  );
}
