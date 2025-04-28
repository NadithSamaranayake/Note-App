import React, { createContext, useReducer } from "react";
import axios from "axios";

// Create context
export const NoteContext = createContext();

// Initial state
const initialState = {
  notes: [],
  currentNote: null,
  loading: true,
  error: null,
};

// Reducer
const noteReducer = (state, action) => {
  switch (action.type) {
    case "GET_NOTES":
      return {
        ...state,
        notes: action.payload,
        loading: false,
      };
    case "GET_NOTE":
      return {
        ...state,
        currentNote: action.payload,
        loading: false,
      };
    case "ADD_NOTE":
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        loading: false,
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        ),
        loading: false,
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
        loading: false,
      };
    case "NOTE_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_CURRENT_NOTE":
      return {
        ...state,
        currentNote: null,
      };
    default:
      return state;
  }
};

// Provider component
export const NoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // Get all notes
  const getNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes");

      dispatch({
        type: "GET_NOTES",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "NOTE_ERROR",
        payload: err.response.data.msg,
      });
    }
  };

  // Get a note
  const getNote = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notes/${id}`);

      dispatch({
        type: "GET_NOTE",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "NOTE_ERROR",
        payload: err.response.data.msg,
      });
    }
  };

  // Add a note
  const addNote = async (note) => {
    try {
      const res = await axios.post("http://localhost:5000/api/notes", note);

      dispatch({
        type: "ADD_NOTE",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "NOTE_ERROR",
        payload: err.response.data.msg,
      });
    }
  };

  // Update a note
  const updateNote = async (note) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/notes/${note._id}`,
        note
      );

      dispatch({
        type: "UPDATE_NOTE",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "NOTE_ERROR",
        payload: err.response.data.msg,
      });
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);

      dispatch({
        type: "DELETE_NOTE",
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: "NOTE_ERROR",
        payload: err.response.data.msg,
      });
    }
  };

  // Clear current note
  const clearCurrentNote = () => dispatch({ type: "CLEAR_CURRENT_NOTE" });

  return (
    <NoteContext.Provider
      value={{
        notes: state.notes,
        currentNote: state.currentNote,
        loading: state.loading,
        error: state.error,
        getNotes,
        getNote,
        addNote,
        updateNote,
        deleteNote,
        clearCurrentNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
