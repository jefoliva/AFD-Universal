$(function () {
    let form = document.getElementById("automata");
    let n;              // numero de estados
    let alphabet;       // alfabeto
    let automaton;      // objeto que contiene al automata generado
    let tabs = $('#tabs');
    tabs.hide();

    // Al hacer click sobre boton 'Generar tabla' mostrar la tabla
    $('#generar-tabla').on('click', function (e) {
        let markup = genTableMarkup();
        $('#tabla').html(markup);
        $('#tabla-transicion').fadeIn('slow');
        $('#tabla-transicion').removeClass('d-none');
    });

    // Si el usuario se coloca de nuevo en los inputs numero de estados o alfabeto ocultar tabla
    $('#input_num_estados, #input_alfabeto').focus(function (e) {
        if (!$('#tabla-transicion').hasClass('d-none')) {
            $('#tabla-transicion, #tabs').fadeOut('slow');
            $('#input-cadena').val('');
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
        } else if(result === 'INVALIDO') {
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

        for(let i = 0; i < rectList.length; i++) {
            let index = parseInt(textList[i].textContent.substring(1), 10);

            if(automaton.action[index] === "SI") {
                rectList[i].setAttribute("style", "outline: 1px double #333; outline-offset: -7px;");
            }
        }
    }

    // Funciones para generar el HTML dinamico dependiendo de estados y alfabeto ingresado
    function genTableMarkup() {
        let n = form.elements[0].value;   // numero de estados
        let alphabet = form.elements[1].value;

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