const express = require("express");

const router = express.Router();

const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});


const prisma = new PrismaClient({
    adapter
});


// GET ALL USERS
router.get("/", async (req, res) => {
    try {
        const users = await prisma.users.findMany();

        res.json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;