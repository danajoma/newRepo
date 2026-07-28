const express = require("express");

const router = express.Router();

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");


const submissionSchema = require("../validation/submission.validation");


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});




// ===============================
// GET ALL SUBMISSIONS
// ===============================

router.get("/", async (req, res) => {

    try {

        const submissions = await prisma.submission.findMany({

            include: {

                intern: true,

                task: true

            }

        });


        res.json(submissions);


    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

});






// ===============================
// GET SUBMISSION BY ID
// ===============================

router.get("/:id", async (req, res) => {


    try {


        const submission = await prisma.submission.findUnique({


            where: {

                id: Number(req.params.id)

            },


            include: {

                intern: true,

                task: true

            }


        });



        if (!submission) {


            return res.status(404).json({

                error: "Submission not found"

            });


        }



        res.json(submission);



    } catch (error) {


        res.status(500).json({

            error: error.message

        });


    }


});







// ===============================
// CREATE SUBMISSION
// ===============================

router.post("/", async (req, res) => {


    try {


        const result = submissionSchema.safeParse(req.body);



        if (!result.success) {


            return res.status(400).json({

                error: result.error.errors

            });


        }




       const submission = await prisma.submission.create({

    data: {

        intern_id: req.body.intern_id,

        task_id: req.body.task_id,

        submission_date: new Date(req.body.submission_date),

        status: req.body.status,

        file_url: req.body.file_url

    }

});



        res.json(submission);



    } catch (error) {


        res.status(500).json({

            error: error.message

        });


    }


});









// ===============================
// UPDATE SUBMISSION
// ===============================

router.put("/:id", async (req, res) => {


    try {


      const submission = await prisma.submission.update({

    where: {

        id: Number(req.params.id)

    },


    data: {

        intern_id: req.body.intern_id,

        task_id: req.body.task_id,

        submission_date: new Date(req.body.submission_date),

        status: req.body.status,

        file_url: req.body.file_url

    }

});




        res.json(submission);



    } catch (error) {


        res.status(500).json({

            error: error.message

        });


    }


});









// ===============================
// DELETE SUBMISSION
// ===============================

router.delete("/:id", async (req, res) => {


    try {



        const submission = await prisma.submission.delete({



            where: {

                id: Number(req.params.id)

            }



        });



        res.json({


            message: "Submission deleted successfully",


            submission


        });




    } catch (error) {



        res.status(500).json({

            error: error.message

        });



    }


});







module.exports = router;