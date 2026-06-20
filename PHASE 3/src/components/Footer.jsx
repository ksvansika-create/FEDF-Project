import React from 'react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t rounded-none border-white/20 dark:border-white/5 py-12 px-6 mt-auto bg-white/50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-slate-600 dark:text-slate-400">
        <div className="flex flex-col gap-3">
          <span className="text-xl font-bold font-display text-primary dark:text-slate-100">✈️ AeroJet</span>
          <p className="text-xs leading-relaxed">
            Next generation airline booking experience. We make search simple, fast, and transparent. Designed for flyers worldwide.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Services</span>
          <a href="#" className="hover:text-primary transition-colors">Flight Search</a>
          <a href="#" className="hover:text-primary transition-colors">Group Bookings</a>
          <a href="#" className="hover:text-primary transition-colors">Corporate Flyers</a>
          <a href="#" className="hover:text-primary transition-colors">AeroJet Privilege</a>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Support</span>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
          <a href="#" className="hover:text-primary transition-colors">Refund Policies</a>
          <a href="#" className="hover:text-primary transition-colors">Baggage Guidelines</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Legal</span>
          <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Grievance Redressal</a>
          <a href="#" className="hover:text-primary transition-colors">Citizen Charter</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>&copy; 2026 AeroJet Airlines System. All rights reserved. Flight search powered by mock JSON datasets.</p>
      </div>
    </footer>
  );
}
