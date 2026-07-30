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
// GET ALL INTERNS
// =========================

router.get("/", authMiddleware,
allowRoles("ADMIN","SUPERVISOR")  , async (req, res) => {

    try {

        const interns = await prisma.interns.findMany({

            include:{
                user:true,
                admin:true,
                feedbacks:true
            }

        });


        res.json(interns);


    } catch(error) {

        res.status(500).json({
            error:error.message
        });

    }

});




// =========================
// GET INTERN BY ID
// =========================

router.get("/:id",authMiddleware,
allowRoles("ADMIN","SUPERVISOR") , async(req,res)=>{

    try {


        const intern = await prisma.interns.findUnique({

            where:{
                id:Number(req.params.id)
            },


            include:{
                user:true,
                admin:true,
                feedbacks:true
            }

        });



        if(!intern){

            return res.status(404).json({
                error:"Intern not found"
            });

        }


        res.json(intern);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});




// =========================
// CREATE INTERN
// =========================

router.post("/", authMiddleware,
allowRoles("ADMIN","SUPERVISOR") , async(req,res)=>{

    try {


        const intern = await prisma.interns.create({

            data:{

                id:req.body.id,

                admin_id:req.body.admin_id,

                university:req.body.university,

                major:req.body.major,

                attendance_ratio:req.body.attendance_ratio

            }

        });



        res.json(intern);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});




// =========================
// UPDATE INTERN
// =========================

router.put("/:id",authMiddleware,
allowRoles("ADMIN","SUPERVISOR") , async(req,res)=>{


    try {


        const intern = await prisma.interns.update({

            where:{
                id:Number(req.params.id)
            },


            data:{

                admin_id:req.body.admin_id,

                university:req.body.university,

                major:req.body.major,

                attendance_ratio:req.body.attendance_ratio

            }

        });


        res.json(intern);



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});





// =========================
// DELETE INTERN
// =========================

router.delete("/:id",authMiddleware,
allowRoles("ADMIN","SUPERVISOR") , async(req,res)=>{


    try {


        const intern = await prisma.interns.delete({

            where:{
                id:Number(req.params.id)
            }

        });


        res.json({

            message:"Intern deleted successfully",

            intern

        });



    }catch(error){


        res.status(500).json({
            error:error.message
        });


    }

});



module.exports = router;