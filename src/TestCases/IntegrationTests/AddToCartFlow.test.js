import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { CartProvider, useCart } from "../../Contexts/CartContext";
import ProductDetailsScreen from "../../Screens/ProductDetailsScreen";

// Mock product list
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    description: "Premium wireless headphones with noise cancellation.",
    image: "https://example.com/headphones.png",
  },
];

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

// Mock CartContext
jest.mock("../../Contexts/CartContext", () => {
  const actual = jest.requireActual("../../Contexts/CartContext");
  return {
    ...actual,
    __esModule: true,
    useCart: jest.fn(() => actual.useCart()),
  };
});

import { useCart as mockUseCart } from "../../Contexts/CartContext";

//Test Interface
const TestInterface = () => {
  const [screen, setScreen] = React.useState("home");
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const { getTotalItems, cartItems, updateQuantity } = useCart();

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setScreen("details");
  };

  const handleCartPress = () => setScreen("cart");

  const handleBack = () => setScreen("home");

  return (
    <View>
      <Text testID="cart-count">{getTotalItems()}</Text>
      <Text testID="cart-icon" onPress={handleCartPress}>
        🛒
      </Text>

      {screen === "home" && (
        <View>
          {products.map((product, index) => (
            <Text
              key={product.id}
              testID="product-card"
              onPress={() => handleProductPress(product)}
            >
              {product.name}
            </Text>
          ))}
        </View>
      )}

      {screen === "details" && (
        <View>
          <ProductDetailsScreen
            route={{ params: { product: selectedProduct } }}
          />
          <Text testID="back-button" onPress={handleBack}>
            Back
          </Text>
        </View>
      )}

      {screen === "cart" && (
        <View>
          {cartItems.map((item) => (
            <View key={item.id}>
              <Text>{item.name}</Text>
              <Text testID="item-quantity">{item.quantity}</Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
              <Text
                testID="increase-btn"
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Text>
              <Text
                testID="decrease-btn"
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockUseCart.mockImplementation(() =>
    jest.requireActual("../../Contexts/CartContext").useCart()
  );
});
//Test Case Start
describe("Add to Cart Flow Integration Tests", () => {
  //First Test Case
  test("user can add product to cart, their count and view it in cart screen", async () => {
    const { getAllByTestId, getByTestId, findByText, getByText } = render(
      <CartProvider>
        <TestInterface />
      </CartProvider>
    );

    // Step 1: Click on a product to view details
    const productCards = getAllByTestId("product-card");
    fireEvent.press(productCards[0]);

    // Step 2: Add product to cart
    const addToCartButton = await findByText("Add to Cart");
    fireEvent.press(addToCartButton);

    // Step 3: Check if cart badge shows 1 item using testID
    const cartBadge = getByTestId("cart-count");
    expect(cartBadge.props.children).toBe(1);

    // Step 4: Go to cart screen
    const cartIcon = getByTestId("cart-icon");
    fireEvent.press(cartIcon);

    // Step 5: Verify product quantity is 1 using testID
    const itemQuantity = getByTestId("item-quantity");
    expect(itemQuantity.props.children).toBe(1);

    // Step 6: Check total
    const firstProduct = products[0];
    expect(getByText(`$${firstProduct.price.toFixed(2)}`)).toBeTruthy();
  });

  //Second Test Case
  test("user can increase and decrease product quantity in cart", async () => {
    const { getAllByTestId, findByText, getByTestId, getByText } = render(
      <CartProvider>
        <TestInterface />
      </CartProvider>
    );

    // Add product to cart
    const productCards = getAllByTestId("product-card");
    fireEvent.press(productCards[0]);
    const addToCartButton = await findByText("Add to Cart");
    fireEvent.press(addToCartButton);

    // Go to cart
    const cartIcon = getByTestId("cart-icon");
    fireEvent.press(cartIcon);

    // Increase quantity
    const increaseBtn = getByTestId("increase-btn");
    fireEvent.press(increaseBtn);
    fireEvent.press(increaseBtn);

    // Decrease quantity
    const decreaseBtn = getByTestId("decrease-btn");
    fireEvent.press(decreaseBtn);

    // Assert final quantity
    const itemQuantity = getByTestId("item-quantity");
    expect(itemQuantity.props.children).toBe(2);

    // Assert total is updated correctly
    const firstProduct = products[0];
    const expectedTotal = (firstProduct.price * 2).toFixed(2);
    expect(getByText(`$${expectedTotal}`)).toBeTruthy();
  });
});
