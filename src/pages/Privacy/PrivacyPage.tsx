import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08080D] text-slate-200 p-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-purple-400 hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to TuneQuest
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Privacy & Cookie Policy (Placeholder)</h1>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-600/40 text-xs text-cyan-200 leading-relaxed">
          <strong>Notice:</strong> This privacy policy is a demonstrator placeholder illustrating TuneQuest's commitment to secure session management and data protection.
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
          <p>We collect basic account credentials, quiz participation metrics, streaming duration, and earned TunePoints to power the gamification engine.</p>

          <h3 className="text-base font-bold text-white">2. Cookies and Security</h3>
          <p>TuneQuest uses secure, HttpOnly, SameSite=Strict cookies for authentication sessions. We do not store plaintext passwords or sensitive tokens in browser localStorage.</p>

          <h3 className="text-base font-bold text-white">3. Third-Party Sharing</h3>
          <p>TuneQuest respects your listening privacy. We do not sell user listening logs or trivia performance records to third-party ad brokers.</p>
        </div>
      </div>
    </div>
  );
};
