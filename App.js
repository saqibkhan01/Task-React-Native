import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/Navigation/AppNavigator';
import { CartProvider } from './src/Contexts/CartContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
}