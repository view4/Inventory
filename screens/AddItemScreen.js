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
    categories: [],
    quantity: '1',
    costPrice: '',
    salePrice: '',
    material: "",
    dimensions: "",
    sku: undefined,
    displayErrorMessage: false,
    isEdit: false,
    existingKey: "",
    displayPickerModal: false,
    errorText: "",
    displayConfirmationModal: false,
    displayCameraOptions: false,
    displayConfirmCategoryAdd: false,
    newCategory: ""
  };


  cameraRollOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true
  }

  componentWillMount() {
    this.setCategories()
    
  }

  setCategories = () => {
    this.skuRef = firebase.database().ref("categories");

    this.skuRef.on("value", snapshot => {
      if(!snapshot.val()){
        return;
      };
      console.log(snapshot.val())
      this.setState({
        categories: Object.values(snapshot.val())
      });
    })
    console.log("Cate from mount")
    console.log(this.state.categories)
  }
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

    this.setSku()
  }

  setSku = () => {
    this.skuRef = firebase.database().ref("sku");

    this.skuRef.on("value", snapshot => {
      if(!snapshot.val()){
        return;
      };
      console.log(snapshot.val())
      this.setState({sku: snapshot.val() + 1});
    })

  };

  getPermissionsAsync = async () => {
   // if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    //}
    //this._pickImage()
    };

  getCameraPermissionsAsync = async () => {
      /*let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }*/
      let { status: statusTwo } = await Permissions.askAsync(Permissions.CAMERA);
      console.log(statusTwo)
      if (statusTwo !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }

  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(this.cameraRollOptions);
    console.log(result)
    let uri = result.base64 ? (result.base64.includes("base64,") ? result.base64 : "data:image/jpeg;base64,".concat(result.base64)): result.uri;

    console.log(uri)

    if (!result.cancelled) {
      this.setState({ image: uri, });
    }
    this.setState({displayCameraOptions: false})
  };

  _takeImage = async () => {

    let result = await ImagePicker.launchCameraAsync(this.cameraRollOptions);

    let uri = result.base64 ? (result.base64.includes("base64,") ? result.base64 : "data:image/jpeg;base64,".concat(result.base64)): result.uri;

    console.log(uri)

    if (!result.cancelled) {
      this.setState({ image: uri, });
    }

    this.setState({displayCameraOptions: false})
    

  }
  addItem = () => {
    const {title, image,description, category, quantity, costPrice, salePrice, isEdit, existingKey, material, dimensions, sku} = this.state;
    const itemsRef = firebase.database().ref("items");
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
        material, 
        dimensions,
        sku
     };
     if (!isEdit) {
       itemsRef.push(newItemObject);
     } else {
 	itemsRef.child(existingKey).set(newItemObject);
     }
     this.setState({displayConfirmationModal: true});
     this.skuRef.set(sku);
    
  }

  resetState = () => {
	this.setState({
	  image: null,
	  title: "",
	  description: "", 
	  category: "",
	  quantity: "1",
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

  handleNewCategoryAddition = () => {
    console.log("Add cat")
    const {newCategory, categories } = this.state;
    console.log(categories)
    console.log(newCategory)

    const categoriesRef = firebase.database().ref("categories");
    categories.push(newCategory);
    console.log(categories);
    categoriesRef.set(categories);

    this.setState({categories, displayConfirmCategoryAdd: false})
    return alert("New category added successfully")



  };
 
	render(){
		const { displayConfirmationModal, displayPickerModal, image, displayErrorMessage, isEdit, title, description, quantity, costPrice, salePrice, category, errorText, displayCameraOptions, material, dimensions, sku, displayConfirmCategoryAdd, newCategory, categories } = this.state;
		console.log(this.state)
                console.log("Categories!!!!")
                console.log(categories)

                let pickerOptions =  categories.map( (cat, key) => {
		  return <Picker.Item label={cat} value={cat} key={key} />
                });
                console.log(pickerOptions)
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

                                <View style={styles.skuContainer}>
				  <Text style={styles.skuText}>SKU: #{sku}</Text>
				</View>
				<ScrollView contentContainerStyle={styles.scrollContainer}>

				  <View style={styles.addImageContainer}>
					<TouchableOpacity onPress={() => this.setState({displayCameraOptions: true})}>
						{ !image ? (<View style={styles.imageContainer}>
						  <Image 
						    style={styles.imageIcon}
						    source={require("../assets/images/image.png")}
						   />
						</View> ) : (
						<View>
						  <Image style={{height: 100, width: 100}} source={{uri: image}} />
						</View>)
						}
						<Text> {!image ? "Add an" : "Change "} image </Text>
					</TouchableOpacity>
				  </View>

					<View style={styles.inputContainer}>
						<TextInput 
						  style={styles.textInput}
						  placeholder={"Product Name"}
			   			  onChangeText={text => this.setState({title:text})}
						  value={title}
						/>
					</View>

					{/*<View style={styles.inputContainer}>
						<TextInput
						  style={styles.textInput} 
						  placeholder={"History/Notes"}
			   			  onChangeText={text => this.setState({description:text})}
						  value={description}
						/>
					</View>*/}
				      { categories.length && (
                                        <View style={{width: "100%", flexDirection: "row", justifyContent: "center"}}>
						{ category !== "Add" ? (<View style={styles.inputContainer}>
							{Platform.OS !== "ios" ? (
								<Picker note selectedValue={category} style={styles.pickerStyle} onValueChange={itemValue => this.setState({category: itemValue})}>
									<Picker.Item value="" label="Please pick a category"/>
									{/*<Picker.Item label="&&&" value="Rings" />
									<Picker.Item label="Earrings" value="Earrrings" />
									<Picker.Item label="Necklaces" value="Necklaces" />
									<Picker.Item label="Bracelets" value="Bracelets" />*/}
		                                                        {
									 pickerOptions
		                                                        }
									<Picker.Item label="Add new category ..." value="Add" />

								</Picker> ) : (
								<TouchableOpacity onPress={()=> this.setState({displayPickerModal: true})}>
								  <Text> {category.length ? category: "Set Category:"}</Text>
								</TouchableOpacity> 
							)}
						</View>) :(
							<View style={[styles.inputContainer, {flexDirection: "column"}]}>
								<TextInput
							    	  style={styles.textInput} 
								  placeholder={"Please add a new category"}
				   			          //onChangeText={text => this.setState({:text})}
								  onBlur={e => this.setState({
								    newCategory: e.target.value,
		                                                    displayConfirmCategoryAdd: true
		                                                  })}
								  //value={material}
								/>
		                                                
							</View> 
		                                )}
                                       </View>
				    )}

					<View style={styles.inputContainer}>
						<TextInput
						  style={styles.textInput} 
						  placeholder={"Material"}
			   			  onChangeText={text => this.setState({material:text})}
						  value={material}
						/>
					</View>

					<View style={styles.inputContainer}>
						<TextInput
						  style={styles.textInput} 
						  placeholder={"Dimensions"}
			   			  onChangeText={text => this.setState({dimensions:text})}
						  value={dimensions}
						/>
					</View>

					<View style={styles.inputContainer}>
						<TextInput
						  style={styles.textInput} 
						  placeholder={"Quantity"}
			   			  onChangeText={text => this.setState({quantity:text})}
						  value={quantity}
						/>
					</View>
           
					<View style={styles.pricesContainer}>
					  <View>
						<View style={[styles.inputContainer, styles.priceInput]}>
							<TextInput 
							  style={styles.textInput} 
							  placeholder={"Cost Price"} 
				   			  onChangeText={text => this.setState({costPrice:text})}
							  value={costPrice}
							/>
						</View>
						<View style={[styles.inputContainer, styles.priceInput]}>
							<TextInput 
							  style={styles.textInput} 
							  placeholder={"Selling Price"} 
				   			  onChangeText={text => this.setState({salePrice:text})}
							  value={salePrice}
							/>
						</View>
					  </View>
					  <View style={styles.markupContainer}>
						<Text style={styles.markupText}> Markup </Text>
						<Text>+ </Text>
                                                <Text> {salePrice && costPrice && ((salePrice-costPrice)/costPrice) * 100}%</Text>
					  </View>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
						  style={styles.textInput} 
						  placeholder={"History/Notes"}
			   			  onChangeText={text => this.setState({description:text})}
						  value={description}
						/>
					</View>
				</ScrollView>
				{
				Platform.OS ==="ios" && displayPickerModal && (
					<Modal visible={displayPickerModal} style={styles.pickerModalContainer}>
						<View style={styles.pickerModalContentContainer}>
							<Picker selectedValue={category} style={styles.pickerStyle} onValueChange={itemValue => this.setState({category: itemValue, displayPickerModal: false})}>
								<Picker.Item value="" label="Please pick a category"/>
								/*<Picker.Item label="Rings" value="Rings" />
								<Picker.Item label="Earrings" value="Earrrings" />
								<Picker.Item label="Necklaces" value="Necklaces" />
								<Picker.Item label="Bracelets" value="Bracelets" />*/
                                                                {
								  pickerOptions
                                                                }
								<Picker.Item label="Add new category ..." value="Add" />
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

				{displayConfirmCategoryAdd && (
					<CustomModal
   					  visible={displayConfirmCategoryAdd} 
					  text={`Are you sure you want to add ${newCategory} as a new category`}
					  buttonText={"yes"}
					  buttonFunctionality={() => this.handleNewCategoryAddition()}
					  secondButtonText={"cancel"}
					  secondButtonFunctionality={() => this.setState({displayConfirmCategoryAdd: false})}
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

				{
					displayCameraOptions && <CustomModal
                                          visible={displayCameraOptions}
                                          text={"Would you like to choose an image from the gallery or take a new one with your camera"}
                                          buttonText={"Gallery"}
                                          buttonFunctionality={() => 
                                            Constants.platform.IOS ?this.getPermissionsAsync()
                                             .then(this._pickImage()) : this._pickImage()
                                          }
                                          secondButtonText={"camera"}
                                          secondButtonFunctionality={()=> this.getCameraPermissionsAsync()
                                            .then(this._takeImage())
                                          }
                                        />
				
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
  // SKU container

  skuContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 36,
    paddingRight: 10
  },


  //Form container

  scrollContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center", 
    marginTop: 10
  },
  
  inputContainer: {
    margin: 7,
    padding: 7,
    width: "72%",
    backgroundColor: "#fff"//"#9e9e9e4d"
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
  //Price input sect

  pricesContainer: {
    flexDirection: "row",
    width: "72%",
    paddingLeft: 0
    //justifyContent: "center"
  },

  priceInput: {
    width: width / 2
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
