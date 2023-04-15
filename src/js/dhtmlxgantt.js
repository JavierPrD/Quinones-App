import gantt from "dhtmlx-gantt";

// This is where you would import the DHTMLX Gantt library, either by downloading it and including it in your project, or by using a package manager like npm or yarn.
// For example:
// import gantt from "dhtmlx-gantt";

gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
gantt.init("gantt-chart");
const tasks = [
  {"id":1,"text":"Task 1","start_date":"2023-04-15 09:00","duration":3},
  {"id":2,"text":"Task 2","start_date":"2023-04-15 12:00","duration":2},
  {"id":3,"text":"Task 3","start_date":"2023-04-15 15:00","duration":1}
];
gantt.parse(tasks);
