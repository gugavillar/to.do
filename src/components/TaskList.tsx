import { useState } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare, FiEdit } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [editTask, setEditTask] = useState<Task>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    const isExist = tasks.some(task => task.title === newTaskTitle);
    if (newTaskTitle.trim() === '') {
      return;
    }
    if (!isExist) {
      const newTask = [...tasks, {
        id: (Math.random() * 10),
        title: newTaskTitle,
        isComplete: false
      }];
      setTasks(newTask);
      setNewTaskTitle('');
    } else {
      confirm('Você já tem uma tarefa com esse nome');
    }
  }

  function handleEditTask() {
    if (newTaskTitle.trim() === '') {
      return;
    }
    setTasks(tasks.filter(task => {
      if (task.id === editTask?.id) {
        task.title = newTaskTitle;
        setEditTask(undefined);
        setNewTaskTitle('');
      }
      return task;
    }));
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    setTasks(tasks.filter(task => {
      if (task.id === id) {
        task.isComplete = !task.isComplete;
      }
      return task;
    }));
  }

  function handleGetTask(task: Task) {
    setEditTask(task);
    setNewTaskTitle(task.title);
  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID
    if (confirm('Deseja remover essa tarefa?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          {!!editTask ? (
            <button type="submit" onClick={handleEditTask}>
              <FiEdit size={16} color="#fff" />
            </button>
          ) : (
            <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
              <FiCheckSquare size={16} color="#fff" />
            </button>
          )}
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>
              <div>
                <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                  <FiTrash size={16} />
                </button>
                <button onClick={() => handleGetTask(task)} type="button">
                  <FiEdit size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </section>
  )
}