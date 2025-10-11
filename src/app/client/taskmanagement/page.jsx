"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { tasksService } from "../../../services/api/tasks.service";
import {
  TextField,
  MenuItem,
} from "@mui/material";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";

// Constants
const PRIORITY_MATRIX = [
  { value: "urgent-important", label: "Urgent & Important" },
  { value: "not-urgent-important", label: "Not Urgent & Important" },
  { value: "urgent-not-important", label: "Urgent & Not Important" },
  { value: "not-urgent-not-important", label: "Not Urgent & Not Important" },
];

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  due_date: "",
  status: "pending",
  priority: "urgent-important",
};

export default function TaskManagementPage() {
  // State management
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState("");
  const [collapsed, setCollapsed] = useState(false);


  const getTasksByPriority = useCallback(
    (priority) => {
      return tasks.filter((task) => task.priority === priority);
    },
    [tasks]
  );


  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tasksService.getTasks();
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setTasks([]);
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    fetchTasks();
  }, [fetchTasks]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenDialog = useCallback((task = null) => {
    setEditTask(task);
    setForm(task ? { ...task } : INITIAL_FORM_STATE);
    setFormError("");
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditTask(null);
    setForm(INITIAL_FORM_STATE);
    setFormError("");
  }, []);

  const handleValidationErrors = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMsg = errors[firstErrorKey][0];
    setFormError(firstErrorMsg);
  };

  const handleSaveTask = useCallback(async () => {
    if (!form.title || !form.due_date) {
      setFormError("Title and Due Date are required.");
      return;
    }

    try {
      if (editTask) {
        const response = await tasksService.updateTask(editTask.id, form);
        toast.success(response.message);
      } else {
        const response = await tasksService.addTask(form);
        toast.success(response.message);
      }
      fetchTasks();
      handleCloseDialog();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          handleValidationErrors(error.response.data.errors);
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error);
        }
      } else {
        console.log(error);
      }
    }
  }, [form, editTask, fetchTasks, handleCloseDialog]);

  const handleDeleteTask = useCallback(
    async (id) => {
      if (!window.confirm("Delete this task?")) return;

      try {
        await tasksService.deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    [fetchTasks]
  );

  const handleUpdateTaskPriority = useCallback(
    async (task, newPriority) => {
      try {
        await tasksService.updateTask(task.id, {
          ...task,
          priority: newPriority,
        });
        fetchTasks();
      } catch (error) {
        console.error("Error updating task priority:", error);
      }
    },
    [fetchTasks]
  );

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const { source, destination, draggableId } = result;
      if (source.droppableId !== destination.droppableId) {
        const task = tasks.find((t) => t.id.toString() === draggableId);
        if (task) {
          handleUpdateTaskPriority(task, destination.droppableId);
        }
      }
    },
    [tasks, handleUpdateTaskPriority]
  );

  return (
    <div className="h-screen flex bg-white font-body">
      <Sidebar
        className="w-56 bg-white border-r border-gray-200"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        <ClientTopbar user={user} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-3 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Content */}
              <div className="flex-1 space-y-3">
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
                      <h1 className="text-xl font-bold text-white mb-1">Task Management</h1>
                      <p className="text-white/90 text-xs">Organize tasks using the Eisenhower Matrix</p>
                    </div>
                    <button
                onClick={() => handleOpenDialog()}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-[11px] shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                      <FaPlus size={10} />
                Add Task
                    </button>
            </div>
                </section>

                {/* Info Section */}
                <section className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <p className="text-[10px] text-gray-600">
                    Organize your tasks using the Eisenhower Matrix. Drag and drop tasks between quadrants to reprioritize.
                  </p>
                </section>

                {/* Matrix Grid */}
                <section>
              <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRIORITY_MATRIX.map((quadrant) => (
                    <Droppable
                      droppableId={quadrant.value}
                      key={quadrant.value}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                              className={`bg-white border border-gray-200 rounded-xl p-3 min-h-[280px] shadow-sm hover:shadow-md transition-shadow flex flex-col ${
                                snapshot.isDraggingOver ? "bg-blue-50 border-blue-300" : ""
                          }`}
                        >
                              <h3 className="text-sm font-bold text-[#002147] mb-3">
                            {quadrant.label}
                          </h3>

                              <div className="space-y-2 flex-1">
                          {getTasksByPriority(quadrant.value).map(
                            (task, idx) => (
                              <Draggable
                                draggableId={task.id.toString()}
                                index={idx}
                                key={task.id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                          className={`p-2.5 rounded-lg border transition-all cursor-pointer group ${
                                      snapshot.isDragging
                                              ? "bg-blue-100 border-blue-300 shadow-lg"
                                              : "bg-gray-50 border-gray-200 hover:bg-blue-50/50 hover:border-blue-200"
                                          }`}
                                    onClick={() => handleOpenDialog(task)}
                                  >
                                          <div className="flex justify-between items-start gap-2">
                                            <span className="font-semibold text-[11px] text-gray-900 flex-1 line-clamp-2">
                                        {task.title}
                                      </span>
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-medium whitespace-nowrap">
                                        {task.status}
                                      </span>
                                    </div>
                                          <div className="text-[9px] text-gray-500 mt-1.5 flex items-center gap-1">
                                            <span className="font-medium">Due:</span>
                                            {task.due_date}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          )}
                              </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </section>
              </div>
              
              {/* Right Sidebar */}
              <aside className="lg:w-64 space-y-3">
                {/* Quick Tips Card */}
                <div className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl shadow-sm p-3 text-white">
                  <h3 className="text-sm font-semibold mb-2">Priority Guide</h3>
                  <ul className="space-y-2 text-[10px] text-white/90">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span><strong>Urgent & Important:</strong> Do first</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span><strong>Not Urgent & Important:</strong> Schedule</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span><strong>Urgent & Not Important:</strong> Delegate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span><strong>Not Urgent & Not Important:</strong> Eliminate</span>
                    </li>
                  </ul>
                </div>

                {/* Stats Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
                  <h3 className="text-sm font-semibold text-[#002147] mb-3">Task Overview</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-[10px] font-medium text-gray-700">Total Tasks</span>
                      <span className="text-sm font-bold text-[#002147]">{tasks.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-[10px] font-medium text-gray-700">Completed</span>
                      <span className="text-sm font-bold text-green-600">
                        {tasks.filter(t => t.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-[10px] font-medium text-gray-700">Pending</span>
                      <span className="text-sm font-bold text-orange-600">
                        {tasks.filter(t => t.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>


          {/* Task Dialog Modal */}
          {dialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-5 w-full max-w-2xl shadow-2xl relative mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${editTask ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      {editTask ? <FaEdit className="text-blue-600" size={14} /> : <FaPlus className="text-orange-600" size={14} />}
                    </div>
                    <h2 className="text-base font-bold text-[#002147]">
                      {editTask ? "Edit Task" : "Add Task"}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseDialog}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-500" size={14} />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <TextField
                      label="Title"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      size="small"
                      sx={{
                        '& .MuiInputLabel-root': { fontSize: '13px' },
                        '& .MuiInputBase-root': { fontSize: '13px' }
                      }}
                    />
                    <TextField
                      label="Due Date"
                      name="due_date"
                      type="date"
                      value={form.due_date}
                      onChange={handleFormChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      size="small"
                      sx={{
                        '& .MuiInputLabel-root': { fontSize: '13px' },
                        '& .MuiInputBase-root': { fontSize: '13px' }
                      }}
                    />
                    <TextField
                      select
                      label="Priority (Quadrant)"
                      name="priority"
                      value={form.priority}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiInputLabel-root': { fontSize: '13px' },
                        '& .MuiInputBase-root': { fontSize: '13px' }
                      }}
                    >
                      {PRIORITY_MATRIX.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ fontSize: '13px' }}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Status"
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiInputLabel-root': { fontSize: '13px' },
                        '& .MuiInputBase-root': { fontSize: '13px' }
                      }}
                    >
                      <MenuItem value="pending" sx={{ fontSize: '13px' }}>Pending</MenuItem>
                      <MenuItem value="in-progress" sx={{ fontSize: '13px' }}>In Progress</MenuItem>
                      <MenuItem value="completed" sx={{ fontSize: '13px' }}>Completed</MenuItem>
                    </TextField>
                  </div>
                  <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    sx={{
                      '& .MuiInputLabel-root': { fontSize: '13px' },
                      '& .MuiInputBase-root': { fontSize: '13px' }
                    }}
                  />
                  {formError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[11px] flex items-center gap-2">
                      <span>⚠</span>
                      {formError}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
                  {editTask ? (
                    <button
                      onClick={() => handleDeleteTask(editTask.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-[11px] transition-all shadow-sm"
                    >
                      <FaTrash size={10} />
                      Delete
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCloseDialog}
                      className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold text-[11px] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTask}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all shadow-sm ${
                        editTask
                          ? 'bg-[#002147] text-white hover:bg-[#003875]'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {editTask ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
