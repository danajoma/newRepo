require("dotenv").config();

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {

    console.log("Starting seed process...");

    // ===========================================
    // ADMIN USER
    // ===========================================

    const adminUser = await prisma.users.upsert({

        where: {
            email: "admin@test.com"
        },

        update: {},

        create: {
            name: "Admin Demo",
            email: "admin@test.com",
            password: "123",
            role: "ADMIN"
        }

    });


    const admin = await prisma.admins.upsert({

        where: {
            id: adminUser.id
        },

        update: {},

        create: {
            id: adminUser.id,
            experience_years: 5
        }

    });


    // ===========================================
    // SUPERVISOR USER
    // ===========================================

    const supervisorUser = await prisma.users.upsert({

        where: {
            email: "supervisor@test.com"
        },

        update: {},

        create: {
            name: "Supervisor Demo",
            email: "supervisor@test.com",
            password: "123",
            role: "SUPERVISOR"
        }

    });


    const supervisor = await prisma.supervisors.upsert({

        where: {
            id: supervisorUser.id
        },

        update: {},

        create: {
            id: supervisorUser.id,
            admin_id: admin.id,
            company: "Tech Corp"
        }

    });


    // ===========================================
    // INTERN USER
    // ===========================================

    const internUser = await prisma.users.upsert({

        where: {
            email: "intern@test.com"
        },

        update: {},

        create: {
            name: "Intern Demo",
            email: "intern@test.com",
            password: "123",
            role: "INTERN"
        }

    });


    const intern = await prisma.interns.upsert({

        where: {
            id: internUser.id
        },

        update: {},

        create: {
            id: internUser.id,
            admin_id: admin.id,
            university: "An-Najah National University",
            major: "Computer Systems Engineering",
            attendance_ratio: 90
        }

    });


    // ===========================================
    // PROJECT
    // ===========================================

    let project = await prisma.projects.findFirst({

        where: {
            title: "Project 1"
        }

    });


    if (!project) {

        project = await prisma.projects.create({

            data: {

                created_by_admin_id: admin.id,

                supervisor_id: supervisor.id,

                title: "Project 1",

                description: "Internship Management System",

                start_date: new Date(),

                end_date: new Date()

            }

        });

    }


    // ===========================================
    // TASK
    // ===========================================

    let task = await prisma.tasks.findFirst({

        where: {

            project_id: project.id,

            intern_id: intern.id,

            title: "Task 1"

        }

    });


    if (!task) {

        task = await prisma.tasks.create({

            data: {

                project_id: project.id,

                intern_id: intern.id,

                title: "Task 1",

                description: "Build CRUD APIs using Prisma",

                status: "Pending",

                deadline: new Date()

            }

        });

    }


    // ===========================================
    // FEEDBACK
    // ===========================================

    let feedback = await prisma.feedbacks.findFirst({

        where: {

            task_id: task.id,

            intern_id: intern.id,

            supervisor_id: supervisor.id

        }

    });


    if (!feedback) {

        feedback = await prisma.feedbacks.create({

            data: {

                task_id: task.id,

                intern_id: intern.id,

                supervisor_id: supervisor.id,

                comment: "Excellent progress",

                rating: 5,

                date: new Date()

            }

        });

    }


    console.log("--------------------------------------------");

    console.log("Seed completed successfully!");

    console.log("Admin User ID:", adminUser.id);

    console.log("Supervisor User ID:", supervisorUser.id);

    console.log("Intern User ID:", internUser.id);

    console.log("Project ID:", project.id);

    console.log("Task ID:", task.id);

    console.log("Feedback ID:", feedback.id);

    console.log("--------------------------------------------");

}


main()

.catch((error) => {

    console.error(error);

    process.exit(1);

})

.finally(async () => {

    await prisma.$disconnect();

});