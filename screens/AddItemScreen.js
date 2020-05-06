import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as React from 'react';
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";

import CustomModal from "../components/customModal";
import Header from "../components/Header";
import MyImagePicker from "../components/ImagePicker";

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

    const {newCategory, categories } = this.state;


    const categoriesRef = firebase.database().ref("categories");
    const newCategoriesArray = categories.push(newCategory);
    categoriesRef.set(newCategoriesArray);
    console.log(newCategoriesArray)

    this.setState({categories, displayConfirmCategoryAdd: false})
    return alert("New category added successfully")



  };
 
	render(){
		const { displayConfirmationModal, displayPickerModal, image, displayErrorMessage, isEdit, title, description, quantity, costPrice, salePrice, category, errorText, displayCameraOptions, material, dimensions, sku, displayConfirmCategoryAdd, newCategory, categories } = this.state;
		console.log(this.state)

                let pickerOptions =  categories.map( (cat, key) => {
		  return <Picker.Item label={cat} value={cat} key={key} />
                });
                console.log(pickerOptions)
		return(
			<View style={styles.container}>
                          <Header 
                            headerText={(isEdit ? "Edit" : "Add") + " item" }
                            leftSectText={"cancel"}
                            leftSectFunctionality={() => {
		              this.resetState()
		              this.props.navigation.goBack()
                              }
                            }
                            rightSectText={"done"}
                            rightSectFunctionality={this.addItem}
                          />

                          <View style={styles.skuContainer}>
	                    <Text style={styles.skuText}>SKU: #{sku}</Text>
	                  </View>

	                  <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <MyImagePicker
                              image={image} 
                              setDisplayCameraOptions={() => this.setState({displayCameraOptions: true})}
                            />

			    <View style={styles.inputContainer}>
			      <TextInput 
			        style={styles.textInput}
		       	        placeholder={"Product Name"}
			   	onChangeText={text => this.setState({title:text})}
				value={title}
			      />

			    </View>
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
				<Text> + </Text>
                                <Text> 
                                  { salePrice && costPrice && ((salePrice-costPrice)/costPrice) * 100}
                                  %
                                </Text>
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
			    Constants.platform.IOS ? this.getPermissionsAsync()
			     .then(this._pickImage()) :this._pickImage()
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
    marginTop: 10, 
    position: "static"
  },
  
  inputContainer: {
    margin: 7,
    padding: 7,
    width: "72%",
    backgroundColor: "#fff"
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
  },

  priceInput: {
    width: width / 2
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
});

		            /*
                              categories.length && (
                                <View style={{width: "100%", flexDirection: "row", justifyContent: "center"}}>
				  { category !== "Add" ? (<View style={styles.inputContainer}>
							{Platform.OS !== "ios" ? (
								<Picker selectedValue={category} style={styles.pickerStyle} onValueChange={itemValue => this.setState({category: itemValue})}>
									<Picker.Item value="" label="Please pick a category"/>

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
								  onBlur={e => this.setState({
								    newCategory: e.target.value,
		                                                    displayConfirmCategoryAdd: true
		                                                  })}
								/>
		                                                
							</View> 
		                                )}
                                       </View>
				    )


				{
				Platform.OS ==="ios" && displayPickerModal && (
					<Modal visible={displayPickerModal} style={styles.pickerModalContainer}>
						<View style={styles.pickerModalContentContainer}>
							<Picker selectedValue={category} style={styles.pickerStyle} onValueChange={itemValue => this.setState({category: itemValue, displayPickerModal: false})}>
								<Picker.Item value="" label="Please pick a category"/>
                                                                {
								  pickerOptions
                                                                }
								<Picker.Item label="Add new category ..." value="Add" />
							</Picker>
						</View>
					</Modal>)

				}
*/
