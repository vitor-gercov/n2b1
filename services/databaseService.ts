import { openDatabase, WebSQLDatabase, SQLTransaction, SQLError } from 'expo-sqlite'
import { FoodCategory } from '../models';

function getDbConnection(): WebSQLDatabase {
    return openDatabase('pizzaria.db')
}

export async function createTables(): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const createFoodCategoriesTableQuery: string = `CREATE TABLE IF NOT EXISTS FoodCategories
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL
        )`;
        const createFoodsTableQuery: string = `CREATE TABLE IF NOT EXISTS Foods
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            foodCategoryId INTEGER NOT NULL,
            description TEXT NOT NULL,
            price float NOT NULL,
            FOREIGN KEY(foodCategoryId) REFERENCES FoodCategories(id)
        )`;
        const createSellsTableQuery: string = `CREATE TABLE IF NOT EXISTS Sells
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT   
        )`;
        const createSellFoodsTableQuery: string = `CREATE TABLE IF NOT EXISTS SellFoods
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sellId INTEGER NOT NULL,    
            foodId INTEGER NOT NULL,
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
                console.log(error)
                resolve(false)
            }
        )
    });
};

export async function createFoodCategory(foodCategoryDescription: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const createFoodCategory: string =
            `INSERT INTO FoodCategories (description) VALUES (${foodCategoryDescription})`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                createFoodCategory, [],
                (transaction: any, list: any) => resolve(true)
            )
        })
    })
}

export async function getAllFoodCategories(): Promise<FoodCategory[]> {
    return new Promise((resolve, reject) => {
        const getAllFoodCategoriesQuery: string = `SELECT * FROM FoodCategories`;
        const database: WebSQLDatabase = getDbConnection();
        database.transaction((transaction: SQLTransaction) => {
            transaction.executeSql(
                getAllFoodCategoriesQuery, [],
                (transaction: any, list: any) => {
                    const foodCategories: FoodCategory[] = []
                    for (let i: number = 0; i < list.rows.length; i++) {
                        const user: FoodCategory = {
                            id: list.rows.item(i).id,
                            description: list.rows.item(i).description,
                        }
                        foodCategories.push(user);
                    }
                    resolve(foodCategories);
                }
            )
        })
    })
}