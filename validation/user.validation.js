const { z } = require("zod");


const userSchema = z.object({

    name: z.string()
        .min(3, "Name must be at least 3 characters"),


    email: z.string()
        .email("Invalid email"),

    password: z.string()
    .length(8, "Password must be exactly 8 characters"),

    role: z.enum([
    "ADMIN",
    "SUPERVISOR",
    "INTERN"
])

});


module.exports = userSchema;