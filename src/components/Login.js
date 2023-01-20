import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, githupSingIn } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/wrong-password") {
        setError("Wrong password");
      } else if (error.code === "auth/user-not-found") {
        setError("User not found");
      } else if (error.code) {
        setError("Something went wrong, please try again");
      }
    }
    setLoading(false);
  }

  async function handleGithupSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await githupSingIn();
      navigate("/");
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button type="submit" className="w-100 mt-2" disabled={loading}>
              Sign In
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <Button
        type="submit"
        className="w-100 mt-2"
        onClick={handleGithupSubmit}
        disabled={loading}
      >
        Github
      </Button>
      <div className="w-100 text-center mt-2">
        Don't have an account yet? <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
};
