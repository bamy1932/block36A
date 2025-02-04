// An instructor can only access their own students' data.
const router = require("express").Router();
const db = require("../db");
const { prisma } = require("../common");

// Deny access if user is not logged in
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to do that.");
  }
  next();
});

// Get all students
router.get("/", async (req, res, next) => {
  try {
    const students = await prisma.student
      .findMany
      // {
      //   where: {
      //     instructorId: req.user.id,
      //   },
      // }
      // "SELECT * FROM student WHERE instructorId = $1",
      // [req.user.id]
      ();
    res.send(students);
  } catch (error) {
    console.error(error);
  }
});

// Get a student by id
router.get("/:id", async (req, res, next) => {
  try {
    const student = await prisma.student.findFirstOrThrow({
      where: {
        id: parseInt(req.params.id),
        instructorId: parseInt(req.user.id),
      },
      //   rows: [student],
      // } = await db.query(
      //   "SELECT * FROM student WHERE id = $1 AND instructorId = $2",
      //   [req.params.id, req.user.id]
    });

    if (!student) {
      return res.status(404).send("Student not found.");
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

// Create a new student
router.post("/", async (req, res, next) => {
  try {
    const student = await prisma.student.create({
      data: {
        name: req.body.name,
        cohort: parseInt(req.body.cohort),
        instructorId: req.user.id,
      },
      //   rows: [student],
      // } = await db.query(
      //   "INSERT INTO student (name, cohort, instructorId) VALUES ($1, $2, $3) RETURNING *",
      //   [req.body.name, req.body.cohort, req.user.id]
    });
    res.status(201).send(student);
  } catch (error) {
    next(error);
  }
});

// Update a student
router.put("/:id", async (req, res, next) => {
  try {
    const student = await prisma.student.update({
      where: {
        id: req.params.id,
        instructorId: req.user.id,
      },
      data: {
        name: req.body.name,
        cohort: parseInt(req.body.cohort),
      },
    });
    // const {
    //   rows: [student],
    // } = await db.query(
    //   "UPDATE student SET name = $1, cohort = $2 WHERE id = $3 AND instructorId = $4 RETURNING *",
    //   [req.body.name, req.body.cohort, req.params.id, req.user.id]
    // );

    if (!student) {
      return res.status(404).send("Student not found.");
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

// Delete a student by id
router.delete("/:id", async (req, res, next) => {
  try {
    const student = await prisma.student.delete({
      where: {
        id: parseInt(req.params.id),
        // instructorId: req.user.id,
      },
    });
    // const {
    //   rows: [student],
    // } = await db.query(
    //   "DELETE FROM student WHERE id = $1 AND instructorId = $2 RETURNING *",
    //   [req.params.id, req.user.id]
    // );
    if (!student) {
      return res.status(404).send("Student not found.");
    }

    return res.send(student);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
