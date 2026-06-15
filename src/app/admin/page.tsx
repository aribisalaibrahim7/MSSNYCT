"use client";

import { Users, BookOpen, Calendar, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">System Overview</h1>
        <p className="text-muted-foreground">Manage the MSSN Yabatech Digital Hub ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="5,240" icon={Users} trend="+12% this month" />
        <StatCard title="Resources" value="1,120" icon={BookOpen} trend="+45 new" />
        <StatCard title="Active Events" value="12" icon={Calendar} trend="3 next week" />
        <StatCard title="Support Requests" value="18" icon={MessageSquare} trend="8 pending" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-border">
          <h3 className="text-xl font-bold mb-6">Recent Activities</h3>
          <div className="space-y-6">
            <ActivityItem 
              user="Abdullah Yusuf" 
              action="downloaded" 
              target="MTH 101 Past Questions" 
              time="2 minutes ago" 
            />
            <ActivityItem 
              user="Zainab Ibrahim" 
              action="registered for" 
              target="IOW 2024" 
              time="1 hour ago" 
            />
            <ActivityItem 
              user="Admin" 
              action="uploaded" 
              target="New Branch Newsletter" 
              time="3 hours ago" 
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-border">
          <h3 className="text-xl font-bold mb-6">Pending Support</h3>
          <div className="space-y-6">
             <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                <p className="font-bold text-sm">Academic Help Request</p>
                <p className="text-xs text-muted-foreground mb-2">From: Idris Ahmed</p>
                <button className="text-xs font-bold text-primary hover:underline">View Details</button>
             </div>
             <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                <p className="font-bold text-sm">Welfare Support Request</p>
                <p className="text-xs text-muted-foreground mb-2">From: Fatima Bello</p>
                <button className="text-xs font-bold text-primary hover:underline">View Details</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
          <TrendingUp size={14} />
          {trend}
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-heading font-bold">{value}</h3>
    </div>
  );
}

function ActivityItem({ user, action, target, time }: any) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold">
        {user[0]}
      </div>
      <div className="flex-1">
        <span className="font-bold">{user}</span> {action} <span className="font-bold text-primary">{target}</span>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
}
