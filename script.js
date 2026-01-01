let data = []
let filt = "all"
let act = null
let idx = null

function load() {
  const saved = localStorage.getItem("todoTasks")
  if (saved) {
    data = JSON.parse(saved)
  }
}

function save() {
  localStorage.setItem("todoTasks", JSON.stringify(data))
}

function add() {
  const input = document.getElementById("taskInput")
  const err = document.getElementById("err")
  const txt = input.value.trim()

  err.textContent = ""

  if (!txt) {
    err.textContent = "The task cannot be empty!"
    return
  }

  if (/^\d/.test(txt)) {
    err.textContent = "The task cannot start with a number!"
    return
  }

  if (txt.length < 5) {
    err.textContent = "The task must be at least 5 characters long!"
    return
  }

  act = { type: "add", data: txt }
  show(`Are you sure you want to add task: "${txt}"?`)
}

function render() {
  const list = document.getElementById("list")
  list.innerHTML = ""

  const filtered = data.filter((t) => {
    switch (filt) {
      case "done":
        return t.done
      case "todo":
        return !t.done
      default:
        return true
    }
  })

  filtered.forEach((t, i) => {
    const li = document.createElement("li")
    li.className = "task-item"

    const span = document.createElement("span")
    span.textContent = t.text
    if (t.done) span.style.textDecoration = "line-through"

    const actions = document.createElement("div")
    actions.className = "actions"

    const editBtn = document.createElement("button")
    editBtn.className = "edit-btn"
    editBtn.innerHTML = '<i class="fas fa-edit"></i>'
    editBtn.onclick = () => showEdit(i)

    const delBtn = document.createElement("button")
    delBtn.className = "delete-btn"
    delBtn.innerHTML = '<i class="fas fa-trash"></i>'
    delBtn.onclick = () => showDel(i)

    const check = document.createElement("input")
    check.type = "checkbox"
    check.checked = t.done
    check.onchange = () => toggle(i)

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)

    li.appendChild(span)
    li.appendChild(actions)
    li.appendChild(check)

    list.appendChild(li)
  })
}

function toggle(i) {
  data[i].done = !data[i].done
  save()
  render()
}

function showEdit(i) {
  idx = i
  document.getElementById("editIn").value = data[i].text
  document.getElementById("editErr").textContent = ""
  document.getElementById("editPopup").classList.add("active")
}

function saveEdit() {
  const txt = document.getElementById("editIn").value.trim()
  const err = document.getElementById("editErr")
