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


// GET ALL PROJECTS
router.get("/", async (req, res) => {
    try {
       const projects = await prisma.projects.findMany({
    include: {
        admin: true,
        supervisor: true
    }
});

        res.json(projects);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// GET PROJECT BY ID
router.get("/:id", async (req, res) => {

    try {

       const project = await prisma.projects.findUnique({
    where: {
        id: Number(req.params.id)
    },
    include: {
        admin: true,
        supervisor: true,
        tasks: true
    }
});

        res.json(project);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// CREATE PROJECT
router.post("/", async (req,res)=>{

    try {

      const project = await prisma.projects.create({
    data:{
        created_by_admin_id: req.body.created_by_admin_id,
        supervisor_id: req.body.supervisor_id,
        title: req.body.title,
        description: req.body.description,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date)
    }
});

        res.json(project);

    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


// UPDATE PROJECT
router.put("/:id", async(req,res)=>{

    try{

        const project = await prisma.projects.update({

            where:{
                id:Number(req.params.id)
            },

            data:{
                name:req.body.name,
                description:req.body.description
            }

        });


        res.json(project);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});






module.exports = router;