$(function () {
    let form = document.getElementById("automata");
    let n;              // numero de estados
    let alphabet;       // alfabeto
    let automaton;      // objeto que contiene al automata generado

    // Al hacer click sobre boton 'Generar tabla' mostrar la tabla
    $('#generar-tabla').on('click', function (e) {
        let markup = genTableMarkup();
        $('#tabla').html(markup);
        $('#tabla-transicion').fadeIn('slow');
        $('#tabla-transicion').removeClass('d-none')
    });

    // Si el usuario se coloca de nuevo en los inputs numero de estados o alfabeto ocultar tabla
    $('#input_num_estados, #input_alfabeto').focus(function(e) {
        if(!$('#tabla-transicion').hasClass('d-none')) {
            $('#tabla-transicion').fadeOut('slow');
        }
    })

    // Al enfocar input para validad cadena, chequear que todos los inputs sean validos
    // Si todos los inputs son válidos, generar automata mediante la clase DFA
    $('#input-cadena').on('focus', function (e) {
        $hiddenSubmit = $("#submit-hidden");
        for (let i = 0; i < form.elements.length - 2; i++) {
            if (!form.elements[i].checkValidity()) {
                $hiddenSubmit.click();
                return;
            }
        }

        n = parseInt($('#input_num_estados').val());
        alphabet = $('#input_alfabeto').val();
        let symbolsToRead = n * alphabet.length + 2 + n;    // numbero de simbolos a leer
        let input = [];                                     // este array contiene el input para el automata

        for (let i = 0; i < form.elements.length; i++)
            input[i] = form.elements[i].value;

        automaton = new DFA(input.slice(0, symbolsToRead).reverse());
        console.log(automaton.next);
    })

    // Al activar evento keyup, simular el input ingresado en Validar Cadena
    // y mostrar si es valido o no.
    $("#input-cadena").on("keyup", function (e) {
        let testExpression = $('#input-cadena').val();
        let result = automaton.simulate(testExpression);
        $("#mensaje").removeClass('d-none').text(result);
    })

    $('#input-cadena').on("blur", function (e) {
        $("#mensaje").addClass('d-none').text('');
        console.log("lose focus");
    });

    // Funciones para generar el HTML dinamico dependiendo de estados y alfabeto ingresado
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