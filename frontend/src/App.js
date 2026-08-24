import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [role, setRole] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [deadline, setDeadline] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!title || !assignedTo || !role || !createdBy) return;

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        assignedTo,
        role,
        deadline: deadline || null,
        createdBy,
        status: "Pending"
      })
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setRole("");
    setDeadline("");
    setCreatedBy("");
    setShowForm(false);
    fetchTasks();
  };

  const markComplete = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Completed" })
    });
    fetchTasks();
  };

  const requestDelete = (id) => {
    setTaskToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:5000/api/tasks/${taskToDelete}`, {
      method: "DELETE"
    });
    fetchTasks();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">

      <h1 className="text-4xl font-light text-center mb-10 text-blue-900 tracking-wide">
        ClubSYNC
      </h1>

      <div className="text-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          + Create Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8 max-w-4xl mx-auto border border-blue-100">
          <div className="grid md:grid-cols-2 gap-4">

            <input className="input" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="input" placeholder="Assigned to" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} />
            <input className="input" placeholder="Issued by" value={createdBy} onChange={e => setCreatedBy(e.target.value)} />

            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="">Select Designation</option>
              <option>Domain Head</option>
              <option>Coordinator</option>
              <option>Manager</option>
              <option>Executive</option>
            </select>

            <input className="input md:col-span-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

            <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>

          <button onClick={addTask} className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700">
            Create
          </button>
        </div>
      )}

      <div className="text-center mb-8">
        <select className="input w-60" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">All Designations</option>
          <option>Domain Head</option>
          <option>Coordinator</option>
          <option>Manager</option>
          <option>Executive</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {tasks.filter(task => !filterRole || task.role === filterRole).map(task => {

          const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "Completed";

          return (
            <div key={task._id}
              className={`relative bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-xl transition border ${isOverdue ? "border-red-300" : "border-blue-100"}`}>

              <div className="absolute top-3 right-3 text-xs text-blue-700 text-right">
                <div>👤 {task.assignedTo}</div>
                <div>✍ {task.createdBy}</div>
                {task.deadline && (
                  <div>📅 {new Date(task.deadline).toLocaleDateString()}</div>
                )}
              </div>

              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {task.role}
              </span>

              <h2 className="mt-4 text-lg font-semibold text-blue-900">
                {task.title}
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                {task.description || "No description"}
              </p>

              <div className="flex gap-3 mt-4">
                <button onClick={() => markComplete(task._id)}
                  className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 hover:bg-green-200">
                  Complete
                </button>

                <button onClick={() => requestDelete(task._id)}
                  className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                  Delete
                </button>
              </div>

              <div className="absolute bottom-3 right-3 text-xs px-3 py-1 rounded-full border">
                {task.status}
              </div>
            </div>
          );
        })}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-blue-900">Delete this task?</p>
            <div className="flex gap-4 mt-4 justify-center">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-full">Yes</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="border px-4 py-2 rounded-full">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input {
          border: 1px solid #dbeafe;
          padding: 10px;
          border-radius: 9999px;
          outline: none;
          background: white;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px #bfdbfe;
        }
      `}</style>

    </div>
  );
}

export default App;
