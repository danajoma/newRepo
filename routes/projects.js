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


// ===============================
// GET ALL PROJECTS
// ===============================

router.get("/", async (req, res) => {

    try {

        const projects = await prisma.projects.findMany({
            include: {
                admin: true,
                supervisor: true,
                tasks: true
            }
        });

        res.json(projects);


    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});




// ===============================
// GET PROJECT BY ID
// ===============================

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


        if (!project) {

            return res.status(404).json({
                error: "Project not found"
            });

        }


        res.json(project);


    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});




// ===============================
// CREATE PROJECT
// ===============================

router.post("/", async (req, res) => {

    try {
        const result = userSchema.safeParse(req.body);


if(!result.success){

    return res.status(400).json({
        error: result.error.errors
    });

}

        const project = await prisma.projects.create({

            data: {

                created_by_admin_id: req.body.created_by_admin_id,

                supervisor_id: req.body.supervisor_id,

                title: req.body.title,

                description: req.body.description,

                start_date: new Date(req.body.start_date),

                end_date: new Date(req.body.end_date)

            }

        });


        res.json(project);


    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});




// ===============================
// UPDATE PROJECT
// ===============================

router.put("/:id", async (req, res) => {

    try {


        const project = await prisma.projects.update({

            where: {
                id: Number(req.params.id)
            },


            data: {

                title: req.body.title,

                description: req.body.description,

                start_date: new Date(req.body.start_date),

                end_date: new Date(req.body.end_date)

            }

        });


        res.json(project);



    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});




// ===============================
// DELETE PROJECT
// ===============================

router.delete("/:id", async (req, res) => {

    try {


        const project = await prisma.projects.delete({

            where: {
                id: Number(req.params.id)
            }

        });


        res.json({

            message: "Project deleted successfully",

            project

        });



    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});




module.exports = router;