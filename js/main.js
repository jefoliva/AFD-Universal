$(function() {
    let q1 = [3, 'ab', 'Yes', 0, 1, 'No', 1, 2, 'No', 2, 0];
    let automaton = new DFA(q1);

    console.log(automaton.simulate('abbb'));
    console.log(automaton.simulate('abaa'));
    console.log(automaton.simulate('abab'));
    console.log(automaton.simulate('aaababbb'));
    console.log(automaton.simulate('ababababababa'));

    let form = document.getElementById("automata");

    console.log(form.elements.length);

    $("#automata").on("submit", function (e) {
        e.preventDefault();
        arr = [];

        for (let i = 0; i < form.elements.length; i++)
            arr[i] = form.elements[i].value;

        console.log(arr);
    })
});