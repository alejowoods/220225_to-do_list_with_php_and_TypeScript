"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const deleteAllTasksButton = document.getElementById('delete-all-tasks');
    if (!taskList) {
        console.error('Task-list not found!');
        return;
    }
    function loadTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost/todo-list/backend/read_task.php');
                const tasks = yield response.json();
                console.log(tasks);
                if (!taskList)
                    return;
                taskList.innerHTML = '';
                tasks.reverse().forEach((task) => {
                    const li = document.createElement('li');
                    const taskContainer = document.createElement('div');
                    taskContainer.classList.add('task-container');
                    const titleInput = document.createElement('input');
                    titleInput.type = 'text';
                    titleInput.value = task.title;
                    titleInput.classList.add('task-title');
                    titleInput.disabled = true;
                    const descriptionInput = document.createElement('input');
                    descriptionInput.type = 'text';
                    descriptionInput.value = task.description;
                    descriptionInput.classList.add('task-description');
                    descriptionInput.disabled = true;
                    const buttonContainer = document.createElement('div');
                    buttonContainer.classList.add('button-container');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.id = 'button-delete';
                    deleteButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                        if (confirm('Are you sure you want to delete this task?')) {
                            yield deleteTask(task.id);
                        }
                    }));
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-button');
                    editButton.setAttribute('data-id', task.id.toString());
                    titleInput.addEventListener('keydown', (event) => __awaiter(this, void 0, void 0, function* () {
                        if (event.key === 'Escape') {
                            titleInput.value = task.title;
                            descriptionInput.value = task.description;
                            titleInput.disabled = true;
                            descriptionInput.disabled = true;
                            editButton.textContent = 'Edit';
                            editButton.style.backgroundColor = '';
                            enableEditButtons();
                        }
                        else if (event.key === 'Enter') {
                            const taskId = editButton.getAttribute('data-id');
                            if (taskId) {
                                yield updateTask(parseInt(taskId), titleInput.value, descriptionInput.value);
                                titleInput.disabled = true;
                                descriptionInput.disabled = true;
                                editButton.textContent = 'Edit';
                                editButton.style.backgroundColor = '';
                                enableEditButtons();
                            }
                        }
                    }));
                    descriptionInput.addEventListener('keydown', (event) => __awaiter(this, void 0, void 0, function* () {
                        if (event.key === 'Escape') {
                            titleInput.value = task.title;
                            descriptionInput.value = task.description;
                            titleInput.disabled = true;
                            descriptionInput.disabled = true;
                            editButton.textContent = 'Edit';
                            editButton.style.backgroundColor = '';
                            enableEditButtons();
                        }
                        else if (event.key === 'Enter') {
                            const taskId = editButton.getAttribute('data-id');
                            if (taskId) {
                                yield updateTask(parseInt(taskId), titleInput.value, descriptionInput.value);
                                titleInput.disabled = true;
                                descriptionInput.disabled = true;
                                editButton.textContent = 'Edit';
                                editButton.style.backgroundColor = '';
                                enableEditButtons();
                            }
                        }
                    }));
                    taskList.appendChild(li); // Parent 
                    li.appendChild(taskContainer); // child of li
                    taskContainer.appendChild(titleInput); // grandchild of li
                    taskContainer.appendChild(descriptionInput);
                    taskContainer.appendChild(buttonContainer);
                    buttonContainer.appendChild(deleteButton);
                    buttonContainer.appendChild(editButton);
                });
            }
            catch (error) {
                console.error('Error loading tasks:', error);
            }
        });
    }
    function disableEditButtons(exceptButton) {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            if (button !== exceptButton) {
                button.disabled = true;
            }
        });
    }
    function enableEditButtons() {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.disabled = false;
        });
    }
    taskList === null || taskList === void 0 ? void 0 : taskList.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const li = target.closest('li');
            if (!li)
                return;
            const titleInput = li.querySelector('.task-title');
            const descriptionInput = li.querySelector('.task-description');
            if (target.textContent === 'Edit') {
                disableEditButtons(target);
                titleInput.disabled = false;
                descriptionInput.disabled = false;
                titleInput.focus();
                titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
                target.textContent = 'Save';
                target.style.backgroundColor = 'red';
            }
            else if (target.textContent === 'Save') {
                const taskId = target.getAttribute('data-id');
                if (taskId) {
                    yield updateTask(parseInt(taskId), titleInput.value, descriptionInput.value);
                    titleInput.disabled = true;
                    descriptionInput.disabled = true;
                    target.textContent = 'Edit';
                    target.style.backgroundColor = '';
                    enableEditButtons();
                }
                ;
            }
        }
    }));
    function deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost/todo-list/backend/delete_task.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `id=${encodeURIComponent(id.toString())}`,
                });
                if (!response.ok)
                    throw new Error('Error deleting task!');
                const result = yield response.text();
                console.log('Delete response: ', result);
            }
            catch (error) {
                console.error('Failed to delete task:', error);
                alert('Error deleting task, please try again.');
            }
        });
    }
    function deleteAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Iniciando borrado de todas las tareas..."); // <-- Este log se ejecuta primero
            try {
                const response = yield fetch('http://localhost/todo-list/backend/read_task.php');
                if (!response.ok)
                    throw new Error(`Failed to fetch tasks: ${response.status}`);
                const tasks = yield response.json();
                console.log('tasks fetched: ', tasks);
                if (!Array.isArray(tasks)) {
                    throw new Error("Invalid response format, expected an array.");
                }
                console.log("Deleting tasks...");
                const results = yield Promise.allSettled(tasks.map((task) => __awaiter(this, void 0, void 0, function* () {
                    // 🔹 Cambié la validación de task.id para evitar problemas con valores falsy (como 0)
                    if (task.id === undefined || task.id === null) {
                        console.error("Task without ID detected:", task);
                        return Promise.reject("Invalid task ID");
                    }
                    return deleteTask(task.id)
                        .catch(error => {
                        // 🔹 Ahora capturo errores dentro del map() para asegurar que los maneje Promise.allSettled
                        console.error(`Failed to delete task ${task.id}:`, error);
                        throw error;
                    });
                })));
                console.log("Delete results:", results);
                const failedTasks = results.filter(result => result.status === 'rejected');
                if (failedTasks.length > 0) {
                    console.error("Some tasks failed to delete", failedTasks);
                }
                console.log("Reloading tasks...");
                yield loadTasks(); // 🔹 Moví esta línea antes de limpiar el DOM
                console.log("Tareas recargadas...");
                if (taskList) {
                    taskList.innerHTML = ''; // 🔹 Ahora limpio el DOM después de recargar tareas
                }
            }
            catch (error) {
                console.error("Failed to delete all tasks:", error);
                alert("Error deleting all tasks, please try again.");
            }
        });
    }
    function updateTask(id, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('http://localhost/todo-list/backend/update_task.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${encodeURIComponent(id.toString())}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
            });
            const result = yield response.text();
            console.log('Update response: ', result);
        });
    }
    loadTasks();
    deleteAllTasksButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (confirm('Are you sure you want to delete all tasks? this cannot be undone')) {
            yield deleteAllTasks();
        }
    }));
    taskForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const taskId = document.getElementById('task-id').value;
        console.log('task-id: ', taskId);
        let url = 'http://localhost/todo-list/backend/create_task.php';
        let body = `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
        if (taskId) {
            url = 'http://localhost/todo-list/backend/update_task.php';
            body += `&id=${encodeURIComponent(taskId)}`;
        }
        const response = yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });
        const result = yield response.text();
        console.log('server response:', result);
        loadTasks();
        setTimeout(() => {
            const newTask = taskList.firstElementChild; // also document.querySelector('#task-list li');
            if (newTask) {
                newTask.classList.add('glow-effect');
                setTimeout(() => {
                    newTask.classList.remove('glow-effect');
                }, 3000);
            }
        }, 200);
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('task-id').value = '';
    }));
});
