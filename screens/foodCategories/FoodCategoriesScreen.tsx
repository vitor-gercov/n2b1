import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'
import { FoodCategory } from '../../models';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '../../assets/styles/globalStyles';

export default function FoodCategoriesScreen({ navigation }: RootTabScreenProps<'FoodCategories'>) {
  const [foodCategories, setFoodCategories] = useState([new FoodCategory()])

  useEffect(() => {
    getFoodCategories()
  }, [])

  function getFoodCategories(): void {
    databaseService.getAllFoodCategories().then((foodCategories: FoodCategory[]) => {
      setFoodCategories(foodCategories)
    })
  }

  function deleteFoodCategory(foodCategoryId: number): void {
    databaseService.deleteFoodCategory(foodCategoryId).then((foodCategoryDeleted: boolean) => {
      if (foodCategoryDeleted) {
        Alert.alert('Categoria excluída')
        return getFoodCategories()
      }
      Alert.alert('Erro', 'Categoria não excluída.')
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView style={globalStyles.scrollView}>
        {
          foodCategories.map((foodCategory: FoodCategory) => {
            return <View key={foodCategory.id} style={[
              styles.card,
              globalStyles.displayFlex,
              globalStyles.alignItemsCenter,
              globalStyles.justifyContentBetween
            ]}>
              <Text key={foodCategory.id} style={styles.title}>
                {foodCategory.description}
              </Text>
              <View style={[globalStyles.displayFlex, globalStyles.borderRadius]}>
                <TouchableOpacity style={globalStyles.button}>
                  <FontAwesome name={'edit'} size={25} color={'#09f'}></FontAwesome>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.button} onPress={() => {
                  deleteFoodCategory(foodCategory.id)
                }}>
                  <FontAwesome name={'close'} size={25} color={'#900'}></FontAwesome>
                </TouchableOpacity>
              </View>
            </View>
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
