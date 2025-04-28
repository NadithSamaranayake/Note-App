import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NoteContext } from "../../context/NoteContext";

const NoteForm = ({ currentNote, clearCurrentNote }) => {
  const { addNote, updateNote } = useContext(NoteContext);

  // Validation schema
  const NoteSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
  });

  useEffect(() => {
    return () => {
      // Clean up
      if (clearCurrentNote) clearCurrentNote();
    };
  }, [clearCurrentNote]);

  return (
    <div className="note-form-container">
      <h3>{currentNote ? "Edit Note" : "Add Note"}</h3>

      <Formik
        initialValues={{
          title: currentNote ? currentNote.title : "",
          content: currentNote ? currentNote.content : "",
        }}
        validationSchema={NoteSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (currentNote) {
            updateNote({
              _id: currentNote._id,
              title: values.title,
              content: values.content,
            });
          } else {
            addNote({
              title: values.title,
              content: values.content,
            });
          }

          resetForm();
          if (clearCurrentNote) clearCurrentNote();
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field type="text" name="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                name="content"
                rows="5"
                className="form-control"
              />
              <ErrorMessage name="content" component="div" className="error" />
            </div>

            <div className="form-group form-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {currentNote ? "Update Note" : "Add Note"}
              </button>

              {currentNote && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearCurrentNote}
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NoteForm;
