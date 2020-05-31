import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal, TouchableHighlight } from 'react-native'
import colors from "../constants/Colors";

const {height, width} = Dimensions.get("screen");

const CustomModal = ({visible, text, buttonText, buttonFunctionality, customButtonStyle, secondButtonText, secondButtonFunctionality}) => {

  return(
    <Modal transparent={true} visible={true} style={{backgroundColor: "rgba(0,0,0,0)"}} presentationStyle={"overFullScreen"} >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
            <View style={styles.modalContentWrapper}>
	      <Text>{text} </Text>
	      <View style={styles.buttonsContainer}>
	        {
                  secondButtonText && (
	            <TouchableOpacity style={[styles.secondButtonStyle, styles.buttonStyle]} onPress={() => secondButtonFunctionality()}>
	              <Text>{secondButtonText}</Text>
                    </TouchableOpacity>)
                }
	        <TouchableOpacity style={[styles.buttonStyle, customButtonStyle ? customButtonStyle : null ]} onPress={() => buttonFunctionality()}>
	          <Text>{buttonText}</Text>
                </TouchableOpacity>
	      </View>
            </View>
          </View>
      </View>	
    </Modal>
  )
};

const styles= StyleSheet.create({
  modalBackground: {
    height: height,
    backgroundColor: "rgba(180, 180, 180, 0.18)",
    width: width,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 90
  },

  modalContent: {
    minHeight: height/ 3,
    minWidth: width /2,
    maxWidth: width - 72,
    backgroundColor: "#fff",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.theme
    //borderColor: "grey",
  },

  buttonsContainer: {
    marginTop: 7,
    alignItems: "center",
    flexDirection: "row",
    width: "100%"
    
  },
  
  buttonStyle: {
	borderRadius: 18,
	width: "50%",
	height: 36,
	padding: 3,
	borderWidth: 1,
	margin: 3,
	justifyContent: "center",
	alignItems: "center"
  },

  modalContentWrapper: {
    margin: 18,
    maxWidth: "90%",
    maxHeight: "90%",
    alignItems: "center"
  }

})



export default CustomModal
