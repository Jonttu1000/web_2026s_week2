// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

// add your code here

const ul = document.querySelector('ul');

todoList.forEach(createTodoElemnt);

const dialog = document.querySelector('dialog');
const addButton = document.querySelector('.add-btn');
const form = document.querySelector('form');
const textInput = form.querySelector('input');

addButton.addEventListener('click', () => {
  dialog.showModal();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const task = textInput.value.trim();

  if (task === '') {
    alert('Please enter a task.');
    return;
  }

  const newTodo = {
    id: todoList.length + 1,
    task: task,
    completed: false,
  };

  todoList.push(newTodo);
  createTodoElemnt(newTodo);
  form.reset();
  dialog.close();

  console.log(todoList);
});

function createTodoElemnt(todo) {
  const li = document.createElement('li');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = `todo-${todo.id}`;
  input.checked = todo.completed;

  const label = document.createElement('label');
  label.htmlFor = `todo-${todo.id}`;
  label.textContent = todo.task;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';

  deleteButton.addEventListener('click', () => {
    const index = todoList.findIndex(item => item.id === todo.id);
    if (index !== -1) {
      todoList.splice(index, 1);
      ul.removeChild(li);
      console.log(todoList);
    }
  });

  input.addEventListener('change', () => {
    todo.completed = input.checked;
    console.log(todoList);
  });

  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(deleteButton);
  ul.appendChild(li);
}
