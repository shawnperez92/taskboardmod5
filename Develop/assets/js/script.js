let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateTaskId() {
    let id = nextId;
    nextId += 1;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

function createTaskCard(task) {
    return `
        <div class="task-card card mb-3" id="task-${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                <button class="btn btn-danger btn-sm" onclick="handleDeleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `;
}

function renderTaskList() {
    let todoCards = document.getElementById("todo-cards");
    let inProgressCards = document.getElementById("in-progress-cards");
    let doneCards = document.getElementById("done-cards");

    todoCards.innerHTML = '';
    inProgressCards.innerHTML = '';
    doneCards.innerHTML = '';

    taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        if (task.status === "to-do") {
            todoCards.innerHTML += taskCard;
        } else if (task.status === "in-progress") {
            inProgressCards.innerHTML += taskCard;
        } else if (task.status === "done") {
            doneCards.innerHTML += taskCard;
        }
    });

    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone"
    });

    $(".lane .card-body").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
}

function handleAddTask(event) {
    event.preventDefault();
    let title = document.getElementById("task-title").value;
    let description = document.getElementById("task-description").value;
    let dueDate = document.getElementById("task-due-date").value;
    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: "to-do"
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
}

function handleDeleteTask(taskId) {
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

function handleDrop(event, ui) {
    let taskId = parseInt(ui.draggable.attr("id").split("-")[1]);
    let newStatus = $(event.target).closest(".card").attr("id");
    let task = taskList.find(task => task.id === taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

function resetTaskForm() {
    document.getElementById("add-task-form").reset();
}

$(document).ready(function() {
    renderTaskList();

    document.getElementById("add-task-form").addEventListener("submit", handleAddTask);

    $("#task-due-date").datepicker();

    $(".lane .card-body").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
});
