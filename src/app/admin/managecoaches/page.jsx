"use client";
import { useState, useEffect } from "react";
import AdminSidebar from '../../../../components/dashboardcomponents/adminsidebar';
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { cohortService } from '../../../services/api/cohort.service';

export default function ManageCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coaches from API
  useEffect(() => {
    async function fetchCoaches() {
      setLoading(true);
      setError(null);
      try {
        const response = await cohortService.getCoaches();
        // Handle nested response structure: { coaches: { data: [...] } }
        const coachesArray = Array.isArray(response) 
          ? response 
          : (Array.isArray(response?.coaches?.data) 
              ? response.coaches.data 
              : (Array.isArray(response?.coaches) 
                  ? response.coaches 
                  : []));
        
        // Map the data to the expected format
        const mappedCoaches = coachesArray.map(coach => ({
          id: coach.id || coach.user_id,
          name: coach.name || coach.user?.name || 'Unknown',
          email: coach.email || coach.user?.email || 'N/A',
          phone: coach.phone || coach.user?.phone || 'N/A',
          status: coach.status || coach.is_active ? 'Active' : 'Inactive'
        }));
        
        setCoaches(mappedCoaches);
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches. Please try again.');
        setCoaches([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCoaches();
  }, []);

  useEffect(() => {
    setFilteredCoaches(
      coaches.filter(
        (coach) =>
          coach.name.toLowerCase().includes(search.toLowerCase()) ||
          coach.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, coaches]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-16 md:ml-56">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#002147] mb-2">Manage Coaches</h1>
            <p className="text-gray-600">View, search, and manage all WANAC coaches.</p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold mt-4 md:mt-0">
            <Plus size={18} /> Add Coach
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <div className="flex items-center mb-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search coaches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-[#002147]">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Phone</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        {search ? 'No coaches match your search.' : 'No coaches found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCoaches.map((coach) => (
                      <tr key={coach.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{coach.name}</td>
                        <td className="py-2 px-4">{coach.email}</td>
                        <td className="py-2 px-4">{coach.phone}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              coach.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {coach.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button className="p-2 rounded hover:bg-gray-200" title="Edit">
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button className="p-2 rounded hover:bg-gray-200" title="Delete">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}