import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function formatTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ConversationMap({ conversationMap, participants }) {
  if (!conversationMap || !participants) return null;

  const chartData = conversationMap.bubbles.map((bubble) => {
    const p = participants.find((x) => x.id === bubble.participantId);
    return {
      x: bubble.timestamp / 60,
      y: Math.random() * 10 + 1,
      z: bubble.understandingDepth * 20,
      participantName: p?.name || "Unknown",
      participantColor: p?.color || "#9ca3af",
      comment: bubble.comment,
      timestamp: formatTimestamp(bubble.timestamp),
      rubric: bubble.rubric || "General Discussion",
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white px-3 py-2.5 rounded-xl shadow-lg border border-gray-100 max-w-xs">
        <p className="text-xs font-bold text-gray-900 mb-0.5">{d.participantName}</p>
        <p className="text-[10px] text-gray-400 mb-1.5">
          {d.timestamp} &middot; {d.rubric}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">{d.comment}</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">Conversation Map</h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
            Bubble size reflects depth of understanding
          </p>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[10px] text-gray-500 font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={["dataMin - 2", "dataMax + 2"]}
              tickFormatter={(v) =>
                `${Math.floor(v)}:${String(Math.round((v % 1) * 60)).padStart(2, "0")}`
              }
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 12]}
              tick={false}
              axisLine={false}
              width={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Scatter dataKey="z" data={chartData} fillOpacity={0.7}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.participantColor} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline footer */}
      <div className="flex items-center justify-between mt-2 text-[10px] text-gray-300 font-medium">
        <span>{conversationMap.timeline.startTime}</span>
        <div className="flex-1 mx-3 h-px bg-gray-100" />
        <span>{conversationMap.timeline.endTime}</span>
      </div>
    </div>
  );
}
