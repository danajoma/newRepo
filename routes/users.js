const express = require("express");

const router = express.Router();

const userSchema = require("../validation/user.validation");
const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});
const bcrypt = require("bcrypt");

const authMiddleware = require("../middleware/auth.middleware");

const allowRoles = require("../middleware/role.middleware");


// GET ALL USERS
router.get("/", authMiddleware,
allowRoles("ADMIN"), async (req, res) => {

    try {


        // 1- أخذ بيانات الصفحة من الرابط

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;



        // 2- حساب عدد العناصر التي نتخطاها

        const skip = (page - 1) * limit;



        // 3- جلب المستخدمين حسب الصفحة

       const search = req.query.search || "";

const role = req.query.role;



const users = await prisma.users.findMany({

    skip: skip,

    take: limit,


    where: {

        AND:[

            search ? {

                OR:[

                    {
                        name:{
                            contains:search,
                            mode:"insensitive"
                        }
                    },

                    {
                        email:{
                            contains:search,
                            mode:"insensitive"
                        }
                    }

                ]

            } : {},



            role ? {

                role:role

            } : {}

        ]

    }

});


        res.json({

            page: page,

            limit: limit,

            users: users

        });



    } catch (error) {


        res.status(500).json({

            error: error.message

        });


    }

});

// CREATE USER
router.post("/", authMiddleware,
    allowRoles("ADMIN"), async (req, res) => {

    try {

        // 1- validation
        const data = userSchema.parse(req.body);


        // 2- check email exists
        const existingUser = await prisma.users.findUnique({
            where:{
                email:data.email
            }
        });


        if(existingUser){

            return res.status(400).json({
                message:"Email already exists"
            });

        }


        // 3- hash password
        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        );


        // 4- create user
        const user = await prisma.users.create({

            data:{
                name:data.name,
                email:data.email,
                password:hashedPassword,
                role:data.role
            }

        });


        res.json({
            message:"User created successfully",
            user
        });


    } catch(error){

        res.status(400).json({
            error:error.message
        });

    }

});


// GET USER BY ID
router.get("/:id", authMiddleware,
    allowRoles("ADMIN"), async (req, res) => {

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
router.put("/:id",
    authMiddleware,
    allowRoles("ADMIN"),
    async (req, res) => {

    try {

        // 1- أخذ الـ id من الرابط

        const id = Number(req.params.id);



        // 2- التأكد أن المستخدم موجود

        const existingUser = await prisma.users.findUnique({

            where:{
                id:id
            }

        });



        if(!existingUser){

            return res.status(404).json({

                message:"User not found"

            });

        }



        // 3- تعديل بيانات المستخدم

        const updatedUser = await prisma.users.update({

            where:{
                id:id
            },

            data:req.body

        });



        // 4- إرجاع النتيجة

        res.json({

            message:"User updated successfully",

            user:updatedUser

        });



    } catch(error){


        res.status(500).json({

            error:error.message

        });


    }

});


// DELETE USER
router.delete("/:id",authMiddleware,
    allowRoles("ADMIN"),  async(req,res)=>{

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