const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// @route   GET api/notes
// @desc    Get all user's notes
// @access  Private
router.get("/", noteController.getNotes);

// @route   GET api/notes/:id
// @desc    Get note by ID
// @access  Private
router.get("/:id", noteController.getNoteById);

// @route   POST api/notes
// @desc    Create a new note
// @access  Private
router.post("/", noteController.createNote);

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put("/:id", noteController.updateNote);

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete("/:id", noteController.deleteNote);

module.exports = router;
