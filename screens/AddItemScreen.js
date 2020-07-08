import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as React from 'react';
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, ActivityIndicator } from "react-native";

import CustomModal from "../components/customModal";
import Header from "../components/Header";
import MyImagePicker from "../components/ImagePicker";
import DropDownSelect from "../components/DropDownSelect";
import Label from "../components/Label";

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
    newCategory: "",
    isLoading: true
  };


  cameraRollOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true
  }

  setCategories = () => {
    const categoriesRef = firebase.database().ref("categories");

    categoriesRef.on("value", snapshot => {
      if(!snapshot.val()){
        this.setState({isLoading: false})
        return;
      };
      console.log(snapshot.val())
      this.setState({
        categories: Object.values(snapshot.val()),
        isLoading: false
      });
    })

    console.log("Cate from")
    console.log(this.state.categories)
  }
  componentDidMount() {

    if(this.props.isEdit) {
      const { image, title, description, category, quantity, costPrice, salePrice, key, dimensions, sku, material } = this.props.item;

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
        sku, 
        dimensions, 
        material
	})
    } else {
      this.setSku()
    }
   
    this.setCategories()
  }

  componentDidUpdate(prevProps) {
    if(this.props.isEdit && ((prevProps.item.key !== this.props.item.key) || (prevProps.item.title !== this.props.item.title))) {
      const { image, title, description, category, quantity, costPrice, salePrice, key, dimensions, sku, material } = this.props.item;

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
        sku, 
        dimensions, 
        material
	})
    }

  }

  setSku = () => {
    if(this.state.isEdit && this.state.sku) {
      console.log("sku set")
      return;
      
    }
    this.skuRef = firebase.database().ref("sku");

    this.skuRef.on("value", snapshot => {
      if(!snapshot.val()){
        this.setState({sku: 10})
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

   if(quantity === ""|| category === "" || quantity === "" || costPrice === "" || salePrice === "" || material === "" || image == null){
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
       this.skuRef.set(sku);
     } else {
        console.log(newItemObject);
        console.log(existingKey)
 	itemsRef.child(existingKey).set(newItemObject);
     }
     this.setState({displayConfirmationModal: true});
     this.resetState()
    
  }

  resetState = () => {
	this.setState({
		image: null,
		title: '',
		description: '',
		category: '',
		quantity: '1',
		costPrice: '',
		salePrice: '',
		material: "",
		dimensions: "",
		sku: this.state.sku + 1,
		displayErrorMessage: false,
		//isEdit: false,
		existingKey: "",
		displayPickerModal: false,
		errorText: "",
		//displayConfirmationModal: false,
		displayCameraOptions: false,
		displayConfirmCategoryAdd: false,
		newCategory: ""
	});
  };

  navigateHome = () => {
	console.log(this.props);
	if(this.state.isEdit){
          this.props.navigation.navigate("Home")
        } else {
	  this.props.navigation.navigate("Home");
	}
  };

  handleNewCategoryAddition = () => {

    const { newCategory, categories } = this.state;


    const categoriesRef = firebase.database().ref("categories");
    categories.push(newCategory);
    categoriesRef.set(categories);

    this.setState({categories, displayConfirmCategoryAdd: false, category: newCategory})
    return alert("New category added successfully")



  };
 
	render(){
		const { displayConfirmationModal, displayPickerModal, image, displayErrorMessage, isEdit, title, description, quantity, costPrice, salePrice, category, errorText, displayCameraOptions, material, dimensions, sku, displayConfirmCategoryAdd, newCategory, categories, isLoading } = this.state;
		console.log(this.state)

		return(
			<View style={styles.container}>
                          <Header 
                            headerText={(isEdit ? "Edit" : "Add") + " item" }
                            leftSectText={"Cancel"}
                            leftSectFunctionality={() => {
		              //this.resetState()
                              console.log(this.props)
		              this.props.navigation.goBack()
                              }
                            }
                            rightSectText={"Done"}
                            rightSectFunctionality={this.addItem}
                          />

                          <View style={styles.skuContainer}>
	                    <Text style={styles.skuText}>SKU: #{sku}</Text>
	                  </View>

                          {isLoading && <ActivityIndicator size="large" color="navy" animating={isLoading}/>}

	                  {!isLoading && (<ScrollView contentContainerStyle={styles.scrollContainer}>


                            <MyImagePicker
                              image={image} 
                              setDisplayCameraOptions={() => this.setState({displayCameraOptions: true})}
                            />

			    <View style={styles.inputContainer}>
		              <Label style={styles.labelStyle} text={"Name:"} />
			      <TextInput 
			        style={styles.textInput}
			   	onChangeText={text => this.setState({title:text})}
				value={title}
			      />

			    </View>
			    <View style={styles.inputContainer}>
		              <Label style={styles.labelStyle} text={"Material:"} />
		              <TextInput
			        style={styles.textInput} 
	   			onChangeText={text => this.setState({material:text})}
				value={material}
		              />
			    </View>
			    <View style={styles.inputContainer}>
		              <Label style={styles.labelStyle} text={"Categories:"} />
			    <DropDownSelect 
                              label={"Please select ..."} 
                              options={categories}
                              onNewAddition={
                                (option) => this.setState({
			          newCategory: option,
		                  displayConfirmCategoryAdd: true
		                })
                              }
                              handleSelect={(category) => this.setState({category})}
                              value={category}
                            />
                            </View>
			    <View style={styles.inputContainer}>
		              <Label style={styles.labelStyle} text={"Dimensions:"} />
			      <TextInput
			        style={styles.textInput} 
			  	onChangeText={text => this.setState({dimensions:text})}
		                value={dimensions}
			      />
		            </View>
		            <View style={styles.inputContainer}>
		              <Label text={"Quantity:"} style={styles.labelStyle} />
			      <TextInput
			        style={styles.textInput} 
			   	onChangeText={text => this.setState({quantity:text})}
				value={quantity}
			      />
			    </View>

                            <View style={styles.pricesContainer}>
			      <View>
		                <Label style={styles.labelStyle}text={"Price:"} />
				<View style={[styles.inputContainer, styles.priceInput]}>
                                  <Text>£ </Text>
				  <TextInput 
				    style={styles.textInput} 
				    placeholder={"Cost"} 
				    onChangeText={text => this.setState({costPrice:text})}
				    value={costPrice}
				  />
				</View>
				<View style={[styles.inputContainer, styles.priceInput]}>
                                  <Text>£ </Text>
				  <TextInput 
				    style={styles.textInput} 
				    placeholder={"Sale"} 
				    onChangeText={text => this.setState({salePrice:text})}
				    value={salePrice}
				  />
				</View>
			      </View>
                              <View style={styles.markupContainer}>
				  <Text style={styles.markupText}> 
                                    Markup =  
                                      { costPrice && salePrice &&
                                        Math.round(((salePrice-costPrice)/costPrice) * 100)
                                      }
                                    %
                                  </Text>
			      </View>
			    </View>
			    <View style={styles.inputContainer}>
		              <Label style={styles.labelStyle} text={"Description:"} />
			      <TextInput
			        style={styles.textInput} 
				placeholder={"History/Notes"}
			   	onChangeText={text => this.setState({description:text})}
			        value={description}
			      />
			    </View>
			  </ScrollView> 
                        )}

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
				  buttonText={"Yes"}
				  buttonFunctionality={() => this.handleNewCategoryAddition()}
				  secondButtonText={"Cancel"}
				  secondButtonFunctionality={() => this.setState({displayConfirmCategoryAdd: false})}
				/>
			)}
			{
				displayConfirmationModal && (
				  <CustomModal
				    visible={displayConfirmationModal}
				    text={isEdit ? "Edit is confirmed": "Item has been added"}
				    buttonText={!isEdit ? "Add another" : "Okay"}
				    secondButtonText={!isEdit ? "Okay" : null}
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
			  secondButtonText={"Camera"}
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

  // SKU container

  skuContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 36,
    paddingRight: 10,
    marginTop: -10,
    // background: "transparent"
  },


  //Form container

  scrollContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center", 
    //marginTop: 10,
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
    paddingLeft: 0,
    //height: 360,
  },

  priceInput: {
    width: width / 2,
    flexDirection: "row",
    alignItems: "center"
  },

  markupContainer: {
    //height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 36
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


  //Label style 

  labelStyle: {
    padding: 0, 
  }
});
