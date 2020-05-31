import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Dimensions } from 'react-native';


import CustomModal from "../components/customModal";
import Label from "../components/Label";

import colors from "../constants/Colors";

import firebase from "../firebase";

const deleteIcon = require("../assets/images/delete.png");
const editIcon = require("../assets/images/edit.png")
const {height, width} = Dimensions.get("screen");


class DisplayItemScreen extends React.Component{

  state = {
    displayDeleteModal: false,
    item: {
		//image: deleteIcon	
	},
    //displayCostPrice: false,
    priceClickCounter:0,
    imageClickCounter: 0 
  };

  componentWillMount(){
    this.setState({item: this.props.route.params.item});
    
  }
  componentDidUpdate(prevProps){
    if((prevProps.route.params.item.key !== this.props.route.params.item.key) || (prevProps.route.params.item.title !== this.props.route.params.item.title)){
      this.setState({item: this.props.route.params.item});
    }
  }

  handleItemDelete = () => {
    const { item } = this.props.route.params;
    const itemRef = firebase.database().ref("items/" +item.key);

    itemRef.remove();

    this.setState({displayDeleteModal: false});
    this.props.navigation.goBack()
  };

  render(){
      const { priceClickCounter, imageClickCounter } = this.state;
      const {image, title, description, quantity, salePrice, costPrice, category, material, dimensions, sku} = this.state.item;
      const { displayDeleteModal } = this.state;
      const isImageExpanded = imageClickCounter > 0 && (imageClickCounter % 2 === 0);
    return(
      <View style={styles.container}>
        <View style={styles.backContainer}>
	  <TouchableOpacity
	    style={{flexDirection: "row", alignItems: "center", margin: 10}}
	    onPress={() => this.props.navigation.goBack()} 
          >
	    <Image 
 	      source={require("../assets/images/back.png")}
              style={styles.backIcon}
            />
	    <Text style={styles.headerText}>Back</Text>
          </TouchableOpacity>

        </View>
      
	<ScrollView>
	  <View style={styles.imageContainer}>
            <ScrollView contentContainerStyle={{margin: "auto", flexDirection: "row", justifyContent: "center"}} minimumZoomScale={1} maximumZoomScale={5} >
              <TouchableOpacity onPress={() => this.setState({imageClickCounter: imageClickCounter + 1})}>
	        <Image 
		  source={{uri: image}}
		  style={ isImageExpanded ? { height: 540, width: 540 }  : {height: 180, width: 180}}
                 />
              </TouchableOpacity>
            </ScrollView>
	  </View>
        {  !isImageExpanded && 
	  (<View style={styles.itemDetailsContainer}>
                  <Text style={styles.skuLabel}>SKU: {sku}</Text>
		  <Label title={"Product Name"} text={title} />
		  <Label title={"Category"} text={category} />
		  <Label title={"Material"} text={material} />
		  <Label title={"Dimensions"} text={dimensions} />
		  { priceClickCounter > 0 && (priceClickCounter % 2 == 0) && <Label title={"Cost"} text={"£" + costPrice} /> }
                  <TouchableOpacity style={{width: "90%"}} onPress={ () => this.setState({priceClickCounter: priceClickCounter + 1}) }>
                    <Label title={"Selling Price"} text={"£" + salePrice} / >
                  </TouchableOpacity>
		  <Label title={"Description"} text={description} />
		  <Label title={"Quantity"} text={quantity} />

                 <View style={styles.buttonsContainer}>
		   <TouchableOpacity style={[styles.buttonContainer, styles.deleteButton]} onPress={() => this.setState({displayDeleteModal: true})}>
		    <Image source={deleteIcon} style={{height: 36, width: 36}}/>
                    <Text style={{color: "red"}}> Delete </Text>
		   </TouchableOpacity>
		   <TouchableOpacity style={[styles.buttonContainer]} onPress={()=> this.props.navigation.navigate("edit item", {isEdit: true, item: this.state.item})}>
		    <Image source={editIcon} style={{height: 18, width: 18}}/>
                    <Text> Edit </Text>
		   </TouchableOpacity>
                 </View>
	  </View>
        )}
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
  backContainer: {
    //alignSelf: "flex-start"
    width: "90%"

  },
  headerContainer: {
    flexDirection: "row",
    width: width,
    justifyContent: "space-around",
    //backgroundColor: colors.theme,
    padding: 10,
    marginBottom: 18,
    position: "relative"
  },

  backIcon: {
    //opacity: 1,
    backgroundColor: "aliceblue",
    height: 18,
    width: 18
  },

  headerText: {
    color: colors.theme
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


  skuLabel: {
    fontWeight: "700",
    fontSize: 18,
    padding: 10,
    margin: 7,
    //alignSelf: "flex-start",
    //paddingLeft: 36
    width: "90%"
  },

  itemDetailsContainer: {
    width: width,
    alignItems: "center"
    
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
    fontWeight: "400",
    textDecorationLine: "underline"
  },
  itemInfo: {

  },

  buttonsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 7
  },

  buttonContainer: {
    height: 54,
    width: "36%",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
    borderRadius: 7
  },

  deleteButton: {
    borderColor: "red"
  }

  
});
