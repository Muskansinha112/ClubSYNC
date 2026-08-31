import { useEffect, useState, useMemo } from "react";

const DOMAIN_OPTIONS = [
  { name: "Technical", icon: "💻", color: "bg-indigo-50 text-indigo-700 border-indigo-200/80" },
  { name: "Design", icon: "🎨", color: "bg-sky-50 text-sky-700 border-sky-200/80" },
  { name: "Operations", icon: "⚙️", color: "bg-amber-50 text-amber-700 border-amber-200/80" },
  { name: "Logistics", icon: "📦", color: "bg-teal-50 text-teal-700 border-teal-200/80" },
  { name: "Sponsorship", icon: "💰", color: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  { name: "Marketing / PR", icon: "📢", color: "bg-rose-50 text-rose-700 border-rose-200/80" },
  { name: "General", icon: "📁", color: "bg-slate-100 text-slate-700 border-slate-200/80" }
];

const DESIGNATIONS = ["Domain Head", "Coordinator", "Manager", "Executive"];

function App() {
  // Primary Entity States
  const [tasks, setTasks] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);

  // Sidebar Selection States
  const [selectedClub, setSelectedClub] = useState(null); // null = All Clubs
  const [selectedEvent, setSelectedEvent] = useState(null); // null = All Events
  const [expandedClubId, setExpandedClubId] = useState(null);

  // Modal Dialog States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Task Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("Technical");
  const [selectedClubName, setSelectedClubName] = useState("");
  const [selectedEventName, setSelectedEventName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdByRole, setCreatedByRole] = useState("");
  const [deadline, setDeadline] = useState("");

  // Club Form State
  const [newClubName, setNewClubName] = useState("");
  const [newClubCategory, setNewClubCategory] = useState("Technical");
  const [newClubFoundedDate, setNewClubFoundedDate] = useState("");
  const [newClubHost, setNewClubHost] = useState("");
  const [newClubHostRole, setNewClubHostRole] = useState("Faculty Advisor");
  const [newClubDescription, setNewClubDescription] = useState("");
  const [newClubMemberCount, setNewClubMemberCount] = useState(25);

  // Event Form State
  const [newEventName, setNewEventName] = useState("");
  const [newEventClubName, setNewEventClubName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventCoordinator, setNewEventCoordinator] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  // Search & Filter State
  const [filterDomain, setFilterDomain] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, COMPLETED, OVERDUE

  useEffect(() => {
    fetchTasks();
    fetchClubs();
    fetchEvents();
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

  const fetchClubs = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/clubs");
      const data = await res.json();
      setClubs(data);
      if (data.length > 0) {
        setSelectedClubName(data[0].name);
        setNewEventClubName(data[0].name);
      }
    } catch (err) {
      console.error("Failed to fetch clubs:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/events");
      const data = await res.json();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventName(data[0].eventName);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  // Add New Task
  const handleAddTask = async (e) => {
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
          clubName: selectedClubName || (selectedClub ? selectedClub.name : (clubs[0] ? clubs[0].name : "Coding Club")),
          eventName: selectedEventName || (selectedEvent ? selectedEvent.eventName : "General Operations"),
          createdBy,
          createdByRole: createdByRole || "Club Leader",
          deadline: deadline || null,
          status: "Pending"
        })
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setRole("");
      setDomain("Technical");
      setCreatedBy("");
      setCreatedByRole("");
      setDeadline("");
      setShowTaskModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  // Add New Club
  const handleAddClub = async (e) => {
    e.preventDefault();
    if (!newClubName || !newClubHost) return;

    try {
      await fetch("http://localhost:5001/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClubName,
          category: newClubCategory,
          foundedDate: newClubFoundedDate || new Date(),
          createdByHost: newClubHost,
          hostRole: newClubHostRole,
          description: newClubDescription,
          memberCount: Number(newClubMemberCount) || 15
        })
      });

      setNewClubName("");
      setNewClubHost("");
      setNewClubDescription("");
      setShowClubModal(false);
      fetchClubs();
    } catch (err) {
      console.error("Failed to add club:", err);
    }
  };

  // Add New Event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventName || !newEventClubName) return;

    try {
      await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: newEventName,
          clubName: newEventClubName,
          eventDate: newEventDate || new Date(),
          location: newEventLocation || "Main Auditorium",
          coordinator: newEventCoordinator || "Event Lead",
          description: newEventDescription
        })
      });

      setNewEventName("");
      setNewEventLocation("");
      setNewEventCoordinator("");
      setNewEventDescription("");
      setShowEventModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to add event:", err);
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

  const requestDeleteItem = (id, type) => {
    setItemToDelete({ id, type });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === "TASK") {
        await fetch(`http://localhost:5001/api/tasks/${itemToDelete.id}`, { method: "DELETE" });
        fetchTasks();
      } else if (itemToDelete.type === "CLUB") {
        await fetch(`http://localhost:5001/api/clubs/${itemToDelete.id}`, { method: "DELETE" });
        fetchClubs();
        if (selectedClub && selectedClub._id === itemToDelete.id) {
          setSelectedClub(null);
        }
      } else if (itemToDelete.type === "EVENT") {
        await fetch(`http://localhost:5001/api/events/${itemToDelete.id}`, { method: "DELETE" });
        fetchEvents();
        if (selectedEvent && selectedEvent._id === itemToDelete.id) {
          setSelectedEvent(null);
        }
      }
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const clearAllFilters = () => {
    setSelectedClub(null);
    setSelectedEvent(null);
    setFilterDomain("");
    setFilterRole("");
    setSearchQuery("");
    setStatusFilter("ALL");
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
      return { text: `Due ${formattedDate}`, class: "text-slate-500 bg-slate-100/80 border-slate-200" };
    }

    if (diffDays < 0) {
      const pastDays = Math.abs(diffDays);
      return {
        text: `Overdue by ${pastDays} ${pastDays === 1 ? "day" : "days"} (${formattedDate})`,
        class: "text-rose-700 bg-rose-50 border-rose-200 font-semibold"
      };
    } else if (diffDays === 0) {
      return { text: `Due Today (${formattedDate})`, class: "text-amber-700 bg-amber-50 border-amber-200 font-semibold" };
    } else if (diffDays === 1) {
      return { text: `Due Tomorrow (${formattedDate})`, class: "text-blue-700 bg-blue-50 border-blue-200 font-medium" };
    } else {
      return { text: `Due in ${diffDays} days (${formattedDate})`, class: "text-slate-600 bg-slate-100/70 border-slate-200" };
    }
  };

  const getDomainStyle = (domainName) => {
    return (
      DOMAIN_OPTIONS.find((d) => d.name === domainName) || {
        name: domainName || "General",
        icon: "📁",
        color: "bg-slate-100 text-slate-700 border-slate-200"
      }
    );
  };

  // Filtered Tasks Calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const isOverdue =
        task.deadline && new Date(task.deadline) < new Date() && task.status !== "Completed";

      if (selectedClub && task.clubName !== selectedClub.name) return false;
      if (selectedEvent && task.eventName !== selectedEvent.eventName) return false;
      if (filterDomain && task.domain !== filterDomain) return false;
      if (filterRole && task.role !== filterRole) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesAssignee = task.assignedTo?.toLowerCase().includes(query);
        const matchesCreator = task.createdBy?.toLowerCase().includes(query);
        const matchesDomain = task.domain?.toLowerCase().includes(query);
        const matchesClub = task.clubName?.toLowerCase().includes(query);
        const matchesEvent = task.eventName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAssignee && !matchesCreator && !matchesDomain && !matchesClub && !matchesEvent) return false;
      }

      if (statusFilter === "PENDING" && task.status === "Completed") return false;
      if (statusFilter === "COMPLETED" && task.status !== "Completed") return false;
      if (statusFilter === "OVERDUE" && !isOverdue) return false;

      return true;
    });
  }, [tasks, selectedClub, selectedEvent, filterDomain, filterRole, searchQuery, statusFilter]);

  // Derived Workspace Stats
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === "Completed").length;
    const pending = filteredTasks.filter((t) => t.status !== "Completed").length;
    const overdue = filteredTasks.filter(
      (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "Completed"
    ).length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, overdue, completionPercentage };
  }, [filteredTasks]);

  const hasActiveFilters = selectedClub || selectedEvent || filterDomain || filterRole || searchQuery || statusFilter !== "ALL";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* LEFT SIDEBAR PANEL: CLUBS & EVENTS NAVIGATION */}
      <aside className="w-full md:w-80 bg-white/90 backdrop-blur-md border-r border-slate-200/80 shrink-0 flex flex-col justify-between h-auto md:h-screen md:sticky md:top-0 shadow-xs z-20 overflow-y-auto">
        <div>
          {/* Welcome & Brand Banner */}
          <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-blue-50/60 via-white to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 ring-1 ring-blue-200">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Club<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SYNC</span>
                </h1>
                <p className="text-[11px] font-bold text-blue-600 tracking-wider">Campus Workspace</p>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-slate-600 leading-relaxed shadow-xs">
              👋 <span className="font-semibold text-slate-900">Welcome to ClubSYNC!</span> Track each club, monitor events, and manage task completion.
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-100">
            <button
              onClick={() => setShowClubModal(true)}
              className="text-xs font-bold px-3 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 active:scale-95 transition text-center shadow-xs"
            >
              + Add Club
            </button>
            <button
              onClick={() => setShowEventModal(true)}
              className="text-xs font-bold px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 active:scale-95 transition text-center shadow-xs"
            >
              + Add Event
            </button>
          </div>

          {/* Clubs & Nested Events Navigation Tree */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Campus Clubs & Events
              </span>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-[11px] text-blue-600 font-semibold hover:underline">
                  Reset All
                </button>
              )}
            </div>

            {/* Global Overview Option */}
            <button
              onClick={() => {
                setSelectedClub(null);
                setSelectedEvent(null);
              }}
              className={`w-full text-left text-xs font-bold p-3 rounded-2xl border transition flex items-center justify-between ${
                !selectedClub && !selectedEvent
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌐</span> All Clubs & Events
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                {tasks.length}
              </span>
            </button>

            {/* Club Items Tree */}
            <div className="space-y-2 pt-1">
              {clubs.map((club) => {
                const isClubSelected = selectedClub && selectedClub._id === club._id;
                const isExpanded = expandedClubId === club._id || isClubSelected;
                const clubEvents = events.filter((e) => e.clubName === club.name);
                const clubTasksCount = tasks.filter((t) => t.clubName === club.name).length;

                return (
                  <div key={club._id} className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
                    {/* Club Header Item */}
                    <div
                      className={`p-3 flex items-center justify-between cursor-pointer transition ${
                        isClubSelected
                          ? "bg-indigo-50/90 border-l-4 border-l-indigo-600 text-indigo-900 font-bold"
                          : "hover:bg-slate-50 text-slate-800"
                      }`}
                      onClick={() => {
                        setSelectedClub(club);
                        setSelectedEvent(null);
                        setExpandedClubId(expandedClubId === club._id ? null : club._id);
                      }}
                    >
                      <div className="flex items-center gap-2 text-xs truncate">
                        <span>🏢</span>
                        <span className="truncate font-bold text-slate-900">{club.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {clubTasksCount}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDeleteItem(club._id, "CLUB");
                          }}
                          className="text-slate-300 hover:text-rose-600 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Nested Events List */}
                    {isExpanded && clubEvents.length > 0 && (
                      <div className="bg-slate-50/80 p-2.5 pl-6 space-y-1.5 border-t border-slate-100 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Events ({clubEvents.length})
                        </span>
                        {clubEvents.map((ev) => {
                          const isEventSelected = selectedEvent && selectedEvent._id === ev._id;
                          const eventTaskCount = tasks.filter((t) => t.eventName === ev.eventName).length;

                          return (
                            <div
                              key={ev._id}
                              onClick={() => {
                                setSelectedClub(club);
                                setSelectedEvent(ev);
                              }}
                              className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition text-xs ${
                                isEventSelected
                                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                                  : "hover:bg-slate-200/70 text-slate-700"
                              }`}
                            >
                              <div className="truncate pr-1">
                                <span className="font-semibold block truncate">📅 {ev.eventName}</span>
                                <span className={`text-[10px] block ${isEventSelected ? "text-emerald-100" : "text-slate-400"}`}>
                                  {new Date(ev.eventDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isEventSelected ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-600"}`}>
                                  {eventTaskCount}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requestDeleteItem(ev._id, "EVENT");
                                  }}
                                  className="text-slate-400 hover:text-rose-600 text-[10px] px-0.5"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">ClubSYNC v2.0 • Campus Task Hub</p>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL: WORKSPACE DASHBOARD */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">

        {/* Active Selection Banner Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-xs">
                {selectedEvent ? "📅 Event Workspace" : selectedClub ? "🏢 Club Workspace" : "🌐 Global Campus Workspace"}
              </span>
              {selectedClub && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {selectedClub.category}
                </span>
              )}
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {selectedEvent ? selectedEvent.eventName : selectedClub ? selectedClub.name : "All Clubs & Events Workspace"}
            </h2>

            {/* Active Sub-details */}
            {selectedEvent ? (
              <p className="text-xs text-slate-600 mt-2 flex flex-wrap items-center gap-4 font-medium">
                <span>🏢 Host Club: <strong className="text-slate-900">{selectedEvent.clubName}</strong></span>
                <span>📅 Date: <strong className="text-slate-900">{new Date(selectedEvent.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                <span>📍 Venue: <strong className="text-slate-900">{selectedEvent.location}</strong></span>
                <span>👤 Lead: <strong className="text-slate-900">{selectedEvent.coordinator}</strong></span>
              </p>
            ) : selectedClub ? (
              <p className="text-xs text-slate-600 mt-2 flex flex-wrap items-center gap-4 font-medium">
                <span>✍️ Host Creator: <strong className="text-slate-900">{selectedClub.createdByHost}</strong> ({selectedClub.hostRole})</span>
                <span>📅 Starting Date: <strong className="text-slate-900">{new Date(selectedClub.foundedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                <span>👥 Roster: <strong className="text-slate-900">{selectedClub.memberCount || 25} Members</strong></span>
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                Select a Club or Event from the left sidebar to filter progress and tasks.
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (selectedClub) setSelectedClubName(selectedClub.name);
              if (selectedEvent) setSelectedEventName(selectedEvent.eventName);
              setShowTaskModal(true);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-95 transition-all shrink-0"
          >
            <span>+</span> Assign Task for Active Scope
          </button>
        </div>

        {/* Completion Progress Bar */}
        {stats.total > 0 && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-xs">
                📈
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Scope Completion Rate</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {stats.completed} of {stats.total} tasks completed ({stats.completionPercentage}%)
                </p>
              </div>
            </div>

            <div className="w-full sm:w-72 bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`p-5 rounded-3xl border text-left transition-all ${
              statusFilter === "ALL"
                ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs"
                : "bg-white border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</p>
              <span className="text-xl">📊</span>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
          </button>

          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`p-5 rounded-3xl border text-left transition-all ${
              statusFilter === "PENDING"
                ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs"
                : "bg-white border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
              <span className="text-xl">⏳</span>
            </div>
            <p className="text-3xl font-black text-amber-700 mt-2">{stats.pending}</p>
          </button>

          <button
            onClick={() => setStatusFilter("COMPLETED")}
            className={`p-5 rounded-3xl border text-left transition-all ${
              statusFilter === "COMPLETED"
                ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                : "bg-white border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed</p>
              <span className="text-xl">✅</span>
            </div>
            <p className="text-3xl font-black text-emerald-700 mt-2">{stats.completed}</p>
          </button>

          <button
            onClick={() => setStatusFilter("OVERDUE")}
            className={`p-5 rounded-3xl border text-left transition-all ${
              statusFilter === "OVERDUE"
                ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 shadow-xs"
                : "bg-white border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Overdue</p>
              <span className="text-xl">🚨</span>
            </div>
            <p className="text-3xl font-black text-rose-700 mt-2">{stats.overdue}</p>
          </button>
        </div>

        {/* Domain & Search Filter Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search active tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 outline-none focus:border-blue-500 bg-slate-50/50"
            />
            <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">✕</button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterDomain("")}
              className={`text-xs px-3.5 py-2 rounded-2xl font-bold border transition ${
                filterDomain === "" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Domains
            </button>
            {DOMAIN_OPTIONS.map((d) => (
              <button
                key={d.name}
                onClick={() => setFilterDomain(d.name)}
                className={`text-xs px-3.5 py-2 rounded-2xl font-bold border inline-flex items-center gap-1.5 transition ${
                  filterDomain === d.name ? "bg-blue-600 text-white border-blue-600 shadow-xs" : `${d.color} hover:opacity-90`
                }`}
              >
                <span>{d.icon}</span> <span>{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-slate-900">No tasks in active workspace</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Assign a new task to this club/event or clear your active search filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                    isCompleted
                      ? "border-emerald-200 bg-emerald-50/10"
                      : isOverdue
                      ? "border-rose-300 bg-rose-50/10 ring-1 ring-rose-200"
                      : "border-slate-200/80 hover:border-blue-200"
                  }`}
                >
                  <div>
                    {/* Top Badges: Club Tag + Domain Badge + Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
                        🏢 {task.clubName || "General Club"}
                      </span>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${domainStyle.color}`}>
                        {domainStyle.icon} {task.domain || "General"}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isOverdue
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isCompleted ? "✓ Done" : isOverdue ? "⚠️ Overdue" : "Pending"}
                      </span>
                    </div>

                    {/* Linked Event Tag */}
                    {task.eventName && (
                      <p className="text-xs font-semibold text-indigo-600 mb-2 flex items-center gap-1">
                        <span>📅 Event:</span> <span>{task.eventName}</span>
                      </p>
                    )}

                    {/* Title & Description */}
                    <h3 className={`text-lg font-bold tracking-tight ${isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata Box */}
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {task.assignedTo ? task.assignedTo.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Member</span>
                          <span className="font-bold text-slate-900">{task.assignedTo}</span>
                          <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-lg font-semibold">
                            {task.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 text-sm">✍️</span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Host / Assigner</span>
                          <span className="font-semibold text-slate-700">{task.createdBy}</span>
                          {task.createdByRole && <span className="text-slate-500 font-normal"> ({task.createdByRole})</span>}
                        </div>
                      </div>

                      {deadlineInfo && (
                        <div className="pt-1">
                          <span className={`text-xs px-3 py-1 rounded-xl border inline-block ${deadlineInfo.class}`}>
                            📅 {deadlineInfo.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`text-xs font-bold px-4 py-2 rounded-2xl border transition ${
                        isCompleted
                          ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {isCompleted ? "Reopen Task" : "✓ Mark Complete"}
                    </button>

                    <button
                      onClick={() => requestDeleteItem(task._id, "TASK")}
                      className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition"
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

      {/* MODAL 1: ASSIGN TASK */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Assign New Task</h2>
                <p className="text-xs text-slate-500">Link task to a club, event, assignee, and set due date.</p>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Host Club *</label>
                  <select
                    value={selectedClubName}
                    onChange={(e) => setSelectedClubName(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  >
                    {clubs.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Event</label>
                  <select
                    value={selectedEventName}
                    onChange={(e) => setSelectedEventName(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="General Operations">General Operations</option>
                    {events.map((ev) => (
                      <option key={ev._id} value={ev.eventName}>{ev.eventName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Event Registration Portal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Assignee Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Assignee Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Designation *</label>
                    <select
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Role</option>
                      {DESIGNATIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Host / Assigner Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Assigner Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prof. Alan Turing"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Host Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Faculty Mentor"
                      value={createdByRole}
                      onChange={(e) => setCreatedByRole(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Tag</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white font-medium"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d.name} value={d.name}>{d.icon} {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Task instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="text-xs font-semibold px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl">Cancel</button>
                <button type="submit" className="text-xs font-bold px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:opacity-95 shadow-md shadow-blue-500/20">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CLUB */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Register New Campus Club</h2>
                <p className="text-xs text-slate-500">Specify founding host, starting date, and category.</p>
              </div>
              <button onClick={() => setShowClubModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleAddClub} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Club Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & ML Society"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newClubCategory}
                    onChange={(e) => setNewClubCategory(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Sports">Sports</option>
                    <option value="Literary">Literary</option>
                    <option value="Social Service">Social Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Host Creator / Founder *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Robert Vance"
                    value={newClubHost}
                    onChange={(e) => setNewClubHost(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Host Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Head of AI Dept"
                    value={newClubHostRole}
                    onChange={(e) => setNewClubHostRole(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Starting</label>
                  <input
                    type="date"
                    value={newClubFoundedDate}
                    onChange={(e) => setNewClubFoundedDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Member Count</label>
                  <input
                    type="number"
                    value={newClubMemberCount}
                    onChange={(e) => setNewClubMemberCount(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Club Description</label>
                <textarea
                  rows={2}
                  placeholder="Club vision, mission, and activities..."
                  value={newClubDescription}
                  onChange={(e) => setNewClubDescription(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowClubModal(false)} className="text-xs font-semibold px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl">Cancel</button>
                <button type="submit" className="text-xs font-bold px-5 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20">Register Club</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD EVENT */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create Campus Event</h2>
                <p className="text-xs text-slate-500">Associate an event with a club, date, and location.</p>
              </div>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleAddEvent} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CodeSprint 2026"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Host Club *</label>
                  <select
                    value={newEventClubName}
                    onChange={(e) => setNewEventClubName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  >
                    {clubs.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Tech Park Auditorium"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Coordinator</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={newEventCoordinator}
                  onChange={(e) => setNewEventCoordinator(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Description</label>
                <textarea
                  rows={2}
                  placeholder="Event schedule, rules, and overview..."
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowEventModal(false)} className="text-xs font-semibold px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl">Cancel</button>
                <button type="submit" className="text-xs font-bold px-5 py-2.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center text-xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Item?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to delete this {itemToDelete?.type?.toLowerCase()}? This action cannot be undone.
            </p>

            <div className="flex gap-2 mt-5 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs font-semibold px-4 py-2.5 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="text-xs font-bold px-4 py-2.5 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 shadow-md shadow-rose-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
