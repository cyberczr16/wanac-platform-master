"use client";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaLink,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaFileDownload,
  FaPlus,
  FaStickyNote,
  FaTimes,
  FaRobot,
  FaArrowLeft,
  FaUsers,
  FaClock
} from "react-icons/fa";
import { sessionsService } from "../../../../../services/api/sessions.service";
import { clientsService } from '../../../../../services/api/clients.service';
import CoachSidebar from "../../../../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../../../../components/dashboardcomponents/clienttopbar";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar";
import { useRouter } from "next/navigation";

export default function SessionDetailsClient({ sessionId, readOnly = false, useClientLayout = false }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [addParticipantLoading, setAddParticipantLoading] = useState(false);
  const [addParticipantError, setAddParticipantError] = useState("");
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceFile, setResourceFile] = useState(null);
  const [resourceLink, setResourceLink] = useState("");
  const [addResourceLoading, setAddResourceLoading] = useState(false);
  const [addResourceError, setAddResourceError] = useState("");
  const [noteText, setNoteText] = useState("");
  const [addNoteLoading, setAddNoteLoading] = useState(false);
  const [addNoteError, setAddNoteError] = useState("");

  useEffect(() => {
    if (showAddParticipant) {
      setClientsLoading(true);
      setClientsError("");
      clientsService.getClients()
        .then((data) => setClients(Array.isArray(data.clients) ? data.clients : []))
        .catch(() => setClientsError("Failed to fetch clients."))
        .finally(() => setClientsLoading(false));
    }
  }, [showAddParticipant]);

  const filteredClients = Array.isArray(clients) ? clients.filter(
    (client) =>
      (client.user && client.user.name && client.user.name.toLowerCase().includes(clientSearch.toLowerCase())) ||
      (client.user && client.user.email && client.user.email.toLowerCase().includes(clientSearch.toLowerCase()))
  ) : [];

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await sessionsService.getSession(sessionId);
        setSession(data.session ?? data);
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#002147] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading session…</p>
      </div>
    </div>
  );
  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <p className="text-sm text-gray-500">Session not found.</p>
    </div>
  );

  const dateObj = session.scheduled_at ? new Date(session.scheduled_at) : null;
  const dateStr = dateObj?.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = dateObj?.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const backHref = useClientLayout ? "/client/session" : "/coach/sessions";
  const SidebarComponent = useClientLayout ? Sidebar : CoachSidebar;

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] font-body">
      <SidebarComponent className={useClientLayout ? "w-56 bg-white border-r border-gray-200" : undefined} />
      <div className="flex-1 flex flex-col min-h-screen">
        <ClientTopbar user={{ name: useClientLayout ? "Client" : "Coach" }} />
        <main className="flex-1 overflow-x-hidden px-4 md:px-8 py-6 bg-[#f8f9fb]">
          <div className="max-w-4xl mx-auto space-y-5">

            {/* Back Button */}
            <button
              onClick={() => router.push(backHref)}
              className="flex items-center gap-2 text-gray-500 hover:text-[#002147] transition-colors text-xs font-medium group"
            >
              <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to Sessions
            </button>

            {/* Session Header */}
            <div className="bg-gradient-to-r from-[#002147] via-[#002d63] to-[#003875] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Session</span>
                  </div>
                  <h1 className="text-lg font-bold text-white mb-1 truncate">{session.title}</h1>
                  <p className="text-sm text-white/75 line-clamp-2 leading-relaxed">
                    {session.description || "No description provided."}
                  </p>
                </div>
                {session.session_link && (
                  <button
                    className="shrink-0 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                    onClick={() => window.open(session.session_link, "_blank")}
                  >
                    <FaCheckCircle className="text-xs" /> Join Session
                  </button>
                )}
              </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaCalendarAlt className="text-xs" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Scheduled</span>
                </div>
                <div className="text-sm font-bold text-[#002147] leading-snug">{dateStr || "N/A"}</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <FaClock className="text-[9px]" />
                  {timeStr || "—"}
                  {session.duration_minutes ? ` · ${session.duration_minutes} min` : ""}
                </div>
              </div>

              <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FaUsers className="text-xs" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Participants</span>
                </div>
                <div className="text-2xl font-bold text-[#002147]">{session.session_members?.length || 0}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {session.session_members?.length === 1 ? "Member enrolled" : "Members enrolled"}
                </div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <FaLink className="text-xs" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Meeting Link</span>
                </div>
                <div className="text-sm font-bold text-[#002147]">
                  {session.session_link ? "Ready to Join" : "Not set"}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 truncate">
                  {session.session_link ? (
                    <a
                      href={session.session_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      Open link →
                    </a>
                  ) : "No link available"}
                </div>
              </div>
            </div>

            {/* Participants & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Participants */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-[#002147] flex items-center gap-2">
                    <FaUser className="text-orange-500 text-xs" />
                    Participants
                    {session.session_members?.length > 0 && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        ({session.session_members.length})
                      </span>
                    )}
                  </h2>
                  {!readOnly && (
                    <button
                      className="text-[11px] px-2.5 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1 transition-colors font-medium shadow-sm"
                      onClick={() => setShowAddParticipant(true)}
                    >
                      <FaPlus className="text-[9px]" /> Add
                    </button>
                  )}
                </div>
                <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                  {session.session_members?.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No participants added yet.</p>
                  ) : (
                    session.session_members?.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50/40 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-gray-900 text-xs">{member.client?.user?.name}</div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[160px]">
                            {member.client?.user?.email}
                          </div>
                        </div>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          Confirmed
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-[#002147] flex items-center gap-2">
                    <FaFileDownload className="text-orange-500 text-xs" />
                    Resources
                    {session.session_resources?.length > 0 && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        ({session.session_resources.length})
                      </span>
                    )}
                  </h2>
                  {!readOnly && (
                    <button
                      className="text-[11px] px-2.5 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1 transition-colors font-medium shadow-sm"
                      onClick={() => setShowAddResource(true)}
                    >
                      <FaPlus className="text-[9px]" /> Add
                    </button>
                  )}
                </div>
                <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                  {session.session_resources?.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No resources added yet.</p>
                  ) : (
                    session.session_resources?.map((res, i) => {
                      const resourceUrl = res.link || res.url;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-purple-50/40 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-xs truncate">{res.name}</div>
                            {res.description && (
                              <div className="text-[10px] text-gray-400 truncate">{res.description}</div>
                            )}
                          </div>
                          {resourceUrl ? (
                            <a
                              href={resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-[10px] font-medium transition-colors ml-2 whitespace-nowrap"
                            >
                              <FaFileDownload className="text-[9px]" /> Open
                            </a>
                          ) : (
                            <span className="text-gray-300 text-[10px] ml-2">—</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Session Notes */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100">
                <FaStickyNote className="text-orange-500 text-sm" />
                <h2 className="text-sm font-semibold text-[#002147]">Session Notes</h2>
                {session.session_notes?.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-normal">({session.session_notes.length})</span>
                )}
              </div>
              <div className="p-4">
                {!readOnly && (
                  <div className="mb-4">
                    <textarea
                      placeholder="Add session observations, feedback, or action items…"
                      className="w-full border border-gray-200 rounded-xl p-3 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] text-xs transition-all bg-gray-50 focus:bg-white leading-relaxed"
                      rows={3}
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      disabled={addNoteLoading}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        className="px-4 py-2 bg-[#002147] text-white rounded-xl hover:bg-[#003875] disabled:opacity-60 text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                        onClick={async () => {
                          if (!noteText.trim()) { setAddNoteError("Note cannot be empty."); return; }
                          setAddNoteLoading(true);
                          setAddNoteError("");
                          try {
                            await sessionsService.addNote({ session_id: sessionId, content: noteText });
                            setNoteText("");
                            const data = await sessionsService.getSession(sessionId);
                            setSession(data.session ?? data);
                          } catch (err) {
                            setAddNoteError("Failed to add note. Please try again.");
                          } finally {
                            setAddNoteLoading(false);
                          }
                        }}
                        disabled={addNoteLoading}
                      >
                        <FaPlus className="text-[10px]" />
                        {addNoteLoading ? "Adding…" : "Add Note"}
                      </button>
                      {addNoteError && (
                        <span className="text-red-600 text-xs">{addNoteError}</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {session.session_notes?.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No notes added yet.</p>
                  ) : (
                    session.session_notes?.map((note, i) => (
                      <div
                        key={i}
                        className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 shadow-sm"
                      >
                        <div className="text-gray-800 text-xs leading-relaxed">{note.note || note.content}</div>
                        <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                          <FaStickyNote className="text-[9px] text-amber-400" />
                          {note.created_at ? new Date(note.created_at).toLocaleString() : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100">
                <FaRobot className="text-purple-500 text-sm" />
                <h2 className="text-sm font-semibold text-[#002147]">AI Summary</h2>
              </div>
              <div className="p-4">
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                  <p className="text-gray-600 text-xs leading-relaxed">
                    AI-generated session summaries, key insights, and action items will appear here once a recording is processed.
                  </p>
                  <div className="text-[10px] text-purple-500 mt-3 flex items-center gap-1.5 font-medium">
                    <FaRobot className="text-[10px]" />
                    Coming soon
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Add Participant Modal */}
      {showAddParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-md relative border border-gray-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-1.5 transition-colors"
              onClick={() => {
                setShowAddParticipant(false);
                setClientSearch("");
                setSelectedClient(null);
                setAddParticipantError("");
              }}
            >
              <FaTimes className="text-sm" />
            </button>
            <h3 className="text-sm font-bold text-[#002147] mb-1 flex items-center gap-2">
              <FaUser className="text-orange-500 text-xs" />
              Add Participant
            </h3>
            <p className="text-[11px] text-gray-400 mb-4">Search and select a client to add to this session.</p>

            {clientsLoading ? (
              <div className="text-gray-500 text-xs py-4 text-center">Loading clients…</div>
            ) : clientsError ? (
              <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl p-3">{clientsError}</div>
            ) : (
              <form className="space-y-3" onSubmit={async (e) => {
                e.preventDefault();
                if (!selectedClient) { setAddParticipantError("Please select a client."); return; }
                setAddParticipantLoading(true);
                setAddParticipantError("");
                try {
                  await sessionsService.addSessionMember(sessionId, selectedClient.id);
                  setShowAddParticipant(false);
                  setClientSearch("");
                  setSelectedClient(null);
                  const data = await sessionsService.getSession(sessionId);
                  setSession(data.session ?? data);
                } catch (err) {
                  setAddParticipantError("Failed to add participant. Please try again.");
                } finally {
                  setAddParticipantLoading(false);
                }
              }}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Search Client</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Type name or email…"
                    value={clientSearch}
                    onChange={(e) => { setClientSearch(e.target.value); setSelectedClient(null); }}
                    autoComplete="off"
                  />
                  {clientSearch && (
                    <div className="border border-gray-200 rounded-xl bg-white mt-2 max-h-36 overflow-y-auto shadow-lg">
                      {filteredClients.length === 0 ? (
                        <div className="p-3 text-gray-400 text-xs text-center">No clients found.</div>
                      ) : (
                        filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className={`px-3 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors ${
                              selectedClient?.id === client.id ? "bg-blue-50 border-l-4 border-[#002147]" : ""
                            }`}
                            onClick={() => {
                              setSelectedClient(client);
                              setClientSearch(
                                (client.user?.name || "") +
                                (client.user?.email ? " (" + client.user.email + ")" : "")
                              );
                            }}
                          >
                            <div className="font-semibold text-xs text-gray-900">{client.user?.name}</div>
                            <div className="text-[10px] text-gray-400">{client.user?.email}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {selectedClient && (
                    <div className="mt-2 text-green-700 text-xs bg-green-50 border border-green-200 rounded-xl p-2.5 font-medium flex items-center gap-1.5">
                      <FaCheckCircle className="text-green-500 text-[10px]" />
                      {selectedClient.user?.name} ({selectedClient.user?.email})
                    </div>
                  )}
                </div>
                {addParticipantError && (
                  <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl p-2.5">{addParticipantError}</div>
                )}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => { setShowAddParticipant(false); setClientSearch(""); setSelectedClient(null); setAddParticipantError(""); }}
                    disabled={addParticipantLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                    disabled={addParticipantLoading}
                  >
                    {addParticipantLoading ? "Adding…" : "Add Participant"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-md relative border border-gray-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-1.5 transition-colors"
              onClick={() => {
                setShowAddResource(false);
                setResourceName(""); setResourceDescription("");
                setResourceFile(null); setResourceLink(""); setAddResourceError("");
              }}
            >
              <FaTimes className="text-sm" />
            </button>
            <h3 className="text-sm font-bold text-[#002147] mb-1 flex items-center gap-2">
              <FaFileDownload className="text-orange-500 text-xs" />
              Add Resource
            </h3>
            <p className="text-[11px] text-gray-400 mb-4">Upload a file or add a link for participants.</p>

            <form className="space-y-3" onSubmit={async (e) => {
              e.preventDefault();
              setAddResourceError("");
              if (!resourceName) { setAddResourceError("Resource name is required."); return; }
              if (!resourceFile && !resourceLink) { setAddResourceError("Please provide a file or a link."); return; }
              if (resourceFile && resourceLink) { setAddResourceError("Please provide only one: file or link, not both."); return; }
              setAddResourceLoading(true);
              try {
                await sessionsService.addSessionResource({
                  session_id: sessionId, name: resourceName,
                  description: resourceDescription, file: resourceFile, link: resourceLink
                });
                setShowAddResource(false);
                setResourceName(""); setResourceDescription(""); setResourceFile(null); setResourceLink("");
                const data = await sessionsService.getSession(sessionId);
                setSession(data.session ?? data);
              } catch (err) {
                setAddResourceError("Failed to add resource. Please try again.");
              } finally {
                setAddResourceLoading(false);
              }
            }}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Resource Name *</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="e.g. Session Slides"
                  value={resourceName}
                  onChange={e => setResourceName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description (optional)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                  placeholder="Brief description…"
                  value={resourceDescription}
                  onChange={e => setResourceDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">File Upload</label>
                <input
                  type="file"
                  className="w-full text-xs border border-gray-200 rounded-xl p-2 file:mr-2 file:px-3 file:py-1 file:rounded-lg file:border-0 file:text-xs file:bg-[#002147] file:text-white hover:file:bg-[#003875] transition-all bg-gray-50"
                  onChange={e => { setResourceFile(e.target.files[0] || null); if (e.target.files[0]) setResourceLink(""); }}
                  disabled={!!resourceLink}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Link URL</label>
                <input
                  type="url"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="https://example.com/resource"
                  value={resourceLink}
                  onChange={e => { setResourceLink(e.target.value); if (e.target.value) setResourceFile(null); }}
                  disabled={!!resourceFile}
                />
              </div>
              {addResourceError && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl p-2.5">{addResourceError}</div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => { setShowAddResource(false); setResourceName(""); setResourceDescription(""); setResourceFile(null); setResourceLink(""); setAddResourceError(""); }}
                  disabled={addResourceLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                  disabled={addResourceLoading}
                >
                  {addResourceLoading ? "Adding…" : "Add Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
