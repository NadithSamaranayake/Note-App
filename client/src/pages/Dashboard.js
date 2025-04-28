import React, { useContext, useEffect, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { AuthContext } from "../context/AuthContext";
import NoteForm from "../components/notes/NoteForm";
import NoteItem from "../components/notes/NoteItem";

const Dashboard = () => {
  const { notes, getNotes, loading } = useContext(NoteContext);
  const { user, logout } = useContext(AuthContext);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  const editNote = (note) => {
    setCurrentNote(note);
    setShowNoteForm(true);
  };

  const clearCurrentNote = () => {
    setCurrentNote(null);
    setShowNoteForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user && user.username}</h2>
        <button onClick={logout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <div className="notes-controls">
        <button
          onClick={() => {
            setCurrentNote(null);
            setShowNoteForm(!showNoteForm);
          }}
          className="btn btn-success"
        >
          {showNoteForm && !currentNote ? "Cancel" : "Add Note"}
        </button>
      </div>

      {showNoteForm && (
        <NoteForm
          currentNote={currentNote}
          clearCurrentNote={clearCurrentNote}
        />
      )}

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes yet. Create one!</p>
        ) : (
          notes.map((note) => (
            <NoteItem key={note._id} note={note} editNote={editNote} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
