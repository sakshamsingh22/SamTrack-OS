"use client";

import { AnimatePresence, Reorder, motion } from "framer-motion";
import { CalendarRange, Check, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import Card, { CardHeader } from "../ui/card";

function categoryClass(category) {
  if (category === "DSA") {
    return "bg-sky-500/12 text-sky-700 dark:text-sky-300";
  }
  if (category === "Revision") {
    return "bg-amber-400/16 text-amber-700 dark:text-amber-300";
  }
  if (category === "Personal") {
    return "bg-rose-500/12 text-rose-700 dark:text-rose-300";
  }
  return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
}

export default function TasksSection({
  taskDate,
  taskForm,
  editingTaskId,
  tasksForSelectedDate,
  setTaskDate,
  setTaskForm,
  onSubmit,
  onCancelEdit,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onReorderTasks,
  formatLongDate
}) {
  const completedCount = tasksForSelectedDate.filter((task) => task.completed).length;

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="space-y-5">
        <CardHeader
          eyebrow="Tasks"
          title="Add and shape the day"
          description="Create tasks on the left, then work the list on the right. Drag to reorder when priorities shift."
        />

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Task date</label>
            <div className="relative">
              <CalendarRange
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                value={taskDate}
                onChange={(event) => setTaskDate(event.target.value)}
                className="field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Task name</label>
            <input
              className="field"
              placeholder="Finish recursion revision sheet"
              value={taskForm.title}
              onChange={(event) =>
                setTaskForm((current) => ({
                  ...current,
                  title: event.target.value
                }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              className="field"
              value={taskForm.category}
              onChange={(event) =>
                setTaskForm((current) => ({
                  ...current,
                  category: event.target.value
                }))
              }
            >
              {["Study", "DSA", "Revision", "Personal"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary gap-2">
              <Plus size={16} />
              {editingTaskId ? "Update task" : "Add task"}
            </button>
            {editingTaskId ? (
              <button type="button" onClick={onCancelEdit} className="btn-secondary">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="space-y-5">
        <CardHeader
          eyebrow="Task list"
          title={formatLongDate(new Date(`${taskDate}T12:00:00`))}
          description={`${completedCount}/${tasksForSelectedDate.length} completed. Drag cards to reorder the queue.`}
        />

        {tasksForSelectedDate.length ? (
          <Reorder.Group
            axis="y"
            values={tasksForSelectedDate}
            onReorder={onReorderTasks}
            className="space-y-3"
          >
            <AnimatePresence initial={false}>
              {tasksForSelectedDate.map((task) => (
                <Reorder.Item
                  key={task.id}
                  value={task}
                  className="list-none"
                  whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.16)" }}
                >
                  <motion.div
                    layout
                    className="flex flex-col gap-4 rounded-2xl border px-4 py-4 soft-divider md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 cursor-grab text-slate-400 active:cursor-grabbing">
                        <GripVertical size={18} />
                      </div>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 text-slate-400 dark:border-slate-700"
                        }`}
                      >
                        {task.completed ? <Check size={12} /> : null}
                      </motion.button>
                      <div>
                        <div
                          className={`font-medium ${
                            task.completed
                              ? "text-slate-400 line-through dark:text-slate-500"
                              : "text-slate-950 dark:text-white"
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryClass(
                              task.category
                            )}`}
                          >
                            {task.category}
                          </span>
                          {task.completed ? (
                            <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                              Completed
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="btn-secondary h-10 w-10 px-0"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="btn-secondary h-10 w-10 px-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="rounded-2xl border border-dashed px-6 py-12 text-center soft-divider">
            <h3 className="text-lg font-medium text-slate-950 dark:text-white">
              No tasks yet
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Add the first task on the left and the list will turn into a draggable
              work queue.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
