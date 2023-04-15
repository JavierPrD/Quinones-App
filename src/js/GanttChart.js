import React from "react";
import Gantt from "react-gantt-chart";

function GanttChart() {
  const data = [
    {
      id: "Task 1",
      start: "2022-01-01",
      end: "2022-01-05",
      name: "Task 1",
    },
    {
      id: "Task 2",
      start: "2022-01-06",
      end: "2022-01-10",
      name: "Task 2",
    },
  ];

  return (
    <div>
      <Gantt data={data} />
    </div>
  );
}
export default GanttChart;
