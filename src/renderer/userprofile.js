
const { ipcRenderer } = require('electron');

ipcRenderer.send('get-data');

ipcRenderer.on('data', (event, results) => {
  const table = document.getElementById('user');

  results.forEach((row) => {
    const tr = document.createElement('tr');

    Object.values(row).forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
});
