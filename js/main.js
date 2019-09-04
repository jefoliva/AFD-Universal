$(function () {
    let elForm = document.getElementById("automata");
    let n;                              // numero de estados
    let alphabet;                       // alfabeto
    let automaton;                      // objeto que contiene al automata generado
    let examples = loadExamples();      // HashMap que contiene automatas de ejemplo      
    let tabs = $('#tabs');
    tabs.hide();

    // Al hacer click sobre boton 'Generar tabla' mostrar la tabla
    $('#generar-tabla').on('click', function (e) {
        showDinamicTable();
    });

    // Si el usuario se coloca de nuevo en los inputs numero de estados o alfabeto ocultar tabla
    $('#input_num_estados, #input_alfabeto').focus(function (e) {
        if (!$('#tabla-transicion').hasClass('d-none')) {
            $('#tabla-transicion, #tabs').fadeOut('slow');
            $('#input-cadena').val('');
        }
    })

    $('#ejemplos').on('click', 'a', function(e) {
        exampleID = $(this).attr('id');
        selectedExample = examples.get(exampleID);
        $('#input_num_estados').val(selectedExample.automata[0]);
        $('#input_alfabeto').val(selectedExample.automata[1]);
        showDinamicTable();

        for(let i = 2; i < selectedExample.automata.length; i++) {
            elForm.elements[i].value = selectedExample.automata[i];
        }

        let markupValidStrings = 'Cadenas Válidas: ';
        let markupInvalidStrings = 'Cadenas Inválidas: ';

        selectedExample.validStrings.forEach(function(element) {
            markupValidStrings += `<code class="ml-3">${element}</code>`;
        });

        selectedExample.invalidStrings.forEach(function(element) {
            markupInvalidStrings += `<code class="ml-3">${element}</code>`;
        });

        $('#ejemplos-cadenas').fadeIn('slow');
        document.getElementById('cadenas-validas').innerHTML = markupValidStrings;
        document.getElementById('cadenas-invalidas').innerHTML = markupInvalidStrings;
    });

    // Al enfocar input para validad cadena, chequear que todos los inputs sean validos
    // Si todos los inputs son válidos, generar automata mediante la clase DFA
    $('#input-cadena').on('focus', function (e) {
        $hiddenSubmit = $("#submit-hidden");
        for (let i = 0; i < elForm.elements.length - 2; i++) {
            if (!elForm.elements[i].checkValidity()) {
                $hiddenSubmit.click();
                return;
            }
        }

        n = parseInt($('#input_num_estados').val());
        alphabet = $('#input_alfabeto').val();
        let symbolsToRead = n * alphabet.length + 2 + n;    // numbero de simbolos a leer
        let input = [];                                     // este array contiene el input para el automata

        for (let i = 0; i < elForm.elements.length; i++)
            input[i] = elForm.elements[i].value;

        automaton = new DFA(input.slice(0, symbolsToRead).reverse());

        tabs.fadeIn('slow');
        genGraph();
        $('#nav-dot').html(`<pre><code>${genDotFile()}</code></pre>`);

        console.log(genDotFile());
    })

    // Al activar evento keyup, simular el input ingresado en Validar Cadena
    // y mostrar si es valido o no.
    $("#input-cadena").on("keyup", function (e) {
        let inputCadena = $('#input-cadena');
        let inputBadge = $('#input-badge');
        let testExpression = inputCadena.val();
        let result = automaton.simulate(testExpression);

        if (result === 'VALIDO') {
            inputCadena.css('background-color', 'rgba(92, 184, 92, 0.2)');
            inputBadge.attr("class", "badge badge-success");
        } else if (result === 'INVALIDO') {
            inputCadena.css('background-color', 'rgba(217, 83, 79, 0.2)');
            inputBadge.attr("class", "badge badge-danger");
        } else {
            inputCadena.css('background-color', 'rgba(295, 193, 7, 0.2)');
            inputBadge.attr("class", "badge badge-warning");
        }

        $("#input-badge").text(result);
    })

    $('#input-cadena').on("blur", function (e) {
        $("#input-badge").attr('class', '').text('');
        $('#input-cadena').css('background-color', 'white')
    });

    function loadExamples() {
        let examples = new Map();

        let evenZerosAndOnes = {
            validStrings: ["0110", "11111111", "1010101010"],
            invalidStrings: ["11110", "000001", "010101"],
            automata: [
                "4", "01",
                "SI", 2, 1,
                "NO", 3, 0,
                "NO", 0, 3,
                "NO", 1, 2
            ]
        }

        let DNASequence = {
            validStrings: ["ATGTCTCTTTAG", "ATGCCTCCTCCTTTCTAA", "ATGTAA"],
            invalidStrings: ["ATGCCTCTTGA", "ATGAAATAATAA"],
            automata: [
                "11", "ATCG",
                "NO", 1, 10, 10, 10,
                "NO", 10, 2, 10, 10,
                "NO", 10, 10, 10, 3,
                "NO", 4, 6, 4, 4,
                "NO", 5, 5, 5, 5,
                "NO", 3, 3, 3, 3,
                "NO", 7, 5, 5, 8,
                "NO", 9, 3, 3, 9,
                "NO", 9, 3, 3, 3,
                "SI", 10, 10, 10, 10,
                "NO", 10, 10, 10, 10
            ]
        };

        let realNumbers = {
            validStrings: ["2234.34E-3", "875E+3", "123.34"],
            invalidStrings: ["2234.E2", "2222.", "6543-E38"],
            automata: [
                "9", "0123456789-+E.",
                "NO", 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 7, 7,
                "NO", 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 7,
                "SI", 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 3,
                "SI", 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7,
                "NO", 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 7, 7,
                "SI", 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7,
                "NO", 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7,
                "NO", 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
                "SI", 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 4, 7
            ]
        };

        examples.set("evenZerosAndOnes", evenZerosAndOnes);
        examples.set("DNASequence", DNASequence);
        examples.set("realNumbers", realNumbers);

        return examples;
    }

    function genGraph() {
        var g = graphlibDot.parse(genDotFile());

        // Renderizar objeto graphlib usando D3
        var renderer = new dagreD3.Renderer();
        renderer.run(g, d3.select("svg g"));

        // Cambiar tamaño del SVG de acuerdo al contenido
        var svg = document.querySelector('#graphContainer');
        var bbox = svg.getBBox();
        svg.style.width = bbox.width + 40.0 + "px";
        svg.style.height = bbox.height + 40.0 + "px";

        let rectList = document.querySelectorAll('g.node rect');
        let textList = document.querySelectorAll('g.node tspan');

        for (let i = 0; i < rectList.length; i++) {
            let index = parseInt(textList[i].textContent.substring(1), 10);

            if (automaton.action[index] === "SI") {
                rectList[i].setAttribute("style", "outline: 1px double #333; outline-offset: -7px;");
            }
        }
    }

    function showDinamicTable() {
        let markup = genTableMarkup();
        $('#tabla').html(markup);
        $('#tabla-transicion').hide().fadeIn('slow');
        $('#tabla-transicion').removeClass('d-none');
        $('#ejemplos-cadenas').hide();
    }

    // Funciones para generar el HTML dinamico dependiendo de estados y alfabeto ingresado
    function genTableMarkup() {
        let n = elForm.elements[0].value;   // numero de estados
        let alphabet = elForm.elements[1].value;

        let markup = `
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">EDA</th>
                ${genTableHeaders(alphabet)}
            </tr>
        </thead>
        <tbody>
            ${genTableBody(alphabet, n)}
        </tbody>
        `;
        return markup;
    }

    function genTableHeaders(alphabet) {
        let th = '';
        for (let i = 0; i < alphabet.length; i++) {
            th += ` <th scope="col">${alphabet[i]}</th>`;
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
            `;
        }
        return columns;
    }

    // FUNCIONES PARA GENERAR EL GRAFICO MEDIANTE EL LENGUAJE DOT DE GRAPHVIZ.
    function genDotFile() {
        let text = `
        digraph fsm {
            rankdir=LR;
            size="8,5"
            node [shape = doublecircle]; ${getFinalStates()};
            node [shape = point ]; qi;
            
            node [shape = circle];
            qi -> q0;
            ${getStatesAndEdges()}           
        } 
        `;
        return text;
    }

    function getFinalStates() {
        let finalStates = '';
        for (let i = 0; i < automaton.action.length; i++) {
            if (automaton.action[i] === 'SI')
                finalStates += ` q${i}`;
        }
        return finalStates;
    }

    function getStatesAndEdges() {
        let text = '';

        for (let i = 0; i < automaton.action.length; i++) {
            let labels = new Map();
            for (let [k, v] of automaton.next[i]) {
                if (!labels.has(v))
                    labels.set(v, k);
                else
                    labels.set(v, `${labels.get(v)} ${k}`);
            }

            for (let [k, v] of labels) {
                text += `\tq${i} -> q${k} [ label = "${v}" ];\n`;
            }
        }

        return text;
    }
});