import React from "react";
import { TextInput } from "@admin-portal/components/FormInputs";
import { signInWithEmailAndPassword, type UserCredential } from "firebase/auth";
import { auth } from "@admin-portal/utils/firebase";

interface LoginProps {
  setCredentials: (credentials: UserCredential | undefined) => void;
}

const WRONG_EMAIL_ERROR_STRING = "auth/user-not-found";
const WRONG_PASSWORD_ERROR_STRING = "auth/wrong-password";

export function Login({ setCredentials }: LoginProps): JSX.Element {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const doLogin = React.useCallback<SubmitCallback>(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const credentials = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        setCredentials(credentials);
      } catch (ex) {
        const message = (ex as { message: string }).message;
        console.error(message);
        if (message.includes(WRONG_EMAIL_ERROR_STRING))
          setError(`"${email}" hasn't yet been registered.`);
        else if (message.includes(WRONG_PASSWORD_ERROR_STRING))
          setError("The password you entered isn't correct.");
        else setError(message);
      }
    },
    [email, password, setError, setCredentials],
  );

  return (
    <>
      <form
        onSubmit={doLogin}
        className="flex flex-col gap-4 content-center items-center py-4 rounded-md bg-slate-100 dark:bg-slate-900"
      >
        <TextInput label="Email" value={email} setValue={setEmail} />
        <TextInput
          label="Password"
          value={password}
          setValue={setPassword}
          password
        />
        <button
          type="submit"
          className="rounded-md bg-sky-700 dark:bg-sky-800  hover:bg-sky-900 text-slate-100 px-4 py-1"
        >
          Login
        </button>
        {error !== "" ? (
          <p role="note" className="text-red-700 dark:text-red-400">
            {error}
          </p>
        ) : undefined}
      </form>
    </>
  );
}
