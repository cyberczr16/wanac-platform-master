"use client";

import { useState, useEffect } from "react";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import LifeScorePreview from '../../../../components/LifeScorePreview';
import InfographicWheel from '../../../../components/infographicWheel';
import { FaChartLine, FaHistory } from "react-icons/fa";
import { Button, LinearProgress, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { habitsService } from '../../../services/api/habits.service';
import { handleValidationErrors } from "@/lib/error";
import toast from "react-hot-toast";

export default function LifeScoresPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [assessmentStep, setAssessmentStep] = useState(1);
  const totalAssessmentSteps = 10;
  const [openAssessment, setOpenAssessment] = useState(null); // 'daily' | 'wholeLife' | null
  const [dailyForm, setDailyForm] = useState({ sleep: '', exercise: '', nutrition: '', mood: '', productivity: '' });
  const [wholeLifeForm, setWholeLifeForm] = useState({ health: '', relationship: '', career: '', finances: '', personal_growth: '', recreation: '', spirituality: '', community: '' });
  const [dailyHabitsData, setDailyHabitsData] = useState([]);
  const [wholeLifeHistory, setWholeLifeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyTimeRange, setDailyTimeRange] = useState('30days'); // 'daily' | 'weekly' | '30days'

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setLoading(true);
        
        // Fetch both daily habits and whole life history
        Promise.all([
          habitsService.getDailyHabitsHistory().catch(() => []),
          habitsService.getWholeLifeHistory().catch(() => [])
        ]).then(([dailyData, wholeLifeData]) => {
          setDailyHabitsData(Array.isArray(dailyData) ? dailyData : []);
          setWholeLifeHistory(Array.isArray(wholeLifeData) ? wholeLifeData : []);
          setLoading(false);
        }).catch(() => {
          setDailyHabitsData([]);
          setWholeLifeHistory([]);
          setLoading(false);
        });
      } catch (e) {
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleDailyChange = (e) => {
    setDailyForm({ ...dailyForm, [e.target.name]: e.target.value });
  };
  const handleWholeLifeChange = (e) => {
    setWholeLifeForm({ ...wholeLifeForm, [e.target.name]: e.target.value });
  };

  // Function to filter/transform daily habits data based on time range
  const getFilteredDailyData = () => {
    if (!dailyHabitsData || dailyHabitsData.length === 0) return [];

    const now = new Date();
    let filteredData = [...dailyHabitsData];

    switch (dailyTimeRange) {
      case '1day':
        // Show only today's data
        filteredData = dailyHabitsData.slice(-1);
        break;
      case 'daily':
        // Show last 7 days
        filteredData = dailyHabitsData.slice(-7);
        break;
      case 'weekly':
        // Show last 4 weeks (28 days grouped by week)
        filteredData = dailyHabitsData.slice(-28);
        // Group by week
        const weeklyData = [];
        for (let i = 0; i < filteredData.length; i += 7) {
          const weekData = filteredData.slice(i, i + 7);
          if (weekData.length > 0) {
            const avgScore = weekData.reduce((sum, item) => sum + (item.score || 0), 0) / weekData.length;
            weeklyData.push({
              day: `Week ${Math.floor(i / 7) + 1}`,
              score: Math.round(avgScore * 10) / 10,
            });
          }
        }
        return weeklyData;
      case '30days':
      default:
        // Show last 30 days
        filteredData = dailyHabitsData.slice(-30);
        break;
    }

    return filteredData;
  };
  const handleDailySubmit = async (e) => {
    e.preventDefault();
    const assessmentData = {
      userId: user?.id || user?._id || 'anonymous',
      date: new Date().toISOString(),
      ...dailyForm,
    };
    try {
     const response = await habitsService.addDailyHabit(assessmentData);
      toast.success(response.success || 'Daily habit assessment submitted successfully');
      setOpenAssessment(null);
      setDailyForm({ sleep: '', exercise: '', nutrition: '', mood: '', productivity: '' });
      
      // Refresh daily habits data
      const dailyData = await habitsService.getDailyHabitsHistory().catch(() => []);
      setDailyHabitsData(Array.isArray(dailyData) ? dailyData : []);
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response?.data?.errors) {
          handleValidationErrors(error.response.data.errors);
        }
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        }
      } else {
        console.log(error);
        toast.error('Failed to submit daily habit assessment');
      }
    }
  };
  const handleWholeLifeSubmit = async (e) => {
    e.preventDefault();
    const assessmentData = {
      userId: user?.id || user?._id || 'anonymous',
      date: new Date().toISOString(),
      ...wholeLifeForm,
    };
    try {
      const response = await habitsService.addWholeLifeAssessment(assessmentData);
      toast.success(response.success || 'Whole life assessment submitted successfully');
      setOpenAssessment(null);
      setWholeLifeForm({ health: '', relationship: '', career: '', finances: '', personal_growth: '', recreation: '', spirituality: '', community: '' });
      
      // Refresh whole life history data
      const wholeLifeData = await habitsService.getWholeLifeHistory().catch(() => []);
      setWholeLifeHistory(Array.isArray(wholeLifeData) ? wholeLifeData : []);
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response?.data?.errors) {
          handleValidationErrors(error.response.data.errors);
        }
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        }
      } else {
        console.log(error);
        toast.error('Failed to submit whole life assessment');
      }
    }
  };

  return (
    <div className="h-screen flex bg-white font-body">
      {/* Sidebar */}
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-3 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Content */}
              <div className="flex-1 space-y-4">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl p-4 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src="/veterancommunity.png" 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <FaChartLine className="text-orange-500" />
                        Track Your Growth
                      </h1>
                      <p className="text-white/90 text-xs">Monitor your daily habits and life progress</p>
                    </div>
                  </div>
                </section>

                {/* Daily Habits Section */}
                <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#002147]">Daily Habits</h3>
                    <button 
                      onClick={() => setOpenAssessment('daily')}
                      className="bg-[#002147] hover:bg-[#003875] text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-[11px] shadow-sm hover:shadow-md"
                    >
                      Take Assessment
                    </button>
                  </div>
                  
                  {/* Time Range Selector */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] text-gray-600">View:</span>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setDailyTimeRange('1day')}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                          dailyTimeRange === '1day'
                            ? 'bg-[#002147] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setDailyTimeRange('daily')}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                          dailyTimeRange === 'daily'
                            ? 'bg-[#002147] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        7 Days
                      </button>
                      <button
                        onClick={() => setDailyTimeRange('weekly')}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                          dailyTimeRange === 'weekly'
                            ? 'bg-[#002147] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        onClick={() => setDailyTimeRange('30days')}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                          dailyTimeRange === '30days'
                            ? 'bg-[#002147] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        30 Days
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-600 mb-3">
                    {dailyTimeRange === '1day' && 'View your habit score for today.'}
                    {dailyTimeRange === 'daily' && 'Track your daily habits over the last 7 days.'}
                    {dailyTimeRange === 'weekly' && 'View your weekly average habit scores.'}
                    {dailyTimeRange === '30days' && 'Track your daily habits over the last 30 days.'}
                  </p>
                  {loading ? (
                    <div className="flex items-center justify-center h-[140px]">
                      <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                  ) : dailyHabitsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[140px] bg-gray-50 rounded-lg">
                      <FaChartLine className="text-gray-300 text-3xl mb-2" />
                      <p className="text-gray-500 text-xs">No daily habit data available</p>
                      <p className="text-gray-400 text-[10px] mt-1">Take an assessment to start tracking</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={getFilteredDailyData()} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                        <YAxis domain={[0, 5]} tick={{ fontSize: 9 }} />
                      <Tooltip />
                        <Bar dataKey="score" fill="#ff6b35" name="Habit Score" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <button className="flex items-center gap-1 text-[#002147] hover:text-orange-500 text-[10px] font-semibold transition-colors">
                      <FaHistory />
                      View History
                    </button>
                    <span className="text-[9px] text-gray-500">
                      {dailyTimeRange === '1day' && 'Today\'s score'}
                      {dailyTimeRange === 'daily' && 'Last 7 days'}
                      {dailyTimeRange === 'weekly' && 'Weekly average'}
                      {dailyTimeRange === '30days' && 'Last 30 days'}
                    </span>
                  </div>
                </section>

                {/* Whole Life Habits Section */}
                <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#002147]">Whole Life Assessment</h3>
                    <button 
                      onClick={() => setOpenAssessment('wholeLife')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-[11px] shadow-sm hover:shadow-md"
                    >
                      Take Assessment
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-3">Overall life balance across 8 key areas over 6 months.</p>
                  {loading ? (
                    <div className="flex items-center justify-center h-[140px]">
                      <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                  ) : wholeLifeHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[140px] bg-gray-50 rounded-lg">
                      <FaChartLine className="text-gray-300 text-3xl mb-2" />
                      <p className="text-gray-500 text-xs">No whole life assessment data available</p>
                      <p className="text-gray-400 text-[10px] mt-1">Take an assessment to start tracking</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={140}>
                      <LineChart data={wholeLifeHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 9 }} />
                      <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#002147" name="Life Score" strokeWidth={2} dot={{ r: 3, fill: "#002147" }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <button className="flex items-center gap-1 text-[#002147] hover:text-orange-500 text-[10px] font-semibold transition-colors">
                      <FaHistory />
                      View History
                    </button>
                    <span className="text-[9px] text-gray-500">Whole life tracking</span>
                  </div>
                </section>

                {/* Historical Trends & Progress Visualization */}
                <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#002147]">Historical Trends & Progress</h3>
                    <button className="flex items-center gap-1 text-[#002147] hover:text-orange-500 text-[10px] font-semibold transition-colors">
                      <FaHistory />
                      Detailed History
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-3">Track your progress over time with interactive charts.</p>
                  {loading ? (
                    <div className="flex items-center justify-center h-[140px]">
                      <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                  ) : wholeLifeHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[140px] bg-gray-50 rounded-lg">
                      <FaChartLine className="text-gray-300 text-3xl mb-2" />
                      <p className="text-gray-500 text-xs">No historical data available yet</p>
                      <p className="text-gray-400 text-[10px] mt-1">Complete assessments to build your history</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={140}>
                      <LineChart data={wholeLifeHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 9 }} />
                      <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#43a047" name="Life Score" strokeWidth={2} dot={{ r: 3, fill: "#43a047" }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  )}
                </section>
              </div>
            
              {/* Right Sidebar */}
              <aside className="lg:w-64 space-y-4">
                {/* Quick Tips Card */}
                <div className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl shadow-sm p-4 text-white">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <FaChartLine />
                    Tips for Success
                  </h3>
                  <ul className="space-y-2 text-[10px] text-white/90">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Take assessments daily for accurate tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Use different time views (Today, 7 days, weekly, 30 days)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Review your trends weekly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Celebrate small improvements</span>
                    </li>
                  </ul>
                </div>

                {/* Life Areas Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
                  <h3 className="text-sm font-semibold text-[#002147] mb-3">Life Assessment Areas</h3>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="font-medium text-gray-700">Health</span>
                      <span className="text-gray-500">Physical wellness</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="font-medium text-gray-700">Relationship</span>
                      <span className="text-gray-500">Connections</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="font-medium text-gray-700">Career</span>
                      <span className="text-gray-500">Professional</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="font-medium text-gray-700">Finances</span>
                      <span className="text-gray-500">Money matters</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
      {/* Pop-up Dialogs for Assessments */}
      <Dialog 
        open={openAssessment === 'daily'} 
        onClose={() => setOpenAssessment(null)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', padding: '8px' }
        }}
      >
        <DialogTitle sx={{ fontSize: '18px', fontWeight: 'bold', color: '#002147', paddingBottom: '8px' }}>
          Daily Habits Assessment
        </DialogTitle>
        <form onSubmit={handleDailySubmit}>
          <DialogContent className="space-y-4">
            <Typography variant="body2" sx={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
              Rate each habit for today (1 = Poor, 5 = Excellent):
            </Typography>
            <TextField
              label="Sleep"
              name="sleep"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={dailyForm.sleep}
              onChange={handleDailyChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Exercise"
              name="exercise"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={dailyForm.exercise}
              onChange={handleDailyChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Nutrition"
              name="nutrition"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={dailyForm.nutrition}
              onChange={handleDailyChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Mood"
              name="mood"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={dailyForm.mood}
              onChange={handleDailyChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Productivity"
              name="productivity"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={dailyForm.productivity}
              onChange={handleDailyChange}
              fullWidth
              required
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ padding: '16px' }}>
            <Button 
              onClick={() => setOpenAssessment(null)} 
              sx={{ 
                textTransform: 'none', 
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                backgroundColor: '#002147',
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#003875' }
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog 
        open={openAssessment === 'wholeLife'} 
        onClose={() => setOpenAssessment(null)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', padding: '8px' }
        }}
      >
        <DialogTitle sx={{ fontSize: '18px', fontWeight: 'bold', color: '#002147', paddingBottom: '8px' }}>
          Whole Life Assessment
        </DialogTitle>
        <form onSubmit={handleWholeLifeSubmit}>
          <DialogContent className="space-y-4">
            <Typography variant="body2" sx={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
              Rate each area (1 = Poor, 10 = Excellent):
            </Typography>
            <TextField
              label="Health"
              name="health"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.health}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Relationship"
              name="relationship"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.relationship}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Career"
              name="career"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.career}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Finances"
              name="finances"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.finances}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Personal Growth"
              name="personal_growth"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.personal_growth}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Recreation"
              name="recreation"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.recreation}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Spirituality"
              name="spirituality"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.spirituality}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Community"
              name="community"
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={wholeLifeForm.community}
              onChange={handleWholeLifeChange}
              fullWidth
              required
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ padding: '16px' }}>
            <Button 
              onClick={() => setOpenAssessment(null)} 
              sx={{ 
                textTransform: 'none', 
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                backgroundColor: '#ff6b35',
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#ff8c5a' }
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
