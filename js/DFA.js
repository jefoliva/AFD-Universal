class DFA {
    constructor(input) {
        this.action = [];
        this.next = [];

        let n = input.shift();
        let alphabet = input.shift();

        for (let state = 0; state < n; state++) {
            this.action[state] = input.shift();
            this.next[state] = new Map();
            for (let i = 0; i < alphabet.length; i++)
                this.next[state].set(alphabet[i], input.shift());
        }
    }

    simulate(input) {
        let state = 0;
        for (let i = 0; i < input.length; i++) {
            state = this.next[state].get(input[i]);
        }
        return this.action[state];
    }
}