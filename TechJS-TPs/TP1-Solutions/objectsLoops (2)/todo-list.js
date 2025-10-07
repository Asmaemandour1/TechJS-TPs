const todoList = [{
  name: 'review course',
  dueDate: '2025-09-29'
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  // Loop over every toDo object and append it to "todoListHTML"
  for (let i = 0; i < todoList.length; i++) {
    const todo = todoList[i];
    const { name, dueDate } = todo; // Destructure for cleaner code
    const html = `
      <div>${name}</div>
      <div>${dueDate}</div>
      <button class="js-delete-todo-button">Delete</button>
    `;
    todoListHTML += html;
  }
  // Show the objects inside the class "js-todo-list"
  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

  // Loop over evey delete button and add an eventListener that deletes the toDo and rerender the Tasks
  document.querySelectorAll('.js-delete-todo-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        // Delete the toDo at the given index
        todoList.splice(index, 1);
        // Rerender the tasks
        renderTodoList();
      });
    });

}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  // Add these values to the variable "todoList"

  if (name && dueDate) { // Ensure inputs are not empty
    todoList.push({
      name: name,
      dueDate: dueDate
    });
  }

  // Clear the input field
  inputElement.value = '';
  inputElement.value = '';

  renderTodoList();
}