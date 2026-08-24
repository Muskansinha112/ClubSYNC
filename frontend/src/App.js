import { useEffect, useState, useMemo } from "react";

const DOMAIN_OPTIONS = [
  { name: "Technical", icon: "💻", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Design", icon: "🎨", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { name: "Operations", icon: "⚙️", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Logistics", icon: "📦", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { name: "Sponsorship", icon: "💰", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { name: "Marketing / PR", icon: "📢", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { name: "General", icon: "📁", color: "bg-slate-100 text-slate-700 border-slate-200" }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("Technical");
  const [createdBy, setCreatedBy] = useState("");
  const [createdByRole, setCreatedByRole] = useState("");
  const [deadline, setDeadline] = useState("");

  // Search & Filter State
  const [filterDomain, setFilterDomain] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, COMPLETED, OVERDUE

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo || !role || !createdBy) return;

    try {
      await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          assignedTo,
          role,
          domain: domain || "General",
          createdBy,
          createdByRole: createdByRole || "Club Leader",
          deadline: deadline || null,
          status: "Pending"
        })
      });

      // Reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setRole("");
      setDomain("Technical");
      setCreatedBy("");
      setCreatedByRole("");
      setDeadline("");
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await fetch(`http://localhost:5001/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const requestDelete = (id) => {
    setTaskToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskToDelete}`, {
        method: "DELETE"
      });
      fetchTasks();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Helper for human-readable deadline calculation
  const getDeadlineText = (deadlineStr, isCompleted) => {
    if (!deadlineStr) return null;
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = new Date(deadlineStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    if (isCompleted) {
      return { text: `Due ${formattedDate}`, class: "text-slate-500" };
    }

    if (diffDays < 0) {
      const pastDays = Math.abs(diffDays);
      return {
        text: `Overdue by ${pastDays} ${pastDays === 1 ? "day" : "days"} (${formattedDate})`,
        class: "text-rose-600 font-semibold"
      };
    } else if (diffDays === 0) {
      return { text: `Due Today (${formattedDate})`, class: "text-amber-600 font-semibold" };
    } else if (diffDays === 1) {
      return { text: `Due Tomorrow (${formattedDate})`, class: "text-indigo-600 font-medium" };
    } else {
      return { text: `Due in ${diffDays} days (${formattedDate})`, class: "text-slate-600" };
    }
  };

  // Helper to get domain styling details
  const getDomainStyle = (domainName) => {
    return (
      DOMAIN_OPTIONS.find((d) => d.name === domainName) || {
        name: domainName || "General",
        icon: "📁",
        color: "bg-slate-100 text-slate-700 border-slate-200"
      }
    );
  };

  // Derived Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = tasks.filter((t) => t.status !== "Completed").length;
    const overdue = tasks.filter(
      (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "Completed"
    ).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  // Filtered Tasks Calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const isOverdue =
        task.deadline && new Date(task.deadline) < new Date() && task.status !== "Completed";

      if (filterDomain && task.domain !== filterDomain) return false;
      if (filterRole && task.role !== filterRole) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesAssignee = task.assignedTo?.toLowerCase().includes(query);
        const matchesCreator = task.createdBy?.toLowerCase().includes(query);
        const matchesDomain = task.domain?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAssignee && !matchesCreator && !matchesDomain) return false;
      }

      if (statusFilter === "PENDING" && task.status === "Completed") return false;
      if (statusFilter === "COMPLETED" && task.status !== "Completed") return false;
      if (statusFilter === "OVERDUE" && !isOverdue) return false;

      return true;
    });
  }, [tasks, filterDomain, filterRole, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Header / Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
              ⚡
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Club<span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">SYNC</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition"
          >
            <span className="text-base leading-none">+</span> Assign New Task
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`p-4 rounded-xl border text-left transition ${
              statusFilter === "ALL"
                ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </button>

          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`p-4 rounded-xl border text-left transition ${
              statusFilter === "PENDING"
                ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{stats.pending}</p>
          </button>

          <button
            onClick={() => setStatusFilter("COMPLETED")}
            className={`p-4 rounded-xl border text-left transition ${
              statusFilter === "COMPLETED"
                ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.completed}</p>
          </button>

          <button
            onClick={() => setStatusFilter("OVERDUE")}
            className={`p-4 rounded-xl border text-left transition ${
              statusFilter === "OVERDUE"
                ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Overdue</p>
            <p className="text-2xl font-bold text-rose-700 mt-1">{stats.overdue}</p>
          </button>
        </div>

        {/* Club Domain Filter Pills Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter by Club Domain
            </span>
            {filterDomain && (
              <button
                onClick={() => setFilterDomain("")}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Clear Domain Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterDomain("")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${
                filterDomain === ""
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Domains
            </button>

            {DOMAIN_OPTIONS.map((dom) => (
              <button
                key={dom.name}
                onClick={() => setFilterDomain(dom.name)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition inline-flex items-center gap-1.5 ${
                  filterDomain === dom.name
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : `${dom.color} hover:opacity-90`
                }`}
              >
                <span>{dom.icon}</span>
                <span>{dom.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Designation Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="🔍 Search title, assignee, domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/50"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["", "Domain Head", "Coordinator", "Manager", "Executive"].map((roleName) => (
              <button
                key={roleName}
                onClick={() => setFilterRole(roleName)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  filterRole === roleName
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {roleName || "All Designations"}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-base font-semibold text-slate-800">No matching tasks found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query, domain, or designation filters.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => {
              const isOverdue =
                task.deadline &&
                new Date(task.deadline) < new Date() &&
                task.status !== "Completed";

              const isCompleted = task.status === "Completed";
              const deadlineInfo = getDeadlineText(task.deadline, isCompleted);
              const domainStyle = getDomainStyle(task.domain);

              return (
                <div
                  key={task._id}
                  className={`bg-white rounded-xl p-5 border shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                    isCompleted
                      ? "border-emerald-200 bg-emerald-50/20"
                      : isOverdue
                      ? "border-rose-300 bg-rose-50/10 ring-1 ring-rose-200"
                      : "border-slate-200 hover:border-indigo-200"
                  }`}
                >
                  <div>
                    {/* Top Row: Domain Badge & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1 ${domainStyle.color}`}
                      >
                        <span>{domainStyle.icon}</span>
                        <span>{task.domain || "General"}</span>
                      </span>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isOverdue
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isCompleted ? "✓ Completed" : isOverdue ? "⚠️ Overdue" : "Pending"}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h3
                      className={`text-base font-bold ${
                        isCompleted ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {/* Task Description */}
                    {task.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {task.description}
                      </p>
                    )}

                    {/* Clarified Assignee & Assigner Information */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                      {/* Assigned To Row */}
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 text-sm">👤</span>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                            Task Assigned To
                          </span>
                          <span className="font-semibold text-slate-800">{task.assignedTo}</span>
                          {task.role && (
                            <span className="text-slate-500 font-normal"> ({task.role})</span>
                          )}
                        </div>
                      </div>

                      {/* Assigned By Row */}
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 text-sm">✍️</span>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                            Task Assigned By
                          </span>
                          <span className="font-medium text-slate-700">{task.createdBy}</span>
                          {task.createdByRole && (
                            <span className="text-slate-500 font-normal"> ({task.createdByRole})</span>
                          )}
                        </div>
                      </div>

                      {/* Due Date Information */}
                      {deadlineInfo && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-slate-400 text-sm">📅</span>
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                              Due Date
                            </span>
                            <span className={`text-xs ${deadlineInfo.class}`}>
                              {deadlineInfo.text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Actions Toolbar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                        isCompleted
                          ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {isCompleted ? "Reopen Task" : "✓ Mark as Complete"}
                    </button>

                    <button
                      onClick={() => requestDelete(task._id)}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 transition font-medium"
                      title="Delete Task"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Dialog: Assign New Task */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Assign New Task</h2>
                <p className="text-xs text-slate-500">Select domain, assignee, and set deadline.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addTask} className="mt-4 space-y-4">
              {/* Task Title & Club Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build Hackathon Website"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Club Domain *
                  </label>
                  <select
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white font-medium"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.icon} {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee Details Section */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Assignee Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Task Assigned To (Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Assignee Designation *
                    </label>
                    <select
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                    >
                      <option value="">Select Designation</option>
                      <option>Domain Head</option>
                      <option>Coordinator</option>
                      <option>Manager</option>
                      <option>Executive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Assigner Details Section */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Assigner Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Task Assigned By (Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Miller"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Assigner Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Club President"
                      value={createdByRole}
                      onChange={(e) => setCreatedByRole(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Due Date & Description */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date / Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Description & Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional details or guidelines..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs font-semibold px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-semibold px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Task?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>

            <div className="flex gap-2 mt-5 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs font-semibold px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="text-xs font-semibold px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm"
              >
                Yes, Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
