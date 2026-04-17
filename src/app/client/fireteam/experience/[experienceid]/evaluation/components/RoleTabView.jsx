import React, { useState } from "react";

export default function RoleTabView({ children, userRole = "client" }) {
  const [activeTab, setActiveTab] = useState(userRole);

  const tabs = [];
  if (userRole === "client" || userRole === "participant") {
    tabs.push({ id: "client", label: "Your Results" });
  }
  if (userRole === "coach" || userRole === "admin") {
    tabs.push({ id: "coach", label: "Coach View" });
  }
  if (userRole === "admin") {
    tabs.push({ id: "admin", label: "Admin View" });
  }

  // Single tab → no tab bar needed
  if (tabs.length <= 1) {
    return <div>{children}</div>;
  }

  return (
    <div>
      {/* Tab pills */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {React.cloneElement(children, { userRole: activeTab })}
    </div>
  );
}
