import React, { useState } from 'react';
import { FLUTTER_MAIN_DART, FLUTTER_PUBSPEC } from '../../data/flutterCode';
import { X, Copy, Check, Terminal, Smartphone, Code2 } from 'lucide-react';
import './FlutterExportModal.css';

interface FlutterExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterExportModal: React.FC<FlutterExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'pubspec'>('main');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = activeTab === 'main' ? FLUTTER_MAIN_DART : FLUTTER_PUBSPEC;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-700/80 text-white flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
                <span>Luné Flutter App (iOS &amp; Android)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-sans font-semibold">
                  v1.3 Full Suite
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Complete Flutter codebase with Customer Details in Cart, Orders &amp; Order Details Tracking, Address Book with Add Address &amp; Dummy Data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Copy button */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'main'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>lib/main.dart (Full App)</span>
            </button>
            <button
              onClick={() => setActiveTab('pubspec')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'pubspec'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>pubspec.yaml</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-slate-900 hover:bg-sky-400 hover:text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Instructions Banner */}
        <div className="px-6 py-2.5 bg-sky-950/40 border-b border-sky-800/40 text-[11px] text-sky-200 flex flex-wrap items-center gap-4">
          <span className="font-semibold text-sky-400">⚡ Quick Setup:</span>
          <span>1. <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">flutter create lune_app</code></span>
          <span>2. Replace <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">lib/main.dart</code></span>
          <span>3. Add dependencies to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">pubspec.yaml</code></span>
          <span>4. Run on your iPhone / Android: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">flutter run</code></span>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre">{currentCode}</pre>
        </div>
      </div>
    </div>
  );
};
