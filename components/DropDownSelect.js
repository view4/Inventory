import React, { useState } from "react";
import { Dimensions, Image, Modal, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";

const DropDownSelect = ({label, options, handleSelect, onNewAddition}) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ addNew, setAddNew ] = useState(false);
  const [ selectedValue, setSelectedValue ] = useState("");
  const [ newValue, setNewValue ] = useState("");
  console.log(options)

  return(

    <View> 
      { addNew ? (
         <View style={styles.addContainer}>
           <TextInput
             onChangeText={text=> {
               if (!text.length) {
                 setAddNew(false)
               }
               setNewValue(text)
               
             }} 
             placeholder={"please add new..."}
             />
           <TouchableOpacity onPress={ () => onNewAddition(newValue) } > 
             <Text> + </Text>
           </TouchableOpacity>
         </ View>
         ) : (
           <View>
             <TouchableOpacity onPress={() => setIsOpen(!isOpen)}> 
              <Text>{selectedValue.length ? selectedValue : label}</Text>
             </TouchableOpacity>
             { isOpen &&  (  
              <ScrollView>
                {
                  options.map( (option, i) => (   
                    <TouchableOpacity key={i} onPress={() => {
                      setSelectedValue(option)
                      handleSelect(option)
                      setIsOpen(false)
                      }}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))
                 }
                <TouchableOpacity onPress={() => setAddNew(true)}>
                  <Text>Add new ...</Text>
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
    justifyContent: "space-between"
  }



})

export default DropDownSelect;

