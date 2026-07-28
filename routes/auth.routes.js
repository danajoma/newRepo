const express = require("express");

const router = express.Router();


const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");


const { PrismaClient } = require("../generated/prisma");

const { PrismaPg } = require("@prisma/adapter-pg");


const {
    registerSchema,
    loginSchema
} = require("../validation/auth.validation");



const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});



// REGISTER

router.post("/register", async(req,res)=>{


    try {


        // 1- validation

        const data = registerSchema.parse(req.body);



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



    }catch(error){


        res.status(400).json({

            error:error.message

        });


    }


});





// LOGIN


router.post("/login", async(req,res)=>{


    try{


        // validation

        const data = loginSchema.parse(req.body);



        // find user


        const user = await prisma.users.findUnique({

            where:{
                email:data.email
            }

        });


    

        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }



        // compare passwords


        const passwordMatch = await bcrypt.compare(

            data.password,

            user.password

        );



        if(!passwordMatch){

            return res.status(401).json({

                message:"Wrong password"

            });

        }




        // create token


        const token = jwt.sign(

            {
                id:user.id,
                role:user.role
            },


            process.env.JWT_SECRET,


            {
                expiresIn:"1d"
            }

        );





        res.json({

            message:"Login successful",

            token

        });



    }
    catch(error){


        res.status(400).json({

            error:error.message

        });


    }


});

// CURRENT USER

router.get("/me", authMiddleware, async(req, res)=>{

    try {

        res.json({

            message:"Current user",

            user:req.user

        });


    } catch(error){

        res.status(500).json({

            message:"Server error"

        });

    }

});


module.exports = router;