
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton =
    document.getElementById("clear-completed");

let todos = [];

try {
    const savedTodos = JSON.parse(
        localStorage.getItem("todos") || "[]"
    );

    if (Array.isArray(savedTodos)) {
        todos = savedTodos.filter(
            task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch {
    todos = [];
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
    todoList.replaceChildren();

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${todo.text} as completed`
        );

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.setAttribute(
            "aria-label",
            `Delete ${todo.text}`
        );

        deleteButton.addEventListener("click", () => {
            todos = todos.filter(task => task.id !== todo.id);
            saveTodos();
            renderTodos();
        });

        li.append(checkbox, span, deleteButton);
        todoList.appendChild(li);
    });

    const remaining = todos.filter(
        todo => !todo.completed
    ).length;

    taskCount.textContent =
        `${remaining} task${remaining === 1 ? "" : "s"} left`;

    emptyMessage.hidden = todos.length > 0;
}

todoForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (!text) return;

    todos.push({
        id: crypto.randomUUID(),
        text: text,
        completed: false
    });

    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

renderTodos();
