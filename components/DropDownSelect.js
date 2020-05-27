import React, { useState, useEffect } from "react";
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";

const DropDownSelect = ({label, options, handleSelect, onNewAddition}) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ addNew, setAddNew ] = useState(false);
  const [ selectedValue, setSelectedValue ] = useState("");
  const [ newValue, setNewValue ] = useState("");
  const [ toggleLogo, setToggleLogo ] = useState("");

  console.log(options)
  useEffect(() => {
    if( isOpen ) {
      setToggleLogo(require(`../assets/images/escape.png`))
    } else {
      setToggleLogo(require(`../assets/images/dropdown.png`))
    }

  }, [isOpen])

  return(

    <View> 
      { addNew ? (
         <View style={styles.addContainer}>
           <TextInput
             style={{width: "90%", height: "100%"}}
             onChangeText={text=> {
               if (!text.length) {
                 setAddNew(false)
               }
               setNewValue(text)
               
             }} 
             placeholder={"please add new..."}
             />
           <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", padding: 3, borderLeftWidth: 1, height: 18 }} onPress={ () => onNewAddition(newValue) } > 
             <Image source={require("../assets/images/add.png")} style={{ height: 18, width: 18}}/>
           </TouchableOpacity>
         </ View>
         ) : (
           <View style={styles.dropDownContainer}>
             <TouchableOpacity style={styles.toggleDisplayContainer} onPress={() => setIsOpen(!isOpen)}> 
              <Text>{selectedValue.length ? selectedValue : label}</Text>
              <Image style={styles.toggleIcon} source={toggleLogo} />
             </TouchableOpacity>
             { isOpen &&  (  
              <ScrollView contentContainerStyle={styles.optionsContainer}>
                {
                  options.map( (option, i) => (   
                    <TouchableOpacity key={i} 
                      onPress={() => {
                        setSelectedValue(option)
                        handleSelect(option)
                        setIsOpen(false)
                      }}
                      style={styles.optionButton}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))
                 }
                <TouchableOpacity style={styles.optionButton} onPress={() => setAddNew(true)}>
                  <Text style={{"fontWeight": "600"}}>Add new ...</Text>
                </TouchableOpacity>
             </ScrollView>
            )
          }
        </View>
      )}
    </View>



  )
};


const styles = StyleSheet.create({

  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 36,
    height: 36,
    justifyContent: "space-between",
    paddingLeft: 7,
    paddingRight: 7
  },
  optionsContainer: {
    borderWidth: 1
  },
  dropDownContainer: {
    borderWidth: 1
  },
  
  optionButton: {
    borderBottomWidth: 1,
    padding: 3
  },
  toggleDisplayContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    paddingRight: 7,
    alignItems: "center"
  },
  toggleIcon: {
    height: 10,
    width: 10
  }



})

export default DropDownSelect;

