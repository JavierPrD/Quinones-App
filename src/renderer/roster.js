const { ipcRenderer } = require("electron");

ipcRenderer.send("get-data");

//ipcRenderer.on("data", (event, results) => {
  //const table = document.getElementById("user");

  //results.forEach((row) => {
    //const tr = document.createElement("tr");
    //const FirstName = document.createElement('td');
    //const LastName = document.createElement('td');
    //const fullName = document.createElement("td");
    //FirstName.textContent = row.FirstName;
    //LastName.textContent = row.LastName;
    //fullName.textContent = `${row.FirstName} ${row.LastName}`;
    //tr.appendChild(FirstName);
    //tr.appendChild(LastName);
    //tr.appendChild(fullName);

    //table.appendChild(tr);
  //});
//});

/*
ipcRenderer.on("data", (event, results) => {
  const table = document.getElementById("member-title");
  results.forEach((row) => {
    const tr = document.createElement("tr");
    const fullName = document.createElement("td");
    fullName.textContent = `${row.FirstName} ${row.LastName}`;
    tr.appendChild(fullName);
    table.appendChild(tr);
  });
});

ipcRenderer.on("data", (event, results) => {
  const table = document.getElementById("member-subtitle");
  results.forEach((row) => {
    const tr = document.createElement("tr");
    const role = document.createElement("td");
    role.textContent = `${row.role}`;
    tr.appendChild(role);
    table.appendChild(tr);
  });
});
*/
ipcRenderer.on("data", (event, results) => {
  const card = document.getElementById("member-card");
  results.forEach((row) => {
    const fullName = `${row.FirstName} ${row.LastName}`;
    const car = `
          <div class="member-card">
          <div class="member-info">
            <label style="right: auto;">${fullName}</label>
            <label>${row.role}</label>
            </div>
          </div>
        `;
    card.insertAdjacentHTML("afterend", car);
  });
});
