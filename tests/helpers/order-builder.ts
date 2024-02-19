import { Drink } from "../../src/drink";
import { Order } from "../../src/order";

export function aCoffee(): OrderInfoBuilder {
    return new OrderInfoBuilder(Drink.Coffee);
};

export function aTea(): OrderInfoBuilder {
    return new OrderInfoBuilder(Drink.Tea);
};

export function aHotChocolate(): OrderInfoBuilder {
    return new OrderInfoBuilder(Drink.Chocolate);
};

export function anOrangeJuice(): OrderInfoBuilder {
    return new OrderInfoBuilder(Drink.OrangeJuice);
};

class OrderInfoBuilder {
    private readonly _selectedDrink: Drink;
    private _spoonsOfSugars: number;
    private _extraHot: boolean;

    constructor(selectedDrink: Drink) {
        this._selectedDrink = selectedDrink;
        this._extraHot = false;
        this._spoonsOfSugars = 0;
    }

    make(): Order {
        return new Order(this._selectedDrink, this._extraHot, this._spoonsOfSugars);
    }
    withSpoonsOfSugar(spoonsOfSugar: number): OrderInfoBuilder {
        this._spoonsOfSugars = spoonsOfSugar;
        return this;
    }

    extraHot(): OrderInfoBuilder {
        this._extraHot = true;
        return this;
    }
}