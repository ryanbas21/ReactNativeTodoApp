import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';

const { ForgeRockModule } = NativeModules;

export default function App() {
  useEffect(() => {
    // It's important to start the FR SDK at the root level
    async function start() {
      await ForgeRockModule.frAuthStart();
    }
    start();
  }, []);
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}
