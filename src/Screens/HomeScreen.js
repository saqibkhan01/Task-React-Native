import React from 'react';
import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ProductCard from '../Components/ProductCard';
import { products } from '../Utils/data';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  list: {
    paddingVertical: 12,
  },
});

export default HomeScreen;