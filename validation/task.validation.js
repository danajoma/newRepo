const { z } = require("zod");


const taskSchema = z.object({

    project_id: z.number()
        .positive(),

    intern_id: z.number()
        .positive(),

    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title is too long"),


    description: z.string()
        .min(10, "Description must be at least 10 characters"),

// cancel , testing 
    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "COMPLETED"
    ]),


    deadline: z.string()
        .date()

});


module.exports = taskSchema;