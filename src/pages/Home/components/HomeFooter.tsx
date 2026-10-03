import React from 'react';
import { Link } from 'react-router-dom';

export const HomeFooter: React.FC = () => {
  return (
    <footer className="mt-16 pt-12 pb-8 border-t border-border text-left">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: TuneQuest Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm">
              <span className="font-display font-extrabold text-xs tracking-tight">TQ</span>
            </div>
            <span className="font-display font-bold text-base text-text-primary tracking-tight">
              Tune<span className="text-primary">Quest</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Listen. Play. Earn. Unlock. The gamified music streaming platform where knowledge is rewarded.
          </p>
        </div>

        {/* Col 2: Explore */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
            Explore
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link to="/browse" className="hover:text-text-primary transition-colors">
                Music Discovery
              </Link>
            </li>
            <li>
              <Link to="/quiz" className="hover:text-text-primary transition-colors">
                Trivia Quizzes
              </Link>
            </li>
            <li>
              <Link to="/rewards" className="hover:text-text-primary transition-colors">
                TunePoints Rewards
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:text-text-primary transition-colors">
                Global Leaderboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
            Support
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link to="/terms" className="hover:text-text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <span className="cursor-not-allowed text-text-muted">Help Center</span>
            </li>
            <li>
              <span className="cursor-not-allowed text-text-muted">Community Guidelines</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Account & Community */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
            Community
          </h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link to="/referrals" className="hover:text-text-primary transition-colors">
                Invite Friends (+100 TP)
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-text-primary transition-colors">
                User Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-text-primary transition-colors">
                Settings & Appearance
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-text-primary transition-colors">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
        <p>© 2026 TuneQuest. All rights reserved. Music for demonstration and educational purposes.</p>
        <p className="text-[11px]">Designed with clean SaaS & editorial music aesthetics.</p>
      </div>
    </footer>
  );
};
