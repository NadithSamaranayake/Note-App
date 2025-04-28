import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate("/");
    }

    // Clear errors when component unmounts
    return () => {
      clearError();
    };
  }, [isAuthenticated, navigate, clearError]);

  // Validation schema
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          login({
            username: values.username,
            password: values.password,
          });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" className="form-control" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Login
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
