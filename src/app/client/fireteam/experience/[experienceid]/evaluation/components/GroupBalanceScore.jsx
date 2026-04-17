import React from "react";

export default function GroupBalanceScore({ groupBalanceScore }) {
  if (!groupBalanceScore) return null;

  const { participants, averageTalkTime, isBalanced, message } = groupBalanceScore;
  const maxTime = Math.max(...participants.map((p) => p.talkTimeMinutes), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-900 mb-0.5">Group Balance</h3>
        <p className={`text-xs font-medium ${isBalanced ? "text-green-500" : "text-amber-500"}`}>
          {message}
        </p>
      </div>

      {/* Horizontal bar chart (pure Tailwind — no Recharts) */}
      <div className="space-y-3 mb-5">
        {participants.map((p) => {
          const pct = (p.talkTimeMinutes / maxTime) * 100;
          return (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-medium text-gray-700">{p.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 tabular-nums">
                  {p.talkTimeMinutes.toFixed(1)}m
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: p.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Average reference line */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Avg Talk Time</p>
          <p className="text-lg font-black text-gray-900 tabular-nums">
            {averageTalkTime.toFixed(1)}
            <span className="text-xs font-medium text-gray-400 ml-0.5">min</span>
          </p>
        </div>
        <div className="flex-1 text-right">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Participants</p>
          <p className="text-lg font-black text-gray-900">{participants.length}</p>
        </div>
      </div>
    </div>
  );
}
