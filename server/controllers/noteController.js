const Note = require("../models/Note");

// Get all notes for current user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a specific note
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      user: req.user.id,
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    let note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Update fields
    note.title = title;
    note.content = content;
    note.updatedAt = Date.now();

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await note.remove();
    res.json({ msg: "Note removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
