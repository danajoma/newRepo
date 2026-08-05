require("dotenv").config();
const express = require("express");


const app = express();

app.use(express.json());
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.get("/health",(req,res)=>{
    res.json({
        status:"Server is running"
    });
});


const usersRoutes = require("./routes/users");

app.use("/users", usersRoutes);

const projectRoutes = require("./routes/projects");

app.use("/projects", projectRoutes);

const admintRoutes = require("./routes/admins");

app.use("/admins", admintRoutes);


const supervisorsRouter = require("./routes/supervisors");
app.use("/supervisors", supervisorsRouter);


const internsRouter = require("./routes/interns");
app.use("/interns", internsRouter);


const tasksRouter = require("./routes/tasks");
app.use("/tasks", tasksRouter);

const feedbacksRouter = require("./routes/feedbacks");
app.use("/feedbacks", feedbacksRouter);

const submissionRouter = require("./routes/submission");
app.use("/submission", submissionRouter);



const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;


