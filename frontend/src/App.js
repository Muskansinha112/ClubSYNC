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
    const res = await fetch("http://localhost:7000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!title || !assignedTo || !role || !createdBy) {
      alert("Fill required fields");
      return;
    }

    await fetch("http://localhost:7000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    await fetch(`http://localhost:7000/api/tasks/${id}`, {
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
    await fetch(`http://localhost:7000/api/tasks/${taskToDelete}`, {
      method: "DELETE"
    });
    fetchTasks();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">

        {/* Header */}
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">
          ClubSYNC
        </h1>

        {/* Create Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-800 text-white px-5 py-2 rounded-md text-sm hover:bg-black"
          >
            + Create Task
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-5 rounded-lg shadow-sm mb-6 max-w-4xl mx-auto border">
            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Task title"
                className="border p-2 rounded"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />

              <input
                placeholder="Assigned to"
                className="border p-2 rounded"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
              />

              <input
                placeholder="Issued by"
                className="border p-2 rounded"
                value={createdBy}
                onChange={e => setCreatedBy(e.target.value)}
              />

              <select
                className="border p-2 rounded"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="">Select Designation</option>
                <option value="Domain Head">Domain Head</option>
                <option value="Coordinator">Coordinator</option>
                <option value="Manager">Manager</option>
                <option value="Executive">Executive</option>
              </select>

              <input
                placeholder="Description"
                className="border p-2 rounded md:col-span-2"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <div>
                <label className="text-sm text-gray-600">Deadline</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>

            </div>

            <button
              onClick={addTask}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black"
            >
              Create
            </button>
          </div>
        )}

        {/* Filter */}
        <div className="text-center mb-6">
          <select
            className="border p-2 rounded"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="">All Designations</option>
            <option value="Domain Head">Domain Head</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Manager">Manager</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        {/* Tasks */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">

          {tasks
            .filter(task => !filterRole || task.role === filterRole)
            .map(task => {

              const isOverdue =
                task.deadline &&
                new Date(task.deadline) < new Date() &&
                task.status !== "Completed";

              return (
                <div
                  key={task._id}
                  className={`relative bg-white border p-5 rounded-lg shadow-sm hover:shadow-md transition ${
                    isOverdue ? "border-red-300" : "border-gray-200"
                  }`}
                >

                  {/* Top Right */}
                  <div className="absolute top-3 right-3 text-[11px] text-gray-500 text-right leading-tight">
                    <div>👤 {task.assignedTo}</div>
                    <div>✍ {task.createdBy}</div>
                    {task.deadline && (
                      <div>
                        📅 Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Designation */}
                  <span className="text-xs border border-gray-300 px-2 py-1 rounded text-gray-600">
                    {task.role}
                  </span>

                  {/* Content */}
                <p className="mt-3">
  <span className="text-xs text-gray-500">Task:</span>{" "}
  <span className="text-sm font-semibold text-gray-900">
    {task.title}
  </span>
</p>

<p className="mb-4">
  <span className="text-xs text-gray-500">Description:</span>{" "}
  <span className="text-sm text-gray-800">
    {task.description || "—"}
  </span>
</p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => markComplete(task._id)}
                      className="text-sm border border-green-500 text-green-600 px-3 py-1 rounded hover:bg-green-50"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => requestDelete(task._id)}
                      className="text-sm border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Status */}
                  <div className="absolute bottom-3 right-3">
                    <span className={`text-[11px] px-2 py-1 rounded border ${
                      task.status === "Completed"
                        ? "border-green-400 text-green-600"
                        : "border-yellow-400 text-yellow-600"
                    }`}>
                      {task.status}
                    </span>
                  </div>

                </div>
              );
            })}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow">
            <p>Delete this task?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;