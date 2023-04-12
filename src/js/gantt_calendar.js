import React, { useState } from "react";
import GanttChart from "react-gantt-chart";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const App = () => {
  const [tasks, setTasks] = useState([
    {
      id: "task1",
      name: "Task 1",
      start: "2023-04-01",
      end: "2023-04-15"
    },
    {
      id: "task2",
      name: "Task 2",
      start: "2023-04-10",
      end: "2023-04-30"
    }
  ]);

  const ganttConfig = {
    data: tasks,
    startDate: "2023-04-01",
    endDate: "2023-05-01",
    cellWidth: 50,
    barHeight: 20,
    padding: 18,
    viewMode: "month"
  };

  const calendarEvents = tasks.map(task => ({
    title: task.name,
    start: task.start,
    end: task.end
  }));

  return (
    <div>
      <GanttChart {...ganttConfig} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.start}</td>
              <td>{task.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <FullCalendar plugins={[dayGridPlugin]} events={calendarEvents} />
    </div>
  );
};

export default App;
