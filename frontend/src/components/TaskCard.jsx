import { RiCheckLine, RiDeleteBinLine } from "react-icons/ri";

export default function TaskCard({ task, onComplete, onDelete }) {
  return (
    <div className="card flex items-center justify-between">

      <div>
        <h3 className="text-white font-semibold">
          {task.title}
        </h3>

        <p className="text-xs text-slate-500">
          {task.completed ? "Completed" : "Pending"}
        </p>
      </div>

      <div className="flex gap-2">

        {!task.completed && (
          <button
            onClick={() => onComplete(task._id)}
            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"
          >
            <RiCheckLine />
          </button>
        )}

        <button
          onClick={() => onDelete(task._id)}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
        >
          <RiDeleteBinLine />
        </button>

      </div>

    </div>
  );
}