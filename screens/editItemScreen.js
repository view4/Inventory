import * as React from 'react';
import AddOrEditItemScreen from "./AddItemScreen"

const EditItemScreen = (props) => {
	console.log("edit")
	console.log(props)
	return <AddOrEditItemScreen isEdit={true} item={props.route.params.item} nav={props.navigation}/>
}

export default EditItemScreen;
