const { z } = require("zod");


const taskSchema = z.object({

    project_id: z.number(),

    intern_id: z.number(),

    title: z.string()
        .min(3, "Title must be at least 3 characters"),


    description: z.string(),


    status: z.string(),


    deadline: z.string()

});


module.exports = taskSchema;
