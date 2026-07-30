const express = require("express");

const router = express.Router();

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
 

const { projectSchema } = require("../validation/project.validation");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});

const authMiddleware = require("../middleware/auth.middleware");

const allowRoles = require("../middleware/role.middleware");


// ===============================
// GET ALL PROJECTS
// ===============================

router.get("/", authMiddleware,
allowRoles("ADMIN","SUPERVISOR"), async (req,res)=>{

    try {


        // Pagination
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;



        // Search
        const search = req.query.search || "";



        const projects = await prisma.projects.findMany({

            skip: skip,

            take: limit,


            where:{

                OR:[

                    {
                        title:{
                            contains:search,
                            mode:"insensitive"
                        }
                    },


                    {
                        description:{
                            contains:search,
                            mode:"insensitive"
                        }
                    }

                ]

            },


            include:{
                admin:true,
                supervisor:true,
                tasks:true
            }

        });



        res.json({

            page:page,

            limit:limit,

            projects:projects

        });



    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});





// ===============================
// GET PROJECT BY ID
// ===============================

router.get("/:id",authMiddleware,
allowRoles("ADMIN","SUPERVISOR"),  async (req, res) => {

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

router.post("/", authMiddleware,
allowRoles("ADMIN") , async (req, res) => {

    try {
        const result = projectSchema.safeParse(req.body);


if(!result.success){

    return res.status(400).json({
        error: result.error.errors
    });

}

const startDate = new Date(req.body.start_date);
        const endDate = new Date(req.body.end_date);


        if(endDate < startDate){

            return res.status(400).json({
                message:"End date must be after start date"
            });

        }

        const supervisor = await prisma.supervisors.findUnique({

    where:{
        id: req.body.supervisor_id
    }

});


if(!supervisor){

    return res.status(400).json({
        message:"Supervisor not found"
    });

}

        const project = await prisma.projects.create({

            data: {

                created_by_admin_id:  req.user.id,

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

router.put("/:id",authMiddleware,
allowRoles("ADMIN","SUPERVISOR") ,  async (req, res) => {

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

router.delete("/:id",authMiddleware,
    allowRoles("ADMIN"), async (req, res) => {

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