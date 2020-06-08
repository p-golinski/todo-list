const addTaskForm = document.querySelector('#addTaskForm')
const addTaskTitle = document.querySelector('#addTaskForm #title')
const addTaskBtn = document.querySelector('#addTaskBtn')
const addTaskMsg = document.querySelector('#addTaskMsg')
const tasksList = document.querySelector('#tasksList')
const tasksListMsg = document.querySelector('#tasksListMsg')

const addTask = async () => {
  const data = new FormData(addTaskForm)

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8'
  })

  const body = JSON.stringify({
    title: data.get('title'),
    description: data.get('description')
  })

  return await fetch('/api/tasks', { method: 'POST', headers, body })
}

addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault()

  addTaskBtn.classList.add('is-loading', 'is-disabled')
  addTaskMsg.classList.remove('is-danger', 'is-success')
  addTaskMsg.classList.add('is-hidden')

setTimeout(() => {
  addTask()
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }

      addTaskMsg.textContent = 'Pomyślnie dodano zadanie.'
      addTaskMsg.classList.add('is-success')
      addTaskTitle.value = ''

      listTasks()
    })
    .catch(() => {
      addTaskMsg.textContent = 'Wystąpił błąd podczas dodawania zadania. Spróbuj ponownie później.'
      addTaskMsg.classList.add('is-danger')
    })
    .finally(() => {
      addTaskBtn.classList.remove('is-loading', 'is-disabled')
      addTaskMsg.classList.remove('is-hidden')
    })
}, 1000)   
})

const listTasks = async () => {
  tasksList.innerHTML = ''
  tasksListMsg.classList.remove('is-danger')
  tasksListMsg.classList.add('is-hidden')

  fetch('/api/tasks')
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }

      return response.json()
    })
    .then((response) => {
      response.forEach((task) => {
        const title = document.createElement('td')
        title.innerHTML = `<p>${task.title}</p>`

        const row = document.createElement('tr')
        row.appendChild(title)

        tasksList.appendChild(row)
      })
    })
    .catch(() => {
      tasksListMsg.textContent = 'Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie później.'
      tasksListMsg.classList.add('is-danger')
    })
}

listTasks() 

const completeTask = (id) => {
  tasksListMsg.classList.remove('is-danger')
  tasksListMsg.classList.add('is-hidden')

  const button = document.querySelector(`#deleteTask${id}`)
  button.classList.add('is-loading')

  setTimeout(() => {
  addTask()
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }

      addTaskMsg.textContent = 'Pomyślnie dodano zadanie.'
      addTaskMsg.classList.add('is-success')
      addTaskTitle.value = ''

      listTasks()
    })
    .catch(() => {
      addTaskMsg.textContent = 'Wystąpił błąd podczas dodawania zadania. Spróbuj ponownie później.'
      addTaskMsg.classList.add('is-danger')
    })
    .finally(() => {
      addTaskBtn.classList.remove('is-loading', 'is-disabled')
      addTaskMsg.classList.remove('is-hidden')
    })
}, 1000)
}
