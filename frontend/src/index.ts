document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form') as HTMLFormElement;
    const taskList = document.getElementById('task-list') as HTMLUListElement | null;
    const deleteAllTasksButton = document.getElementById('delete-all-tasks') as HTMLButtonElement;

    if(!taskList) {
        console.error('Task-list not found!');
        return;
    }    

    async function loadTasks() {

        try {
            const response = await fetch('http://localhost/todo-list/backend/read_task.php');
            
            const tasks = await response.json();
            console.log(tasks);
    
            if (!taskList) return;
            taskList.innerHTML = '';
    
            tasks.reverse().forEach((task: any) => {
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
                deleteButton.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this task?')) {
                        await deleteTask(task.id);
                    }
                });
    
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-button')
                editButton.setAttribute('data-id', task.id.toString());
    
                
                titleInput.addEventListener('keydown', async (event) => {
                    if(event.key === 'Escape') {
                        titleInput.value = task.title;
                        descriptionInput.value = task.description;
                        titleInput.disabled = true;
                        descriptionInput.disabled = true;
                        editButton.textContent = 'Edit';
                        editButton.style.backgroundColor = '';
                        enableEditButtons();
                    }  else if (event.key === 'Enter') {
                        const taskId = editButton.getAttribute('data-id');
                        if (taskId) {
                            await updateTask(parseInt(taskId!), titleInput.value, descriptionInput.value);
                            titleInput.disabled = true;
                            descriptionInput.disabled = true;
                            editButton.textContent = 'Edit';
                            editButton.style.backgroundColor = '';
                            enableEditButtons();
                        }
                    }
    
                });
    
                descriptionInput.addEventListener('keydown', async (event) => {
                    if(event.key === 'Escape') {
                        titleInput.value = task.title;
                        descriptionInput.value = task.description;
                        titleInput.disabled = true;
                        descriptionInput.disabled = true;
                        editButton.textContent = 'Edit';
                        editButton.style.backgroundColor = '';
                        enableEditButtons();
                    } else if (event.key === 'Enter') {
                        const taskId = editButton.getAttribute('data-id');
                        if (taskId) {
                            await updateTask(parseInt(taskId!), titleInput.value, descriptionInput.value);
                            titleInput.disabled = true;
                            descriptionInput.disabled = true;
                            editButton.textContent = 'Edit';
                            editButton.style.backgroundColor = '';
                            enableEditButtons();
                        }
                    }
                });
                
                
                taskList.appendChild(li); // Parent 
                li.appendChild(taskContainer); // child of li
                
                    taskContainer.appendChild(titleInput); // grandchild of li
                    taskContainer.appendChild(descriptionInput);
                    taskContainer.appendChild(buttonContainer);
                    
                    buttonContainer.appendChild(deleteButton);
                    buttonContainer.appendChild(editButton);
    
            });
            
        } catch (error) {
            console.error('Error loading tasks:', error);
        }

    }

    function disableEditButtons(exceptButton: HTMLElement) {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            if(button !== exceptButton) {
                (button as HTMLButtonElement).disabled = true;
            }
        });
    }

    function enableEditButtons() {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button =>{
            (button as HTMLButtonElement).disabled = false;
        });
    }

    taskList?.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;

        if (target.tagName === 'BUTTON') {
            const li = target.closest('li');
            if (!li) return;

            const titleInput = li.querySelector('.task-title') as HTMLInputElement;
            const descriptionInput = li.querySelector('.task-description') as HTMLInputElement;

            if(target.textContent === 'Edit') {
                disableEditButtons(target);
                titleInput.disabled = false;
                descriptionInput.disabled = false;
                titleInput.focus();
                titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
                target.textContent = 'Save';
                target.style.backgroundColor = 'red';
            } else if (target.textContent === 'Save') {
                const taskId = target.getAttribute('data-id');

                if(taskId) {
                    await updateTask(parseInt(taskId!), titleInput.value, descriptionInput.value);
                    titleInput.disabled = true;
                    descriptionInput.disabled = true;
                    target.textContent = 'Edit';
                    target.style.backgroundColor = '';
                    enableEditButtons();
                };
            }
        }
    });

    async function deleteTask(id: number) {

        try {
            const response = await fetch('http://localhost/todo-list/backend/delete_task.php', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                body: `id=${encodeURIComponent(id.toString())}`,
            });
    
            if (!response.ok) throw new Error('Error deleting task!');
    
            const result = await response.text();
            console.log('Delete response: ', result);
            
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Error deleting task, please try again.');
        }

    }

    async function deleteAllTasks() {
        console.log("Iniciando borrado de todas las tareas..."); // <-- Este log se ejecuta primero

        try {
            const response = await fetch('http://localhost/todo-list/backend/read_task.php');
            
            if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status}`);

            const tasks = await response.json();
            console.log('tasks fetched: ', tasks);
    
            if (!Array.isArray(tasks)) {
                throw new Error("Invalid response format, expected an array.");
            }
    
            console.log("Deleting tasks...");
    
            const results = await Promise.allSettled(
                tasks.map(async task => {
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
                })
            );
    
            console.log("Delete results:", results);
    
            const failedTasks = results.filter(result => result.status === 'rejected');
            if (failedTasks.length > 0) {
                console.error("Some tasks failed to delete", failedTasks);
            }
    
            console.log("Reloading tasks...");
            await loadTasks(); // 🔹 Moví esta línea antes de limpiar el DOM
            console.log("Tareas recargadas...");
            if (taskList) {
                taskList.innerHTML = ''; // 🔹 Ahora limpio el DOM después de recargar tareas
            }
    
        } catch (error) {
            console.error("Failed to delete all tasks:", error);
            alert("Error deleting all tasks, please try again.");
        }
    }
    

    async function updateTask(id: number, title: string, description: string) {
        const response = await fetch('http://localhost/todo-list/backend/update_task.php', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body: `id=${encodeURIComponent(id.toString())}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        });

        const result = await response.text(); 
        console.log('Update response: ', result);
    }

    loadTasks(); 

    deleteAllTasksButton.addEventListener('click', async () => {
        if(confirm('Are you sure you want to delete all tasks? this cannot be undone')) {
            await deleteAllTasks();
        }
    })


    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = (document.getElementById('title')  as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const taskId = (document.getElementById('task-id') as HTMLInputElement).value;

        console.log('task-id: ', taskId);

        let url = 'http://localhost/todo-list/backend/create_task.php';
        let body = `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

        if (taskId) {
            url = 'http://localhost/todo-list/backend/update_task.php';
            body += `&id=${encodeURIComponent(taskId)}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
            },
            body: body,
        });

        const result = await response.text();
        console.log('server response:', result);
        loadTasks(); 

        
        setTimeout(() => {
            const newTask = taskList.firstElementChild as HTMLElement; // also document.querySelector('#task-list li');
            if (newTask) {
                newTask.classList.add('glow-effect');
                setTimeout(() => {
                    newTask.classList.remove('glow-effect');
                }, 3000);
            }
        }, 200);
        
        (document.getElementById('title')  as HTMLInputElement).value = '';
        (document.getElementById('description') as HTMLTextAreaElement).value = '';
        (document.getElementById('task-id') as HTMLInputElement).value = '';
    });
});