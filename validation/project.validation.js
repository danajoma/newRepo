const { z } = require("zod");


const projectSchema = z.object({

    created_by_admin_id: z.number().positive(),

    title: z.string()
        .min(3, "Title must be at least 3 characters"),

    description: z.string(),

    start_date: z.string().data(),

    end_date: z.string().data()

});


module.exports = {projectSchema};
