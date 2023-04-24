const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Login.html"));
});

router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Home_view.html"));
});


router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Sign-up.html"));
});

router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/UserProfile_view.html"));
});

router.get("/calendar", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Calender_view.html"));
});

router.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Chat_view.html"));
});

router.get("/call", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/call-view.html"));
});

router.get("/gantt", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Gantt-Chart_view.html"));
});

router.get("/files", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Files_view.html"));
});

router.get("/groups", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Groups_view.html"));
});

router.get("/help", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Help_view.html"));
});

router.get("/requests", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Requests_view.html"));
});

router.get("/task", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/Task_view.html"));
});

module.exports = router;