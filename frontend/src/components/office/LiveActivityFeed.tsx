import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Radio, Terminal } from 'lucide-react';
import { SpeechBubbleItem } from '../../types/office';
import { gameAudio } from '../../utils/gameAudio';

interface LiveActivityFeedProps {
  logs: SpeechBubbleItem[];
  onSelectSpeaker?: (speakerId: string) => void;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ logs, onSelectSpeaker }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="absolute bottom-5 right-16 w-80 max-w-[calc(100vw-6rem)] bg-slate-950/90 border border-sky-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl z-30 transition-all overflow-hidden flex flex-col font-sans">
      {/* Comms Terminal Header */}
      <div
        onClick={() => {
          gameAudio.playClick();
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-sky-500/20 cursor-pointer select-none hover:bg-slate-850 transition"
      >
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono font-bold text-xs text-sky-300 tracking-wider">
            COMMS FEED
          </span>
          <span className="text-[10px] bg-sky-950 border border-sky-500/30 px-1.5 py-0.2 rounded text-sky-400 font-mono font-bold">
            {logs.length}
          </span>
        </div>

        <button className="text-slate-400 hover:text-white p-0.5">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Feed list */}
      {isExpanded && (
        <div className="p-2.5 space-y-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-900 font-sans">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-3 font-mono">
              [COMM CHANNEL OPEN - AWAITING CHATTER]
            </p>
          ) : (
            logs.slice(-6).reverse().map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  gameAudio.playSelect();
                  if (onSelectSpeaker) onSelectSpeaker(item.speaker_id);
                }}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition cursor-pointer text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sky-300 text-[11px] hover:underline flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
                    <span>{item.speaker_name}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
