const taskSchema = require("../validation/task.validation");
const express = require("express");

const router = express.Router();

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});

const authMiddleware = require("../middleware/auth.middleware");

const allowRoles = require("../middleware/role.middleware");


// =========================
// GET ALL TASKS
// =========================

router.get("/", authMiddleware,
allowRoles("ADMIN","SUPERVISOR"), async (req,res)=>{

    try {


        const tasks = await prisma.tasks.findMany({

            include:{
                
            }

        });


        res.json(tasks);



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});





// =========================
// GET TASK BY ID
// =========================

router.get("/:id",authMiddleware,
    allowRoles("ADMIN","SUPERVISOR"),  async(req,res)=>{


    try {


        const task = await prisma.tasks.findUnique({

            where:{
                id:Number(req.params.id)
            },


            include:{
                project:true,
              
                feedbacks:true
            }

        });



        if(!task){

            return res.status(404).json({
                error:"Task not found"
            });

        }


        res.json(task);



    }catch(error){


        res.status(500).json({
            error:error.message
        });

    }


});





// =========================
// CREATE TASK
// =========================

router.post("/",authMiddleware,
allowRoles("SUPERVISOR"), async(req,res)=>{


    try {

const result = taskSchema.safeParse(req.body);


if(!result.success){

    return res.status(400).json({

        error: result.error.errors

    });

}

const project = await prisma.projects.findUnique({

    where:{
        id:req.body.project_id
    }

});

if(!project){

    return res.status(404).json({
        message:"Project not found"
    });

}
if(project.supervisor_id !== req.user.id){

    return res.status(403).json({
        message:"You cannot create task for this project"
    });

}

        const task = await prisma.tasks.create({

            data:{


                project_id:req.body.project_id,

                
                title:req.body.title,

                description:req.body.description,

                status:req.body.status,

                deadline:new Date(req.body.deadline)


            }

        });
 


        res.json(task);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }


});






// =========================
// UPDATE TASK
// =========================

router.put(
    "/:id",
    authMiddleware,
    allowRoles("SUPERVISOR"),
    async(req,res)=>{

    try {


        const task = await prisma.tasks.findUnique({

            where:{
                id:Number(req.params.id)
            },

            include:{
                project:true
            }

        });


        if(!task){

            return res.status(404).json({
                message:"Task not found"
            });

        }


        if(task.project.supervisor_id !== req.user.id){

            return res.status(403).json({
                message:"You cannot update this task"
            });

        }



        const updatedTask = await prisma.tasks.update({

            where:{
                id:Number(req.params.id)
            },

            data:{

                title:req.body.title,

                description:req.body.description,

                status:req.body.status,

                deadline:new Date(req.body.deadline)

            }

        });



        res.json(updatedTask);



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }


});






// =========================
// DELETE TASK
// =========================

router.delete("/:id",authMiddleware,
    allowRoles("SUPERVISOR"), async(req,res)=>{


    try {


    const task = await prisma.tasks.findUnique({

        where:{
            id:Number(req.params.id)
        },

        include:{
            project:true
        }

    });



    if(!task){

        return res.status(404).json({
            message:"Task not found"
        });

    }



    if(task.project.supervisor_id !== req.user.id){

        return res.status(403).json({
            message:"You cannot delete this task"
        });

    }



    const deletedTask = await prisma.tasks.delete({

        where:{
            id:Number(req.params.id)
        }

    });



    res.json({

        message:"Task deleted successfully",

        task: deletedTask

    });



}

    catch(error){


        res.status(500).json({
            error:error.message
        });


    }


});





module.exports = router;