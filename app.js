const modal = document.querySelector('#modal');
const bigmodal = document.querySelector('#bigmodal');
const addButton = document.querySelector('#add');
const applyButton = document.querySelector('#apply');
const cancelButton = document.querySelector('#cancel');
const todoContainer = document.querySelector('.todo-container');
const filterSelect = document.querySelector('.filter-todos');
const searchInput = document.querySelector('.search');
const darkModeToggle = document.querySelector('#darkMode');
let noteList = [];

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.querySelector('i').className = 'fa-solid fa-sun';
}

// Dark mode toggle
darkModeToggle.onclick = function() {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fa-solid fa-sun';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.className = 'fa-solid fa-moon';
        localStorage.setItem('darkMode', 'disabled');
    }
};

// Show modal
addButton.onclick = function() {
    modal.style.display = 'block';
    bigmodal.style.display = 'block';
    document.querySelector('#addtask').value = '';
    document.querySelector('#addtask').focus();
};

// Hide modal
cancelButton.onclick = function() {
    modal.style.display = 'none';
    bigmodal.style.display = 'none';
};

// Close modal when clicking outside
bigmodal.onclick = function(event) {
    if (event.target === bigmodal) {
        modal.style.display = 'none';
        bigmodal.style.display = 'none';
    }
};

// Filter and search tasks
function filterTasks() {
    const filter = filterSelect.value;
    const searchText = searchInput.value.toLowerCase();
    
    const filteredTasks = noteList.filter(function(task) {
        const matchesFilter = 
            filter === 'all' ||
            (filter === 'complete' && task.completed) ||
            (filter === 'incomplete' && !task.completed);
            
        const matchesSearch = 
            searchText === '' ||
            task.text.toLowerCase().includes(searchText);
            
        return matchesFilter && matchesSearch;
    });
    
    renderTodos(filteredTasks);
}

// Add filter change event
filterSelect.onchange = filterTasks;

// Add search input event
searchInput.oninput = filterTasks;

// Render todos
function renderTodos(tasksToRender) {
    if (!tasksToRender) tasksToRender = noteList;
    
    todoContainer.innerHTML = '';
    
    for (let i = 0; i < tasksToRender.length; i++) {
        const task = tasksToRender[i];
        
        // Create task item container
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        if (task.completed) {
            taskDiv.classList.add('completed');
        }
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = createToggleHandler(i);
        taskDiv.appendChild(checkbox);
        
        // Create task text
        const taskText = document.createElement('p');
        taskText.textContent = task.text;
        taskDiv.appendChild(taskText);
        
        // Create button container
        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.className = 'edit-btn';
        editBtn.onclick = createEditHandler(i);
        btnContainer.appendChild(editBtn);
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = createDeleteHandler(i);
        btnContainer.appendChild(deleteBtn);
        
        taskDiv.appendChild(btnContainer);
        todoContainer.appendChild(taskDiv);
    }
}

// Create handlers
function createToggleHandler(index) {
    return function() {
        toggleComplete(index);
    };
}

function createEditHandler(index) {
    return function() {
        editTask(index);
    };
}

function createDeleteHandler(index) {
    return function() {
        deleteTask(index);
    };
}

// Add todo
function addTodos() {
    const taskInput = document.querySelector('#addtask');
    const task = taskInput.value.trim();
    
    if (task) {
        noteList.push({
            text: task,
            completed: false
        });
        modal.style.display = 'none';
        bigmodal.style.display = 'none';
        taskInput.value = '';
        filterTasks();
    }
}

// Add todo button click
applyButton.onclick = addTodos;

// Delete task
function deleteTask(index) {
    noteList.splice(index, 1);
    filterTasks();
}

// Edit task
function editTask(index) {
    const newTask = prompt('Edit your task:', noteList[index].text);
    if (newTask !== null) {
        noteList[index].text = newTask.trim();
        filterTasks();
    }
}

// Toggle complete
function toggleComplete(index) {
    noteList[index].completed = !noteList[index].completed;
    filterTasks();
}

// Initial render
renderTodos();
