const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {


    try {


        // أخذ الـ token من الهيدر

        const authHeader = req.headers.authorization;



        if(!authHeader){

            return res.status(401).json({

                message:"No token provided"

            });

        }



        // شكل الهيدر يكون:
        // Bearer token

        const token = authHeader.split(" ")[1];



        if(!token){

            return res.status(401).json({

                message:"Invalid token format"

            });

        }



        // التحقق من صحة التوكن

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );



        // تخزين بيانات المستخدم داخل request

        req.user = decoded;



        next();



    }
    catch(error){


        res.status(401).json({

            message:"Invalid token"

        });


    }

};



module.exports = authMiddleware;