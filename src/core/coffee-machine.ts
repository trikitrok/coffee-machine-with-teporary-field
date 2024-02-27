import {Drink} from "./drink";
import {DrinkMakerDriver} from "./drink-maker-driver";
import {OrderProcessing} from "./order-processing";

export class CoffeeMachine {
    private orderProcessing: OrderProcessing;

    constructor(priceTable: Record<Drink, number>, drinkMakerDriver: DrinkMakerDriver) {
        this.orderProcessing = OrderProcessing.start(priceTable, drinkMakerDriver);
    }

    selectCoffee(): void {
        this.orderProcessing = this.orderProcessing.selectDrink(Drink.Coffee);
    }

    selectTea(): void {
        this.orderProcessing = this.orderProcessing.selectDrink(Drink.Tea);
    }

    selectChocolate(): void {
        this.orderProcessing = this.orderProcessing.selectDrink(Drink.Chocolate);
    }

    selectOrangeJuice(): void {
        this.orderProcessing = this.orderProcessing.selectDrink(Drink.OrangeJuice);
    }

    selectExtraHot(): void {
        this.orderProcessing = this.orderProcessing.selectExtraHot();
    }

    addOneSpoonOfSugar(): void {
        this.orderProcessing = this.orderProcessing.addOneSpoonOfSugar();
    }

    addMoney(amount: number): void {
        this.orderProcessing = this.orderProcessing.addMoney(amount);
    }

    makeDrink(): void {
        this.orderProcessing = this.orderProcessing.placeOrder();
    }
}
