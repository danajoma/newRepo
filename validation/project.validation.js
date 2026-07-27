const { z } = require("zod");


const projectSchema = z.object({

    created_by_admin_id: z.number(),

    title: z.string()
        .min(3, "Title must be at least 3 characters"),

    description: z.string(),

    start_date: z.string(),

    end_date: z.string()

});


module.exports = {projectSchema};