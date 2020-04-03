import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Dimensions } from 'react-native';


import CustomModal from "../components/customModal"
import firebase from "../firebase";

const deleteIcon = require("../assets/images/delete.png")
const {height, width} = Dimensions.get("screen");


class DisplayItemScreen extends React.Component{

  state = {
    displayDeleteModal: false,
    item: {
		image: deleteIcon	
	}
  };

  componentDidMount(){
    this.setState({item: this.props.route.params.item});
  }

  handleItemDelete = () => {
    const { item } = this.props.route.params;
    const itemRef = firebase.database().ref("items/" +item.key);

    itemRef.remove();

    this.setState({displayDeleteModal: false});
    this.props.navigation.goBack()
  };

  render(){
      const {image, title, description, quantity, salePrice, costPrice, category} = this.state.item;
    const { displayDeleteModal } = this.state;
	console.log(this.props)
	console.log(this.state)
    return(
      <View style={styles.container}>
        <View style={styles.headerContainer}>
	  <View style={styles.logoContainer}>
	    <TouchableOpacity
	      style={styles.headerButton}
	      onPress={() => this.props.navigation.goBack()}>
	      <Text style={styles.headerText}>Back</Text>
            </TouchableOpacity>
	  </View>
	  <View style={styles.searchContainer}>

	  </View>
	  <View style={styles.addItemButton}>
	    <TouchableOpacity
	      style={styles.headerButton}
	      onPress={()=> this.props.navigation.navigate("edit item", {isEdit: true, item: this.state.item})}> 
	      <Text style={styles.headerText}>Edit</Text>
	    </TouchableOpacity> 
	  </View>
	 </View>
      
	<ScrollView>
	  <View style={styles.imageContainer}>
	    <Image 
		source={{uri: image}}
		style={{height: 180, width: 180}}
             />
	  </View>
	  <View style={styles.itemDetailsContainer}>
		  <View style={styles.inputContainer}>
		    <Text style={styles.title}>
			Title:
		    </Text>
		    <Text style={styles.itemInfo}>
			{title}
		    </Text>
		  </View>
		  <View style={styles.inputContainer}>
		    <Text style={styles.title}>Description:</Text>
		    <Text style={styles.itemInfo}>
		     {description}
		    </Text>
		  </View>
		  <View style={styles.inputContainer}>
		    <Text style={styles.title}>Category:</Text>
		    <Text style={styles.itemInfo}>
			{category}
		    </Text>
		  </View>
		  <View style={styles.inputContainer}>
		    <Text style={styles.title}>Quantity: </Text>
		    <Text style={styles.itemInfo}>
			{quantity}
		    </Text>
		  </View>
		  <View style={styles.inputContainer}>
		    <Text style={styles.title}>Cost:</Text>
		    <Text style={styles.itemInfo}>
			£{costPrice}
		    </Text>
		  </View>
		  <View style={styles.inputContainer}>
		    <Text style={styles.title}>Sale Price:</Text>
		    <Text style={styles.itemInfo}>
		       £{salePrice}
		    </Text>
		  </View>
		 <TouchableOpacity onPress={() => this.setState({displayDeleteModal: true})}>
		    <Image source={deleteIcon} style={{height: 36, width: 36}}/>
		 </TouchableOpacity>
	  </View>
	</ScrollView>
        {
	  displayDeleteModal && <CustomModal 
				  visible={displayDeleteModal}
				  text={"Are you sure you wish to delete this item ? It cannot be undone. "}
				  buttonText={"Yes, I'm sure"}
				  buttonFunctionality={this.handleItemDelete}
				  secondButtonText={"Nope, cancel!"}
				  secondButtonFunctionality={() => this.setState({displayDeleteModal: false})}
				  />
	}
	</View>
  )}
};

export default DisplayItemScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
    alignItems: "center"
  },
  headerContainer: {
    flexDirection: "row",
    width: width,
    justifyContent: "space-around",
    backgroundColor: "navy",
    padding: 10,
    marginBottom: 18,
    position: "relative"
  },
  headerText: {
    color: "#fff"
  },
  headerButton: {
    padding: 10
  },
  imageContainer: {
    marginBottom: 36,
    width: width,
   justifyContent: "center",
   flexDirection: "row"
  },
  inputContainer: {
    margin: "7px;"
  },

  itemDetailsContainer: {
    width: width,
    alignItems: "flex-start"
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
    fontWeight: "400",
    textDecorationLine: "underline"
  },
  itemInfo: {

  }
  
});
