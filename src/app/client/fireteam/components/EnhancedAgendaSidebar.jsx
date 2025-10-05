import React, { useState, useRef, useEffect } from "react";
import { Send, Download, ExternalLink, FileText, Link as LinkIcon } from "lucide-react";

export default function EnhancedAgendaSidebar({ 
  agenda, 
  moduleTitle, 
  moduleDescription, 
  peers = [], 
  onStepClick, 
  currentStep,
  exhibits = [],
  chatMessages = [],
  onSendMessage
}) {
  const [activeTab, setActiveTab] = useState("Agenda");
  const [showPeersModal, setShowPeersModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);
  const tabs = ["Agenda", "Peers", "Chat", "Exhibits"];

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current && activeTab === "Chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const handleSendChat = () => {
    if (chatInput.trim() && onSendMessage) {
      onSendMessage(chatInput);
      setChatInput("");
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  const getExhibitIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'link':
      case 'url':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className="w-96 border-l bg-white flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex justify-between border-b bg-gray-50 px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`text-sm font-semibold px-3 py-2 rounded transition-colors ${
              activeTab === tab
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "Agenda" && (
          <>
            {/* Module Title */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">{moduleTitle}</h3>
              <p className="text-sm text-gray-600">{moduleDescription}</p>
            </div>
            
            {/* Agenda Steps */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Session Agenda</h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {agenda.map(([label, time], i) => (
                  <li
                    key={i}
                    className={`flex justify-between items-center cursor-pointer rounded-lg px-3 py-2 transition-colors ${
                      currentStep === i 
                        ? "bg-yellow-200 font-semibold border-l-4 border-yellow-600" 
                        : "hover:bg-yellow-50 border-l-4 border-transparent"
                    }`}
                    onClick={onStepClick ? () => onStepClick(i) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep === i ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {i + 1}
                      </span>
                      <span>{label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === "Peers" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Participants ({peers.length})</h3>
              {peers.length > 0 && (
                <button
                  className="text-xs px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
                  onClick={() => setShowPeersModal(true)}
                >
                  Expand
                </button>
              )}
            </div>
            
            {peers.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No participants yet</p>
                <p className="text-xs mt-2">Waiting for others to join...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {peers.map((peer, idx) => (
                  <div
                    key={peer.id || peer.name || idx}
                    className={`flex flex-col items-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-sm border-2 transition-all ${
                      peer.speaking ? "border-green-400 shadow-green-200" : "border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 mb-3 flex items-center justify-center shadow-md">
                      {peer.avatarUrl ? (
                        <img src={peer.avatarUrl} alt={peer.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {peer.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    
                    {/* Name Badge */}
                    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm text-xs font-medium">
                      <svg width="12" height="12" fill="currentColor" className="text-gray-600">
                        <circle cx="6" cy="6" r="6" />
                      </svg>
                      <span className="truncate max-w-[90px]">{peer.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Modal for expanded peers view */}
            {showPeersModal && peers.length > 0 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full relative max-h-[85vh] overflow-y-auto">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
                    onClick={() => setShowPeersModal(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-6">All Participants ({peers.length})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {peers.map((peer, idx) => (
                      <div
                        key={peer.id || peer.name || idx}
                        className={`flex flex-col items-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-sm border-2 ${
                          peer.speaking ? "border-green-400" : "border-transparent"
                        }`}
                      >
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 mb-3 flex items-center justify-center">
                          {peer.avatarUrl ? (
                            <img src={peer.avatarUrl} alt={peer.name} className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-white text-3xl font-bold">
                              {peer.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
                          <span className="truncate max-w-[120px]">{peer.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "Chat" && (
          <div className="flex flex-col h-full -m-6">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-bold text-lg">Team Chat</h3>
              <p className="text-xs text-gray-500">Collaborate with your fireteam</p>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-2">Start the conversation!</p>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-lg px-4 py-2 ${
                          msg.isOwn 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          {!msg.isOwn && (
                            <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                          )}
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="border-t bg-white px-4 py-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Exhibits" && (
          <>
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Session Exhibits</h3>
              <p className="text-sm text-gray-600">Resources and materials for this session</p>
            </div>
            
            {exhibits.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No exhibits available</p>
                <p className="text-xs mt-2">Check back later for materials</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exhibits.map((exhibit) => (
                  <div
                    key={exhibit.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {getExhibitIcon(exhibit.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{exhibit.title}</h4>
                        {exhibit.description && (
                          <p className="text-xs text-gray-600 mb-2">{exhibit.description}</p>
                        )}
                        <div className="flex gap-2">
                          <a
                            href={exhibit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </a>
                          {exhibit.type !== 'link' && exhibit.type !== 'url' && (
                            <a
                              href={exhibit.url}
                              download
                              className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

