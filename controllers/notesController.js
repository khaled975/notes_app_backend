const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");

const Notes = require("../models/note.model");
const errorHandler = require("../utils/errorHandler");

// GET ALL NOTES FOR ALL USER
const getAllNotesForAllUsers = asyncWrapper(async (req, res, next) => {
  const notes = await Notes.find();

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { notes },
  });
});

// GET ALL NOTES FOR CURRENT USER
const getAllNotes = asyncWrapper(async (req, res, next) => {
  const currentUser = req.currentUser;
  const notes = await Notes.find({ userId: currentUser.email }).sort({
    isPinned: -1,
  });

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { notes },
  });
});

const addNewNote = asyncWrapper(async (req, res, next) => {
  const currentUser = req.currentUser;
  console.log(currentUser);

  const newNote = new Notes({ ...req.body, userId: currentUser.email });
  await newNote.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { note: newNote } });
});

const editNote = asyncWrapper(async (req, res, next) => {
  const noteId = req.params.id;
  const currentUser = req.currentUser;
  const note = await Notes.findOne({ _id: noteId, userId: currentUser.email });
  if (!note) {
    const error = errorHandler.create(
      404,
      httpStatusText.FAIL,
      "Note Not Found!"
    );
    return next(error);
  }
  const updatedNote = await Notes.updateOne(
    { _id: noteId, userId: currentUser.email },
    { ...req.body },
    { runValidators: false }
  );
  //   await Notes.save();
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { updatedNote } });
});

const deleteNote = asyncWrapper(async (req, res, next) => {
  const noteId = req.params.id;
  const currentUser = req.currentUser;

  const note = await Notes.findOne({ _id: noteId, userId: currentUser.email });
  if (!note) {
    const error = errorHandler.create(
      404,
      httpStatusText.FAIL,
      "Note Not Found!"
    );
    return next(error);
  }

  await Notes.deleteOne({ _id: noteId, userId: currentUser.email });
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

const updateIsPinned = asyncWrapper(async (req, res, next) => {
  const { isPinned } = req.body;
  const noteId = req.params.id;
  const currentUser = req.currentUser;

  const note = await Notes.findOne({ _id: noteId, userId: currentUser.email });

  note.isPinned = isPinned;
  await note.save();

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

const searchNotes = asyncWrapper(async (req, res, next) => {
  const currentUser = req.currentUser;
  const { query } = req.query;
  console.log(query);

  if (!query) {
    return res.status(404).json({ message: "no query" });
  }

  const matchedNotes = await Notes.find({
    userId: currentUser.email,
    $or: [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ],
  });
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { notes: matchedNotes } });
});
module.exports = {
  getAllNotes,
  addNewNote,
  editNote,
  deleteNote,
  updateIsPinned,
  searchNotes,
};
