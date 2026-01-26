import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={() => signInWithEmailAndPassword(auth, email, password)}>
        Login
      </button>

      <button onClick={() => createUserWithEmailAndPassword(auth, email, password)}>
        Sign Up
      </button>
    </div>
  );
}
