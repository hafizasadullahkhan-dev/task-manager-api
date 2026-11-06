import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Tasks load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await api.post("/tasks", { title, description, priority });
      setTasks([response.data.task, ...tasks]);
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err.response?.data?.message || "Task add nahi hua");
    }
  };

  const handleToggle = async (task) => {
    try {
      const newStatus = task.status === "done" ? "pending" : "done";
      const response = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? response.data.task : t)));
    } catch (err) {
      setError(err.response?.data?.message || "Update nahi hua");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Pakka delete karna hai?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete nahi hua");
    }
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h1>Task Manager</h1>
        <div className="navbar-right">
          <span>Hi, {user.name}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="task-form">
        <h3>Naya Task</h3>
        <input
          type="text"
          placeholder="Task ka title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="btn-primary">
          + Add Task
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>Abhi koi task nahi.</p>
          <p>Pehla task banao! ✨</p>
        </div>
      ) : (
        <>
          <div className="tasks-header">
            <h3>Tumhare Tasks ({tasks.length})</h3>
          </div>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;