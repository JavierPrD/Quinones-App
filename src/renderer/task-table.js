const { ipcRenderer } = require("electron");

ipcRenderer.send("get-task");

ipcRenderer.on("task", (event, results) => {
  const table = document.getElementById("task-table");
  const headerRow = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Phase</th>
        <th>Due Date</th>
        <th>Assigned To</th>
        <th>Action</th>
        
      </tr>
    </thead>
  `;
  const rows = results
    .map((row) => {
      const taskId = row.id; // Assuming each task has a unique ID
      return `
      <tr>
        <td>${row.name}</td>
        <td>${row.phase}</td>
        <td>${row.dueDate}</td>
        <td>${row.assignedTo}</td>
        <td>
        <button onclick="handleEditButtonClick(${taskId})">Edit</button>
        <button onclick="handleDeleteButtonClick(${taskId})">Delete</button>
        </td>
      </tr>
    `;
    })
    .join("");
  table.innerHTML = headerRow + rows;
});


