import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
// import { products } from '../Utils/data';
import HomeScreen from '../Screens/HomeScreen';
import { products } from '../Utils/data';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('Product Listing Tests', () => {
  test('products are displayed on the home screen', async () => {
    const { getAllByTestId } = render(<HomeScreen />);
    
    // Wait for component to fully render
    await waitFor(() => {
      // Assuming ProductCard component has a testID="product-card"
      const productCards = getAllByTestId('product-card');
      expect(productCards.length).toBeGreaterThanOrEqual(5);
    });
  });
  
  test('products display correct name and price', async () => {
    const { getByText } = render(<HomeScreen />);
    
    // Check if first product's name and price are rendered
    await waitFor(() => {
      expect(getByText(products[0].name)).toBeTruthy();
      expect(getByText(`$${products[0].price.toFixed(2)}`)).toBeTruthy();
    });
  });
});