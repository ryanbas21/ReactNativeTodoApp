import React, { useEffect, useState } from 'react';
import { LoginContainer } from '../components/Login';
import { Loading } from '../components/utilities/loading';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Login() {
  const [loading, setLoading] = useState(true);
  const [callbacks, setCallbacks] = useState([]);
  const [step, setStep] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await ForgeRockModule.loginWithoutUI();
        const next = JSON.parse(data);
        setLoading(false);

        setStep(next);
        setCallbacks(
          next.callbacks.map((res) => ({
            ...res,
            response: JSON.parse(res.response),
          })),
        );
      } catch (err) {
        await ForgeRockModule.performUserLogout();
        setError(err.message);
      }
    })();
  }, []);

  return loading ? (
    <Loading message={'Checking your session'} />
  ) : (
    <LoginContainer
      step={step}
      callbacks={callbacks}
      error={error}
      setLoading={setLoading}
    />
  );
}

export { Login };
