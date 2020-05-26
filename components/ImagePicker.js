import React, {useState} from "react";
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";



const MyImagePicker = ({image, _pickImage, _takeImage, getPermissions, getCameraPermissions, setDisplayCameraOptions}) => {

  return(
    <View style={styles.addImageContainer}>
      <TouchableOpacity onPress={() => setDisplayCameraOptions()}>
        { 
          !image ? (
            <View style={styles.imageContainer}>
	      <Image 
	      style={styles.imageIcon}
	      source={require("../assets/images/image.png")}
	     />
	    </View> 
          ) : (
	    <View>
	      <Image style={{height: 100, width: 100}} source={{uri: image}} />
	    </View>)
	}
        <Text> {!image ? "Add an" : "Change "} image </Text>
      </TouchableOpacity>


    </View>
  )
};

const styles = StyleSheet.create({


  // Image 
  addImageContainer: {
    padding: 10, 
  },
  imageContainer: {
    backgroundColor: "#000",
    borderRadius: 18
  },
  imageIcon: {
    height: 100,
    width: 100,
    backgroundColor: "rgb(240, 248, 255)",
  },


})

export default MyImagePicker;
