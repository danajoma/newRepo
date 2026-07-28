const { z } = require("zod");


const submissionSchema = z.object({

    intern_id: z.number(),

    task_id: z.number(),

    submission_date: z.string(),

    status: z.string(),

    file_url: z.string().optional()

});


module.exports = submissionSchema;