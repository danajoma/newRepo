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
// GET ALL SUPERVISORS
// =========================

router.get("/", async (req, res) => {

    try {

        const supervisors = await prisma.supervisors.findMany({

            include:{
                user:true,
                admin:true,
                projects:true,
                feedbacks:true
            }

        });


        res.json(supervisors);


    } catch(error) {

        res.status(500).json({
            error:error.message
        });

    }

});



// =========================
// GET SUPERVISOR BY ID
// =========================

router.get("/:id", async(req,res)=>{

    try {


        const supervisor = await prisma.supervisors.findUnique({

            where:{
                id:Number(req.params.id)
            },


            include:{
                user:true,
                admin:true,
                projects:true,
                feedbacks:true
            }

        });



        if(!supervisor){

            return res.status(404).json({
                error:"Supervisor not found"
            });

        }


        res.json(supervisor);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});



// =========================
// CREATE SUPERVISOR
// =========================

router.post("/", async(req,res)=>{

    try {


        const supervisor = await prisma.supervisors.create({

            data:{

                id:req.body.id,

                admin_id:req.body.admin_id,

                company:req.body.company

            }

        });



        res.json(supervisor);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});



// =========================
// UPDATE SUPERVISOR
// =========================

router.put("/:id", async(req,res)=>{


    try {


        const supervisor = await prisma.supervisors.update({

            where:{
                id:Number(req.params.id)
            },


            data:{

                admin_id:req.body.admin_id,

                company:req.body.company

            }

        });


        res.json(supervisor);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});




// =========================
// DELETE SUPERVISOR
// =========================

router.delete("/:id", async(req,res)=>{


    try {


        const supervisor = await prisma.supervisors.delete({

            where:{
                id:Number(req.params.id)
            }

        });


        res.json({

            message:"Supervisor deleted successfully",

            supervisor

        });



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});



module.exports = router;