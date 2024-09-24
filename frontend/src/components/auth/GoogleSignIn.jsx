import { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "./firbase";

function GoogleSignIn() {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      // Store the user data in state
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
    console.log(user);
  };
  return (
    <div>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
}

export default GoogleSignIn;
