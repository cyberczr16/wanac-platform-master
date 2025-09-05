"use client";
import { useState, useEffect } from "react";
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
import { ProgramsService } from '../../../services/api/programs.service';
import { cohortService } from '../../../services/api/cohort.service';

// Data comes from API services (Programs, Cohorts)

export default function CourseManagementPage() {
  const [user, setUser] = useState({ name: "Coach" });
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programUnits, setProgramUnits] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddEditCourse, setShowAddEditCourse] = useState(false);
  const [showAddEditUnit, setShowAddEditUnit] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', syllabus: '', resources: [] });
  const [newResource, setNewResource] = useState({ type: 'link', title: '', url: '', file: null });
  const [unitForm, setUnitForm] = useState({ name: '', resources: [] });
  const [newUnitResource, setNewUnitResource] = useState({ type: 'link', title: '', url: '', file: null });
  const [classRoster, setClassRoster] = useState([]);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', idx: null });
  const [showCohortDialog, setShowCohortDialog] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);

  // Fetch programs and cohorts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProgramsService.getAll();
        const programsArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (Array.isArray(data.programs) ? data.programs : []));
        setPrograms(programsArray);
        if (programsArray.length > 0) {
          setSelectedProgram(programsArray[0]);
        }
      } catch (e) {
        setError('Failed to fetch programs');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchCohorts = async () => {
      try {
        const data = await cohortService.getCohorts();
        const cohortArray = Array.isArray(data) ? data : (Array.isArray(data.cohorts) ? data.cohorts : []);
        setCohorts(cohortArray);
      } catch (e) {
        setCohorts([]);
      }
    };
    fetchData();
    fetchCohorts();
  }, []);

  // Fetch units when selected program changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedProgram) {
        setProgramUnits([]);
        return;
      }
      try {
        const units = await ProgramsService.getUnitsByProgramId(selectedProgram.id);
        setProgramUnits(Array.isArray(units) ? units : []);
      } catch (e) {
        setProgramUnits([]);
      }
    };
    fetchUnits();
  }, [selectedProgram]);

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

  // Filter cohorts by selected program
  const filteredCohorts = Array.isArray(cohorts) && selectedProgram
    ? cohorts.filter(c => c.program_id === selectedProgram.id)
    : [];

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
            
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-heading">Programs Overview</h1>
                <button className="ml-auto bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600" onClick={handleOpenAddCourse}>
                  <FaPlus /> Add Course
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <div className="text-gray-500">Loading programs...</div>
                ) : (Array.isArray(programs) && programs.length > 0 ? (
                  programs.map(program => (
                    <div key={program.id} className={`bg-white border border-gray-100 rounded-xl p-4 shadow flex flex-col gap-2 ${selectedProgram && selectedProgram.id === program.id ? 'ring-2 ring-blue-400' : ''}`}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{program.title || program.name}</span>
                        <button className="ml-auto text-blue-500 hover:text-blue-700" onClick={e => { e.stopPropagation(); handleOpenAddCourse(); }} title="Edit Program">
                          <FaEdit />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">{program.description || '—'}</div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Units: {Array.isArray(programUnits) && selectedProgram && selectedProgram.id === program.id ? programUnits.length : 0}</span>
                        <span>Cohorts: {Array.isArray(cohorts) ? cohorts.filter(c => c.program_id === program.id).length : 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No programs found.</div>
                ))}
              </div>
            </section>

            {/* Units/Modules Management */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <FaLayerGroup className="text-green-600" />
                <h2 className="text-xl font-bold text-heading">Units/Modules</h2>
                <button className="ml-auto bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600" onClick={handleOpenAddUnit}>
                  <FaPlus /> Add Unit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(!selectedProgram || !Array.isArray(programUnits) || programUnits.length === 0) ? (
                  <div className="col-span-full text-gray-500">No units for this program.</div>
                ) : (
                  programUnits.map(unit => (
                    <div key={unit.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">{unit.name}</span>
                        <button className="ml-auto text-green-500 hover:text-green-700" onClick={() => setShowAddEditUnit(true)} title="Edit Unit">
                          <FaEdit />
                        </button>
                      </div>
                      <div className="text-xs text-gray-600">{unit.description || '—'}</div>
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
                <h2 className="text-xl font-bold text-heading">Cohorts</h2>
                <button className="ml-auto bg-purple-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-purple-600" onClick={handleOpenAddStudent}>
                  <FaPlus /> Add Student
                </button>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow">
                <div className="mb-2 font-semibold text-gray-700">{selectedProgram ? `Cohorts for ${selectedProgram.title || selectedProgram.name}` : 'Select a program to view cohorts'}</div>
                {(!selectedProgram || filteredCohorts.length === 0) ? (
                  <div className="text-gray-500">No cohorts found.</div>
                ) : (
                  <ul className="mb-4">
                    {filteredCohorts.map((cohort) => (
                      <li key={cohort.id} className="flex items-center gap-2 text-sm py-1 border-b last:border-b-0 cursor-pointer" onClick={() => { setSelectedCohort(cohort); setShowCohortDialog(true); }}>
                        <FaUser className="text-gray-400" />
                        <span>{cohort.name}</span>
                        <span className="ml-2 text-xs text-gray-500">{cohort.description || '—'}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {cohort.start_date ? new Date(cohort.start_date).toLocaleDateString() : '—'}
                          {cohort.end_date ? ` - ${new Date(cohort.end_date).toLocaleDateString()}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
            {/* Cohort Details Modal */}
            <Dialog open={showCohortDialog} onClose={() => setShowCohortDialog(false)}>
              <DialogTitle>{selectedCohort?.name || 'Cohort Details'}</DialogTitle>
              <DialogContent>
                <div className="space-y-2">
                  <div><span className="font-semibold">Description:</span> {selectedCohort?.description || '—'}</div>
                  <div><span className="font-semibold">Program:</span> {selectedProgram?.title || selectedProgram?.name || '—'}</div>
                  <div>
                    <span className="font-semibold">Dates:</span> {selectedCohort?.start_date ? new Date(selectedCohort.start_date).toLocaleDateString() : '—'}
                    {selectedCohort?.end_date ? ` - ${new Date(selectedCohort.end_date).toLocaleDateString()}` : ''}
                  </div>
                  <div><span className="font-semibold">Coaches:</span> {Array.isArray(selectedCohort?.coaches) ? selectedCohort.coaches.length : 0}</div>
                  <div><span className="font-semibold">Clients:</span> {Array.isArray(selectedCohort?.clients) ? selectedCohort.clients.length : 0}</div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowCohortDialog(false)} color="secondary">Close</Button>
              </DialogActions>
            </Dialog>
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
