class DFA {
    constructor(input) {
        this.action = [];
        this.next = [];

        let n = input.pop();
        let alphabet = input.pop();

        for (let state = 0; state < n; state++) {
            this.action[state] = input.pop();
            this.next[state] = new Map();
            for (let i = 0; i < alphabet.length; i++)
                this.next[state].set(alphabet[i], input.pop());
        }
    }

    simulate(input) {
        if(input.trim().length == 0)
            return "INVALIDO";
         
        let state = 0;
        for (let i = 0; i < input.length; i++) {

            if(this.next[state].has(input[i]))
                state = this.next[state].get(input[i]);
            else
                return "Error, Caracter Invalido: " + input[i];
        }

        return this.action[state] === "SI" ? "VALIDO" : "INVALIDO";
    }
}