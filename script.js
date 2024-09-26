let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
let selectedTask = null;

// Function to generate a new task ID
function generateTaskId() {
    console.log("Generating new task ID:", nextId);
    return nextId++;
}

// Function to update localStorage
function updateLocalStorage() {
    console.log("Updating localStorage");
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
}

// Function to display task details
function displayTaskDetails(task) {
    console.log("Displaying task details for:", task);
    if (task) {
        $('#task-detail-title').text(task.title || 'No Title');
        $('#task-detail-desc').text(task.description || 'No Description');
        $('#task-detail-priority').text(task.priority || 'No Priority');
        $('#task-detail-category').text(task.category || 'No Category');
        $('#task-detail-due').text(task.dueDate || 'No Due Date');
        $('#task-detail-extra').text(task.extraDays || 'No Extra Days');
        $('#task-time-spent').text(task.timeSpent || 'Not started');
        $('#task-logging').html(task.log || 'No logs yet');
        $('#task-details').show();

        // Timer control logic
        $('#start-timer').off('click').on('click', function() {
            console.log("Start timer clicked for task:", task);
            if (!task.timer) {
                task.timer = {
                    startTime: dayjs(),
                    interval: setInterval(() => {
                        const now = dayjs();
                        const duration = dayjs.duration(now.diff(task.timer.startTime));
                        task.timeSpent = `${duration.hours()}h ${duration.minutes()}m`;
                        updateLocalStorage();
                        displayTaskDetails(task);
                    }, 60000)
                };
                $(this).text('Stop Timer');
            }
        });

        $('#stop-timer').off('click').on('click', function() {
            console.log("Stop timer clicked for task:", task);
            if (task.timer) {
                clearInterval(task.timer.interval);
                const now = dayjs();
                const totalDuration = dayjs.duration(now.diff(task.timer.startTime));
                const timeSpent = `${totalDuration.hours()}h ${totalDuration.minutes()}m`;
                const logEntry = `${now.format('YYYY-MM-DD HH:mm')} - Time spent: ${timeSpent}`;
                task.log = (task.log || '') + `<br>${logEntry}`;
                delete task.timer;
                updateLocalStorage();
                displayTaskDetails(task);
                $('#start-timer').text('Start Timer');
            }
        });

        // Delete task logic
        $('#delete-task').off('click').on('click', function() {
            console.log("Delete task clicked for task:", task);
            handleDeleteTask({ target: $(this).closest('.task-card') });
            $('#task-details').hide();
        });
    } else {
        $('#task-details').hide();
    }
}

// Function to create a task card
function createTaskCard(task) {
    console.log("Creating task card for:", task);
    let urgencyColor;
    const today = dayjs();
    const dueDate = dayjs(task.dueDate);

    // Ensure task.dueDate is valid
    if (!dueDate.isValid()) {
        urgencyColor = "bg-secondary"; // Default color for invalid or missing due dates
    } else if (dueDate.isBefore(today)) {
        urgencyColor = "bg-dark text-danger"; // Overdue
    } else if (dueDate.isSame(today, 'day')) {
        urgencyColor = "bg-warning"; // Due today
    } else if (dueDate.diff(today, 'days') <= 3) {
        urgencyColor = "bg-warning"; // Less than 3 days
    } else {
        urgencyColor = "bg-primary"; // More than 3 days
    }

    // Safeguard task.log to ensure it's always a string
    task.log = typeof task.log === 'string' ? task.log : '';

    const creationLog = `${today.format('YYYY-MM-DD HH:mm')} - Task created: ${task.title}`;
    task.log += `<br>${creationLog}`;

    return `
      <div class="card text-white ${urgencyColor} mb-3 task-card" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">Due: ${task.dueDate || 'No Due Date'}</p>
          <p class="card-text"><small>Urgency: ${task.urgency || 'Normal'}</small></p>
          <button class="btn btn-sm btn-danger delete-task">Delete</button>
        </div>
      </div>
    `;
}

// Function to render the task list
function renderTaskList() {
    $('#todo-cards, #in-progress-cards, #done-cards, #testing-review-cards').empty();

    // Sort tasks based on due date
    taskList.sort((a, b) => {
        const urgencyA = dayjs(a.dueDate);
        const urgencyB = dayjs(b.dueDate);
        return urgencyA.diff(urgencyB);
    });

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        switch (task.status) {
            case "to-do":
                $('#todo-cards').append(taskCard);
                break;
            case "in-progress":
                $('#in-progress-cards').append(taskCard);
                break;
            case "done":
                $('#done-cards').append(taskCard);
                break;
            case "testing-review":
                $('#testing-review-cards').append(taskCard);
                break;
            default:
                console.error(`Unknown task status: ${task.status}`);
        }
    });

    $('.delete-task').off('click').on('click', handleDeleteTask);
    $('.task-card').draggable({ revert: 'invalid', stack: '.task-card', helper: 'clone' });
    $('.task-card').off('click').on('click', function() {
        const taskId = $(this).data('id');
        const task = taskList.find(t => t.id === taskId);
        if (task) {
            selectedTask = task;
            displayTaskDetails(selectedTask);
        } else {
            console.error(`Task with ID ${taskId} not found.`);
        }
    });
}

// Function to handle the delete task button
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.task-card').data('id');
    console.log("Deleting task with ID:", taskId);
    taskList = taskList.filter(task => task.id !== taskId);
    updateLocalStorage();
    renderTaskList();
}

// Function to handle the add task form
function handleAddTask(event) {
    event.preventDefault();
    console.log("Adding new task");
    const taskTitle = $('#task-title').val();
    const taskDescription = $('#task-desc').val();
    const taskPriority = $('#task-priority').val();
    const taskCategory = $('#task-category').val();
    const taskDueDate = $('#task-date').val();
    const taskExtraDays = $('#task-extra-days').val();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        category: taskCategory,
        dueDate: taskDueDate,
        extraDays: taskExtraDays || 0,
        status: 'to-do',
        timeSpent: '0h 0m',
        log: ''
    };

    taskList.push(newTask);
    updateLocalStorage();
    renderTaskList();
    $('#formModal').modal('hide');
}

// Function to handle drop event
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newStatus = $(this).attr('id').replace('-cards', '');
    console.log(`Task with ID ${taskId} dropped into ${newStatus}`);

    taskList.forEach(task => {
        if (task.id === taskId) {
            task.status = newStatus;
            if (newStatus === "done" || newStatus === "testing-review") {
                if (task.timer) {
                    clearInterval(task.timer.interval);
                    const endTime = dayjs();
                    const log = `${endTime.format('YYYY-MM-DD HH:mm')} - Task moved to ${newStatus}`;
                    task.log = (task.log || '') + `<br>${log}`;
                    delete task.timer;
                }
            }
            updateLocalStorage();
        }
    });
    renderTaskList();
}

// Initialize Sortable
function setupSortable() {
    console.log("Setting up sortable");
    $('.task-list').sortable({
        connectWith: '.task-list',
        update: handleDrop
    }).disableSelection();
}

// Attach event listeners
$('#add-task-form').on('submit', handleAddTask);
$('#task-details').hide();
$('#task-modal-trigger').on('click', function() {
    console.log("Task modal triggered");
    $('#formModal').modal('show');
});

// Initialize sortable
setupSortable();
renderTaskList();
