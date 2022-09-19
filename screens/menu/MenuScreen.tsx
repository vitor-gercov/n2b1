import { useEffect, useState } from 'react';
import { StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, TextInput, AsyncStorage } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Food, FoodCategory } from '../../models';
import { FontAwesome } from '@expo/vector-icons';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'
import { globalStyles } from '../../assets/styles/globalStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { Cart } from '../../models/cartModel';

export default function MenuScreen({ navigation }: RootTabScreenProps<'Menu'>) {
  const [cart, setCart] = useState<Cart>(new Cart())
  const [foods, setFoods] = useState([new Food()])
  const [foodCategories, setFoodCategories] = useState([new FoodCategory()])
  const [categoryFilters, setCategoryFilters] = useState([new FoodCategory()])
  const [visibleModal, setVisibleModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState(NaN)
  const [foodCategoryId, setFoodCategoryId] = useState(NaN)
  const [foodCategoryFilter, setFoodCategoryFilter] = useState(NaN)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(NaN)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const unsubscribe: any = navigation.addListener('focus', async () => {
      databaseService.getAllFoodCategories().then((foodCategories: FoodCategory[]) => {
        setFoodCategories(foodCategories)
        setCategoryFilters(foodCategories)
        getFoods()
        AsyncStorage.getItem('cart').then(async localStorage => {
          if (localStorage) {
            let cartFromStorage: Cart = JSON.parse(localStorage)
            if (cartFromStorage.totalPrice < 0) {
              cartFromStorage.totalPrice = 0
            }
            setCart(cartFromStorage)
          }
        })
      })
    })
    return unsubscribe
  }, [navigation])

  async function createFood(): Promise<void> {
    if (description && foodCategoryId && description.trim() != '') {
      const foodCreated: boolean = await databaseService.createFood({ foodCategoryId, description, price })
      if (foodCreated) {
        setVisibleModal(false)
        getFoods()
        return Alert.alert('Alimento cadastrado.')
      }
      return Alert.alert('Erro', 'Alimento não cadastrado.')
    }
  }

  async function editFood(): Promise<void> {
    if (isEdit && id && description && foodCategoryId && description.trim() != '') {
      const foodEdited: boolean = await databaseService.editFood({ description, id, foodCategoryId, price })
      if (foodEdited) {
        setVisibleModal(false)
        getFoods()
        return Alert.alert('Alimento editado.')
      }
      return Alert.alert('Erro', 'Alimento não editado.')
    }
  }

  function getFoods(): void {
    databaseService.getAllFoods(foodCategoryFilter).then((foods: Food[]) => {
      foods.map((food: Food) => {
        food.categoryDescription = foodCategories.find((foodCategory: FoodCategory) => foodCategory.id == food.foodCategoryId)?.description
        return food
      })
      setFoods(foods)
    })
  }

  function deleteFood(foodId: number): void {
    databaseService.deleteFood(foodId).then((foodDeleted: boolean) => {
      if (foodDeleted) {
        Alert.alert('Alimento excluído')
        return getFoods()
      }
      Alert.alert('Erro', 'Alimento não excluído.')
    })
  }

  return (
    <View style={globalStyles.container}>
      <TouchableOpacity onPress={() => {
        setIsEdit(false)
        setFormSubmitted(false)
        setFoodCategoryId(NaN)
        setDescription('')
        setPrice(0)
        setVisibleModal(true)
      }} style={[globalStyles.button, globalStyles.backgroudGreen, globalStyles.alignSelfEnd]}>
        <Text style={globalStyles.textWhite}>Novo alimento</Text>
      </TouchableOpacity>
      <Text>
        Valor total: R$ {cart?.totalPrice ?? 0}
      </Text>
      <Text>
        Categoria
      </Text>
      <DropDownPicker
        placeholder='Selecione um item'
        open={isFilterOpen}
        value={foodCategoryFilter}
        items={categoryFilters.map((foodCategory: FoodCategory) => {
          return { label: foodCategory.description, value: foodCategory.id }
        })}
        setOpen={setIsFilterOpen}
        setValue={setFoodCategoryFilter}
        setItems={setCategoryFilters}
        onChangeValue={(item) => {
          getFoods()
        }}
      />
      <TouchableOpacity onPress={() => {
        setFoodCategoryFilter(NaN)
      }} style={[globalStyles.button, globalStyles.backgroudBlue, globalStyles.alignSelfEnd]}>
        <Text style={globalStyles.textWhite}>Limpar filtro</Text>
      </TouchableOpacity>
      <ScrollView style={globalStyles.scrollView}>
        {
          foods?.map((food: Food, index: number) => {
            return (<View key={index} style={[
              styles.card,
              globalStyles.displayFlex,
              globalStyles.alignItemsCenter,
              globalStyles.justifyContentBetween
            ]}>
              <View style={globalStyles.backGroundGrey}>
                <Text style={globalStyles.label}>
                  {food.description}
                </Text>
                <Text>
                  R$ {food.price}
                </Text>
                <Text>
                  {food.categoryDescription}
                </Text>
              </View>
              <View style={globalStyles.backGroundGrey}>
                <View style={[globalStyles.displayFlex, globalStyles.borderRadius]}>
                  <TouchableOpacity style={globalStyles.button} onPress={() => {
                    setId(food.id)
                    setFoodCategoryId(food.foodCategoryId)
                    setDescription(food.description)
                    setPrice(food.price)
                    setIsEdit(true)
                    setFormSubmitted(false)
                    setVisibleModal(true)
                  }}>
                    <FontAwesome name={'edit'} size={25} color={'#09f'}></FontAwesome>
                  </TouchableOpacity>
                  <TouchableOpacity style={globalStyles.button} onPress={() => {
                    deleteFood(food.id)
                  }}>
                    <FontAwesome name={'close'} size={25} color={'#900'}></FontAwesome>
                  </TouchableOpacity>
                </View>
                <View style={globalStyles.marginBottom}></View>
                <View style={[globalStyles.displayFlex, globalStyles.borderRadius]}>
                  <TouchableOpacity style={globalStyles.button} onPress={async () => {
                    let localStorage = await AsyncStorage.getItem('cart')
                    if (localStorage) {
                      let cart: Cart = JSON.parse(localStorage)
                      let selectedItem = cart.items.find(item => item.food.id == food.id)
                      if (selectedItem) {
                        if (selectedItem.quantity > 0) {
                          selectedItem.quantity--
                        }
                        if (cart.totalPrice - food.price >= 0) {
                          cart.totalPrice -= food.price
                        }
                        cart.items = cart.items.map(item => {
                          if (item.food == selectedItem?.food) {
                            return selectedItem
                          }
                          return item
                        })
                        await AsyncStorage.setItem('cart', JSON.stringify(cart))
                        setCart(cart)
                      }
                    }
                  }}>
                    <FontAwesome name={'minus'} size={25} color={'#000'}></FontAwesome>
                  </TouchableOpacity>
                  <TouchableOpacity style={globalStyles.button} onPress={async () => {
                    let localStorage = await AsyncStorage.getItem('cart')
                    if (!localStorage) {
                      let newCart: Cart = {
                        items: [{ food, quantity: 1 }],
                        totalPrice: food.price
                      }
                      await AsyncStorage.setItem('cart', JSON.stringify(newCart))
                      setCart(newCart)
                      return
                    }
                    let storedCart: Cart = JSON.parse(localStorage)
                    let selectedItem = storedCart.items.find(item => item.food.id == food.id)
                    if (!selectedItem) {
                      storedCart.items.push({ food, quantity: 1 })
                    } else {
                      selectedItem.quantity++
                    }
                    storedCart.totalPrice += food.price
                    storedCart.items = storedCart.items.map(item => {
                      if (item.food == selectedItem?.food) {
                        return selectedItem
                      }
                      return item
                    })
                    await AsyncStorage.setItem('cart', JSON.stringify(storedCart))
                    setCart(storedCart)
                  }}>
                    <FontAwesome name={'plus'} size={25} color={'#000'}></FontAwesome>
                  </TouchableOpacity>
                </View>
                <Text>
                  Quantidade: {cart?.items?.find(item => item.food.id == food.id)?.quantity.toString() ?? 0}
                </Text>
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
          <Text style={globalStyles.inputLabel}>
            Preço
          </Text>
          <TextInput
            style={globalStyles.input}
            onChangeText={(value: string) => {
              setPrice(Number(value))
            }}
            value={price.toString()}
          />
          {
            formSubmitted && !(price && price != NaN && price > 0) ?
              <Text style={globalStyles.textRed}>
                Preço não informado
              </Text> : null
          }
          <View style={globalStyles.marginBottom}></View>
          <Text>
            Categoria
          </Text>
          <DropDownPicker
            open={isDropdownOpen}
            value={foodCategoryId}
            items={foodCategories.map((foodCategory: FoodCategory) => {
              return { label: foodCategory.description, value: foodCategory.id }
            })}
            setOpen={setIsDropdownOpen}
            setValue={setFoodCategoryId}
            setItems={setFoodCategories}
          />
          <View style={globalStyles.marginBottom}></View>
          {
            isEdit ?
              <TouchableOpacity style={[globalStyles.button, globalStyles.backgroudBlue]}
                onPress={async () => {
                  setFormSubmitted(true)
                  await editFood()
                }}>
                <Text style={globalStyles.textWhite}>
                  Editar
                </Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[globalStyles.button, globalStyles.backgroudGreen]}
                onPress={async () => {
                  setFormSubmitted(true)
                  await createFood()
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