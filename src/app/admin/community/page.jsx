"use client";
import { useState, useEffect } from "react";
import AdminSidebar from '../../../../components/dashboardcomponents/adminsidebar';
import { Plus, Search, Edit, Trash2, Users, MessageSquare, Calendar, Eye, X } from "lucide-react";
import { 
  fetchCommunities, 
  createCommunity, 
  updateCommunity,
  deleteCommunity 
} from '../../../services/api/community.service';

export default function AdminCommunityManagement() {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalMembers: 0,
    totalPosts: 0
  });

  // Load sidebar state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wanacAdminSidebarCollapsed');
    if (stored !== null) {
      setSidebarCollapsed(stored === 'true');
    }
  }, []);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('wanacAdminSidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Fetch communities from API
  useEffect(() => {
    async function loadCommunities() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchCommunities();
        console.log('Communities response:', response);
        
        // Handle nested response structure
        const communitiesArray = Array.isArray(response) 
          ? response 
          : (Array.isArray(response?.communites?.data) 
              ? response.communites.data 
              : (Array.isArray(response?.communites) 
                  ? response.communites 
                  : (Array.isArray(response?.data)
                      ? response.data
                      : [])));
        
        setCommunities(communitiesArray);
        
        // Calculate statistics
        setStats({
          total: communitiesArray.length,
          active: communitiesArray.filter(c => c.is_active !== false).length,
          totalMembers: communitiesArray.reduce((sum, c) => sum + (c.members_count || 0), 0),
          totalPosts: communitiesArray.reduce((sum, c) => sum + (c.posts_count || 0), 0)
        });
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities. Please try again.');
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    }
    loadCommunities();
  }, []);

  // Filter communities based on search
  useEffect(() => {
    setFilteredCommunities(
      communities.filter(
        (community) =>
          community.name?.toLowerCase().includes(search.toLowerCase()) ||
          community.description?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, communities]);

  // Handle create community
  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError("Name and description are required.");
      setFormLoading(false);
      return;
    }

    try {
      const newCommunity = await createCommunity({
        name: formData.name,
        description: formData.description
      });
      
      setCommunities([newCommunity, ...communities]);
      setShowCreateModal(false);
      setFormData({ name: "", description: "" });
      setFormError("");
    } catch (err) {
      console.error('Error creating community:', err);
      setFormError("Failed to create community. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update community
  const handleUpdateCommunity = async (e) => {
    e.preventDefault();
    if (!selectedCommunity) return;
    
    setFormLoading(true);
    setFormError("");

    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError("Name and description are required.");
      setFormLoading(false);
      return;
    }

    try {
      const updatedCommunity = await updateCommunity(selectedCommunity.id, {
        name: formData.name,
        description: formData.description
      });
      
      // Update the community in the list
      setCommunities(communities.map(c => 
        c.id === selectedCommunity.id ? { ...c, ...updatedCommunity } : c
      ));
      
      setShowEditModal(false);
      setSelectedCommunity(null);
      setFormData({ name: "", description: "" });
      setFormError("");
    } catch (err) {
      console.error('Error updating community:', err);
      setFormError("Failed to update community. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete community
  const handleDeleteCommunity = async () => {
    if (!selectedCommunity) return;
    
    setFormLoading(true);
    setFormError("");

    try {
      await deleteCommunity(selectedCommunity.id);
      setCommunities(communities.filter(c => c.id !== selectedCommunity.id));
      setShowDeleteModal(false);
      setSelectedCommunity(null);
    } catch (err) {
      console.error('Error deleting community:', err);
      setFormError("Failed to delete community. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (community) => {
    setSelectedCommunity(community);
    setFormData({
      name: community.name || "",
      description: community.description || ""
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (community) => {
    setSelectedCommunity(community);
    setShowDeleteModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-screen flex bg-white font-body text-foreground overflow-hidden">
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-[#002147]">Community Management</h2>
            <p className="text-xs text-gray-600">Manage all client communities</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} /> Create Community
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-8 py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Communities</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Communities</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Members</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalMembers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Posts</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">{stats.totalPosts}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Communities List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                  <span className="font-medium">Error:</span> {error}
                </div>
              )}

              {/* Search Bar */}
              <div className="flex items-center mb-6">
                <div className="relative w-full md:w-1/3">
                  <input
                    type="text"
                    placeholder="Search communities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              {/* Communities Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-[#002147]">
                        <th className="py-3 px-4 text-left font-semibold">Community Name</th>
                        <th className="py-3 px-4 text-left font-semibold">Description</th>
                        <th className="py-3 px-4 text-left font-semibold">Members</th>
                        <th className="py-3 px-4 text-left font-semibold">Posts</th>
                        <th className="py-3 px-4 text-left font-semibold">Created</th>
                        <th className="py-3 px-4 text-left font-semibold">Status</th>
                        <th className="py-3 px-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCommunities.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            {search ? 'No communities match your search.' : 'No communities found. Create one to get started!'}
                          </td>
                        </tr>
                      ) : (
                        filteredCommunities.map((community) => (
                          <tr key={community.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Users className="text-blue-600" size={18} />
                                </div>
                                <span className="font-medium text-gray-900">{community.name || 'Untitled'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-gray-600 line-clamp-2 max-w-xs">
                                {community.description || 'No description'}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-700">{community.members_count || 0}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-700">{community.posts_count || 0}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar size={14} />
                                <span>{formatDate(community.created_at)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  community.is_active !== false
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {community.is_active !== false ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button 
                                  className="p-2 rounded hover:bg-blue-50 transition-colors group" 
                                  title="View Details"
                                >
                                  <Eye size={16} className="text-blue-600 group-hover:text-blue-700" />
                                </button>
                                <button 
                                  onClick={() => openEditModal(community)}
                                  className="p-2 rounded hover:bg-blue-50 transition-colors group" 
                                  title="Edit"
                                >
                                  <Edit size={16} className="text-blue-600 group-hover:text-blue-700" />
                                </button>
                                <button 
                                  onClick={() => openDeleteModal(community)}
                                  className="p-2 rounded hover:bg-red-50 transition-colors group" 
                                  title="Delete"
                                >
                                  <Trash2 size={16} className="text-red-600 group-hover:text-red-700" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => {
                setShowCreateModal(false);
                setFormData({ name: "", description: "" });
                setFormError("");
              }}
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-[#002147] flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              Create New Community
            </h3>
            
            <form onSubmit={handleCreateCommunity} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Community Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter community name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter community description"
                  required
                />
              </div>
              
              {formError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: "", description: "" });
                    setFormError("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formLoading}
                >
                  {formLoading ? "Creating..." : "Create Community"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Community Modal */}
      {showEditModal && selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => {
                setShowEditModal(false);
                setSelectedCommunity(null);
                setFormData({ name: "", description: "" });
                setFormError("");
              }}
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-[#002147] flex items-center gap-2">
              <Edit className="text-blue-600" size={24} />
              Edit Community
            </h3>
            
            <form onSubmit={handleUpdateCommunity} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Community Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter community name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter community description"
                  required
                />
              </div>
              
              {formError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCommunity(null);
                    setFormData({ name: "", description: "" });
                    setFormError("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formLoading}
                >
                  {formLoading ? "Updating..." : "Update Community"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCommunity(null);
                setFormError("");
              }}
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-[#002147]">Delete Community</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedCommunity.name}</span>? 
                This action cannot be undone.
              </p>
              
              {formError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{formError}</p>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCommunity(null);
                    setFormError("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCommunity}
                  className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formLoading}
                >
                  {formLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

