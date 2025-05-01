const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const notesController = require("../controllers/notesController");

router.get("/all-notes", verifyToken, notesController.getAllNotes);

router.get("/search-notes", verifyToken, notesController.searchNotes);

router.post("/add-note", verifyToken, notesController.addNewNote);

router.put("/edit-note/:id", verifyToken, notesController.editNote);

router.patch(
  "/edit-note-pinned/:id",
  verifyToken,
  notesController.updateIsPinned
);

router.delete("/delete-note/:id", verifyToken, notesController.deleteNote);

module.exports = router;
