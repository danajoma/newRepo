const express = require("express");

const router = express.Router();

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

const authMiddleware = require("../middleware/auth.middleware");

const allowRoles = require("../middleware/role.middleware");


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});


// =========================
// GET ALL ADMINS
// =========================

router.get("/", authMiddleware,
allowRoles("ADMIN"), async (req, res) => {

    try {

        const admins = await prisma.admins.findMany({
            include:{
                user:true,
                projects:true,
                supervisors:true,
                interns:true
            }
        });

        res.json(admins);


    } catch(error) {

        res.status(500).json({
            error:error.message
        });

    }

});


// =========================
// GET ADMIN BY ID
// =========================

router.get("/:id",authMiddleware,
allowRoles("ADMIN"),  async (req,res)=>{

    try {

        const admin = await prisma.admins.findUnique({

            where:{
                id:Number(req.params.id)
            },

            include:{
                user:true,
                projects:true,
                supervisors:true,
                interns:true
            }

        });


        if(!admin){

            return res.status(404).json({
                error:"Admin not found"
            });

        }


        res.json(admin);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


// =========================
// CREATE ADMIN
// =========================

router.post("/", authMiddleware,
allowRoles("ADMIN"), async(req,res)=>{

    try {


        const admin = await prisma.admins.create({

            data:{

                id:req.body.id,

                experience_years:req.body.experience_years

            }

        });


        res.json(admin);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


// =========================
// UPDATE ADMIN
// =========================

router.put("/:id",authMiddleware,
allowRoles("ADMIN"),  async(req,res)=>{

    try {


        const admin = await prisma.admins.update({

            where:{
                id:Number(req.params.id)
            },

            data:{

                experience_years:req.body.experience_years

            }

        });


        res.json(admin);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


// =========================
// DELETE ADMIN
// =========================

router.delete("/:id", authMiddleware,
allowRoles("ADMIN"), async(req,res)=>{

    try {


        const admin = await prisma.admins.delete({

            where:{
                id:Number(req.params.id)
            }

        });


        res.json({

            message:"Admin deleted successfully",
            admin

        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});



module.exports = router;