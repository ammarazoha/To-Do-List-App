const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const emptyMessage = document.getElementById('emptyMessage');
const clearCompletedButton = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.text} as completed`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = remaining;
  emptyMessage.hidden = visibleTasks.length > 0;
  emptyMessage.textContent = tasks.length === 0
    ? 'No tasks yet. Add your first task above!'
    : 'No tasks in this filter.';
}

function addTask(text) {
  tasks.unshift({ id: Date.now(), text, completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id
    ? { ...task, completed: !task.completed }
    : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = '';
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    renderTasks();
  });
});

clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
