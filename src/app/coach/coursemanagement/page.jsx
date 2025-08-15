"use client";
import { useState } from "react";
import CoachSidebar from '../../../../components/dashboardcomponents/CoachSidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import { FaBook, FaEdit, FaPlus, FaUsers, FaLayerGroup, FaBullhorn, FaClipboardList, FaUser, FaChartLine } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinkIcon from '@mui/icons-material/Link';

// Mock data
const mockCourses = [
  { id: 1, name: "Leadership 101", syllabus: "Intro to Leadership", resources: 3, announcements: 2 },
  { id: 2, name: "Resilience Training", syllabus: "Building Resilience", resources: 2, announcements: 1 },
];
const mockUnits = [
  { id: 1, courseId: 1, name: "Unit 1: Foundations", resources: 2 },
  { id: 2, courseId: 1, name: "Unit 2: Practice", resources: 1 },
  { id: 3, courseId: 2, name: "Unit 1: Mindset", resources: 1 },
];
const mockClassRoster = [
  { id: 1, name: "Mary Johnson", email: "mary@client.com" },
  { id: 2, name: "Peter Lee", email: "peter@client.com" },
  { id: 3, name: "Grace Kim", email: "grace@client.com" },
];

export default function CourseManagementPage() {
  const [user, setUser] = useState({ name: "Coach" });
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]);
  const [showAddEditCourse, setShowAddEditCourse] = useState(false);
  const [showAddEditUnit, setShowAddEditUnit] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', syllabus: '', resources: [] });
  const [newResource, setNewResource] = useState({ type: 'link', title: '', url: '', file: null });
  const [unitForm, setUnitForm] = useState({ name: '', resources: [] });
  const [newUnitResource, setNewUnitResource] = useState({ type: 'link', title: '', url: '', file: null });
  const [classRoster, setClassRoster] = useState([...mockClassRoster]);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', idx: null });

  // Handler functions must be defined before return
  const handleOpenAddCourse = () => {
    setCourseForm({ name: '', syllabus: '', resources: [] });
    setNewResource({ type: 'link', title: '', url: '', file: null });
    setShowAddEditCourse(true);
  };
  const handleCourseFormChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };
  const handleResourceTypeChange = (e) => {
    setNewResource({ ...newResource, type: e.target.value, url: '', file: null });
  };
  const handleResourceChange = (e) => {
    setNewResource({ ...newResource, [e.target.name]: e.target.value });
  };
  const handleResourceFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, file: e.target.files[0], url: '' });
    }
  };
  const handleAddResource = () => {
    if (newResource.type === 'link' && newResource.title && newResource.url) {
      setCourseForm({
        ...courseForm,
        resources: [...courseForm.resources, { type: 'link', title: newResource.title, url: newResource.url }],
      });
      setNewResource({ type: 'link', title: '', url: '', file: null });
    } else if (newResource.type === 'document' && newResource.title && newResource.file) {
      setCourseForm({
        ...courseForm,
        resources: [...courseForm.resources, { type: 'document', title: newResource.title, file: newResource.file }],
      });
      setNewResource({ type: 'link', title: '', url: '', file: null });
    }
  };
  const handleRemoveResource = (idx) => {
    setCourseForm({
      ...courseForm,
      resources: courseForm.resources.filter((_, i) => i !== idx),
    });
  };
  const handleSaveCourse = () => {
    // Here you would add logic to save the course (API call or update state)
    setShowAddEditCourse(false);
  };

  const handleOpenAddUnit = () => {
    setUnitForm({ name: '', resources: [] });
    setNewUnitResource({ type: 'link', title: '', url: '', file: null });
    setShowAddEditUnit(true);
  };
  const handleUnitFormChange = (e) => {
    setUnitForm({ ...unitForm, [e.target.name]: e.target.value });
  };
  const handleUnitResourceTypeChange = (e, val) => {
    if (val) setNewUnitResource({ ...newUnitResource, type: val, url: '', file: null });
  };
  const handleUnitResourceChange = (e) => {
    setNewUnitResource({ ...newUnitResource, [e.target.name]: e.target.value });
  };
  const handleUnitResourceFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewUnitResource({ ...newUnitResource, file: e.target.files[0], url: '' });
    }
  };
  const handleAddUnitResource = () => {
    if (newUnitResource.type === 'link' && newUnitResource.title && newUnitResource.url) {
      setUnitForm({
        ...unitForm,
        resources: [...unitForm.resources, { type: 'link', title: newUnitResource.title, url: newUnitResource.url }],
      });
      setNewUnitResource({ type: 'link', title: '', url: '', file: null });
    } else if (newUnitResource.type === 'document' && newUnitResource.title && newUnitResource.file) {
      setUnitForm({
        ...unitForm,
        resources: [...unitForm.resources, { type: 'document', title: newUnitResource.title, file: newUnitResource.file }],
      });
      setNewUnitResource({ type: 'link', title: '', url: '', file: null });
    }
  };
  const handleRemoveUnitResource = (idx) => {
    setUnitForm({
      ...unitForm,
      resources: unitForm.resources.filter((_, i) => i !== idx),
    });
  };
  const handleSaveUnit = () => {
    // Here you would add logic to save the unit (API call or update state)
    setShowAddEditUnit(false);
  };

  const handleOpenAddStudent = () => {
    setStudentForm({ name: '', email: '', idx: null });
    setShowStudentDialog(true);
  };
  const handleOpenEditStudent = (student, idx) => {
    setStudentForm({ name: student.name, email: student.email, idx });
    setShowStudentDialog(true);
  };
  const handleStudentFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  const handleSaveStudent = () => {
    if (studentForm.idx === null) {
      setClassRoster([...classRoster, { name: studentForm.name, email: studentForm.email }]);
    } else {
      setClassRoster(classRoster.map((s, i) => i === studentForm.idx ? { name: studentForm.name, email: studentForm.email } : s));
    }
    setShowStudentDialog(false);
  };
  const handleRemoveStudent = (idx) => {
    setClassRoster(classRoster.filter((_, i) => i !== idx));
  };

  // Filter units for selected course
  const courseUnits = mockUnits.filter(u => u.courseId === selectedCourse.id);

  return (
    <div className="h-screen flex bg-white font-body text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <CoachSidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-2 md:px-8 py-6 bg-muted">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Courses Overview */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-2">
            
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-heading">Courses Overview</h1>
                <button className="ml-auto bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600" onClick={handleOpenAddCourse}>
                  <FaPlus /> Add Course
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCourses.map(course => (
                  <div key={course.id} className={`bg-white border border-gray-100 rounded-xl p-4 shadow flex flex-col gap-2 ${selectedCourse.id === course.id ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{course.name}</span>
                      <button className="ml-auto text-blue-500 hover:text-blue-700" onClick={e => { e.stopPropagation(); handleOpenAddCourse(); }} title="Edit Course">
                        <FaEdit />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">Syllabus: {course.syllabus}</div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Resources: {course.resources}</span>
                      <span>Announcements: {course.announcements}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Units/Modules Management */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <FaLayerGroup className="text-green-600" />
                <h2 className="text-xl font-bold text-heading">Units/Modules Management</h2>
                <button className="ml-auto bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600" onClick={handleOpenAddUnit}>
                  <FaPlus /> Add Unit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseUnits.length === 0 ? (
                  <div className="col-span-full text-gray-500">No units for this course.</div>
                ) : (
                  courseUnits.map(unit => (
                    <div key={unit.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">{unit.name}</span>
                        <button className="ml-auto text-green-500 hover:text-green-700" onClick={() => setShowAddEditUnit(true)} title="Edit Unit">
                          <FaEdit />
                        </button>
                      </div>
                      <div className="text-xs text-gray-600">Resources: {unit.resources}</div>
                      <div className="flex gap-2 mt-1">
                        <button className="text-blue-500 hover:underline text-xs">Attach Resource</button>
                        <button className="text-blue-500 hover:underline text-xs">View Assignments</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Class/Intake Management */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <FaUsers className="text-purple-600" />
                <h2 className="text-xl font-bold text-heading">Class/Intake Management</h2>
                <button className="ml-auto bg-purple-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-purple-600" onClick={handleOpenAddStudent}>
                  <FaPlus /> Add Student
                </button>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow">
                <div className="mb-2 font-semibold text-gray-700">Class Roster</div>
                <ul className="mb-4">
                  {classRoster.map((student, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm py-1 border-b last:border-b-0">
                      <FaUser className="text-gray-400" />
                      <span>{student.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{student.email}</span>
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditStudent(student, idx)}><FaEdit /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleRemoveStudent(idx)}><DeleteIcon /></IconButton>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center gap-1 text-xs hover:bg-blue-200">
                    <FaClipboardList /> Attendance
                  </button>
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded flex items-center gap-1 text-xs hover:bg-green-200">
                    <FaChartLine /> Progress
                  </button>
                </div>
              </div>
            </section>
            {/* Add/Edit Student Modal */}
            <Dialog open={showStudentDialog} onClose={() => setShowStudentDialog(false)}>
              <DialogTitle>{studentForm.idx === null ? 'Add Student' : 'Edit Student'}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={studentForm.name}
                  onChange={handleStudentFormChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={studentForm.email}
                  onChange={handleStudentFormChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowStudentDialog(false)} color="secondary">Cancel</Button>
                <Button onClick={handleSaveStudent} variant="contained" color="primary">Save</Button>
              </DialogActions>
            </Dialog>

            {/* Add/Edit Course Modal (Material UI) */}
            <Dialog open={showAddEditCourse} onClose={() => setShowAddEditCourse(false)}>
              <DialogTitle>Add/Edit Course</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Course Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={courseForm.name}
                  onChange={handleCourseFormChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  name="syllabus"
                  label="Syllabus"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={courseForm.syllabus}
                  onChange={handleCourseFormChange}
                  sx={{ mb: 2 }}
                />
                {/* Resource Management */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>Resources</div>
                  <Stack spacing={1}>
                    {courseForm.resources.map((resource, idx) => (
                      <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                        <TextField
                          value={resource.title}
                          label="Title"
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ flex: 1 }}
                        />
                        {resource.type === 'link' ? (
                          <TextField
                            value={resource.url}
                            label="URL"
                            size="small"
                            InputProps={{ readOnly: true }}
                            sx={{ flex: 2 }}
                          />
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            component="a"
                            href={resource.file ? URL.createObjectURL(resource.file) : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ flex: 2, textTransform: 'none', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                          >
                            {resource.file ? resource.file.name : 'Document'}
                          </Button>
                        )}
                        <IconButton aria-label="delete" color="error" onClick={() => handleRemoveResource(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        name="title"
                        label="Title"
                        size="small"
                        value={newResource.title}
                        onChange={handleResourceChange}
                        sx={{ flex: 1 }}
                      />
                      <ToggleButtonGroup
                        value={newResource.type}
                        exclusive
                        onChange={(e, val) => val && setNewResource({ ...newResource, type: val, url: '', file: null })}
                        sx={{ flex: 1 }}
                        size="small"
                      >
                        <ToggleButton value="link" aria-label="Link" sx={{ textTransform: 'none' }}>
                          <LinkIcon fontSize="small" sx={{ mr: 0.5 }} /> Link
                        </ToggleButton>
                        <ToggleButton value="document" aria-label="Document" sx={{ textTransform: 'none' }}>
                          <AttachFileIcon fontSize="small" sx={{ mr: 0.5 }} /> Document
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {newResource.type === 'link' ? (
                        <TextField
                          name="url"
                          label="URL"
                          size="small"
                          value={newResource.url}
                          onChange={handleResourceChange}
                          sx={{ flex: 2 }}
                        />
                      ) : (
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AttachFileIcon />}
                          sx={{ flex: 2, minWidth: 0 }}
                        >
                          {newResource.file ? newResource.file.name : 'Upload'}
                          <input
                            type="file"
                            hidden
                            onChange={handleResourceFileChange}
                          />
                        </Button>
                      )}
                      <Button onClick={handleAddResource} variant="outlined" color="primary" size="small" sx={{ height: 40 }}>
                        Add
                      </Button>
                    </Stack>
                  </Stack>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowAddEditCourse(false)} color="secondary">Cancel</Button>
                <Button onClick={handleSaveCourse} variant="contained" color="primary">Save</Button>
              </DialogActions>
            </Dialog>
            {/* Add/Edit Unit Modal (Material UI) */}
            <Dialog open={showAddEditUnit} onClose={() => setShowAddEditUnit(false)}>
              <DialogTitle>Add/Edit Unit</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Unit Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={unitForm.name}
                  onChange={handleUnitFormChange}
                  sx={{ mb: 2 }}
                />
                {/* Unit Resource Management */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>Resources</div>
                  <Stack spacing={1}>
                    {unitForm.resources.map((resource, idx) => (
                      <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                        <TextField
                          value={resource.title}
                          label="Title"
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ flex: 1 }}
                        />
                        {resource.type === 'link' ? (
                          <TextField
                            value={resource.url}
                            label="URL"
                            size="small"
                            InputProps={{ readOnly: true }}
                            sx={{ flex: 2 }}
                          />
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            component="a"
                            href={resource.file ? URL.createObjectURL(resource.file) : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ flex: 2, textTransform: 'none', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                          >
                            {resource.file ? resource.file.name : 'Document'}
                          </Button>
                        )}
                        <IconButton aria-label="delete" color="error" onClick={() => handleRemoveUnitResource(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        name="title"
                        label="Title"
                        size="small"
                        value={newUnitResource.title}
                        onChange={handleUnitResourceChange}
                        sx={{ flex: 1 }}
                      />
                      <ToggleButtonGroup
                        value={newUnitResource.type}
                        exclusive
                        onChange={handleUnitResourceTypeChange}
                        sx={{ flex: 1 }}
                        size="small"
                      >
                        <ToggleButton value="link" aria-label="Link" sx={{ textTransform: 'none' }}>
                          <LinkIcon fontSize="small" sx={{ mr: 0.5 }} /> Link
                        </ToggleButton>
                        <ToggleButton value="document" aria-label="Document" sx={{ textTransform: 'none' }}>
                          <AttachFileIcon fontSize="small" sx={{ mr: 0.5 }} /> Document
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {newUnitResource.type === 'link' ? (
                        <TextField
                          name="url"
                          label="URL"
                          size="small"
                          value={newUnitResource.url}
                          onChange={handleUnitResourceChange}
                          sx={{ flex: 2 }}
                        />
                      ) : (
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AttachFileIcon />}
                          sx={{ flex: 2, minWidth: 0 }}
                        >
                          {newUnitResource.file ? newUnitResource.file.name : 'Upload'}
                          <input
                            type="file"
                            hidden
                            onChange={handleUnitResourceFileChange}
                          />
                        </Button>
                      )}
                      <Button onClick={handleAddUnitResource} variant="outlined" color="primary" size="small" sx={{ height: 40 }}>
                        Add
                      </Button>
                    </Stack>
                  </Stack>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowAddEditUnit(false)} color="secondary">Cancel</Button>
                <Button onClick={handleSaveUnit} variant="contained" color="primary">Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
