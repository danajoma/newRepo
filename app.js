require("dotenv").config();
const express = require("express");


const app = express();

app.use(express.json());


app.get("/health",(req,res)=>{
    res.json({
        status:"Server is running"
    });
});


const usersRoutes = require("./routes/users");

app.use("/users", usersRoutes);

const projectRoutes = require("./routes/projects");

app.use("/projects", projectRoutes);

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});

