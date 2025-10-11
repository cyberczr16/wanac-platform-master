"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";
import { fireteamService } from "../../../../services/api/fireteam.service";
import { experienceService } from "../../../../services/api/experience.service";
import { clientsService } from "../../../../services/api/clients.service";
import { notificationService } from "../../../../services/api/notification.service";
import { generateFireteamMeetingLink } from "../../../../lib/jitsi.utils";


export default function FireteamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [fireteam, setFireteam] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [members, setMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedMemberToRemove, setSelectedMemberToRemove] = useState("");
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    cohort_id: "",
  });
  const [experienceData, setExperienceData] = useState({
    title: "",
    experience: "",
  });

  useEffect(() => {
    if (id) {
      fetchFireteamDetails();
    }
  }, [id]);

  // Auto-dismiss success and error messages after 2 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchFireteamDetails = async () => {
    setLoading(true);
    try {
      const fireteamData = await fireteamService.getFireteam(id);
      const fireTeam = fireteamData.fireTeam;
      console.log("Fireteam data:", fireteamData.fireTeam);
      setFireteam(fireTeam);
      setMembers(Array.isArray(fireTeam.members) ? fireTeam.members : []);
      setExperiences(Array.isArray(fireTeam.experiences) ? fireTeam.experiences : []);
      setCohort(fireTeam.cohort);
      setEditData({
        title: fireTeam.title || "",
        description: fireTeam.description || "",
        date: fireTeam.date || "",
        time: fireTeam.time || "",
        cohort_id: fireTeam.cohort_id || "",
      });

      // Fetch clients for the add member dropdown
      try {
        const clientsResponse = await clientsService.getClients();
        const clientsArray = Array.isArray(clientsResponse?.clients) ? clientsResponse.clients : [];
        const mappedClients = clientsArray.map(client => ({
          id: client.id,
          name: client.user?.name || 'Unknown',
          email: client.user?.email || ''
        }));
        setClients(mappedClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setClients([]);
      }
      
    } catch (err) {
      console.error("Error fetching fireteam:", err);
      setError("Failed to load fireteam details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fireteamService.updateFireteam(id, editData);
      setSuccess("Fireteam updated successfully!");
      setShowEdit(false);
      fetchFireteamDetails();
    } catch (err) {
      setError("Failed to update fireteam");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this fireteam?")) {
      try {
        await fireteamService.deleteFireteam(id);
        setSuccess("Fireteam deleted successfully!");
        router.push("/admin/fireteammanagement");
      } catch (err) {
        setError("Failed to delete fireteam");
      }
    }
  };

  const handleAddMember = async () => {
    if (!selectedClient) return;
    try {
      console.log("Adding member with data:", {
        client_id: selectedClient,
        fire_team_id: id,
      });
      const result = await fireteamService.addFireteamMember({
        client_id: selectedClient,
        fire_team_id: id,
      });
      console.log("Add member result:", result);
      
      // Send notification to the added member
      try {
        await notificationService.sendNotification({
          user_id: selectedClient,
          title: "Added to Fireteam",
          message: `You have been added to the fireteam: ${fireteam?.title || 'Unknown Fireteam'}`,
          type: "fireteam",
          metadata: {
            fireteam_id: id,
          }
        });
        console.log("Notification sent successfully");
      } catch (notifErr) {
        console.error("Error sending notification:", notifErr);
      }
      
      setSuccess("Member added successfully!");
      setShowAddMember(false);
      setSelectedClient("");
      fetchFireteamDetails();
    } catch (err) {
      console.error("Error adding member:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member from the fireteam?")) {
      try {
        await fireteamService.deleteFireteamMember(memberId);
        setSuccess("Member removed successfully!");
        fetchFireteamDetails();
      } catch (err) {
        setError("Failed to remove member");
      }
    }
  };

  const handleRemoveMemberFromDialog = async () => {
    if (!selectedMemberToRemove) return;
    try {
      await fireteamService.deleteFireteamMember(selectedMemberToRemove);
      setSuccess("Member removed successfully!");
      setShowRemoveMember(false);
      setSelectedMemberToRemove("");
      fetchFireteamDetails();
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const handleAddExperience = () => {
    setExperienceData({
      title: "",
      experience: "",
    });
    setShowAddExperience(true);
  };

  const handleSaveExperience = async () => {
    try {
      const timestamp = Date.now();
      const meetingLink = generateFireteamMeetingLink(
        id,
        `new-${timestamp}`,
        'system',
        fireteam?.title || 'Fireteam Meeting'
      );
      
      console.log('🔗 [CREATE EXPERIENCE] Generated meeting link:', meetingLink);
      
      await experienceService.addExperience({
        fire_team_id: id,
        ...experienceData,
        link: meetingLink,
      });
      setSuccess("Experience added successfully!");
      setShowAddExperience(false);
      fetchFireteamDetails();
    } catch (err) {
      console.error('Failed to add experience:', err);
      setError("Failed to add experience");
    }
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceService.deleteExperience(id);
        setSuccess("Experience deleted successfully!");
        fetchFireteamDetails();
      } catch (err) {
        setError("Failed to delete experience");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-gray-600">Loading fireteam details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!fireteam) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-red-600">Fireteam not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 ml-16 md:ml-56 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {fireteam.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Fireteam
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Fireteam
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Fireteam Details */}
            <div className="md:col-span-8 min-h-0">
              <div className="bg-white rounded-md shadow-sm p-3">
                <h2 className="text-base font-semibold mb-2">Fireteam Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Title</p>
                    <p className="text-sm text-gray-900 break-words">{fireteam.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Cohort</p>
                    <p className="text-sm text-gray-900 break-words">
                      {cohort ? (cohort.name || cohort.title || `Cohort ${cohort.id}`) : `Cohort ${fireteam.cohort_id}`}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-0.5">Description</p>
                    <p className="text-sm text-gray-900 break-words">{fireteam.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Date & Time</p>
                    <p className="text-sm text-gray-900 break-words">
                      {fireteam.date} {fireteam.time && `at ${fireteam.time}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Created</p>
                    <p className="text-sm text-gray-900">
                      {fireteam.created_at ? new Date(fireteam.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Members List */}
            <div className="md:col-span-12 min-h-0">
              <div className="bg-white rounded-md shadow-sm h-[250px] flex flex-col">
                <div className="flex-1 min-h-0 flex flex-col p-4">
                  <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <h2 className="text-lg font-semibold">Fireteam Members</h2>
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Add Member
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white border-b">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Name</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Email</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Role</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                    {members.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-6 text-sm text-gray-500">
                          No members found
                            </td>
                          </tr>
                    ) : (
                      members.map((member) => (
                            <tr key={member.id} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-3 text-gray-900">{member.client.user.name}</td>
                              <td className="py-2 px-3 text-gray-600">{member.client.user.email}</td>
                              <td className="py-2 px-3">
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {member.role || 'Member'}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <button
                              onClick={() => handleRemoveMember(member.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          {/* Experiences List */}
            <div className="md:col-span-12 min-h-0 flex-1">
              <div className="bg-white rounded-md shadow-sm h-full flex flex-col">
                <div className="flex-1 min-h-0 flex flex-col p-4">
                  <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <h2 className="text-lg font-semibold">Fireteam Experiences</h2>
                    <button
                      onClick={handleAddExperience}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Experience
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 flex-shrink-0">
                    Create learning experiences and discussion sessions for your fireteam members.
                  </p>
                  <div className="flex-1 min-h-0 overflow-y-auto block relative">
                    {experiences.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 mb-3">No experiences created yet</p>
                        <button
                          onClick={handleAddExperience}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                      Create First Experience
                        </button>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white border-b">
                          <tr>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Title</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Description</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                      {experiences.map((experience) => (
                            <tr
                              key={experience.id}
                              className="border-b hover:bg-gray-50 cursor-pointer"
                              onClick={(e) => {
                                if (e.target.closest('.experience-action-btn')) return;
                                console.log("Navigating to experience:", experience);
                                router.push(`/admin/fireteammanagement/${id}/experience/${experience.id}`);
                              }}
                            >
                              <td className="py-2 px-3 text-gray-900">{experience.title}</td>
                              <td className="py-2 px-3 text-gray-600">{experience.experience}</td>
                              <td className="py-2 px-3">
                                <div className="flex gap-2">
                                  <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/admin/fireteammanagement/${id}/experience/${experience.id}`);
                                }}
                                    className="experience-action-btn flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    View
                                  </button>
                                  <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteExperience(experience.id);
                                }}
                                    className="experience-action-btn px-2 py-1 border border-red-600 text-red-600 rounded text-xs hover:bg-red-50 transition-colors"
                              >
                                Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Edit Fireteam</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({...editData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                type="time"
                value={editData.time}
                onChange={(e) => setEditData({...editData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Dialog */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Add Member to Fireteam</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Member Dialog */}
        {showRemoveMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Remove Member from Fireteam</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Member to Remove</label>
                <select
                  value={selectedMemberToRemove}
                  onChange={(e) => setSelectedMemberToRemove(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a member...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.client.user.name} ({member.client.user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowRemoveMember(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
              onClick={handleRemoveMemberFromDialog}
              disabled={!selectedMemberToRemove}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Experience Dialog */}
        {showAddExperience && (
          <div className="fixed inset-0 bg-black bg-opacity-15 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Add New Experience</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Title</label>
                  <input
                    type="text"
                value={experienceData.title}
                onChange={(e) => setExperienceData({...experienceData, title: e.target.value})}
                    placeholder="e.g., Leadership in Crisis Management"
                required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter a descriptive title for this experience</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Content</label>
                  <textarea
                value={experienceData.experience}
                onChange={(e) => setExperienceData({...experienceData, experience: e.target.value})}
                rows={4}
                    placeholder="Describe the experience content, learning objectives, and what participants will gain..."
                required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">Provide the detailed content and description of the experience</p>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowAddExperience(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
              onClick={handleSaveExperience}
              disabled={!experienceData.title.trim() || !experienceData.experience.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Experience
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
