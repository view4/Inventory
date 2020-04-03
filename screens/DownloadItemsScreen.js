import * as Print from 'expo-print';
import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import firebase from "../firebase";


const htmlStyle= 
  `<style> .item-container{
			display: flex;
			border-bottom: 1px solid gray;
			width: 90%;
			margin: 0px 54px 10px 54px;;
			justify-content: flex-start;
			padding-bottom: 7px;
			position: relative;
			height: 180px;
		}
		.image-container {
			height: 180px;
			width: 180px;
			margin-right: 7px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.image-container > img {
			height: 126px;
			width: 126px;
		}
		.item-middle-sect, .item-end-sect{
			display: flex;
			flex-direction: column;
			height: 100%;
			justify-content: space-between;
		}

		.item-end-sect{
			height: 100%;
			position: absolute;
			right: 10px;
		}
		.cat-text{
			font-weight: 700;
		}
	</style>`;

class DownloadItemsScreen extends React.Component{
  state={
    allItems: [],
  }

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

  handleDownload = async () => {
	const html = this.writeHtmlDoc();
	console.log(html)
	const options = {
		html: html,
      		width : 612,
     		height : 792,
      		base64 : false
	};
	console.log(options)
	let printer = await Print.printAsync(options);
    
  };

  writeHtmlDoc = () => {
    const {allItems} = this.state;

    const style = htmlStyle;
    let body = "<body>"
    for (let i =0; i < allItems.length; i++) {
	let itemHtml = `
		<div class="item-container">
			<div class="image-container">
				<Image src="${allItems[i].image}" alt="image not available"> 
			</div>
			<div class="item-middle-sect">
				<h3> ${allItems[i].title}</h3>
				<p> ${allItems[i].description}</p>
				<span class="cat-text">${allItems[i].category}</span> 
			</div>
			<div class="item-end-sect">
				<span>Cost: £${allItems[i].costPrice} </span>
				<span>Sale: £${allItems[i].salePrice} </span>
				<span>Quantity:${allItems[i].quantity}  </span>
			</div>
		</div>`
	body = body.concat(itemHtml);
    }  
    body = body.concat("</body>");



   const doc = `<html>
		${style}
		${body}
		</html>`;
   return doc
  }

  render(){
	return (
	  <View style={styles.container}>
		<Button style={styles.downloadButton} title="Press to download" onPress={this.handleDownload}></Button>
	  </View>
   )
 }
}


const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "aliceblue"
  },
  downloadButton: {
    width: 180,
    height: 36
  },


});

export default DownloadItemsScreen;


