import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as React from 'react';
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";

import CustomModal from "../components/customModal";
import firebase from "../firebase";

import colors from "../constants/Colors";

const {height, width} = Dimensions.get("screen");

class AddOrEditItemScreen extends React.Component{

  state = {
    image: null,
    title: '',
    description: '',
    category: '',
    quantity: '',
    costPrice: '',
    salePrice: '',
    displayErrorMessage: false,
    isEdit: false,
    existingKey: "",
    displayPickerModal: false,
    errorText: "",
    displayConfirmationModal: false
  };

  componentDidMount() {

    if(this.props.isEdit) {
      const { image, title, description, category, quantity, costPrice, salePrice, key } = this.props.item;

      this.setState({
	image, 
	title,
	description,
	category,
	quantity,
	costPrice,
	salePrice,
	isEdit: true,
	existingKey: key,
	})
    } 
  }

  getPermissionsAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    this._pickImage()
    };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    console.log(result)
    let uri = result.base64 ? (result.base64.includes("base64,") ? result.base64 : "data:image/jpeg;base64,".concat(result.base64)): result.uri;

    console.log(uri)

    if (!result.cancelled) {
      this.setState({ image: uri, });
    }
  };
  addItem = () => {
    const {title, image,description, category, quantity, costPrice, salePrice, isEdit, existingKey} = this.state;
    const itemsRef =firebase.database().ref("items");
    console.log(this.state)

   if(title === "" || description === ""  || category === "" || quantity === "" || costPrice === "" || salePrice === "" ){
     this.setState({errorText:"Please complete all fields" ,displayErrorMessage: true});
     return;
   }
   if( (!(!!Number(quantity)) || !(!!Number(costPrice)) || !Number(!!salePrice)) && Number(quantity) !== 0 ) {
     this.setState({errorText:" Quantity, Cost, and Sale Price fields must be numbers" ,displayErrorMessage: true});
     return;
   }

     const newItemObject = {
	title,
	description, 
	category,
	quantity, 
	costPrice, 
	salePrice,
	image,
     };
     if (!isEdit) {
       itemsRef.push(newItemObject);
     } else {
 	itemsRef.child(existingKey).set(newItemObject);
     }
     this.setState({displayConfirmationModal: true});
    
  }

  resetState = () => {
	this.setState({
	  image: null,
	  title: "",
	  description: "", 
	  category: "",
	  quantity: "",
	  costPrice: "",
	  salePrice: ""
	});
  };

  navigateHome = () => {
	console.log(this.props);
	if(this.state.isEdit){
		this.props.nav.navigate("Home")
        } else {
	        this.props.navigation.navigate("Home");
	}
  };
	render(){
		const { displayConfirmationModal, displayPickerModal, image, displayErrorMessage, isEdit, title, description, quantity, costPrice, salePrice, category, errorText } = this.state;
		console.log(this.state)
		return(
			<View style={styles.container}>
				<View style={styles.headerContainer}>
				  <View style={styles.logoContainer}>
				    <TouchableOpacity
				     style={styles.headerButton}
				     onPress={() => {
					this.resetState()
					this.props.navigation.goBack()
				     }}>
				      <Text style={[styles.headerText]}>Cancel</Text>
				    </TouchableOpacity>
				  </View>
				  <View style={styles.pageTitleContainer}>
				    <Text style={[styles.headerText]}>{isEdit ? "Edit" : "Add"} Item</Text>
				  </View>
				  <View style={styles.addItemButton}>
				    <TouchableOpacity
				      onPress={this.addItem}
				      style={styles.headerButton}
 				    > 
				      <Text style={[styles.headerText]}>Done</Text>
				    </TouchableOpacity> 
				  </View>
				 </View>
				<View style={styles.addImageContainer}>
					<TouchableOpacity onPress={this.getPermissionsAsync}>
						{ !image ? (<View style={styles.imageContainer}>
						  <Image 
						    style={styles.imageIcon}
						    source={require("../assets/images/image.svg")}
						   />
						</View> ) : (
						<View>
						  <Image style={{height: 100, width: 100}} source={{uri: image}} />
						</View>)
						}
						<Text> {!image ? "Add an" : "Change "} image </Text>
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={styles.formContainer}>
					<View style={styles.inputContainer}>
						<TextInput 
						  style={styles.textInput}
						  placeholder={"Product Title"}
			   			  onChangeText={text => this.setState({title:text})}
						  value={title}
						/>
					</View>
					<View style={styles.inputContainer}>
						<TextInput 
						  style={styles.textInput} 
						  placeholder={"Product Description"}
			   			  onChangeText={text => this.setState({description:text})}
						  value={description}	
						/>
					</View>
					<View style={styles.inputContainer}>
						{Platform.OS !== "ios" ? (
							<Picker selectedValue={category} style={styles.pickerStyle} onValueChange={itemValue => this.setState({category: itemValue})}>
								<Picker.Item label="Rings" value="Rings" />
								<Picker.Item label="Earrings" value="Earrrings" />
								<Picker.Item label="Necklaces" value="Necklaces" />
								<Picker.Item label="Bracelets" value="Bracelets" />
							</Picker> ) : (<TouchableOpacity onPress={()=> this.setState({displayPickerModal: true})}>
						<Text> {category.length ? category: "Set Category:"}</Text>
									</TouchableOpacity> )
						}
					</View>
					<View style={styles.inputContainer}>
						<TextInput
						  style={styles.textInput} 
						  placeholder={"Quantity"}
			   			  onChangeText={text => this.setState({quantity:text})}
						  value={quantity}
						/>
					</View>
					<View style={styles.inputContainer}>
						<TextInput 
						  style={styles.textInput} 
						  placeholder={"Cost Price"} 
			   			  onChangeText={text => this.setState({costPrice:text})}
						  value={costPrice}
						/>
					</View>
					<View style={styles.inputContainer}>
						<TextInput 
						  style={styles.textInput} 
						  placeholder={"Selling Price"} 
			   			  onChangeText={text => this.setState({salePrice:text})}
						  value={salePrice}
						/>
					</View>
				</ScrollView>
				{
				Platform.OS ==="ios" && displayPickerModal && (
					<Modal visible={displayPickerModal} style={styles.pickerModalContainer}>
						<View style={styles.pickerModalContentContainer}>
							<Picker selectedValue={category} style={styles.pickerStyle} onValueChange={itemValue => this.setState({category: itemValue, displayPickerModal: false})}>
								<Picker.Item label="Rings" value="Rings" />
								<Picker.Item label="Earrings" value="Earrrings" />
								<Picker.Item label="Necklaces" value="Necklaces" />
								<Picker.Item label="Bracelets" value="Bracelets" />
							</Picker>
						</View>
					</Modal>)

						}
				{displayErrorMessage && (
					<CustomModal
   					  visible={displayErrorMessage} 
					  text={errorText}
					  buttonText={"Ok"}
					  buttonFunctionality={() => this.setState({displayErrorMessage: false})}
					/>
				)}

				{
					displayConfirmationModal && (
					  <CustomModal
					    visible={displayConfirmationModal}
					    text={isEdit ? "edit is confirmed": "Item has been added"}
					    buttonText={!isEdit ? "add another" : "okay"}
					    secondButtonText={!isEdit ? "okay" : null}
					    buttonFunctionality={!isEdit ? (
						() => {
						  this.resetState()
						  this.setState({displayConfirmationModal: false})
						}) : (
						  () => {
						    this.setState({displayConfirmationModal:false})
						    this.navigateHome()
						  })
					        }
					    secondButtonFunctionality={!isEdit ? (
						() => {
						  this.setState({displayConfirmationModal:false})
						  this.navigateHome();
						}): null}
					   />)
				}
			</View>

		)
	}
};

export default AddOrEditItemScreen;



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
  //Form container

  formContainer: {
    width: width,
    justifyContent: "center",
	alignItems: "center",
	marginTop: 18
  },
  
  inputContainer: {
    margin: 7,
    padding: 7,
    width: "72%",
    backgroundColor: "#9e9e9e4d"
  },

  inputPlaceholderStyle: {
    color: "#000"
  },

  pickerStyle: {
    height: 36,
    width: "100%",
	justifyContent: "center",
	backgroundColor: "#9e9e9e4d"
  },

  // Image 
  addImageContainer: {
    padding: 10
  },
  imageContainer: {
    backgroundColor: "#000",
    borderRadius: 18
  },
  imageIcon: {
    height: 100,
    width: 100,
    opacity: 1,
    backgroundColor: "rgb(240, 248, 255)",
  },

  pickerModalContainer: {
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
   },

 pickerModalContentContainer: {
   padding: 18,
   backgroundColor: "#fff",
   borderWidth: 1,
   borderRadius: 18,
 },

  //Modal

  /*modalContainer: {
    height: "100%",//height, 
    width: "100%", //width,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  }*/
  
});
