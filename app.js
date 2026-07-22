const express = require("express"); // هون عرفنا زي متغير اسمه اكسبرس عادي شو ما سميتيه ما بيفرق هاد المتغير رحتي عملي ريكور ل مكتبة الاكسبرس 

const app = express(); // هون عملتي زي فعلتي الابلكيشين اللي بيفعل هاي المكتبة 


app.get("/health", (req,res)=>{
res.json({
    status: "Server is runing "
}) ; 

});
let students = [
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
    const students = await prisma.Student.findMany();
    res.json(students);
});



app.get("/students/:id", (req,res)=> {
const studentId = req.params.id ;
const Student =  students.find(s => s.id == studentId);
res.json(Student);

});


app.delete("/students/:id",(req,res)=>{
 const id = req.params.id;

students = students.filter(
  student => student.id != id
);

    res.json({
        message:"Student deleted"
    });

});

app.put("/students/:id",(req,res)=>{
const id = req.params.id;

    const student = students.find(
        student => student.id == id
    );

student.name = req.body.name;
student.age = req.body.age;

    res.json({
        message:"Student updated",
        student
    });

});


app.listen(3000, ()=>{
    console.log("the Server is running now on port 3000");
});