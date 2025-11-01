const taskInput = document.querySelector('#task-input');
const dateInput = document.querySelector('#due-date');
const addBtn = document.querySelector('#add-btn');
const deleteAllBtn = document.querySelector('#delete-all-btn');
const todoList = document.querySelector('#todo-list');
const filterSelect = document.querySelector('#filter-select');

let todos = [];
let currentFilter = 'all'; 

function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = `
            <tr>
                <td colspan="4" class="no-task">No task found</td>
            </tr>
        `;
        return;
    }

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'completed') return todo.completed;
        if (currentFilter === 'pending') return !todo.completed;
        return true; 
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <tr>
                <td colspan="4" class="no-task">No ${currentFilter} tasks found</td>
            </tr>
        `;
        return;
    }

    filteredTodos.forEach((todo, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${todo.task}</td>
            <td>${todo.date || '-'}</td>
            <td>
                <span class="status ${todo.completed ? 'done' : 'pending'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                </span>
            </td>
            <td>
                <button class="action-btn done-btn"><i class="fa-solid fa-check"></i></button>
                <button class="action-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;

        row.querySelector('.done-btn').addEventListener('click', () => {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        todoList.appendChild(row);
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
    }
    renderTodos();
}

addBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const task = taskInput.value.trim();
    const date = dateInput.value;

    if (task === '') {
        alert('Please enter a task!');
        return;
    }

    todos.push({
        task,
        date,
        completed: false
    });

    taskInput.value = '';
    dateInput.value = '';

    saveTodos();
    renderTodos();
});

deleteAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
});

filterSelect.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTodos();
});

loadTodos();
