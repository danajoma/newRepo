const express = require("express");
const router = express.Router();

const { feedbackSchema } = require("../validation/feedback.validation");
const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});


// =========================
// GET ALL FEEDBACKS
// =========================
router.get("/", async (req, res) => {
    try {
        const feedbacks = await prisma.feedbacks.findMany({
            include: {
                task: true,
                intern: true,
                supervisor: true
            }
        });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =========================
// GET FEEDBACK BY ID
// =========================
router.get("/:id", async (req, res) => {
    try {
        const feedback = await prisma.feedbacks.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                task: true,
                intern: true,
                supervisor: true
            }
        });

        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =========================
// CREATE FEEDBACK
// =========================
router.post("/", async (req, res) => {
    try {
        const result = feedbackSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: result.error.errors
            });
        }

        const feedback = await prisma.feedbacks.create({
            data: {
                task_id: Number(req.body.task_id),
                intern_id: Number(req.body.intern_id),
                supervisor_id: Number(req.body.supervisor_id),
                comment: req.body.comment,
                rating: Number(req.body.rating),
                // إذا تم إرسال تاريخ نستخدمه، وإلا يضع تاريخ اللحظة تلقائياً
                date: req.body.date ? new Date(req.body.date) : new Date()
            }
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =========================
// UPDATE FEEDBACK
// =========================
router.put("/:id", async (req, res) => {
    try {
        const { comment, rating, date } = req.body;

        const feedback = await prisma.feedbacks.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                ...(comment && { comment }),
                ...(rating && { rating: Number(rating) }),
                ...(date && { date: new Date(date) })
            }
        });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// =========================
// DELETE FEEDBACK
// =========================
router.delete("/:id", async (req, res) => {
    try {
        const feedback = await prisma.feedbacks.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.json({
            message: "Feedback deleted successfully",
            feedback
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;