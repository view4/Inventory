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
    /*height: height,
    width: width,
    alignItems: "center",
    justifyContent: "center"*/
  },

  modalBackground: {
    height: height,
    backgroundColor: "rgba(180, 180, 180, 0.18)",
    width: width,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 90
  },

  modalContent: {
    height: height/ 3,
    width: width /2,
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
  },

  buttonContainer: {
	marginTop: 7,
	alignItems: "center",
  },
  
  buttonStyle: {
	borderRadius: 18,
	width: 180,
	height: 36,
	padding: 3,
	borderWidth: 1,
	margin: 3,
	justifyContent: "center",
	alignItems: "center"
  }

})



export default CustomModal
