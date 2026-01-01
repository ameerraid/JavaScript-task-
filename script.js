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

  data[idx].text = txt
  save()
  render()
  cancelEdit()
}

function cancelEdit() {
  document.getElementById("editPopup").classList.remove("active")
  idx = null
}

function showDel(i) {
  act = { type: "delete", index: i }
  show(`Are you sure you want to delete task: "${data[i].text}"?`)
}

function show(m) {
  document.getElementById("msg").textContent = m
  document.getElementById("popup").classList.add("active")
}

function confirm() {
  if (!act) return

  switch (act.type) {
    case "add":
      const input = document.getElementById("taskInput")
      data.push({ text: act.data, done: false })
      input.value = ""
      save()
      render()
      break
    case "delete":
      data.splice(act.index, 1)
      save()
      render()
      break
    case "deleteDone":
      data = data.filter((t) => !t.done)
      save()
      render()
      break
    case "deleteAll":
      data = []
      save()
      render()
      break
  }

  cancel()
}

function cancel() {
  document.getElementById("popup").classList.remove("active")
  act = null
}

function showDelDone() {
  const cnt = data.filter((t) => t.done).length
  if (cnt === 0) {
    alert("No completed tasks to delete!")
    return
  }
  act = { type: "deleteDone" }
  show(`Are you sure you want to delete ${cnt} completed task(s)?`)
}

function showDelAll() {
  if (data.length === 0) {
    alert("No tasks to delete!")
    return
  }
  act = { type: "deleteAll" }
  show(`Are you sure you want to delete all ${data.length} task(s)?`)
}

function filter(type) {
  filt = type
  render()
}

load()
render()
