import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import HomeScreen from "../Screens/HomeScreen";
import { products } from "../Utils/data";

// Mock navigation
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

//Test Cases Start
describe("Product Listing Tests", () => {
  //First Test Case
  test("products are displayed on the home screen", async () => {
    const { getAllByTestId } = render(<HomeScreen />);

    // Wait for component to fully render
    await waitFor(() => {
      const productCards = getAllByTestId("product-card");
      expect(productCards.length).toBeGreaterThanOrEqual(5);
    });
  });

  //Second Test Case
  test("products display correct name and price", async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText(products[0].name)).toBeTruthy();
      expect(getByText(`$${products[0].price.toFixed(2)}`)).toBeTruthy();
    });
  });
});
