
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
