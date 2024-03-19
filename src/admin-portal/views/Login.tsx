import React from "react";
import { TextInput } from "@admin-portal/components/FormInputs";
import { signInWithEmailAndPassword, type UserCredential } from "firebase/auth";
import { auth } from "@admin-portal/utils/firebase";

interface LoginProps {
  setCredentials: (credentials: UserCredential | undefined) => void;
}

export function Login({ setCredentials }: LoginProps): JSX.Element {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const doLogin = React.useCallback<SubmitCallback>(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        setCredentials(credentials);
      }
      catch (ex) {
        const message = (ex as { message: string }).message;
        console.error(message);
        setError(message);
      }
    },
    [email, password, setError, setCredentials],
  );

  return (
    <>
      <form onSubmit={doLogin}>
        <TextInput label="Email" value={email} setValue={setEmail} />
        <TextInput
          label="Password"
          value={password}
          setValue={setPassword}
          password
        />
        <button type="submit">Login</button>
      </form>
      {error !== "" ? <p>{error}</p> : undefined}
    </>
  );
}
