import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  const [editingId, setEditingId] = useState(null);

  // Get all tasks when page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update task
        const response = await axios.put(
          `${API_URL}/${editingId}`,
          {
            ...formData,
            isCompleted: false
          }
        );

        setTasks(
          tasks.map((task) =>
            task._id === editingId
              ? response.data
              : task
          )
        );

        setEditingId(null);
      } else {
        // Create task
        const response = await axios.post(API_URL, {
          ...formData,
          isCompleted: false
        });

        setTasks([response.data, ...tasks]);
      }

      // Clear form
      setFormData({
        title: "",
        description: "",
        dueDate: ""
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setTasks(
        tasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  // Edit Task
  const handleEdit = (task) => {
    setEditingId(task._id);

    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0]
    });
  };

  // Complete / Pending
  const toggleComplete = async (task) => {
    try {
      const response = await axios.put(
        `${API_URL}/${task._id}`,
        {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          isCompleted: !task.isCompleted
        }
      );

      setTasks(
        tasks.map((item) =>
          item._id === task._id
            ? response.data
            : item
        )
      );
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  return (
    <div className="container">

      <h1>Todo List App</h1>

      {/* Task Form */}
      <form
        onSubmit={handleSubmit}
        className="task-form"
      >

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId
            ? "Update Task"
            : "Add Task"}
        </button>

      </form>

      {/* Task List */}
      <div className="task-list">

        {tasks.length === 0 ? (
          <p className="no-task">
            No tasks available
          </p>
        ) : (
          tasks.map((task) => (

            <div
              className={`task ${
                task.isCompleted
                  ? "completed"
                  : ""
              }`}
              key={task._id}
            >

              <h2>{task.title}</h2>

              <p>
                {task.description}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(
                  task.dueDate
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {task.isCompleted
                  ? "Completed"
                  : "Pending"}
              </p>

              <div className="buttons">

                <button
                  onClick={() =>
                    toggleComplete(task)
                  }
                >
                  {task.isCompleted
                    ? "Mark Pending"
                    : "Complete"}
                </button>

                <button
                  onClick={() =>
                    handleEdit(task)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(task._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default App;