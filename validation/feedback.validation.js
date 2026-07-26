const { z } = require("zod");


const feedbackSchema = z.object({

    task_id:z.number(),

    intern_id:z.number(),

    supervisor_id:z.number(),

    comment:z.string(),

    rating:z.number()
        .min(1)
        .max(5),

    date:z.string()

});


module.exports = feedbackSchema;