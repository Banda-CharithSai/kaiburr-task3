document.addEventListener("DOMContentLoaded", getLocalTodos);
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dueDateInput = document.getElementById("due-date-input");
const todoList = document.getElementById("todo-list");
const filterOption = document.getElementById("filter-todo");
const undoButton = document.getElementById("undo-btn");
const redoButton = document.getElementById("redo-btn");

let todos = [];
let currentIndex = 0;

todoForm.addEventListener("submit", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);


const currentDate = new Date().toISOString().split('T')[0];
dueDateInput.min = currentDate;

function addTodo(event) {
    event.preventDefault();
    const todoText = todoInput.value;
    const dueDate = dueDateInput.value;

    if (todoText.trim() === "") return;

    const todo = createTodoElement(todoText, dueDate);
    todoList.appendChild(todo);

    saveLocalTodos(todoText, dueDate);
    todoInput.value = "";
    dueDateInput.value = "";


    addToHistory();
}

function addToHistory() {

    currentIndex++;


    todos.splice(currentIndex + 1);


    todos.push(todoList.innerHTML);


    updateButtons();
}

function undo() {
    if (currentIndex > 0) {
        currentIndex--;
        todoList.innerHTML = todos[currentIndex];


        updateButtons();
    }
}

function redo() {
    if (currentIndex < todos.length - 1) {
        currentIndex++;
        todoList.innerHTML = todos[currentIndex];

        updateButtons();
    }
}

function updateButtons() {
    undoButton.disabled = currentIndex === 0;
    redoButton.disabled = currentIndex === todos.length - 1;
}



function createTodoElement(todoText, dueDate) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = todoText;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const dueDateElement = document.createElement("span");
    dueDateElement.innerText = dueDate !== "" ? `Due: ${formatDueDate(dueDate)}` : "";
    dueDateElement.classList.add("due-date");
    todoDiv.appendChild(dueDateElement);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i> Complete';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    return todoDiv;
}

function formatDueDate(dueDate) {
    const [year, month, day] = dueDate.split('-');
    const monthName = getMonthName(parseInt(month));
    return `${monthName} ${parseInt(day)}, ${year}`;
}

function getMonthName(month) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month - 1];
}

function deleteCheck(e) {
    const item = e.target;
    const todo = item.parentElement;

    if (item.classList.contains("trash-btn")) {
        removeLocalTodos(todo);
        todo.remove();
    }

    if (item.classList.contains("complete-btn")) {
        todo.classList.toggle("completed");
    }
}

function filterTodo() {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (filterOption.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "incomplete":
                todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function (todoText) {
        const todo = createTodoElement(todoText);
        todoList.appendChild(todo);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoText = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoText), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}
