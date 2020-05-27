import * as React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";

import colors from "../constants/Colors";
const {height, width} = Dimensions.get("screen");


const NavigationTab = ({isActive, label,  icon,}) => {
  console.log("**********")
  //console.log(props)
  //props.onPress();
  return(
	<View style={[styles.tabContainer, isActive ? styles.activeTabContainer: null ]}>
          <View style={styles.innerContainer}>
            <Image source={icon}  style={{height: 22, width: 22}} />
            <Text style={isActive ? styles.activeText : styles.inactiveText}> {label} </Text>
          </View>
	</View>
  )
};


const styles = StyleSheet.create({
  tabContainer: {
    width: width / 3,
    height: "100%",
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#e3e6e8"
  },
  activeTabContainer : {
    backgroundColor: colors.theme
  },
  
  innerContainer: {
    justifyContent: "center", 
    alignItems: "center"
  },

  activeText : {
    color: "rgba(105,195,209,1)", 
    //fontSize: 18,
    fontWeight: "700"
  },
  inactiveText: {
    color: "rgba(124,126,128,1)"

  }


});


export default NavigationTab;
