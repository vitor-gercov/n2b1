import { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, Modal } from 'react-native'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'
import { FoodCategory } from '../../models';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '../../assets/styles/globalStyles';

export default function FoodCategoriesScreen({ navigation }: RootTabScreenProps<'FoodCategories'>) {
  const [foodCategories, setFoodCategories] = useState([new FoodCategory()])
  const [visibleModal, setVisibleModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState(0)
  const [description, setDescription] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    getFoodCategories()
  }, [])

  async function createFoodCategory(): Promise<void> {
    if (description && description.trim() != '') {
      const foodCategoryCreated: boolean = await databaseService.createFoodCategory(description)
      if (foodCategoryCreated) {
        setVisibleModal(false)
        getFoodCategories()
        return Alert.alert('Categoria cadastrada.')
      }
      return Alert.alert('Erro', 'Categoria não cadastrada.')
    }
  }

  async function editFoodCategory(): Promise<void> {
    if (description && description.trim() != '') {
      const foodCategoryCreated: boolean = await databaseService.editFoodCategory(description, id)
      if (foodCategoryCreated) {
        setVisibleModal(false)
        getFoodCategories()
        return Alert.alert('Categoria editada.')
      }
      return Alert.alert('Erro', 'Categoria não editada.')
    }
  }

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
    <View style={globalStyles.container}>
      <TouchableOpacity onPress={() => {
        setIsEdit(false)
        setFormSubmitted(false)
        setDescription('')
        setVisibleModal(true)
      }} style={[globalStyles.button, globalStyles.backgroudGreen, globalStyles.alignSelfEnd]}>
        <Text style={globalStyles.textWhite}>Nova categoria</Text>
      </TouchableOpacity>
      <ScrollView style={globalStyles.scrollView}>
        {
          foodCategories?.map((foodCategory: FoodCategory, index: number) => {
            return (<View key={index} style={[
              styles.card,
              globalStyles.displayFlex,
              globalStyles.alignItemsCenter,
              globalStyles.justifyContentBetween
            ]}>
              <Text style={globalStyles.label}>
                {foodCategory.description}
              </Text>
              <View style={[globalStyles.displayFlex, globalStyles.borderRadius]}>
                <TouchableOpacity style={globalStyles.button} onPress={() => {
                  setId(foodCategory.id)
                  setDescription(foodCategory.description)
                  setIsEdit(true)
                  setFormSubmitted(false)
                  setVisibleModal(true)
                }}>
                  <FontAwesome name={'edit'} size={25} color={'#09f'}></FontAwesome>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.button} onPress={() => {
                  deleteFoodCategory(foodCategory.id)
                }}>
                  <FontAwesome name={'close'} size={25} color={'#900'}></FontAwesome>
                </TouchableOpacity>
              </View>
            </View>)
          })
        }
      </ScrollView>

      <Modal
        animationType="slide"
        visible={visibleModal}
        style={globalStyles.modal}
        onRequestClose={() => {
          setVisibleModal(false);
        }}
      >
        <View>
          <TouchableOpacity style={[globalStyles.button, globalStyles.alignSelfEnd]} onPress={() => setVisibleModal(false)}>
            <FontAwesome name={'close'} size={25} color={'#900'}></FontAwesome>
          </TouchableOpacity>
          <Text style={globalStyles.inputLabel}>
            Descrição
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(value: string) => {
              setDescription(value)
            }}
            value={description}
          />
          {
            formSubmitted && !(description && description.trim() != '') ?
              <Text style={globalStyles.textRed}>
                Descrição não informada
              </Text> : null
          }
          <View style={globalStyles.marginBottom}></View>
          {
            isEdit ?
              <TouchableOpacity style={[globalStyles.button, globalStyles.backgroudBlue]}
                onPress={async () => {
                  setFormSubmitted(true)
                  await editFoodCategory()
                }}>
                <Text style={globalStyles.textWhite}>
                  Editar
                </Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[globalStyles.button, globalStyles.backgroudGreen]}
                onPress={async () => {
                  setFormSubmitted(true)
                  await createFoodCategory()
                }}>
                <Text style={globalStyles.textWhite}>
                  Criar
                </Text>
              </TouchableOpacity>
          }
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5
  },
});
