import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Apollo Mutation
import { useMutation } from "@apollo/client/react";
import { SIGNUP_MUTATION } from "../graphql/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  const navigate = useNavigate();
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);

  // 🔥 Handle Signup
  const handleSignup = async () => {
    if (!name || !number || !password || !confirmPass) {
      return alert("All fields are required");
    }
    if (password !== confirmPass) {
      return alert("Passwords do not match");
    }

    try {
      const res = await signup({
        variables: { name, number, password },
      });

      const user = res.data.signup;

      // Save user session
      localStorage.setItem("token", user.token);
      localStorage.setItem("userName", user.name);

      navigate("/"); // redirect to home
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md rounded-xl bg-white">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign up to explore the best shopping experience
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-4">

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="number"
              placeholder="Enter your number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Re-enter password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>

        </div>

        {/* Signup Button */}
        <div className="mt-6">
          <Button 
            className="w-full" 
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
}
