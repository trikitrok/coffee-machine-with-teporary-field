import {Drink} from "./drink";
import {DrinkMakerDriver} from "./drink-maker-driver";
import {OrderProcessing} from "./order-processing";

export class CoffeeMachine {
    private orderProcessing: OrderProcessing;
    private readonly drinkMakerDriver: DrinkMakerDriver;

    constructor(priceTable: Record<Drink, number>, drinkMakerDriver: DrinkMakerDriver) {
        this.drinkMakerDriver = drinkMakerDriver;
        this.orderProcessing = new OrderProcessing(priceTable);
    }

    selectCoffee(): void {
        this.orderProcessing.selectDrink(Drink.Coffee);
    }

    selectTea(): void {
        this.orderProcessing.selectDrink(Drink.Tea);
    }

    selectChocolate(): void {
        this.orderProcessing.selectDrink(Drink.Chocolate);
    }

    selectOrangeJuice(): void {
        this.orderProcessing.selectDrink(Drink.OrangeJuice);
    }

    selectExtraHot(): void {
        this.orderProcessing.isExtraHot();
    }

    addOneSpoonOfSugar(): void {
        this.orderProcessing.addOneSpoonOfSugar();
    }

    addMoney(amount: number): void {
        this.orderProcessing.addMoney(amount);
    }

    makeDrink(): void {
        this.orderProcessing = this.orderProcessing.placeOrder(this.drinkMakerDriver);
    }
}

