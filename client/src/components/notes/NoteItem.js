import React, { useContext } from "react";
import { NoteContext } from "../../context/NoteContext";

const NoteItem = ({ note, editNote }) => {
  const { deleteNote } = useContext(NoteContext);

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button
            onClick={() => editNote(note)}
            className="btn btn-sm btn-primary"
          >
            Edit
          </button>
          <button
            onClick={() => deleteNote(note._id)}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="note-content">
        <p>{note.content}</p>
      </div>

      <div className="note-footer">
        <small>Created: {formatDate(note.createdAt)}</small>
        {note.updatedAt !== note.createdAt && (
          <small>Updated: {formatDate(note.updatedAt)}</small>
        )}
      </div>
    </div>
  );
};

export default NoteItem;
