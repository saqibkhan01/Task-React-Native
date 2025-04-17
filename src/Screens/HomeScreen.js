import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, } from 'react-native';
import ProductCard from '../Components/ProductCard';
import { products } from '../Utils/data';
import { globalStyles } from '../Utils/globalStyles';

const HomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;