/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          FoodCategories: {
            screens: {
              FoodCategoriesScreen: 'foodCategories',
            },
          },
          Menu: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
          Cart: {
            screens: {
              CartScreen: 'cart'
            }
          },
          Historic: {
            screens: {
              HistoricScreen: 'historic'
            }
          }
        },
      },
      RegisterFoodCategory: 'registerFoodCategory',
      EditFoodCategory: 'editFoodCategory',
      RegisterFood: 'registerFood',
      EditFood: 'editFood',
      NotFound: '*',
    },
  },
};

export default linking;
