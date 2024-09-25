document.getElementById('taskForm').addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Timer tracking
let taskTimers = {};

function startTimer(taskTitle, status) {
    if (!taskTimers[taskTitle]) {
        taskTimers[taskTitle] = {};
    }
    taskTimers[taskTitle][status] = new Date();
}

function stopTimer(taskTitle, status) {
    if (taskTimers[taskTitle] && taskTimers[taskTitle][status]) {
        const startTime = taskTimers[taskTitle][status];
        const endTime = new Date();
        const timeSpent = (endTime - startTime) / 1000; // time in seconds
        console.log(`${taskTitle} spent ${timeSpent} seconds in ${status}`);
        delete taskTimers[taskTitle][status];
    }
}

function getTimeSpent(taskTitle, status) {
    if (taskTimers[taskTitle] && taskTimers[taskTitle][status]) {
        const startTime = taskTimers[taskTitle][status];
        const currentTime = new Date();
        return ((currentTime - startTime) / 1000).toFixed(2); // time in seconds
    }
    return 0;
}

// Modify moveToProgress to start and stop timers
function moveToProgress(button, title) {
    const taskItem = button.closest('li');
    document.getElementById('progress-list').appendChild(taskItem);
    taskItem.querySelector('.btn-success').remove();
    taskItem.innerHTML = `
        <div class="task-card">
            <div class="task-header" style="text-align: center; font-weight: bold; font-size: 1.2em;">
                ${title}
            </div>
            <div class="task-body">
                <p><strong>Category:</strong> ${taskItem.querySelector('.task-body p:nth-child(1)').innerText.split(': ')[1]}</p>
                <p><strong>Priority:</strong> <span class="badge bg-secondary">${taskItem.querySelector('.task-body p:nth-child(2) .badge').innerText}</span></p>
                <p><strong>Due Date:</strong> ${taskItem.querySelector('.task-body p:nth-child(3)').innerText.split(': ')[1]}</p>
            </div>
            <div class="task-actions d-flex justify-content-around">
                <button class="btn btn-sm btn-warning" onclick="moveToTesting(this, '${title}')">Move to Testing</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">Delete</button>
            </div>
        </div>
    `;
    updateTaskStatusInLocalStorage(title, 'In Progress');
    logProgress(title, 'In Progress');
    startTimer(title, 'In Progress');
}

// Modify moveToTesting to start and stop timers
function moveToTesting(button, title) {
    const taskItem = button.closest('li');
    document.getElementById('testing-list').appendChild(taskItem);
    taskItem.querySelector('.btn-warning').remove();
    taskItem.innerHTML = `
        <div class="task-card">
            <div class="task-header" style="text-align: center; font-weight: bold; font-size: 1.2em;">
                ${title}
            </div>
            <div class="task-body">
                <p><strong>Category:</strong> ${taskItem.querySelector('.task-body p:nth-child(1)').innerText.split(': ')[1]}</p>
                <p><strong>Priority:</strong> <span class="badge bg-secondary">${taskItem.querySelector('.task-body p:nth-child(2) .badge').innerText}</span></p>
                <p><strong>Due Date:</strong> ${taskItem.querySelector('.task-body p:nth-child(3)').innerText.split(': ')[1]}</p>
            </div>
            <div class="task-actions d-flex justify-content-around">
                <button class="btn btn-sm btn-primary" onclick="moveToDone(this, '${title}')">Complete</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">Delete</button>
            </div>
        </div>
    `;
    updateTaskStatusInLocalStorage(title, 'Testing');
    logProgress(title, 'Testing');
    stopTimer(title, 'In Progress');
    startTimer(title, 'Testing');
}

// Modify moveToDone to stop timers
function moveToDone(button, title) {
    const taskItem = button.closest('li');
    document.getElementById('done-list').appendChild(taskItem);
    taskItem.querySelectorAll('.btn-warning, .btn-primary').forEach(btn => btn.remove());
    updateTaskStatusInLocalStorage(title, 'Done');
    logProgress(title, 'Done');
    stopTimer(title, 'Testing');
}

function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;
    const dueDate = new Date(document.getElementById('taskDueDate').value);
    const extraDays = parseInt(document.getElementById('taskExtraDays').value) || 0;

    const task = {
        title,
        desc,
        priority,
        category,
        dueDate: dueDate.setDate(dueDate.getDate() + extraDays),
        status: 'To Do',
        priorityValue: getPriorityValue(priority)
    };

    addTaskToList(task);
    saveTaskToLocalStorage(task);
    document.getElementById('taskForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
    modal.hide();
}

function addTaskToList(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `list-group-item task-${getTaskStatus(task.dueDate)}`;
    taskItem.draggable = true;
    taskItem.addEventListener('dragstart', dragStart);
    taskItem.addEventListener('dragend', dragEnd);

    // Card structure
    taskItem.innerHTML = `
        <div class="task-card">
            <div class="task-header" style="text-align: center; font-weight: bold; font-size: 1.2em;">
                ${task.title}
            </div>
            <div class="task-body">
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Priority:</strong> <span class="badge bg-secondary">${task.priority}</span></p>
                <p><strong>Due Date:</strong> ${task.dueDate}</p>
            </div>
            <div class="task-actions d-flex justify-content-around">
                <button class="btn btn-sm btn-success" onclick="moveToProgress(this, '${task.title}')">Move to Progress</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">Delete</button>
            </div>
        </div>
    `;

    taskItem.addEventListener('click', () => showTaskDetails(task)); // Display details on click

    const todoList = document.getElementById('todo-list');
    insertTaskByPriority(todoList, taskItem, task.priorityValue);
}

function insertTaskByPriority(todoList, taskItem, taskPriorityValue) {
    let inserted = false;

    for (let i = 0; i < todoList.children.length; i++) {
        const existingTaskPriority = getPriorityValue(todoList.children[i].querySelector('.badge').innerText);

        if (taskPriorityValue > existingTaskPriority) {
            todoList.insertBefore(taskItem, todoList.children[i]);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        todoList.appendChild(taskItem);
    }
}

function getPriorityValue(priority) {
    const priorityMap = {
        'Low': 1,
        'Medium': 2,
        'High': 3,
        'Urgent': 4
    };
    return priorityMap[priority];
}

function getTaskStatus(dueDate) {
    const now = new Date();
    const timeDiff = (new Date(dueDate) - now) / (1000 * 60 * 60 * 24);

    if (timeDiff > 7) return 'green';
    if (timeDiff > 1 && timeDiff <= 7) return 'yellow';
    if (timeDiff <= 1 && timeDiff >= 0) return 'red';
    return 'black';
}

// Display task details when a task is clicked
function showTaskDetails(task) {
    const taskDetails = document.getElementById('taskDetails');
    const timeInProgress = getTimeSpent(task.title, 'In Progress');
    const timeInTesting = getTimeSpent(task.title, 'Testing');
    taskDetails.innerHTML = `
        <h4>Task Details:</h4>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.desc}</p>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
        <p><strong>Time in Progress:</strong> ${timeInProgress} seconds</p>
        <p><strong>Time in Testing:</strong> ${timeInTesting} seconds</p>
    `;
}

// Function to log task progression
function logProgress(taskTitle, status) {
    const now = new Date();
    const logMessage = `${taskTitle} moved to ${status} on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    console.log(logMessage);

    // Display log on the page
    const logContainer = document.getElementById('logContainer');
    const logEntry = document.createElement('p');
    logEntry.textContent = logMessage;
    logContainer.appendChild(logEntry);
}

// Function to delete a task
function deleteTask(button) {
    const taskItem = button.closest('li');
    const title = taskItem.querySelector('div').innerText;
    taskItem.remove();
    deleteTaskFromLocalStorage(title);
}

// Save task to local storage
function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));
}

// Update task status in local storage
function updateTaskStatusInLocalStorage(title, status) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.title === title) {
            task.status = status;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task from local storage
function deleteTaskFromLocalStorage(title) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.title !== title);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Drag and Drop Functions
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hide');
    }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('hide');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    event.target.appendChild(draggable);
}

// Add drag and drop event listeners to the lists
const lists = document.querySelectorAll('.task-list');
lists.forEach(list => {
    list.addEventListener('dragover', dragOver);
    list.addEventListener('drop', drop);
});
