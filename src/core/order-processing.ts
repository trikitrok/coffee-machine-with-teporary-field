import {Drink} from "./drink";
import {DrinkMakerDriver} from "./drink-maker-driver";
import {Order} from "./order";

export abstract class OrderProcessing {
  private extraHot: boolean;
  private spoonsOfSugars: number;
  private money: number;

  protected constructor(money: number, spoonsOfSugars: number, extraHot: boolean) {
    this.money = money;
    this.spoonsOfSugars = spoonsOfSugars;
    this.extraHot = extraHot;
  }

  static start(priceTable: Record<Drink, number>, drinkMakerDriver: DrinkMakerDriver): OrderProcessing {
    return new InitialOrderProcessing(priceTable, drinkMakerDriver);
  }

  abstract placeOrder(): OrderProcessing;

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

  protected getSpoonsOfSugars(): number {
    return this.spoonsOfSugars;
  }

  protected isExtraHot(): boolean {
    return this.extraHot;
  }
}

class InitialOrderProcessing extends OrderProcessing {
  private readonly drinkMakerDriver: DrinkMakerDriver;
  private readonly priceTable: Record<Drink, number>;

  constructor(priceTable: Record<Drink, number>, drinkMakerDriver: DrinkMakerDriver) {
    super(0, 0, false);
    this.drinkMakerDriver = drinkMakerDriver;
    this.priceTable = priceTable;
  }

  placeOrder(): OrderProcessing {
    this.drinkMakerDriver.notifyUser(this.missingDrinkSelectionMessage());
    return this;
  }

  selectDrink(selectedDrink: Drink): OrderProcessing {
    return new ReadyToPlaceOrderProcessing(
      selectedDrink,
      this.priceTable,
      this.getMoney(),
      this.getSpoonsOfSugars(),
      this.isExtraHot(),
      this.drinkMakerDriver
    );
  }

  selectExtraHot(): OrderProcessing {
    this.setExtraHot(true)
    return this;
  }

  private missingDrinkSelectionMessage(): string {
    return "Select a drink, please";
  }
}

class ReadyToPlaceOrderProcessing extends OrderProcessing {
  private selectedDrink: Drink;
  private readonly drinkMakerDriver: DrinkMakerDriver;
  private readonly priceTable: Record<Drink, number>;

  constructor(selectedDrink: Drink,
              priceTable: Record<Drink, number>,
              money: number,
              spoonsOfSugars: number,
              extraHot: boolean,
              drinkMakerDriver: DrinkMakerDriver) {
    super(money, spoonsOfSugars, extraHot);
    this.restrictExtraHot(selectedDrink);
    this.selectedDrink = selectedDrink;
    this.drinkMakerDriver = drinkMakerDriver
    this.priceTable = priceTable;
  }

  placeOrder(): OrderProcessing {
    if (!this.isThereEnoughMoney()) {
      this.drinkMakerDriver.notifyUser(this.composeMissingMoneyMessage());
      return this;
    }
    this.drinkMakerDriver.make(this.createOrder(this.selectedDrink));
    return OrderProcessing.start(this.priceTable, this.drinkMakerDriver);
  }

  selectDrink(selectedDrink: Drink): OrderProcessing {
    this.selectedDrink = selectedDrink;
    return this;
  }

  selectExtraHot(): OrderProcessing {
    this.setExtraHot(true);
    this.restrictExtraHot(this.selectedDrink);
    return this;
  }

  private createOrder(selectedDrink: Drink): Order {
    return new Order(selectedDrink, this.isExtraHot(), this.getSpoonsOfSugars())
  }

  private restrictExtraHot(selectedDrink: Drink): void {
    if (selectedDrink === Drink.OrangeJuice) {
      this.setExtraHot(false);
    }
  }

  private isThereEnoughMoney(): boolean {
    return this.getMoney() >= this.getSelectedDrinkPrice(this.selectedDrink);
  }

  private composeMissingMoneyMessage(): string {
    const missingMoney = this.computeMissingMoney();
    return ` not enough money (${(missingMoney.toFixed(1))} missing)`;
  }

  private computeMissingMoney(): number {
    return this.getSelectedDrinkPrice(this.selectedDrink) - this.getMoney();
  }

  private getSelectedDrinkPrice(selectedDrink: Drink): number {
    return this.priceTable[selectedDrink];
  }
}

