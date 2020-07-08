import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';

const {height, width} = Dimensions.get("window");

const CatalogueItem = (item) => {
	const {title, key, description, salePrice, image} = item.item.item;
  return(
    <View style={styles.itemContainer} >
      <View style={styles.imageContainer}>
        <Image
	  style={{height: "100%", width: "100%"}}
	  source={{uri: image}}
	/>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}> {title}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>  £ {salePrice}</Text>
      </View>
    </View>
  )
};
export default CatalogueItem;

const styles= StyleSheet.create({
  itemContainer: {
    padding: 4,
    margin: 7,
    alignItems: "center",
    width: (width / 2) -18,
    backgroundColor: "#fff"
  },
  imageContainer: {
    width: "100%",
    height: (width / 2) -18
    //aspectRatio: 1,
  },

  
  titleContainer: {
    width: "100%"
  },
  titleText: {
    color: "grey",
    fontSize: 18
  },
  
  priceContainer: {
    width: "100%"
  },
  priceText: {
    fontSize: 13,
    fontWeight: "400"
  },


});



