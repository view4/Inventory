import React from "react";
import { StyleSheet, Text, View } from 'react-native';


const Label = ({title, text}) => {

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>
	{title}:
      </Text>*/}
      <Text style={styles.labelText}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
 container: {
    margin: 7,
    minHeight: 7,
    padding: 10,
    width: "90%",
    backgroundColor: "#fff"
  },

  labelText: {
    frontSize: 18,
    fontWeight: "700"
  }
  



});


export default Label;
