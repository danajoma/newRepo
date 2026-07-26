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



// =========================
// GET ALL TASKS
// =========================

router.get("/", async (req,res)=>{

    try {


        const tasks = await prisma.tasks.findMany({

            include:{
                project:true,
                intern:true,
                feedbacks:true
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

router.get("/:id", async(req,res)=>{


    try {


        const task = await prisma.tasks.findUnique({

            where:{
                id:Number(req.params.id)
            },


            include:{
                project:true,
                intern:true,
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

router.post("/", async(req,res)=>{


    try {

const result = taskSchema.safeParse(req.body);


if(!result.success){

    return res.status(400).json({

        error: result.error.errors

    });

}

        const task = await prisma.tasks.create({

            data:{


                project_id:req.body.project_id,

                intern_id:req.body.intern_id,

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

router.put("/:id", async(req,res)=>{


    try {


        const task = await prisma.tasks.update({

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



        res.json(task);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }


});






// =========================
// DELETE TASK
// =========================

router.delete("/:id", async(req,res)=>{


    try {


        const task = await prisma.tasks.delete({

            where:{
                id:Number(req.params.id)
            }

        });



        res.json({

            message:"Task deleted successfully",

            task

        });



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }


});





module.exports = router;