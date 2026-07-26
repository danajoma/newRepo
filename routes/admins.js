const express = require("express");
const router = express.Router();

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});

router.post("/", async (req, res) => {

    try {

        const admin = await prisma.admins.create({
            data: {
                id: req.body.id,
                experience_years: req.body.experience_years
            }
        });

        res.json(admin);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;