import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CartIcon from '../Components/CartIcon';

// Mocking the navigation function
const mockNavigate = jest.fn();

// Mock navigation module
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock CartContext
jest.mock('../Contexts/CartContext', () => ({
  useCart: () => ({
    getTotalItems: () => 3,
  }),
}));

//Test Cases Start
describe('CartIcon Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  //First Test Case
  test('cart icon navigates to cart screen when pressed', () => {
    const { getByTestId } = render(<CartIcon />);

    const cartIcon = getByTestId('cart-icon');
    fireEvent.press(cartIcon);

    // Now we track the shared mockNavigate function
    expect(mockNavigate).toHaveBeenCalledWith('Cart');
  });
 
  //Second Test Case
  test('badge displays item count when there are items in the cart', () => {
    const { getByTestId } = render(<CartIcon />);
    const badge = getByTestId('cart-count');
    expect(badge).toHaveTextContent('3');
  });
});
