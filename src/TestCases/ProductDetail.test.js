import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProductDetailsScreen from "../Screens/ProductDetailsScreen";
import { CartProvider } from "../Contexts/CartContext";

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
const mockRoute = {
  params: {
    product: mockProduct,
  },
};

// Mock navigation
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock the useCart hook
const mockAddToCart = jest.fn();
jest.mock("../Contexts/CartContext", () => {
  const originalModule = jest.requireActual("../Contexts/CartContext");
  return {
    ...originalModule,
    useCart: () => ({
      addToCart: mockAddToCart,
    }),
  };
});

// Helper function
const renderWithContext = (component) => {
  return render(<CartProvider>{component}</CartProvider>);
};

//Test Cases Start
describe("ProductDetailsScreen Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  //First Test Case
  test("displays correct product information", async () => {
    const { getByText } = renderWithContext(
      <ProductDetailsScreen route={mockRoute} />
    );

    await waitFor(() => {
      // Check product name is displayed
      expect(getByText(mockProduct.name)).toBeTruthy();

      // Check product price is displayed with correct formatting
      expect(getByText(`$${mockProduct.price.toFixed(2)}`)).toBeTruthy();

      // Check product description is displayed
      expect(getByText(mockProduct.description)).toBeTruthy();
    });
  });

  //Second Test Case
  test("displays Add to Cart button", async () => {
    const { getByText } = renderWithContext(
      <ProductDetailsScreen route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText("Add to Cart")).toBeTruthy();
    });
  });

  //Third Test Case
  test("calls addToCart when button is pressed", async () => {
    const { getByText } = render(<ProductDetailsScreen route={mockRoute} />);

    const addButton = getByText("Add to Cart");
    fireEvent.press(addButton);

    // Verify the addToCart function was called with the correct product
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  //Fourth Test Case
  test("renders product image correctly", async () => {
    const { getByTestId } = render(<ProductDetailsScreen route={mockRoute} />);

    await waitFor(() => {
      const image = getByTestId("product-image");
      expect(image.props.source.uri).toBe(mockProduct.image);
    });
  });
});
