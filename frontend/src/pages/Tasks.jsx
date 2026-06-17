import { useState, useEffect, useRef } from "react";
import {
  RiAddLine, RiDeleteBin6Line, RiCheckLine, RiCloseLine,
  RiImageLine, RiFlashlightLine, RiCalendarLine, RiSearchLine,
  RiFilterLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";

// ── helpers ──────────────────────────────────────────────
const XP_MAP  = { Easy: 10, Medium: 25, Hard: 50 };
const today   = () => new Date().toISOString().split("T")[0];

function DiffPill({ diff }) {
  const cls = { Easy: "diff-easy", Medium: "diff-medium", Hard: "diff-hard" }[diff] ?? "diff-easy";
  return <span className={cls}>{diff}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── main component ────────────────────────────────────────
export default function Tasks() {
  const { user, updateUserStats } = useAuth();

  // Task list state
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [dueDate, setDueDate]       = useState("");
  const [creating, setCreating]     = useState(false);
  const [showForm, setShowForm]     = useState(false);

  // Filter state
  const [filter, setFilter]   = useState("all"); // all | pending | completed
  const [search, setSearch]   = useState("");
  const [diffFilter, setDiffFilter] = useState("all");

  // Complete modal state
  const [completeTask, setCompleteTask] = useState(null);
  const [proofImage, setProofImage]     = useState(null);
  const [previewUrl, setPreviewUrl]     = useState("");
  const [proofNote, setProofNote]       = useState("");
  const [completing, setCompleting]     = useState(false);
  const fileRef = useRef();

  // ── fetch tasks ──────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch {
      toast.error("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // ── create task ──────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title is required");
    if (!dueDate)      return toast.error("Please set a due date");

    setCreating(true);
    try {
      await api.post("/tasks/create", {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        dueDate,
      });
      toast.success("Task created!");
      setTitle(""); setDescription(""); setDifficulty("Easy"); setDueDate("");
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  // ── delete task ──────────────────────────────────────────
  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting…");
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted", { id: toastId });
    } catch {
      toast.error("Delete failed", { id: toastId });
    }
  };

  // ── proof image picker ───────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return toast.error("Only JPG / PNG images allowed");
    }
    setProofImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ── complete task ────────────────────────────────────────
  const handleComplete = async () => {
    if (!proofImage) return toast.error("Proof image is required to complete a task");

    setCompleting(true);
    const toastId = toast.loading("Uploading proof & completing task…");

    try {
      const formData = new FormData();
      formData.append("proofImage", proofImage);
      formData.append("proofNote", proofNote);

      const { data } = await api.patch(
        `/tasks/${completeTask._id}/complete`,
        formData
      );

      // Update tasks list
      setTasks((prev) =>
        prev.map((t) => (t._id === completeTask._id ? data.task : t))
      );

      // Update user stats in context
      updateUserStats({
        xp:     data.xp,
        level:  data.level,
        streak: data.streak,
        badges: data.badges,
      });

      // Celebrate with toasts
      toast.success(`+${data.xpEarned} XP earned! 🎮`, { id: toastId, duration: 4000 });

      if (data.badges?.length > (user?.badges?.length ?? 0)) {
        const newOnes = data.badges.filter((b) => !(user?.badges ?? []).includes(b));
        newOnes.forEach((b) =>
          toast.success(`🏅 New badge unlocked: ${b}!`, { duration: 5000 })
        );
      }

      // Reset modal
      setCompleteTask(null);
      setProofImage(null);
      setPreviewUrl("");
      setProofNote("");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not complete task", { id: toastId });
    } finally {
      setCompleting(false);
    }
  };

  const closeModal = () => {
    setCompleteTask(null);
    setProofImage(null);
    setPreviewUrl("");
    setProofNote("");
  };

  // ── filtered tasks ───────────────────────────────────────
  const filteredTasks = tasks.filter((t) => {
    const matchStatus =
      filter === "all"       ? true :
      filter === "pending"   ? !t.completed :
      filter === "completed" ? t.completed : true;

    const matchDiff =
      diffFilter === "all" ? true : t.difficulty === diffFilter;

    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchDiff && matchSearch;
  });

  const pendingCount   = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) =>  t.completed).length;

  // ── render ───────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {pendingCount} pending · {completedCount} completed
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto"
          >
            {showForm ? <RiCloseLine className="text-lg" /> : <RiAddLine className="text-lg" />}
            {showForm ? "Cancel" : "New Task"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="card animate-fade-in">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <RiAddLine className="text-primary" />
              Create New Task
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wider">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you need to do?"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wider">Description</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional details…"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="input-field"
                  >
                    {["Easy", "Medium", "Hard"].map((d) => (
                      <option key={d} value={d}>
                        {d} (+{XP_MAP[d]} XP)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    min={today()}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* XP preview */}
              <div className="flex items-center gap-2 text-sm bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5">
                <RiFlashlightLine className="text-cyan-400" />
                <span className="text-slate-300">
                  Completing this task will earn you{" "}
                  <span className="text-cyan-400 font-bold font-mono">+{XP_MAP[difficulty]} XP</span>
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2">
                  {creating ? "Creating…" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="input-field pl-10"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-[#111827] border border-[#2D3748] rounded-xl p-1">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5">
            <RiFilterLine className="text-slate-500 shrink-0" />
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="input-field py-2"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-16">
            <svg className="animate-spin h-8 w-8 text-primary mx-auto" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-slate-600 text-lg">
              {tasks.length === 0 ? "No tasks yet — create your first one!" : "No tasks match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={() => handleDelete(task._id)}
                onComplete={() => setCompleteTask(task)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Complete Task Modal */}
      {completeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card w-full max-w-md animate-fade-in relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-bold text-white text-lg">Complete Task</h2>
                <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">
                  {completeTask.title}
                </p>
              </div>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors ml-2 shrink-0">
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            {/* XP Preview */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 mb-5">
              <RiFlashlightLine className="text-cyan-400 shrink-0" />
              <span className="text-sm text-slate-300">
                You'll earn{" "}
                <span className="text-cyan-400 font-bold font-mono">
                  +{XP_MAP[completeTask.difficulty] ?? 10} XP
                </span>{" "}
                for completing this <DiffPill diff={completeTask.difficulty} />
              </span>
            </div>

            {/* Proof image upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Proof Image <span className="text-red-400">*</span>
              </label>

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-[#2D3748] mb-2">
                  <img src={previewUrl} alt="proof preview" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => { setProofImage(null); setPreviewUrl(""); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                  >
                    <RiCloseLine />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#2D3748] hover:border-primary/60
                             rounded-xl p-6 flex flex-col items-center gap-2
                             text-slate-500 hover:text-slate-300 transition-all"
                >
                  <RiImageLine className="text-3xl" />
                  <span className="text-sm">Click to upload proof image</span>
                  <span className="text-xs text-slate-600">JPG, PNG up to 5MB</span>
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {!previewUrl && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 text-xs text-primary hover:text-purple-300 transition-colors"
                >
                  or click here to browse
                </button>
              )}
            </div>

            {/* Proof note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Proof Note <span className="text-slate-600">(optional)</span>
              </label>
              <textarea
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="Describe what you did to complete this task…"
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={handleComplete}
                disabled={completing || !proofImage}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {completing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <RiCheckLine className="text-lg" />
                    Mark Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── TaskCard sub-component ────────────────────────────────
function TaskCard({ task, onDelete, onComplete }) {
  const isOverdue =
    !task.completed &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <div
      className={`card transition-all duration-200 ${
        task.completed
          ? "opacity-60 border-[#2D3748]"
          : "hover:border-primary/40 hover:shadow-glow"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
            task.completed
              ? "border-success bg-success/20"
              : "border-[#2D3748]"
          }`}
        >
          {task.completed && <RiCheckLine className="text-success text-sm" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${task.completed ? "line-through text-slate-500" : "text-white"}`}>
              {task.title}
            </h3>
            <DiffPill diff={task.difficulty} />
            <span className="stat-chip">
              <RiFlashlightLine className="text-cyan-400" />
              +{XP_MAP[task.difficulty] ?? 10} XP
            </span>
          </div>

          {task.description && (
            <p className="text-slate-500 text-sm mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${isOverdue ? "text-red-400" : ""}`}>
                <RiCalendarLine />
                {isOverdue ? "Overdue: " : "Due: "}
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {task.completed && task.completedAt && (
              <span className="flex items-center gap-1 text-success/70">
                <RiCheckLine />
                Completed{" "}
                {new Date(task.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            )}
          </div>

          {/* Proof image thumbnail */}
          {task.proofImage && (
            <a href={task.proofImage} target="_blank" rel="noreferrer" className="mt-3 inline-block">
              <img
                src={task.proofImage}
                alt="proof"
                className="h-12 w-20 object-cover rounded-lg border border-[#2D3748] hover:opacity-80 transition-opacity"
              />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!task.completed && (
            <button
              onClick={onComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         bg-primary/10 text-purple-400 border border-primary/20
                         hover:bg-primary/20 hover:border-primary/40
                         transition-all duration-200"
            >
              <RiCheckLine />
              Complete
            </button>
          )}
          <button
            onClick={onDelete}
            className="btn-danger p-1.5 flex items-center justify-center"
            title="Delete task"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
    </div>
  );
}
