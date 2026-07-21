const express = require("express"); // هون عرفنا زي متغير اسمه اكسبرس عادي شو ما سميتيه ما بيفرق هاد المتغير رحتي عملي ريكور ل مكتبة الاكسبرس 

const app = express(); // هون عملتي زي فعلتي الابلكيشين اللي بيفعل هاي المكتبة 


app.get("/health", (req,res)=>{
res.json({
    status: "Server is runing "
}) ; 

});
const students = [
    {
        id: 1,
        name: "Dana",
        age: 22
    },
    {
        id: 2,
        name: "Omar",
        age: 21
    },
    {
        id: 3,
        name: "Malak",
        age: 20
    }
];

app.use(express.json());
app.post("/students" , (req,res) => {
const newStudent = req.body ; 
students.push(newStudent);

res.json({
  Message :  "this student added ",
  student : newStudent 
});

});



app.get("/students", (req,res)=>{
    res.json(students);
});



app.get("/students/:id", (req,res)=> {
const studentId = req.params.id ;
const Student =  students.find(s => s.id == studentId);
res.json(Student);

});

app.listen(3000, ()=>{
    console.log("the Server is running now on port 3000");
});