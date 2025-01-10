const modal = document.querySelector('#modal');
const add = document.querySelector('#add');
const apply = document.querySelector('#apply');
const cancel = document.querySelector('#cancel');
const bigmodal = document.querySelector('#bigmodal');
const todoContainer = document.querySelector('.todo-container');
const filterSelect = document.querySelector('.filter-todos');
const darkModeToggle = document.querySelector('#darkMode');
const note_list = [];

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('darkMode', 'disabled');
  }
});

add.addEventListener('click', function() {
  modal.style.display = 'block';
});

cancel.addEventListener('click', function() {
  modal.style.display = 'none';
});

function filterTasks() {
  const filter = filterSelect.value;
  const filteredTasks = note_list.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'uncompleted') return !task.completed;
  });
  renderTodos(filteredTasks);
}

filterSelect.addEventListener('change', filterTasks);

function renderTodos(tasksToRender = note_list) {
  todoContainer.innerHTML = ''; 
  tasksToRender.forEach((task, index) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    if (task.completed) {
      taskDiv.classList.add('completed');
    }
    
    // Checkbox for completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(index));
    taskDiv.appendChild(checkbox);
    
    // Task text
    const taskText = document.createElement('p');
    taskText.textContent = task.text;
    taskDiv.appendChild(taskText);
    
    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    
    // Edit button with icon
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => editTask(index));
    btnContainer.appendChild(editBtn);
    
    // Delete button with icon
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(index));
    btnContainer.appendChild(deleteBtn);
    
    taskDiv.appendChild(btnContainer);
    todoContainer.appendChild(taskDiv);
  });
}

function addTodos() {
  const taskInput = document.querySelector('#addtask');
  const task = taskInput.value.trim();
  if (task) {
    note_list.push({
      text: task,
      completed: false
    });
    modal.style.display = 'none';
    taskInput.value = '';
    filterTasks();
  }
}

apply.addEventListener('click', addTodos);

function deleteTask(index) {
  note_list.splice(index, 1);
  filterTasks();
}

function editTask(index) {
  const newTask = prompt('Edit your task:', note_list[index].text);
  if (newTask !== null) {
    note_list[index].text = newTask.trim();
    filterTasks();
  }
}

function toggleComplete(index) {
  note_list[index].completed = !note_list[index].completed;
  filterTasks();
}
