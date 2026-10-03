import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08080D] text-slate-200 p-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-purple-400 hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to TuneQuest
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Terms of Service (Demo Placeholder)</h1>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 leading-relaxed">
          <strong>Notice:</strong> This document represents a design and architecture demonstration placeholder for the TuneQuest Web Application. Formal legal terms and conditions will be provided upon full commercial deployment.
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">1. Service Overview</h3>
          <p>TuneQuest provides interactive gamified music streaming and knowledge trivia. All TunePoints are virtual utility points within the TuneQuest platform and cannot be traded for real currency or cash.</p>

          <h3 className="text-base font-bold text-white">2. Fair Play & Anti-Cheat</h3>
          <p>Any automated answering scripts, browser automation tools, or unauthorized manipulation of quiz session IDs will result in immediate forfeiture of TunePoints and account suspension.</p>

          <h3 className="text-base font-bold text-white">3. Intellectual Property</h3>
          <p>All demo audio tracks and cover imagery are provided under royalty-free, Creative Commons, or fictional demonstrative licenses.</p>
        </div>
      </div>
    </div>
  );
};
