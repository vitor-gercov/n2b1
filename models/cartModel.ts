import { Food } from "./foodModel";

export class Cart {
    items!: {
        food: Food,
        quantity: number
    }[]
    totalPrice!: number
}