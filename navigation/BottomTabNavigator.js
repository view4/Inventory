import * as React from 'react';
import {View, Image} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
//import {  createAppContainer } from "@react-navigation"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddOrEditItemScreen from '../screens/AddItemScreen';
import DisplayItemScreen from '../screens/displayItemScreen';
import DownloadItemsScreen from '../screens/DownloadItemsScreen';
import EditItemScreen from '../screens/editItemScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const addIcon = require("../assets/images/add.png");
const downloadIcon = require("../assets/images/download.png");
const catalogueIcon =require("../assets/images/catalogue.png");

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  let tabBarVisible = false;

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Add Item"
        component={AddOrEditItemScreen}
        options={{
          title: 'Add new Item',
	  labelPosition: "below-icon",
	  tabBarIcon: ({focused}) => <Image source={addIcon} style={{height: 36, width: 36}}/>
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Catalogue',
	  labelPosition: "below-icon",
	  tabBarIcon: ({focused}) => <Image source={catalogueIcon} style={{height: 36, width: 36}}/>
        }}
      />
      <BottomTab.Screen
        name="Export"
        component={DownloadItemsScreen}
        options={{
          title: 'Export Items',
	  labelPosition: "below-icon",
	  tabBarIcon: ({focused}) => <Image source={downloadIcon} style={{height: 36, width: 36}}/>
        }}
      />
      <BottomTab.Screen
        name="item display"
        component={DisplayItemScreen}
        options={{
	  tabBarVisible: true,
	  showLabel: false,
	  tabBarButton: () => <View></View> // THIS IS A HACKISH WAY OF DOING IT.
        }} />
      <BottomTab.Screen
        name="edit item"
        component={EditItemScreen}
        options={{
	  tabBarVisible: true,
	  showLabel: false,
	  tabBarButton: () => <View></View> // THIS IS A HACKISH WAY OF DOING IT.
        }}
      />
    </BottomTab.Navigator>
  );
}


function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Catalogue';
    case 'Add Item':
      return 'Add a new Item';
    case 'item display':
      return 'View Item';
    case 'edit item':
      return 'Edit Item';
    case 'Export':
      return 'Export all Items';
  }
}
