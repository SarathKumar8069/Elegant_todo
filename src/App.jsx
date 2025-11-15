// App.jsx
// Mini React project: "Elegant Todo + Progress Card"
// - Single-file React component (default export)
// - Uses Tailwind CSS for styling
// - Uses framer-motion for subtle animations
// Instructions to run:
// 1) Create a React app (Vite or CRA). 2) Add Tailwind CSS following official setup. 3) npm install framer-motion
// 4) Replace src/App.jsx with this file and run the app.

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ElegantTodoCard() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("elegant_tasks")) || [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("elegant_dark") === "true";
  });

  useEffect(() => {
    localStorage.setItem("elegant_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("elegant_dark", dark.toString());
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const addTask = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setTasks((s) => [
      { id: Date.now(), text: v, done: false, created: new Date().toISOString() },
      ...s,
    ]);
    setText("");
  };

  const toggleDone = (id) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTask = (id) => {
    setTasks((s) => s.filter((t) => t.id !== id));
  };

  const clearCompleted = () => setTasks((s) => s.filter((t) => !t.done));

  const filtered = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  const progress = tasks.length === 0 ? 0 : Math.round((tasks.filter(t=>t.done).length / tasks.length) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 ring-1 ring-gray-100 dark:ring-0"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Elegant Todo</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">A clean, minimal todo with progress and smooth animations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 5.47a1 1 0 011.4-.14l.7.6a1 1 0 11-1.26 1.56l-.7-.6a1 1 0 01-.14-1.42zM2 11a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.64 15.36a1 1 0 01.14-1.4l.6-.7a1 1 0 111.56 1.26l-.6.7a1 1 0 01-1.7.14zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14.36 15.36a1 1 0 011.7-.14l.6.7a1 1 0 11-1.56 1.26l-.6-.7a1 1 0 01.14-1.42zM17 11a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.58 6.11a1 1 0 01.14 1.42l-.6.7A1 1 0 1113.56 6.3l.6-.7a1 1 0 011.42-.2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <main className="mt-6">
          <form onSubmit={addTask} className="flex gap-3">
            <input
              aria-label="Add task"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 ring-1 ring-gray-100 dark:ring-0 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="What do you want to do today?"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm"
            >
              Add
            </motion.button>
          </form>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 w-full">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>{tasks.filter(t=>!t.done).length} active • {tasks.length} total</span>
                  <span className="font-medium">{progress}% done</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl p-3">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 text-center text-sm text-gray-400"
                  >
                    No tasks here — add something small and achievable ✨
                  </motion.div>
                ) : (
                  filtered.map((t) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleDone(t.id)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ring-1 ${t.done ? 'bg-indigo-600 ring-indigo-600 text-white' : 'bg-white dark:bg-gray-900 ring-gray-200 dark:ring-gray-700 text-gray-500'}`}>
                          {t.done ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 002 0V7zm-1 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <div>
                          <div className={`text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>{t.text}</div>
                          <div className="text-xs text-gray-400">{new Date(t.created).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => removeTask(t.id)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 6a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900/40 p-2 rounded-lg">
                <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg ${filter==='all' ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}>All</button>
                <button onClick={() => setFilter("active")} className={`px-3 py-1 rounded-lg ${filter==='active' ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}>Active</button>
                <button onClick={() => setFilter("done")} className={`px-3 py-1 rounded-lg ${filter==='done' ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}>Done</button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={clearCompleted} className="text-sm text-red-500 hover:underline">Clear completed</button>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-6 text-xs text-gray-400 text-center">Made with ❤️ • Small project for practice</footer>
      </motion.div>
    </div>
  );
}
