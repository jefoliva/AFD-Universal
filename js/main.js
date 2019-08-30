$(function () {
    let form = document.getElementById("automata");
    let n;   // numero de estados
    let alphabet;
    let automaton;

    // Al hacer click sobre boton 'Generar tabla' mostrar la tabla
    $('#generar-tabla').on('click', function (e) {
        let markup = genTableMarkup();
        $('#tabla').html(markup);
        $('#tabla-transicion').removeClass('d-none')
    });

    // Al enfocar input para validad cadena, chequear que todos los inputs sean validos
    $('#input-cadena').on('focus', function (e) {
        $hiddenSubmit = $("#submit-hidden");
        for (let i = 0; i < form.elements.length - 2; i++) {
            if (!form.elements[i].checkValidity()) {
                $hiddenSubmit.click();
                return;
            }
        }

        n = parseInt($('#input_num_estados').val());        // numero de estados
        alphabet = $('#input_alfabeto').val();              // alfabeto
        let symbolsToRead = n * alphabet.length + 2 + n;    // numbero de simbolos a leer
        let input = [];                                     // este array contiene el input para el automata

        let test = [3, 'ab', 'SI', '0', '1', 'NO', '1', '2', 'NO', '2', '0']

        for (let i = 0; i < form.elements.length; i++)
            input[i] = form.elements[i].value;

        console.log(input);
        
        console.log(`simbolsToRead typeof(): ${typeof (symbolsToRead)}`);
        console.log(`simbolsToRead: ${symbolsToRead}`);

        console.log(`\nn typeof(): ${typeof (n)}`);
        console.log(`n: ${n}`);

        console.log(`alphabet typeof(): ${typeof (alphabet)}`);
        console.log(`alphaber: ${alphabet}`);

        console.log(test.slice(0, symbolsToRead));
        automaton = new DFA(input.slice(0, symbolsToRead).reverse());
    })

    // Al activar evento keyup, mostrar si cadena ingresada es valida o invalida 
    $("#input-cadena").on("keyup", function (e) {
        let testExpression = $('#input-cadena').val();
        // console.log(testExpression);
        $("#mensaje").removeClass('d-none').text(automaton.simulate(testExpression));
    })

    $('#input-cadena').on("blur", function (e) {
        $("#mensaje").addClass('d-none').text('');
        console.log("lose focus");
    });

    function genTableMarkup() {
        let n = form.elements[0].value;   // numero de estados
        let alphabet = form.elements[1].value;

        let markup = `
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">EDC</th>
                ${genTableHeaders(alphabet)}
            </tr>
        </thead>
        <tbody>
            ${genTableBody(alphabet, n)}
        </tbody>
        `
        return markup;
    }

    function genTableHeaders(alphabet) {
        let th = '';
        for (let i = 0; i < alphabet.length; i++) {
            th += ` <th scope="col">${alphabet[i]}</th>`
        }
        return th;
    }

    function genTableBody(alphabet, n) {
        let tbody = '';
        for (let i = 0; i < n; i++) {
            tbody += `
            <tr>
                <th scope="row">q
                    <sub>${i}</sub>
                </th>
                <td>
                    <select name="" id="" class="custom-select">
                        <option value="SI">SI</option>
                        <option value="NO" selected>NO</option>
                    </select>
                </td>
                ${genTableData(alphabet, n)}
            </tr>
            `;
        }
        return tbody;
    }

    function genTableData(alphabet, n) {
        let columns = '';

        for (let i = 0; i < alphabet.length; i++) {
            columns += `
            <td>
                <input type="number" class="form-control" required min=${0} max=${n - 1}>
            </td>
            `
        }
        return columns;
    }
});