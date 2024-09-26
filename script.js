let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", function() {
    renderTasks();
});

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event, columnId) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    console.log(`Dropped task with ID: ${data} into column: ${columnId}`);

    if (draggedElement) {
        updateTaskStatus(data, columnId);
        const targetColumn = document.getElementById(columnId).querySelector(".task-container");
        targetColumn.appendChild(draggedElement);
    }
}

function updateTaskStatus(taskId, newStatus) {
    tasks = tasks.map((task) => {
        if (task.id === taskId) {
            console.log(`Updating task ${taskId} to status ${newStatus}`);
            return { ...task, status: newStatus };
        }
        return task;
    });
    updateLocalStorage();
    renderTasks();
}

function addTask(columnId) {
    const taskInput = document.getElementById("taskInput");
    const taskContent = taskInput.value.trim();
    if (taskContent !== "") {
        const newTask = {
            id: "task-" + Date.now(),
            content: taskContent,
            status: columnId,
        };
        tasks.push(newTask);
        updateLocalStorage();
        renderTasks();
        taskInput.value = "";
    }
}

function createTaskElement(content, id) {
    const task = document.createElement("div");
    task.id = id;
    task.className = "task";
    task.draggable = true;
    task.innerHTML = `${content} 
        <span class="delete-btn" onclick="deleteTask('${id}')">X</span>`;
    task.addEventListener("dragstart", drag);
    return task;
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    updateLocalStorage();
    renderTasks();
}

function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const columns = ["to-do", "in-progress", "done"];
    
    columns.forEach((columnId) => {
        const column = document.getElementById(columnId);
        const taskContainer = column.querySelector(".task-container");
        taskContainer.innerHTML = ""; // Clear existing tasks
        
        tasks.forEach((task) => {
            if (task.status === columnId) {
                const taskElement = createTaskElement(task.content, task.id);
                taskContainer.appendChild(taskElement);
            }
        });
    });
}
