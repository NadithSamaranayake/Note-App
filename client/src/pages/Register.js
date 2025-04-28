import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { register, isAuthenticated, error, clearError } =
    useContext(AuthContext);
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
  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { setSubmitting }) => {
          register({
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
