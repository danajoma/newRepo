const { z } = require("zod");


const feedbackSchema = z.object({

    task_id:z.number().positive(),

    intern_id:z.number().positive(),

    supervisor_id:z.number().positive(),

    comment:z.string(),

    rating:z.number()
        .min(1)
        .max(5),

    date:z.string().date()

});


module.exports = { feedbackSchema };