import { openDatabase, WebSQLDatabase, SQLTransaction, SQLError } from 'expo-sqlite'
import { Food, FoodCategory } from '../models';
import { Cart } from '../models/cartModel';
import { Sell } from '../models/sellModal';

function getDbConnection(): WebSQLDatabase {
    return openDatabase('pizzaria.db')
}

export async function createTables(): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const createFoodCategoriesTableQuery: string = `CREATE TABLE IF NOT EXISTS FoodCategories
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            createdAt text NOT NULL
        )`;
        const createFoodsTableQuery: string = `CREATE TABLE IF NOT EXISTS Foods
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            foodCategoryId INTEGER NOT NULL,
            description TEXT NOT NULL,
            price float NOT NULL,
            createdAt text NOT NULL,
            FOREIGN KEY(foodCategoryId) REFERENCES FoodCategories(id)
        )`;
        const createSellsTableQuery: string = `CREATE TABLE IF NOT EXISTS Sells
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            totalPrice float NOT NULL,
            createdAt text NOT NULL
        )`;
        const createSellFoodsTableQuery: string = `CREATE TABLE IF NOT EXISTS SellFoods
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sellId INTEGER NOT NULL,    
            foodId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY(sellId) REFERENCES Sells(id),
            FOREIGN KEY(foodId) REFERENCES Foods(id)
        )`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                createFoodCategoriesTableQuery, [],
                (transaction, resultado) => resolve(true)
            )
            transaction.executeSql(
                createFoodsTableQuery, [],
                (transaction, resultado) => resolve(true)
            )
            transaction.executeSql(
                createSellsTableQuery, [],
                (transaction, resultado) => resolve(true)
            )
            transaction.executeSql(
                createSellFoodsTableQuery, [],
                (transaction, resultado) => resolve(true)
            )
        },
            (error: SQLError) => {
                resolve(false)
            }
        )
    });
};

export async function createFoodCategory(foodCategoryDescription: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const createFoodCategory: string =
            `INSERT INTO FoodCategories (description, createdAt) VALUES (?, ?)`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            const date: string = new Date().toISOString()
            transaction.executeSql(
                createFoodCategory,
                [foodCategoryDescription, date],
                (transaction: any, result: any) => {
                    if (result) {
                        resolve(true)
                    }
                    reject(false)
                },
                (transaction, error) => {
                    return true
                }
            )
        })
    })
}

export async function getAllFoodCategories(): Promise<FoodCategory[]> {
    return new Promise((resolve, reject) => {
        const getAllFoodCategoriesQuery: string = `SELECT * FROM FoodCategories`
        const database: WebSQLDatabase = getDbConnection()
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                getAllFoodCategoriesQuery, [],
                (transaction: any, list: any) => {
                    const foodCategories: FoodCategory[] = []
                    for (let i: number = 0; i < list.rows.length; i++) {
                        const foodCategory: FoodCategory = {
                            id: list.rows.item(i).id,
                            description: list.rows.item(i).description,
                        }
                        foodCategories.push(foodCategory)
                    }
                    resolve(foodCategories)
                }
            )
        })
    })
}

export async function editFoodCategory(foodCategoryDescription: string, foodCategoryId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const createFoodCategory: string =
            `UPDATE FoodCategories SET description=? WHERE id=?`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                createFoodCategory,
                [foodCategoryDescription, foodCategoryId],
                (transaction: any, result: any) => {
                    if (result) {
                        resolve(true)
                    }
                    reject(false)
                }
            )
        })
    })
}

export async function deleteFoodCategory(foodCategoryId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const deleteFoodCategoryQuery: string = 'DELETE FROM FoodCategories WHERE id=?'
        const database: WebSQLDatabase = getDbConnection()
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                deleteFoodCategoryQuery,
                [foodCategoryId],
                (transaction: any, result: any) => {
                    if (result) {
                        resolve(true)
                    }
                    reject(false)
                }
            )
        })
    })
}

export async function createFood(food: { foodCategoryId: number, description: string, price: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const createFoodQuery: string = `INSERT INTO Foods (foodCategoryId, description, price, createdAt) VALUES (?, ?, ?, ?)`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            const date: string = new Date().toISOString()
            transaction.executeSql(
                createFoodQuery,
                [food.foodCategoryId, food.description, food.price, date],
                (transaction: any, result: any) => {
                    if (result) {
                        resolve(true)
                    }
                    reject(false)
                }
            )
        })
    })
}

export async function getAllFoods(categoryId?: number): Promise<Food[]> {
    return new Promise((resolve, reject) => {
        let getAllFoodsQuery: string = `SELECT * FROM Foods`
        let queryParams: any[] = []
        if (categoryId) {
            getAllFoodsQuery += ` WHERE foodCategoryId=?`
            queryParams.push(categoryId)
        }
        const database: WebSQLDatabase = getDbConnection()
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                getAllFoodsQuery,
                queryParams,
                (transaction: any, list: any) => {
                    const foods: Food[] = []
                    for (let i: number = 0; i < list.rows.length; i++) {
                        const food: Food = {
                            id: list.rows.item(i).id,
                            foodCategoryId: list.rows.item(i).foodCategoryId,
                            price: list.rows.item(i).price,
                            description: list.rows.item(i).description,
                        }
                        foods.push(food)
                    }
                    resolve(foods)
                }
            )
        })
    })
}

export async function editFood(food: Food): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const editFoodQuery: string =
            `UPDATE Foods SET foodCategoryId=?, description=?, price=? WHERE id=?`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                editFoodQuery,
                [food.foodCategoryId, food.description, food.price, food.id],
                (transaction: any, result: any) => {
                    if (result) {
                        resolve(true)
                    }
                    reject(false)
                }
            )
        })
    })
}

export async function deleteFood(foodId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const deleteFoodQuery: string = 'DELETE FROM Foods WHERE id=?'
        const database: WebSQLDatabase = getDbConnection()
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                deleteFoodQuery,
                [foodId],
                (transaction: any, result: any) => {
                    if (result) {
                        resolve(true)
                    }
                    reject(false)
                }
            )
        })
    })
}

export async function createSell(cart: Cart): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const createSellQuery: string = `INSERT INTO Sells (totalPrice, createdAt) VALUES (?, ?)`;
        const database: WebSQLDatabase = getDbConnection()
        database.transaction((transaction: SQLTransaction) => {
            let date: string = new Date().toISOString()
            transaction.executeSql(
                createSellQuery,
                [cart.totalPrice, date],
                (transaction, result) => {
                    if (result.insertId) {
                        for (let item of cart.items) {
                            const createSellFoodQuery: string = `INSERT INTO SellFoods (sellId, foodId, quantity) VALUES (?, ?, ?)`
                            transaction.executeSql(
                                createSellFoodQuery,
                                [result.insertId, item.food.id, item.quantity],
                                (transaction, result) => {
                                    if (result) {
                                        resolve(true)
                                    }
                                    reject(false)
                                }
                            )
                        }
                    }
                },
                (transaction, error) => {
                    console.log(error)
                    return true
                }
            )
        })
    })
}

export async function getAllSells(): Promise<Sell[]> {
    return new Promise((resolve, reject) => {
        let getAllFoodsQuery: string = `SELECT Sells.*, SellFoods.quantity, Foods.description FROM Sells LEFT JOIN SellFoods LEFT JOIN Foods WHERE Sells.id=SellFoods.sellId AND SellFoods.foodId=Foods.id`
        let queryParams: any[] = []
        const database: WebSQLDatabase = getDbConnection()
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                getAllFoodsQuery,
                [],
                (transaction: any, list: any) => {
                    const sells: Sell[] = []
                    const sellsIds: number[] = []
                    for (let i: number = 0; i < list.rows.length; i++) {
                        if (!sellsIds.includes(list.rows.item(i).id)) {
                            sellsIds.push(list.rows.item(i).id)
                            sells.push({
                                id: list.rows.item(i).id,
                                createdAt: list.rows.item(i).createdAt,
                                items: []
                            })
                        }
                    }
                    for (let sell of sells) {
                        for (let i: number = 0; i < list.rows.length; i++) {
                            if (sell.id == list.rows.item(i).id) {
                                sell.items.push({
                                    food: list.rows.item(i).description,
                                    quantity: list.rows.item(i).quantity
                                })
                            }
                        }
                    }
                    resolve(sells)
                }
            )
        }, (error: SQLError) => {
            console.log(error)
        })
    })
}