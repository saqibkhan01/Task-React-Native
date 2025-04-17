import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../Contexts/CartContext";

const CartIcon = () => {
  const navigation = useNavigation();
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <TouchableOpacity
      style={styles.container}
      testID="cart-icon"
      onPress={() => navigation.navigate("Cart")}
    >
      <Ionicons name="cart-outline" size={24} color="black" />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text testID="cart-count" style={styles.badgeText}>
            {itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginRight: 15,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default CartIcon;
