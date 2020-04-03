import * as React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CatalogueItem from "../components/CatalogueItem";
import firebase from "../firebase";

const addIcon = require("../assets/images/add_green.png");
const logo = require("../assets/images/logo.png");

const {height, width} = Dimensions.get("screen");


export default class HomeScreen extends React.Component{
  state = {
    allItems: [],
    filteredItems: [],
    isSearch: false,
    hasFilters: false,
    filters: [],
  };

  componentDidMount(){
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", snapshot => {
      if(!snapshot.val()){
        return;
      };
      const allItemsArray = this.convertToArray(snapshot.val());
      this.setState({allItems: allItemsArray});
    })
  };


  convertToArray = (object) => {

   const objectKeys = Object.keys(object);

   const objectArray = objectKeys.map( key => (
     {
       ['key']:key,
	 ...object[key]
     }
    ));

    return objectArray;
  }

  handleSearchInput = (text) => {
    const { allItems } = this.state;
    const isSearch = !!text.length;

    const filteredItems = [];
    for(let i = 0; i < allItems.length; i++){
      if(allItems[i].title.toLowerCase().includes(text.toLowerCase())){
        filteredItems.push(allItems[i])
      }
    }
    
    this.setState({ 
      isSearch, 
      filteredItems
   });
  };

  addCategoryFilter = (category) => {
    const { filters, allItems } = this.state; 
    
    if (filters.indexOf(category) === -1) {
      filters.push(category);
    } else {
      filters.splice(filters.indexOf(category), 1);

    }

    const hasFilters = !!filters.length; 
    const filteredItems = [];

    if ( hasFilters ) {

      for(let i = 0; i < allItems.length; i++){
        if(filters.indexOf(allItems[i].category) !== -1){
          filteredItems.push(allItems[i])
        }
      }
    };

    this.setState({
      filteredItems,
      filters,
      hasFilters

    })
  }
  render() {
    const { allItems, isSearch, filteredItems, hasFilters, filters } = this.state;
    const categories = ["Rings", "Necklaces", "Earrings", "Bracelets"];

    return(
      <View style={styles.container}>
        <View style={styles.headerContainer}>
	 <View style={[styles.headerTopRowContainer, styles.headerRow]}>
	  <View style={styles.logoContainer}>
		<Image source={logo}  style={{height: 36, width: 36}}/>
	  </View>
	  <View style={styles.searchContainer}>
	    <View style={styles.searchIconContainer}>
	    </View>
	    <TextInput
	      placeholder="search"
	      onChangeText={(text) => this.handleSearchInput(text) }
	      style={[styles.searchInputField, !isSearch ? {textAlign: "center", fontWeight: "700"}: null]}
	      placeholderTextColor={"#fff"}
	    />
	  </View>
	  <View style={styles.addItemButton}>
	    <TouchableOpacity onPress={()=> this.props.navigation.navigate("Add Item")}> 
	      <Image source={addIcon}  style={{height: 36, width: 36}}/>
	    </TouchableOpacity> 
	  </View>
	 </View>
	 <View style={[styles.bottomRowContainer, styles.headerRow]}>
	   {
		categories.map(category => (
			<TouchableOpacity 
			  style={[styles.categoryButton, filters.indexOf(category) !== -1 ? styles.selectedFilterItem: null]}
			  key={category} 
			  onPress={() => this.addCategoryFilter(category)}
			>
				<Text style={styles.headerText}>{category}</Text>
			</TouchableOpacity>
		))
	   }
	   
	 </View>
	</View>

        <ScrollView style={styles.catalogueContainer} contentContainerStyle={styles.catalogueContentContainer}>
	  <FlatList
	    numColumns={2}
	    columnWrapperStyle={styles.colStyle}
	    data={ !isSearch && !hasFilters ? allItems: filteredItems }
            renderItem={(item) => (
	      <TouchableOpacity style={{width: (width / 2) - 18, margin: 4 }} onPress={()=>this.props.navigation.navigate("item display", item)}>
	        <CatalogueItem item={item} />
	      </TouchableOpacity >
            )}
	    keyExtractor={item => item.key}

	   />
		


        </ScrollView>
      </View>
    )
  }
}

HomeScreen.navigationOptions = {
  header: null,
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },

  headerContainer: {
        backgroundColor: "navy",
        marginBottom: 10,
        padding: 7
  },

  headerRow: {
    flexDirection: "row",
    width: "100%", 
    justifyContent: "space-around",
    padding: 3,
    alignItems: "center"
  },

  headerText:{
   color: "#fff"
  },

  categoryButton: {
    backgroundColor: "#d4d0d096",
    padding: 7,
    borderRadius: 7
  },
  searchInputField: {
     backgroundColor: "#d4d0d096",
     padding: 7,
     borderRadius: 18,
     width: width / 2,
     
  },

  selectedFilterItem: {
    borderWidth: 3,
    borderColor: "#fff"
  },

  //Catalogue
  
  catalogueContentContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  colStyle: {
    flex: 1,
    //justifyContent: "space-around"
  }

});
  ;
