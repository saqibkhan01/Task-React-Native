import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useCart } from "../Contexts/CartContext";
import { globalStyles } from "../Utils/globalStyles";
import Color from "../Utils/colors";

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const { addToCart } = useCart();

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.imageContainer}>
        <Image
          testID="product-image"
          source={{ uri: product.image }}
          style={styles.image}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    backgroundColor: Color.whiteColor,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 24,
  },
  button: {
    backgroundColor: Color.btnColor,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetailsScreen;
