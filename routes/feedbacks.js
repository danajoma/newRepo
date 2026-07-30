const express = require("express");
const router = express.Router();

const { feedbackSchema } = require("../validation/feedback.validation");

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
// GET ALL FEEDBACKS
// =========================

router.get("/", authMiddleware,
allowRoles("ADMIN","SUPERVISOR"), async (req,res)=>{


    try {


        const feedbacks = await prisma.feedbacks.findMany({

            include:{
                task:true,
                intern:true,
                supervisor:true
            }

        });


        res.json(feedbacks);



    }catch(error){


        res.status(500).json({
            error:error.message
        });

    }


});





// =========================
// GET FEEDBACK BY ID
// =========================


router.get("/:id", authMiddleware,
allowRoles("ADMIN","SUPERVISOR"), async(req,res)=>{


    try {


        const feedback = await prisma.feedbacks.findUnique({

            where:{
                id:Number(req.params.id)
            },

            include:{
                task:true,
                intern:true,
                supervisor:true
            }

        });



        if(!feedback){

            return res.status(404).json({
                message:"Feedback not found"
            });

        }


        res.json(feedback);



    }catch(error){


        res.status(500).json({
            error:error.message
        });

    }


});







// =========================
// CREATE FEEDBACK
// =========================


router.post("/", authMiddleware,
allowRoles("SUPERVISOR"), async(req,res)=>{


    try {


        // Validation

        const result = feedbackSchema.safeParse(req.body);


        if(!result.success){

            return res.status(400).json({

                error: result.error.errors

            });

        }



        // Check Task exists

        const task = await prisma.tasks.findUnique({

            where:{
                id:Number(req.body.task_id)
            },


            include:{
                submissions:true
            }

        });



        if(!task){

            return res.status(404).json({

                message:"Task not found"

            });

        }





        // Check intern submitted this task

        const hasSubmission = task.submissions.some(

            submission =>
            submission.intern_id === Number(req.body.intern_id)

        );



        if(!hasSubmission){

            return res.status(400).json({

                message:"This intern has no submission for this task"

            });

        }




        // Create Feedback

        const feedback = await prisma.feedbacks.create({


            data:{


                task_id:Number(req.body.task_id),


                intern_id:Number(req.body.intern_id),


                supervisor_id:req.user.id,


                comment:req.body.comment,


                rating:Number(req.body.rating),


                date:req.body.date 
                ? new Date(req.body.date)
                : new Date()


            }


        });



        res.status(201).json(feedback);



    }catch(error){


        res.status(500).json({

            error:error.message

        });

    }


});







// =========================
// UPDATE FEEDBACK
// =========================


router.put("/:id", authMiddleware,
allowRoles("SUPERVISOR"), async(req,res)=>{


    try {


        const feedback = await prisma.feedbacks.update({

            where:{
                id:Number(req.params.id)
            },


            data:{


                ...(req.body.comment && {
                    comment:req.body.comment
                }),


                ...(req.body.rating && {
                    rating:Number(req.body.rating)
                }),


                ...(req.body.date && {
                    date:new Date(req.body.date)
                })


            }


        });



        res.json(feedback);



    }catch(error){


        res.status(500).json({

            error:error.message

        });

    }


});







// =========================
// DELETE FEEDBACK
// =========================


router.delete("/:id", authMiddleware,
allowRoles("SUPERVISOR"), async(req,res)=>{


    try {


        const feedback = await prisma.feedbacks.delete({

            where:{
                id:Number(req.params.id)
            }

        });



        res.json({

            message:"Feedback deleted successfully",

            feedback

        });



    }catch(error){


        res.status(500).json({

            error:error.message

        });

    }


});






module.exports = router;