import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'
import { FoodCategory } from '../../models';

export default function FoodCategoriesScreen({ navigation }: RootTabScreenProps<'FoodCategories'>) {
  const [foodCategories, setFoodCategories] = useState([new FoodCategory()])

  // function getFoodCategories(): void {
  //   databaseService.getAllFoodCategories().then((foodCategories: FoodCategory[]) => {
  //     console.log(foodCategories)
  //     setFoodCategories(foodCategories)
  //   })
  // }

  // getFoodCategories()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
