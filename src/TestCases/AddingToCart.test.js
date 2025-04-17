import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProductDetailsScreen from "../Screens/ProductDetailsScreen";
import { CartProvider, useCart } from "../Contexts/CartContext";
import { Text, View } from "react-native";

// Mock product data
const mockProduct = {
  id: 1,
  name: "Wireless Headphones",
  price: 99.99,
  description:
    "Premium wireless headphones with noise cancellation and 30-hour battery life.",
  image:
    "https://images.philips.com/is/image/philipsconsumer/bce55fd21d424811a938b0d2007784a0?$pnglarge$&wid=1920",
};

// Mock route params
const mockRoute = { params: { product: mockProduct } };

// Mock navigation
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Create Test Interface
const TestInterface = () => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const { getTotalItems } = useCart();

  return (
    <View>
      <Text testID="cart-count">{getTotalItems()}</Text>

      {!showDetails ? (
        <View>
          <Text testID="product-name">{mockProduct.name}</Text>
          <Text testID="view-details" onPress={() => setShowDetails(true)}>
            View Details
          </Text>
        </View>
      ) : (
        <View>
          <ProductDetailsScreen route={mockRoute} />
          <Text
            testID="back-button"
            onPress={() => {
              setShowDetails(false);
              // Simulate navigation back after potential cart addition
              if (addedToCart) {
                setAddedToCart(true);
              }
            }}
          >
            Back
          </Text>
        </View>
      )}
    </View>
  );
};

// Mock CartContext
jest.mock("../Contexts/CartContext", () => {
  const actual = jest.requireActual("../Contexts/CartContext");
  return {
    ...actual,
    __esModule: true,
    useCart: jest.fn().mockImplementation(() => actual.useCart()),
  };
});

import { useCart as mockUseCart } from "../Contexts/CartContext";

// Mock functions
const mockAddToCart = jest.fn();
const mockGetTotalItems = jest.fn(() => 1);

beforeEach(() => {
  jest.clearAllMocks();
  mockUseCart.mockImplementation(() =>
    jest.requireActual("../Contexts/CartContext").useCart()
  );
});

//Test Cases Start
describe("ProductDetailsScreen Tests", () => {
  //First Test Case
  test("adds product to cart from product details screen", () => {
    mockUseCart.mockReturnValue({
      addToCart: mockAddToCart,
      getTotalItems: mockGetTotalItems,
      cartItems: [],
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      getCartTotal: jest.fn(),
    });

    const { getByText } = render(<ProductDetailsScreen route={mockRoute} />);
    const addButton = getByText("Add to Cart");
    fireEvent.press(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  //Second Test Case
  it("updates total cart items after adding a product", async () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestInterface />
      </CartProvider>
    );

    // Initial cart count should be 0
    expect(getByTestId("cart-count").props.children).toBe(0);

    // Navigate to details
    fireEvent.press(getByTestId("view-details"));

    // Add product to cart
    fireEvent.press(getByText("Add to Cart"));

    // Navigate back
    fireEvent.press(getByTestId("back-button"));

    // Check if cart count updated to 1
    await waitFor(() => {
      expect(getByTestId("cart-count").props.children).toBe(1);
    });
  });
});
