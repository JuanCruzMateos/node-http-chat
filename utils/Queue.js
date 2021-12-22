class Queue {
    constructor() {
        this._data = [];
    }

    peek() {
        if (this._data.length > 0) {
            return this._data[0];
        } else {
            return null;
        }
    }

    push(stuff) {
        this._data.push(stuff);
    }


    pop() {
        if (this._data.length > 0) {
            return this._data.shift();
        } else {
            return null;
        }
    }

    toString() {
        let str = "[ ";
        this._data.forEach(item => {
            str += item + " "
        });
        return str + "]";
    }
}
