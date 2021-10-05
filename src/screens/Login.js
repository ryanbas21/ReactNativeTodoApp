import React, { useEffect, useState } from 'react';
import { LoginContainer } from '../components/Login';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Login() {
  const [callbacks, setCallbacks] = useState([]);
  const [step, setStep] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await ForgeRockModule.loginWithoutUI();
        const next = JSON.parse(data);

        setStep(next);
        setCallbacks(
          next.callbacks.map((res) => ({
            ...res,
            response: JSON.parse(res.response),
          })),
        );
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return <LoginContainer step={step} callbacks={callbacks} error={error} />;
}

export { Login };
