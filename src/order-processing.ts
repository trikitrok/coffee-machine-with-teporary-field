import {Drink} from "./drink";
import {DrinkMakerDriver} from "./drink-maker-driver";
import {Order} from "./order";

export abstract class OrderProcessing {
    private extraHot: boolean;
    private spoonsOfSugars: number;
    private money: number;
    private readonly priceTable: Record<Drink, number>;

    protected constructor(priceTable: Record<Drink, number>, money: number, spoonsOfSugars: number, extraHot: boolean) {
        this.priceTable = priceTable;
        this.money = money;
        this.spoonsOfSugars = spoonsOfSugars;
        this.extraHot = extraHot;
    }

    static start(priceTable: Record<Drink, number>): OrderProcessing {
        return new InitialOrderProcessing(priceTable);
    }

    abstract makeDrink(drinkMakerDriver: DrinkMakerDriver): OrderProcessing;

    abstract selectDrink(selectedDrink: Drink): OrderProcessing;

    abstract selectExtraHot(): OrderProcessing;

    addOneSpoonOfSugar(): OrderProcessing {
        const MAX_SPOONS_OF_SUGAR: number = 2;
        this.spoonsOfSugars = Math.min(
            this.spoonsOfSugars + 1,
            MAX_SPOONS_OF_SUGAR
        );
        return this;
    }

    addMoney(amount: number): OrderProcessing {
        this.money += amount;
        return this;
    }

    protected setExtraHot(value: boolean): void {
        this.extraHot = value;
    }

    protected getMoney(): number {
        return this.money;
    }

    protected getSelectedDrinkPrice(selectedDrink: Drink): number {
        return this.priceTable[selectedDrink];
    }

    protected makeOrderProcessingReady(selectedDrink: Drink): OrderProcessing {
        return new ReadyOrderProcessing(
            selectedDrink,
            this.priceTable,
            this.money,
            this.spoonsOfSugars,
            this.extraHot
        );
    }

    protected reset(): OrderProcessing {
        return OrderProcessing.start(this.priceTable);
    }

    protected getSpoonsOfSugars(): number {
        return this.spoonsOfSugars;
    }

    protected isExtraHot(): boolean {
        return this.extraHot;
    }
}

class InitialOrderProcessing extends OrderProcessing {
    constructor(priceTable: Record<Drink, number>) {
        super(priceTable, 0, 0, false);
    }

    makeDrink(drinkMakerDriver: DrinkMakerDriver): OrderProcessing {
        drinkMakerDriver.notifyUser(this.missingDrinkSelectionMessage());
        return this;
    }

    selectDrink(selectedDrink: Drink): OrderProcessing {
        return super.makeOrderProcessingReady(selectedDrink);
    }

    selectExtraHot(): OrderProcessing {
        this.setExtraHot(true)
        return this;
    }

    private missingDrinkSelectionMessage(): string {
        return "Select a drink, please";
    }
}

class ReadyOrderProcessing extends OrderProcessing {
    private selectedDrink: Drink;

    constructor(selectedDrink: Drink, priceTable: Record<Drink, number>, money: number, spoonsOfSugars: number, extraHot: boolean) {
        super(priceTable, money, spoonsOfSugars, extraHot);
        this.selectedDrink = selectedDrink;
        this.restrictExtraHot();
    }

    makeDrink(drinkMakerDriver: DrinkMakerDriver): OrderProcessing {
        if (!this.isThereEnoughMoney()) {
            drinkMakerDriver.notifyUser(this.missingMoneyMessage());
            return this;
        }
        drinkMakerDriver.make(this.createOrder(this.selectedDrink));
        return this.reset();
    }

    selectDrink(selectedDrink: Drink): OrderProcessing {
        this.selectedDrink = selectedDrink;
        return this;
    }

    selectExtraHot(): OrderProcessing {
        this.setExtraHot(true);
        this.restrictExtraHot();
        return this;
    }

    private createOrder(selectedDrink: Drink): Order {
        return new Order(selectedDrink, this.isExtraHot(), this.getSpoonsOfSugars())
    }

    private restrictExtraHot(): void {
        if (this.selectedDrink === Drink.OrangeJuice) {
            this.setExtraHot(false);
        }
    }

    private isThereEnoughMoney(): boolean {
        return this.getMoney() >= this.getSelectedDrinkPrice(this.selectedDrink);
    }

    private missingMoneyMessage(): string {
        const missingMoney = this.computeMissingMoney();
        return ` not enough money (${(missingMoney.toFixed(1))} missing)`;
    }

    private computeMissingMoney(): number {
        return this.getSelectedDrinkPrice(this.selectedDrink) - this.getMoney();
    }
}
