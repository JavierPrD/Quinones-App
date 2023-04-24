// Search function will loop owners to find label fow owner_id
function getUser(user_id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].key == user_id) {
            return users[i].label;
        }
    }
    return "";
}

// Array of owners for options(in the lightbox)
var users = [
  { key: '0', label: "" },
  { key: '1', label: "Ozzy Osbourne" },
  { key: '2', label: "Bonnie Tyler" },
  { key: '3', label: "Gene Pitney" },
];
 
gantt.config.columns = [
  { name: "text", label: "Task name", width: "*", tree: true },
  { name: "start_date", label: "Start time", align: "center" },
  { name: "duration", label: "Duration", align: "center" },
  // Owners column
  {
  name: "user_id", label: "User", template: function (obj) {
  return getUser(obj.user_id);
  }
  },
  { name: "add", label: "", width: 44 }
];

// Configuring lightbox
gantt.config.lightbox.sections = [
  // Owners section, will map to owner_id
  { name: "users", height: 22, map_to: "user_id", type: "select", options: users },
  { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
  { name: "time", height: 72, map_to: "auto", type: "duration" }
]

// Assigning value to the owners label in the lightbox
gantt.locale.labels.section_users = "Users";
gantt.init("gantt_here");
gantt.parse(<data>);