import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider as PaperProvider } from 'react-native-paper';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '546241434648-5fbpv243mip8spvu1vqts8m7jab7icvl.apps.googleusercontent.com',
    });
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
}

export default App;


