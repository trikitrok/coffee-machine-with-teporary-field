import {Drink} from "./drink";
import {Order} from "./order";
import {DrinkMakerDriver} from "./drink-maker-driver";

export class OrderProcessing {
    private readonly MAX_SPOONS_OF_SUGAR: number = 2;
    private readonly priceTable: Record<Drink, number>;
    private selectedDrink: Drink;
    private extraHot: boolean;
    private spoonsOfSugars: number;
    private money: number;

    constructor(priceTable: Record<Drink, number>) {
        this.priceTable = priceTable;
        this.money = 0;
        this.spoonsOfSugars = 0;
        this.extraHot = false;
    }

    placeOrder(drinkMakerDriver: DrinkMakerDriver): OrderProcessing {
        if (!this.isOrderReady()) {
            drinkMakerDriver.notifyUser(this.missingDrinkSelectionMessage());
            return this;
        }
        if (!this.isThereEnoughMoney()) {
            drinkMakerDriver.notifyUser(this.missingMoneyMessage());
            return this;
        }
        drinkMakerDriver.make(this.createOrder());
        return this.resetOrderProcessing();
    }

    selectDrink(selectedDrink: Drink): void {
        this.selectedDrink = selectedDrink;
    }

    isExtraHot(): void {
        if (this.selectedDrink === Drink.OrangeJuice) {
            return;
        }
        this.extraHot = true;
    }

    addOneSpoonOfSugar(): void {
        this.spoonsOfSugars = Math.min(
            this.spoonsOfSugars + 1,
            this.MAX_SPOONS_OF_SUGAR
        );
    }

    addMoney(amount: number): void {
        this.money += amount;
    }

    private createOrder(): Order {
        return new Order(this.selectedDrink, this.extraHot, this.spoonsOfSugars);
    }

    private computeMissingMoney(): number {
        return this.getSelectedDrinkPrice() - this.money;
    }

    private isThereEnoughMoney(): boolean {
        return this.money >= this.getSelectedDrinkPrice();
    }

    private getSelectedDrinkPrice(): number {
        return this.priceTable[this.selectedDrink];
    }

    private missingDrinkSelectionMessage(): string {
        return "Select a drink, please";
    }

    private missingMoneyMessage(): string {
        const missingMoney = this.computeMissingMoney();
        return ` not enough money (${(missingMoney.toFixed(1))} missing)`;
    }

    private resetOrderProcessing(): OrderProcessing {
        return new OrderProcessing(this.priceTable);
    }

    private isOrderReady(): boolean {
        return this.selectedDrink !== undefined;
    }
}