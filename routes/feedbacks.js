const express = require("express");

const router = express.Router();
const feedbackSchema = require("../validation/feedback.validation");

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});




// =========================
// GET ALL FEEDBACKS
// =========================

router.get("/", async (req,res)=>{

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

router.get("/:id", async(req,res)=>{


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
                error:"Feedback not found"
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

router.post("/", async(req,res)=>{


    try {
const result = feedbackschema.safeParse(req.body);


if(!result.success){

    return res.status(400).json({
        error:result.error.errors
    });

}

        const feedback = await prisma.feedback.create({

            data:{


                task_id:req.body.task_id,

                intern_id:req.body.intern_id,

                supervisor_id:req.body.supervisor_id,

                comment:req.body.comment,

                rating:req.body.rating,

                date:new Date(req.body.date)


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
// UPDATE FEEDBACK
// =========================

router.put("/:id", async(req,res)=>{


    try {


        const feedback = await prisma.feedbacks.update({

            where:{
                id:Number(req.params.id)
            },


            data:{


                comment:req.body.comment,

                rating:req.body.rating,

                date:new Date(req.body.date)


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

router.delete("/:id", async(req,res)=>{


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