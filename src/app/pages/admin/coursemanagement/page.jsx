"use client";
import { useState } from "react";
import AdminSidebar from '../../../../../components/dashboardcomponents/adminsidebar';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Stack, Select, MenuItem, InputLabel, FormControl, Autocomplete, Chip, Box, Typography } from '@mui/material';
import { FaBook, FaEdit, FaPlus, FaUsers, FaLayerGroup, FaUser } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data
const mockCoaches = [
  { id: 1, name: "Jane Doe", email: "jane@wanac.org" },
  { id: 2, name: "John Smith", email: "john@wanac.org" },
  { id: 3, name: "Alice Brown", email: "alice@wanac.org" },
];
const mockCoursesInit = [
  { id: 1, name: "Leadership 101", syllabus: "Intro to Leadership", coaches: [1], units: [1, 2] },
  { id: 2, name: "Resilience Training", syllabus: "Building Resilience", coaches: [], units: [3] },
];
const mockUnitsInit = [
  { id: 1, courseId: 1, name: "Unit 1: Foundations", coaches: [2] },
  { id: 2, courseId: 1, name: "Unit 2: Practice", coaches: [] },
  { id: 3, courseId: 2, name: "Unit 1: Mindset", coaches: [1, 3] },
];

export default function AdminCourseManagementPage() {
  const [courses, setCourses] = useState(mockCoursesInit);
  const [units, setUnits] = useState(mockUnitsInit);
  const [coaches] = useState(mockCoaches);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showUnitDialog, setShowUnitDialog] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', syllabus: '', coaches: [] });
  const [unitForm, setUnitForm] = useState({ name: '', courseId: '', coaches: [] });

  // Handlers for Courses
  const handleOpenAddCourse = () => {
    setCourseForm({ name: '', syllabus: '', coaches: [] });
    setSelectedCourse(null);
    setShowCourseDialog(true);
  };
  const handleOpenEditCourse = (course) => {
    setCourseForm({ name: course.name, syllabus: course.syllabus, coaches: course.coaches });
    setSelectedCourse(course);
    setShowCourseDialog(true);
  };
  const handleCourseFormChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };
  const handleCourseCoachChange = (event, value) => {
    setCourseForm({ ...courseForm, coaches: value.map(c => c.id) });
  };
  const handleSaveCourse = () => {
    if (selectedCourse) {
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...courseForm } : c));
    } else {
      setCourses([...courses, { id: Date.now(), ...courseForm, units: [] }]);
    }
    setShowCourseDialog(false);
  };

  // Handlers for Units
  const handleOpenAddUnit = (courseId) => {
    setUnitForm({ name: '', courseId, coaches: [] });
    setSelectedUnit(null);
    setShowUnitDialog(true);
  };
  const handleOpenEditUnit = (unit) => {
    setUnitForm({ name: unit.name, courseId: unit.courseId, coaches: unit.coaches });
    setSelectedUnit(unit);
    setShowUnitDialog(true);
  };
  const handleUnitFormChange = (e) => {
    setUnitForm({ ...unitForm, [e.target.name]: e.target.value });
  };
  const handleUnitCoachChange = (event, value) => {
    setUnitForm({ ...unitForm, coaches: value.map(c => c.id) });
  };
  const handleSaveUnit = () => {
    if (selectedUnit) {
      setUnits(units.map(u => u.id === selectedUnit.id ? { ...u, ...unitForm } : u));
    } else {
      setUnits([...units, { id: Date.now(), ...unitForm }]);
      setCourses(courses.map(c => c.id === unitForm.courseId ? { ...c, units: [...(c.units || []), Date.now()] } : c));
    }
    setShowUnitDialog(false);
  };

  // Helper to get coach objects from IDs
  const getCoachNames = (ids) => ids.map(id => coaches.find(c => c.id === id)?.name).filter(Boolean);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-16 md:ml-56">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Program Management</Typography>
        <Button variant="contained" color="primary" startIcon={<FaPlus />} sx={{ mb: 3 }} onClick={handleOpenAddCourse}>
          Add Course
        </Button>
        <Stack spacing={3}>
          {courses.map(course => (
            <Box key={course.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, bgcolor: '#fff' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <FaBook size={24} />
                <Typography variant="h6" sx={{ flex: 1 }}>{course.name}</Typography>
                <Button size="small" variant="outlined" startIcon={<FaEdit />} onClick={() => handleOpenEditCourse(course)}>Edit</Button>
                <Button size="small" variant="contained" color="success" startIcon={<FaPlus />} onClick={() => handleOpenAddUnit(course.id)}>Add Unit</Button>
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>Syllabus: {course.syllabus}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Assigned Coaches: {getCoachNames(course.coaches).join(', ') || <em>None</em>}</Typography>
              <Box sx={{ mt: 2, ml: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}><FaLayerGroup style={{ marginRight: 6 }} />Units</Typography>
                <Stack spacing={1}>
                  {units.filter(u => u.courseId === course.id).length === 0 && (
                    <Typography variant="body2" color="text.secondary">No units for this course.</Typography>
                  )}
                  {units.filter(u => u.courseId === course.id).map(unit => (
                    <Box key={unit.id} sx={{ border: '1px solid #f0f0f0', borderRadius: 1, p: 2, bgcolor: '#fafafa' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaLayerGroup size={18} />
                        <Typography variant="body2" sx={{ flex: 1 }}>{unit.name}</Typography>
                        <Button size="small" variant="outlined" startIcon={<FaEdit />} onClick={() => handleOpenEditUnit(unit)}>Edit</Button>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 1 }}>Assigned Coaches: {getCoachNames(unit.coaches).join(', ') || <em>None</em>}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Add/Edit Course Dialog */}
        <Dialog open={showCourseDialog} onClose={() => setShowCourseDialog(false)}>
          <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add Course'}</DialogTitle>
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
            <Autocomplete
              multiple
              options={coaches}
              getOptionLabel={option => option.name}
              value={coaches.filter(c => courseForm.coaches.includes(c.id))}
              onChange={handleCourseCoachChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
                ))
              }
              renderInput={params => (
                <TextField {...params} variant="outlined" label="Assign Coaches" placeholder="Select coaches" />
              )}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCourseDialog(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSaveCourse} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Unit Dialog */}
        <Dialog open={showUnitDialog} onClose={() => setShowUnitDialog(false)}>
          <DialogTitle>{selectedUnit ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="course-select-label">Course</InputLabel>
              <Select
                labelId="course-select-label"
                name="courseId"
                value={unitForm.courseId}
                label="Course"
                onChange={handleUnitFormChange}
                disabled={!!selectedUnit}
              >
                {courses.map(course => (
                  <MenuItem value={course.id} key={course.id}>{course.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Autocomplete
              multiple
              options={coaches}
              getOptionLabel={option => option.name}
              value={coaches.filter(c => unitForm.coaches.includes(c.id))}
              onChange={handleUnitCoachChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
                ))
              }
              renderInput={params => (
                <TextField {...params} variant="outlined" label="Assign Coaches" placeholder="Select coaches" />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUnitDialog(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSaveUnit} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}
