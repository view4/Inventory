import React from "react";
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";

import colors from "../constants/Colors";

const Header = ({headerText, leftSectText, leftSectFunctionality, rightSectText, rightSectFunctionality}) => {

  return(
	<View style={styles.headerContainer}>
	  <View style={styles.logoContainer}>
	    <TouchableOpacity
	     style={styles.headerButton}
	     onPress={leftSectFunctionality} 
            >
	      <Text style={[styles.headerText]}>{leftSectText}</Text>
	    </TouchableOpacity>
	  </View>
	  <View style={styles.pageTitleContainer}>
	    <Text style={[styles.headerText]}>{headerText}</Text>
	  </View>
	  <View style={styles.addItemButton}>
	    <TouchableOpacity
	      onPress={rightSectFunctionality}
	      style={styles.headerButton}
	    > 
	      <Text style={[styles.headerText]}>{rightSectText}</Text>
	    </TouchableOpacity> 
	  </View>
	 </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
    alignItems: "center"
  },
  headerContainer: {
    backgroundColor: colors.theme,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 18,
    padding: 10,
    alignItems: "center"
  },

  headerText: {
    color: "#fff"
  },

  headerButton: {
    padding: 10
  },
})





export default Header;
