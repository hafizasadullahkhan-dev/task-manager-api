const TaskCard = ({ task, onToggle, onDelete }) => {
  const isDone = task.status === "done";

  return (
    <div className={`task-card ${isDone ? "done" : ""}`}>
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-actions">
        <button
          onClick={() => onToggle(task)}
          className={`btn-toggle ${isDone ? "undo" : ""}`}
        >
          {isDone ? "Mark Pending" : "Mark Done"}
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;