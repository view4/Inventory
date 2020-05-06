import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal, TouchableHighlight } from 'react-native'

const {height, width} = Dimensions.get("screen");

const CustomModal = ({visible, text, buttonText, buttonFunctionality, customButtonStyle, secondButtonText, secondButtonFunctionality}) => {

  return(
    <Modal visible={visible} style={styles.modalContainer}>
      <TouchableOpacity style={styles.modalBackground}>
        <TouchableHighlight style={styles.modalContent}>
          <View>
	    <Text>{text} </Text>
	    <View style={styles.buttonContainer}>
	      {
                secondButtonText && (
	          <TouchableOpacity style={[styles.secondButtonStyle, styles.buttonStyle]}onPress={() => secondButtonFunctionality()}>
	            <Text>{secondButtonText}</Text>
                  </TouchableOpacity>)
              }
	      <TouchableOpacity style={[styles.buttonStyle, customButtonStyle ? customButtonStyle : null ]} onPress={() => buttonFunctionality()}>
	        <Text>{buttonText}</Text>
              </TouchableOpacity>
	    </View>
          </View>
        </TouchableHighlight>	
      </TouchableOpacity>	
    </Modal>
  )
};

const styles= StyleSheet.create({
  modalContainer: {
    height: height, 
    width: width,
    backgroundColor: "#bababa6e",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    display: "flex", 
    zIndex: 90
  },

  modalBackground: {
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 90
  },

  modalContent: {
    height: height/2,
    width: width /2,
    //marginTop: 54,
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    //marginRight: "auto",
    //marginLeft: "auto"
  },

  buttonContainer: {
	marginTop: 7,
	alignItems: "center",
	width: "90%",
  },
  
  buttonStyle: {
	borderRadius: 18,
	width: "90%",
	height: 36,
	padding: 3,
	borderWidth: 1,
	margin: 3,
	justifyContent: "center",
	alignItems: "center"
  }

})



export default CustomModal
