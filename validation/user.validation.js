const { z } = require("zod");


const userSchema = z.object({

    name: z.string()
        .min(3, "Name must be at least 3 characters"),


    email: z.string()
        .email("Invalid email"),
// اعدل ع محتوى الباسووود ل يكون أأمن 
     password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        

    role: z.enum([
    "ADMIN",
    "SUPERVISOR",
    "INTERN"
])

});


module.exports = userSchema;