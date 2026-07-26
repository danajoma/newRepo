const express = require("express");

const router = express.Router();

const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});


// GET ALL USERS
router.get("/", async (req, res) => {

    try {

        const users = await prisma.users.findMany();

        res.json(users);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// CREATE USER
router.post("/", async (req, res) => {

    try {

        const user = await prisma.users.create({

            data: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }

        });

        res.json(user);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// GET USER BY ID
router.get("/:id", async (req, res) => {

    try {

        const user = await prisma.users.findUnique({

            where: {
                id: Number(req.params.id)
            }

        });


        res.json(user);


    } catch(error) {

        res.status(500).json({
            error:error.message
        });

    }

});


// UPDATE USER
router.put("/:id", async (req,res)=>{

    try {

        const user = await prisma.users.update({

            where:{
                id:Number(req.params.id)
            },

            data:{
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                role:req.body.role
            }

        });


        res.json(user);


    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


// DELETE USER
router.delete("/:id", async(req,res)=>{

    try {

        const user = await prisma.users.delete({

            where:{
                id:Number(req.params.id)
            }

        });


        res.json({
            message:"User deleted",
            user
        });


    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


// لازم يكون آخر شيء
module.exports = router;