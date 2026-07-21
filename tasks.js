const tasks = [
 {
    id :1 ,
    TaskName : "java_script learning " , 
    person : "Dana " ,
            completed: true

 },

 {
    id : 2 , 
    TaskName : "git and github learning ",
    person : "Ahmad ",
            completed: false 


 },
 { 
    id : 3 ,
    TaskName : "Node.JS learning ",
    person : "noor ",
            completed: true



 }




];

function displayTasks(){
        console.log(tasks);

}


function displayCompletedTasks() {

    const completedTasks = tasks.filter(task => task.completed);

    console.log(completedTasks);
}


function displayIncompleteTasks() {

    const incompleteTasks = tasks.filter(task => !task.completed);

    console.log(incompleteTasks);
}


function findTaskbyid(num){
const task = tasks.find(t => t.id==num);
console.log(task);

}


function addTask(title){
const newTask = {
id : tasks.length+1 ,
    TaskName : title, 
    person : "Dana " ,
     completed: false 


};
tasks.push(newTask);

}

function displayComplete(){
const task = tasks.filter(t => t.completed== true);
 console.log(task);
 

}

function displayinComplete(){

const task = tasks.filter(t => t.completed== false);
 console.log(task);


}

function showRatio(){
    const Complete = tasks.filter(t => t.completed == true );
    const ratio = (Complete.length / tasks.length) * 100;
    console.log(ratio + '%')  ;

}

addTask("Backend task") ; 

const editTask = tasks.find(t => t.id==4);
editTask.completed = true  ; 

displayTasks();
displayComplete();
displayinComplete();
findTaskbyid(2);
showRatio();

console.log("Hello world");


