'use client';

import React, { useState, useEffect } from 'react';
import {
  User, Clock, CheckCircle, Mail, Phone, Calendar, MessageSquare,
  ChevronRight, ChevronDown, Play, BookOpen, Award, Zap, AlertCircle,
  Send, MapPin, Loader, X
} from 'lucide-react';
import { FaBriefcase, FaLinkedin, FaClock, FaCheckCircle, FaCircle } from 'react-icons/fa';

const API_BASE = '/api/career-compass/coach';

export default function PLCACoachIntegration() {
  // Coach Profile State
  const [coach, setCoach] = useState(null);
  const [relationship, setRelationship] = useState(null);

  // Curriculum State
  const [modules, setModules] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [expandedModule, setExpandedModule] = useState(null);

  // Sessions State
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [sessionPage, setSessionPage] = useState('upcoming'); // upcoming, past
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    type: 'resume_review',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: '',
  });
  const [sessionSubmitting, setSessionSubmitting] = useState(false);

  // Messaging State
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, curriculum, sessions, messages

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch coach info
        const coachRes = await fetch(`${API_BASE}`);
        if (coachRes.ok) {
          const coachData = await coachRes.json();
          setCoach(coachData.coach);
          setRelationship(coachData.relationship);
        }

        // Fetch curriculum
        const curriculumRes = await fetch(`${API_BASE}/curriculum`);
        if (curriculumRes.ok) {
          const currData = await curriculumRes.json();
          setModules(currData.modules);
          setOverallProgress(currData.overallProgress);
        }

        // Fetch sessions
        const sessionsRes = await fetch(`${API_BASE}/sessions`);
        if (sessionsRes.ok) {
          const sessData = await sessionsRes.json();
          setUpcomingSessions(sessData.upcomingSessions);
          setPastSessions(sessData.pastSessions);
        }

        // Fetch messages
        const messagesRes = await fetch(`${API_BASE}/messages`);
        if (messagesRes.ok) {
          const msgData = await messagesRes.json();
          setMessages(msgData.messages);
          setUnreadCount(msgData.messages.filter(m => !m.read && m.sender === 'coach').length);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Submit new session request
  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionForm.preferredDate) {
      alert('Please select a date');
      return;
    }

    try {
      setSessionSubmitting(true);
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionForm),
      });

      if (res.ok) {
        const newSession = await res.json();
        alert(newSession.message);
        setShowSessionModal(false);
        setSessionForm({
          type: 'resume_review',
          preferredDate: '',
          preferredTime: '10:00 AM',
          notes: '',
        });
      }
    } catch (err) {
      alert('Failed to submit session request: ' + err.message);
    } finally {
      setSessionSubmitting(false);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      setMessageSending(true);
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageInput }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setMessageInput('');
      }
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setMessageSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-[#002147] mx-auto mb-4" />
          <p className="text-gray-600">Loading your coaching dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Coaching Dashboard</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'not_started':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'resume_review':
        return <FaBriefcase className="text-blue-600" />;
      case 'mock_interview':
        return <User className="text-purple-600" />;
      case 'networking_strategy':
        return <FaLinkedin className="text-blue-600" />;
      case 'career_planning':
        return <Award className="text-amber-600" />;
      default:
        return <Calendar className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'resume_review':
        return 'Resume Review';
      case 'mock_interview':
        return 'Mock Interview';
      case 'networking_strategy':
        return 'Networking Strategy';
      case 'career_planning':
        return 'Career Planning';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  // Coach initials avatar
  const coachInitials = coach ? coach.name.split(' ').map(n => n[0]).join('') : '??';

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002147] to-[#003366] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6" />
          <h1 className="text-3xl font-bold">PLCA Coaching</h1>
        </div>
        <p className="text-blue-100">
          Promise Land Career Accelerator - Your personalized path to career success
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: 'profile', label: 'Coach Profile', icon: User },
          { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
          { id: 'sessions', label: 'Sessions', icon: Calendar },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#002147] text-[#002147]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
              {tab.id === 'messages' && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* PROFILE TAB */}
      {activeTab === 'profile' && coach && (
        <div className="space-y-6">
          {/* Coach Profile Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-6 mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-[#002147] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  {coachInitials}
                </div>
              </div>

              {/* Coach Info */}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-[#002147] mb-1">{coach.name}</h2>
                <p className="text-blue-600 font-medium mb-4">{coach.title}</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{coach.bio}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Relationship Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#002147] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Email</p>
                  <p className="text-sm text-gray-900 font-medium">{coach.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#002147] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Phone</p>
                  <p className="text-sm text-gray-900 font-medium">{coach.phone}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActiveTab('sessions');
                  setShowSessionModal(true);
                }}
                className="flex-1 bg-[#002147] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#001a33] transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Session
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className="flex-1 border border-[#002147] text-[#002147] px-4 py-2.5 rounded-lg font-medium hover:bg-[#002147]/5 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>

          {/* Relationship Stats */}
          {relationship && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-2">
                  Started
                </p>
                <p className="text-lg font-bold text-[#002147]">
                  {new Date(relationship.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-2">
                  Sessions Completed
                </p>
                <p className="text-lg font-bold text-green-600">{relationship.totalSessions}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-2">
                  Upcoming
                </p>
                <p className="text-lg font-bold text-blue-600">{relationship.upcomingSessions}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-2">
                  Status
                </p>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>
          )}

          {/* Availability */}
          {coach.availability && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(coach.availability).map(([day, slots]) => (
                  <div key={day} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 capitalize mb-2">{day}</p>
                    {slots.map((slot, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        {slot}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CURRICULUM TAB */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Overall PLCA Progress
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24">
                  <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#002147"
                      strokeWidth="8"
                      strokeDasharray={`${overallProgress * 2.827} 282.7`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#002147]">{overallProgress}%</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  You're making excellent progress through the PLCA curriculum! Keep up the momentum.
                </p>
                <p className="text-sm text-gray-600">
                  {modules.filter(m => m.status === 'completed').length} of {modules.length} modules completed
                </p>
              </div>
            </div>
          </div>

          {/* Module Cards */}
          <div className="grid gap-4">
            {modules.map(module => (
              <div
                key={module.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedModule(expandedModule === module.id ? null : module.id)
                  }
                  className="w-full p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {module.status === 'completed' && (
                        <FaCheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {module.status === 'in_progress' && (
                        <FaCircle className="w-6 h-6 text-blue-600" />
                      )}
                      {module.status === 'not_started' && (
                        <FaCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex-grow text-left">
                      <h4 className="text-lg font-bold text-[#002147] mb-1">{module.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-semibold text-gray-600">Progress</span>
                          <span className="text-xs font-bold text-[#002147]">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#002147] h-2 rounded-full transition-all"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Status Badge & Stats */}
                      <div className="flex gap-3 items-center flex-wrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            module.status
                          )}`}
                        >
                          {getStatusLabel(module.status)}
                        </span>
                        {module.sessions.length > 0 && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {module.sessions.length} session{module.sessions.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {module.assignments.length > 0 && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {module.assignments.length} assignment{module.assignments.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand Button */}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedModule === module.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedModule === module.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-6">
                    {/* Sessions */}
                    {module.sessions.length > 0 && (
                      <div>
                        <h5 className="font-bold text-[#002147] mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Sessions ({module.sessions.length})
                        </h5>
                        <div className="space-y-2">
                          {module.sessions.map(session => (
                            <div
                              key={session.id}
                              className="bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-medium text-gray-900">{session.title}</p>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded ${
                                    session.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-purple-100 text-purple-700'
                                  }`}
                                >
                                  {session.status === 'completed' ? 'Completed' : 'Scheduled'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {new Date(session.date).toLocaleDateString()} • {session.duration} min
                              </p>
                              {session.notes && (
                                <p className="text-xs text-gray-700 italic">{session.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignments */}
                    {module.assignments.length > 0 && (
                      <div>
                        <h5 className="font-bold text-[#002147] mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Assignments ({module.assignments.length})
                        </h5>
                        <div className="space-y-2">
                          {module.assignments.map(assignment => (
                            <div
                              key={assignment.id}
                              className="bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-medium text-gray-900">{assignment.title}</p>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded ${
                                    assignment.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : assignment.status === 'in_progress'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {assignment.status === 'completed'
                                    ? 'Completed'
                                    : assignment.status === 'in_progress'
                                    ? 'In Progress'
                                    : 'Pending'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                              {assignment.feedback && (
                                <p className="text-xs text-green-700 italic mt-2">
                                  Coach feedback: {assignment.feedback}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SESSIONS TAB */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Session Type Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setSessionPage('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sessionPage === 'upcoming'
                  ? 'bg-[#002147] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setSessionPage('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sessionPage === 'past'
                  ? 'bg-[#002147] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past ({pastSessions.length})
            </button>
          </div>

          {/* Request New Session Button */}
          <button
            onClick={() => setShowSessionModal(true)}
            className="w-full bg-[#002147] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#001a33] transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Request New Session
          </button>

          {/* Upcoming Sessions */}
          {sessionPage === 'upcoming' &&
            (upcomingSessions.length > 0 ? (
              <div className="grid gap-4">
                {upcomingSessions.map(session => (
                  <div
                    key={session.id}
                    className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm bg-gradient-to-br from-blue-50/50 to-white"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 text-3xl">
                        {getTypeIcon(session.type)}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-[#002147] mb-2">
                          {session.title}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-[#002147]" />
                            {new Date(session.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-[#002147]" />
                            {session.time} • {session.duration} min
                          </div>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-600 italic mb-4">
                            {session.notes}
                          </p>
                        )}
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-[#002147] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#001a33] transition-colors"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-100 rounded-xl">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">No Upcoming Sessions</p>
                <p className="text-sm text-gray-500">
                  Schedule your next coaching session to continue your PLCA journey
                </p>
              </div>
            ))}

          {/* Past Sessions */}
          {sessionPage === 'past' &&
            (pastSessions.length > 0 ? (
              <div className="space-y-4">
                {pastSessions.map((session, idx) => (
                  <div
                    key={session.id}
                    className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="text-2xl">
                          {getTypeIcon(session.type)}
                        </div>
                        {idx < pastSessions.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-[#002147] mb-1">
                          {session.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {new Date(session.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}{' '}
                          at {session.time}
                        </p>
                        {session.feedback && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-xs font-semibold text-green-900 mb-1">
                              Coach Feedback:
                            </p>
                            <p className="text-sm text-green-800">{session.feedback}</p>
                          </div>
                        )}
                        {session.recordingLink && (
                          <a
                            href={session.recordingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[#002147] font-medium text-sm hover:underline"
                          >
                            Watch Recording →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-100 rounded-xl">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No Past Sessions</p>
              </div>
            ))}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Messages List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {messages.length > 0 ? (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'veteran' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      msg.sender === 'veteran'
                        ? 'bg-[#002147] text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'veteran'
                          ? 'text-blue-100'
                          : 'text-gray-600'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No messages yet</p>
                <p className="text-sm text-gray-500">Start a conversation with your coach</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4 flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-transparent"
              disabled={messageSending}
            />
            <button
              type="submit"
              disabled={messageSending || !messageInput.trim()}
              className="bg-[#002147] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#001a33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {messageSending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* Session Request Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#002147]">Request a Session</h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSessionSubmit} className="p-6 space-y-4">
              {/* Session Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session Type
                </label>
                <select
                  value={sessionForm.type}
                  onChange={e =>
                    setSessionForm({ ...sessionForm, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="resume_review">Resume Review</option>
                  <option value="mock_interview">Mock Interview</option>
                  <option value="networking_strategy">Networking Strategy</option>
                  <option value="career_planning">Career Planning</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={sessionForm.preferredDate}
                  onChange={e =>
                    setSessionForm({
                      ...sessionForm,
                      preferredDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  required
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Time
                </label>
                <select
                  value={sessionForm.preferredTime}
                  onChange={e =>
                    setSessionForm({
                      ...sessionForm,
                      preferredTime: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={sessionForm.notes}
                  onChange={e =>
                    setSessionForm({ ...sessionForm, notes: e.target.value })
                  }
                  placeholder="Tell us what you'd like to focus on..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-transparent resize-none h-24"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sessionSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#002147] text-white font-medium hover:bg-[#001a33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sessionSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
