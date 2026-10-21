// =====================================================
// GALPÃO SENAI 3D
// VERSÃO 4 - ESTRUTURA COMPLETA
// =====================================================


// =====================================================
// CONFIGURAÇÕES DO AMBIENTE
// =====================================================

const CONFIG = {

    // Galpão principal
    largura: 15,
    comprimento: 18,
    alturaGalpao: 8,

    // Construções internas
    alturaConstrucoes: 2.5,

    // Área externa superior
    larguraExterna: 15,
    comprimentoExterno: 4,

    // Extensão inferior
    larguraExtensao: 8,
    comprimentoExtensao: 12,

    // Paredes
    espessuraParede: 0.20,

    // Jogador
    alturaCamera: 1.6

};


// =====================================================
// CORES
// =====================================================

const COR = {

    concreto: "#858585",

    concretoClaro: "#B0B0B0",

    concretoEscuro: "#666666",

    tijolo: "#A65338",

    tijoloClaro: "#B96747",

    tijoloEscuro: "#82412D",

    grama: "#4F873A",

    amarelo: "#FFD500",

    preto: "#151515",

    metal: "#555555",

    madeira: "#936A42",

    vidro: "#75B4CD",

    branco: "#FFFFFF"

};


// =====================================================
// INICIAR AMBIENTE
// =====================================================

function iniciarAmbiente() {

    const cenario = document.querySelector("#cenario");

    const status = document.querySelector("#status");

    if (!cenario) {

        console.error("ERRO: cenário não encontrado!");

        return;

    }

    // Evita duplicação
    cenario.innerHTML = "";

    console.log("Iniciando Galpão SENAI 3D...");


    // =================================================
    // FUNÇÃO CRIAR BLOCO
    // =================================================

    function bloco(
        x, y, z,
        largura, altura, profundidade,
        cor
    ) {

        const objeto = document.createElement("a-box");

        objeto.setAttribute(
            "position",
            `${x} ${y} ${z}`
        );

        objeto.setAttribute("width", largura);

        objeto.setAttribute("height", altura);

        objeto.setAttribute("depth", profundidade);

        objeto.setAttribute("color", cor);

        objeto.setAttribute(
            "material",
            "roughness: 0.9; metalness: 0"
        );

        cenario.appendChild(objeto);

        return objeto;

    }


    // =================================================
    // FUNÇÃO CRIAR CILINDRO
    // =================================================

    function cilindro(
        x, y, z,
        raio, altura,
        cor
    ) {

        const objeto = document.createElement("a-cylinder");

        objeto.setAttribute(
            "position",
            `${x} ${y} ${z}`
        );

        objeto.setAttribute("radius", raio);

        objeto.setAttribute("height", altura);

        objeto.setAttribute("color", cor);

        cenario.appendChild(objeto);

        return objeto;

    }


    // =================================================
    // FUNÇÃO CRIAR ESFERA
    // =================================================

    function esfera(
        x, y, z,
        raio,
        cor
    ) {

        const objeto = document.createElement("a-sphere");

        objeto.setAttribute(
            "position",
            `${x} ${y} ${z}`
        );

        objeto.setAttribute("radius", raio);

        objeto.setAttribute("color", cor);

        cenario.appendChild(objeto);

        return objeto;

    }


    // =================================================
    // FUNÇÃO CRIAR TEXTO
    // =================================================

    function texto(
        conteudo,
        x, y, z,
        rotacao = "0 0 0",
        cor = "#FFFFFF"
    ) {

        const objeto = document.createElement("a-text");

        objeto.setAttribute("value", conteudo);

        objeto.setAttribute(
            "position",
            `${x} ${y} ${z}`
        );

        objeto.setAttribute("rotation", rotacao);

        objeto.setAttribute("align", "center");

        objeto.setAttribute("color", cor);

        objeto.setAttribute("width", 5);

        cenario.appendChild(objeto);

        return objeto;

    }


    // =================================================
    // FUNÇÃO PAREDE HORIZONTAL
    // =================================================

    function paredeX(
        x,
        z,
        comprimento,
        altura,
        cor
    ) {

        return bloco(
            x,
            altura / 2,
            z,
            comprimento,
            altura,
            CONFIG.espessuraParede,
            cor
        );

    }


    // =================================================
    // FUNÇÃO PAREDE VERTICAL
    // =================================================

    function paredeZ(
        x,
        z,
        comprimento,
        altura,
        cor
    ) {

        return bloco(
            x,
            altura / 2,
            z,
            CONFIG.espessuraParede,
            altura,
            comprimento,
            cor
        );

    }


    // =================================================
    // 1 - TERRENO EXTERNO
    // =================================================

    // Grama ao redor de todo o galpão.
    // Fica abaixo do piso de concreto.

    bloco(
        0,
        -0.35,
        0,
        200,
        0.30,
        200,
        COR.grama
    );


    // =================================================
    // 2 - PISO PRINCIPAL
    // =================================================

    // Galpão de 15 x 18 metros.

    bloco(
        0,
        -0.10,
        0,
        CONFIG.largura,
        0.20,
        CONFIG.comprimento,
        COR.concreto
    );


    // =================================================
    // 3 - ÁREA EXTERNA SUPERIOR
    // =================================================

    // 15 metros de largura.
    // 4 metros de comprimento.
    //
    // Totalmente concretada.
    // Sem paredes externas.
    // Sem cobertura.
    //
    // Localização:
    // Z = -9 até Z = -13.

    bloco(
        0,
        -0.10,
        -11,
        CONFIG.larguraExterna,
        0.20,
        CONFIG.comprimentoExterno,
        "#999999"
    );


    // =================================================
    // 4 - EXTENSÃO INFERIOR
    // =================================================

    // IMPORTANTE:
    //
    // 8 metros de largura.
    // 12 metros de comprimento.
    //
    // O comprimento cresce no eixo Z.
    //
    // Início: Z = 9
    // Final:  Z = 21
    //
    // Dois compartimentos lado a lado.

    bloco(
        3.5,
        -0.10,
        15,
        CONFIG.larguraExtensao,
        0.20,
        CONFIG.comprimentoExtensao,
        COR.concreto
    );


    // =================================================
    // 5 - PAREDES EXTERNAS DO GALPÃO
    // =================================================

    // Parede esquerda
    paredeZ(
        -7.5,
        0,
        18,
        CONFIG.alturaGalpao,
        COR.tijolo
    );

    // Parede direita
    paredeZ(
        7.5,
        0,
        18,
        CONFIG.alturaGalpao,
        COR.tijolo
    );


    // =================================================
    // 6 - PAREDE SUPERIOR COM PORTÃO ABERTO
    // =================================================

    // Divide o galpão da área externa.
    //
    // Portão central aberto.
    // Abertura de 3 metros.

    paredeX(
        -4.5,
        -9,
        6,
        8,
        COR.tijolo
    );

    paredeX(
        4.5,
        -9,
        6,
        8,
        COR.tijolo
    );

    // Viga superior do portão
    bloco(
        0,
        7.5,
        -9,
        3,
        1,
        0.20,
        COR.concretoClaro
    );


   // =================================================
// 7 - PAREDE INFERIOR COM DUAS ENTRADAS
// =================================================

// Parede do galpão em Z = 9.
// A extensão ocupa X = -0.5 até X = 7.5.
//
// Entrada 1: corredor de saída.
// Entrada 2: depósito 3.

// Parede esquerda do galpão
paredeX(
    -4,
    9,
    7,
    8,
    COR.tijolo
);

// Parede entre as duas portas
paredeX(
    3.5,
    9,
    2,
    8,
    COR.tijolo
);

// Parede direita
paredeX(
    7,
    9,
    1,
    8,
    COR.tijolo
);

// Fechamento acima da porta do corredor
bloco(
    1,
    5.25,
    9,
    3,
    5.5,
    0.20,
    COR.tijolo
);

// Fechamento acima da porta do depósito 3
bloco(
    5.5,
    5.25,
    9,
    2,
    5.5,
    0.20,
    COR.tijolo
);

    // =================================================
    // 8 - TETO INDUSTRIAL
    // =================================================

    // Teto alto.
    // Cor cinza para lembrar concreto.

    bloco(
        0,
        8.10,
        0,
        15,
        0.20,
        18,
        COR.concretoEscuro
    );


    // =================================================
    // 9 - VIGAS DO TETO
    // =================================================

    // Sem pilares no chão.
    // Apenas vigas superiores.

    for (let z = -7; z <= 7; z += 7) {

        bloco(
            0,
            7.65,
            z,
            15,
            0.50,
            0.40,
            COR.concretoClaro
        );

    }


    // =================================================
    // 10 - JANELAS INDUSTRIAIS
    // =================================================

    function janela(
        x,
        y,
        z,
        largura,
        altura
    ) {

        // Vidro
        bloco(
            x,
            y,
            z,
            largura,
            altura,
            0.05,
            COR.vidro
        );

        // Moldura vertical
        bloco(
            x,
            y,
            z + 0.05,
            0.07,
            altura,
            0.08,
            COR.metal
        );

        // Moldura horizontal
        bloco(
            x,
            y,
            z + 0.05,
            largura,
            0.07,
            0.08,
            COR.metal
        );

    }

    // Painéis de janela na parede superior
    // (representação visual provisória)

    janela(-4, 5, -8.85, 2, 1.5);

    janela(4, 5, -8.85, 2, 1.5);


    // =================================================
    // 11 - DEPÓSITOS À ESQUERDA
    // =================================================

    // Dois depósitos.
    //
    // NÃO criar quadrados fechados.
    //
    // Apenas uma parede alta dividindo
    // os dois depósitos ao meio.
    //
    // A lateral voltada ao corredor
    // permanece aberta.

    // Parede divisória central
    paredeX(
        -5,
        0,
        5,
        8,
        COR.tijolo
    );

    // Identificação depósito superior
    texto(
        "DEPOSITO 1",
        -5,
        0.08,
        -5,
        "-90 0 0",
        "#FFFFFF"
    );

    // Identificação depósito inferior
    texto(
        "DEPOSITO 2",
        -5,
        0.08,
        5,
        "-90 0 0",
        "#FFFFFF"
    );


    // =================================================
    // 12 - CORREDOR CENTRAL
    // =================================================

    // Área livre para circulação.
    // Sem paredes laterais.

    bloco(
        0,
        0.01,
        0,
        3,
        0.02,
        17,
        "#939393"
    );

    // Linha amarela de circulação
    bloco(
        0,
        0.04,
        0,
        0.10,
        0.02,
        16,
        COR.amarelo
    );


    // =================================================
    // 13 - ÁREA DE CONSTRUÇÃO À DIREITA
    // =================================================

    // Área delimitada no piso.
    // Sem parede separando do corredor.

    bloco(
        4.5,
        0.01,
        0,
        5,
        0.02,
        16,
        "#A3A3A3"
    );

    // Bordas amarelas
    bloco(
        4.5, 0.04, -8,
        5, 0.02, 0.12,
        COR.amarelo
    );

    bloco(
        4.5, 0.04, 8,
        5, 0.02, 0.12,
        COR.amarelo
    );

    bloco(
        2, 0.04, 0,
        0.12, 0.02, 16,
        COR.amarelo
    );

    bloco(
        7, 0.04, 0,
        0.12, 0.02, 16,
        COR.amarelo
    );


    // =================================================
    // 14 - CONSTRUÇÃO INTERNA 1
    // =================================================

    // Localizada à direita.
    // Altura: 2.50 metros.

    const altura = CONFIG.alturaConstrucoes;

    // Parede esquerda
    paredeZ(
        3,
        -4,
        4,
        altura,
        COR.tijoloClaro
    );

    // Parede do fundo
    paredeX(
        5,
        -6,
        4,
        altura,
        COR.tijoloClaro
    );

    // Parede direita
    paredeZ(
        7,
        -4,
        4,
        altura,
        COR.tijoloClaro
    );

    // Frente com abertura
    paredeX(
        3.6,
        -2,
        1.2,
        altura,
        COR.tijoloClaro
    );

    paredeX(
        6.4,
        -2,
        1.2,
        altura,
        COR.tijoloClaro
    );

    // Parte acima da porta
    bloco(
        5,
        2.3,
        -2,
        1.6,
        0.4,
        0.20,
        COR.tijoloClaro
    );


    // =================================================
    // 15 - CONSTRUÇÃO INTERNA 2
    // =================================================

    // Segunda estrutura de alvenaria.

    paredeZ(
        3,
        3,
        4,
        altura,
        COR.tijoloClaro
    );

    paredeX(
        5,
        1,
        4,
        altura,
        COR.tijoloClaro
    );

    paredeZ(
        7,
        3,
        4,
        altura,
        COR.tijoloClaro
    );

    // Frente com abertura
    paredeX(
        3.6,
        5,
        1.2,
        altura,
        COR.tijoloClaro
    );

    paredeX(
        6.4,
        5,
        1.2,
        altura,
        COR.tijoloClaro
    );

    bloco(
        5,
        2.3,
        5,
        1.6,
        0.4,
        0.20,
        COR.tijoloClaro
    );


    // =================================================
    // 16 - EXTENSÃO INFERIOR - PAREDES
    // =================================================

    // Dois compartimentos.
    //
    // Compartimento esquerdo:
    // Corredor de saída.
    //
    // Compartimento direito:
    // Depósito 3.
    //
    // Ambos possuem 12 metros de comprimento.

    // Parede externa esquerda
    paredeZ(
        -0.5,
        15,
        12,
        3,
        COR.concretoClaro
    );

    // Parede externa direita
    paredeZ(
        7.5,
        15,
        12,
        3,
        COR.concretoClaro
    );

    // Parede inferior
    paredeX(
        3.5,
        21,
        8,
        3,
        COR.concretoClaro
    );


    // =================================================
    // 17 - DIVISÓRIA ENTRE OS COMPARTIMENTOS
    // =================================================

    // Parede longitudinal.
    // Abertura para passagem entre os espaços.

    paredeZ(
        3.5,
        11,
        4,
        3,
        COR.concretoClaro
    );

    paredeZ(
        3.5,
        18,
        6,
        3,
        COR.concretoClaro
    );

    // Viga acima da porta
    bloco(
        3.5,
        2.6,
        14.5,
        0.20,
        0.8,
        1,
        COR.concretoClaro
    );


    // =================================================
    // 18 - CORREDOR DE SAÍDA
    // =================================================

    // Lado esquerdo da extensão.

    texto(
        "CORREDOR DE SAIDA",
        1.5,
        0.08,
        16,
        "-90 0 0",
        COR.branco
    );


    // =================================================
    // 19 - DEPÓSITO 3
    // =================================================

    // Lado direito da extensão.

    texto(
        "DEPOSITO 3",
        5.5,
        0.08,
        16,
        "-90 0 0",
        COR.branco
    );


    // =================================================
    // 20 - PORTA DE SAÍDA
    // =================================================

    // Abertura na parede inferior do corredor.

    // Substitui a parte da parede do fundo
    // correspondente à saída por uma passagem.

    // A abertura visual será representada
    // por uma porta metálica provisória.

    bloco(
        1.5,
        1.1,
        20.85,
        1.5,
        2.2,
        0.05,
        COR.metal
    );


    // =================================================
    // 21 - CAIXAS DO DEPÓSITO 1
    // =================================================

    bloco(
        -6,
        0.5,
        -7,
        1,
        1,
        1,
        COR.madeira
    );

    bloco(
        -5,
        0.5,
        -7,
        1,
        1,
        1,
        COR.madeira
    );

    bloco(
        -6,
        1.5,
        -7,
        1,
        1,
        1,
        COR.madeira
    );

    bloco(
        -5,
        1.5,
        -7,
        1,
        1,
        1,
        COR.madeira
    );


    // =================================================
    // 22 - CAIXAS DO DEPÓSITO 2
    // =================================================

    bloco(
        -6,
        0.5,
        6,
        1,
        1,
        1,
        COR.madeira
    );

    bloco(
        -5,
        0.5,
        6,
        1,
        1,
        1,
        COR.madeira
    );

    bloco(
        -6,
        1.5,
        6,
        1,
        1,
        1,
        COR.madeira
    );


    // =================================================
    // 23 - PRATELEIRAS
    // =================================================

    function prateleira(x, z) {

        // Estrutura vertical
        bloco(
            x - 0.8,
            1.2,
            z,
            0.10,
            2.4,
            0.8,
            COR.metal
        );

        bloco(
            x + 0.8,
            1.2,
            z,
            0.10,
            2.4,
            0.8,
            COR.metal
        );

        // Prateleira inferior
        bloco(
            x,
            0.5,
            z,
            1.7,
            0.10,
            0.8,
            COR.metal
        );

        // Prateleira central
        bloco(
            x,
            1.3,
            z,
            1.7,
            0.10,
            0.8,
            COR.metal
        );

        // Prateleira superior
        bloco(
            x,
            2.1,
            z,
            1.7,
            0.10,
            0.8,
            COR.metal
        );

    }

    prateleira(-5.5, -4);

    prateleira(-5.5, 3);


    // =================================================
    // 24 - BANCADA DE TRABALHO
    // =================================================

    bloco(
        4.5,
        0.9,
        6,
        2,
        0.15,
        0.9,
        COR.madeira
    );

    // Pernas
    bloco(
        3.7,
        0.45,
        5.6,
        0.12,
        0.9,
        0.12,
        COR.metal
    );

    bloco(
        5.3,
        0.45,
        5.6,
        0.12,
        0.9,
        0.12,
        COR.metal
    );

    bloco(
        3.7,
        0.45,
        6.4,
        0.12,
        0.9,
        0.12,
        COR.metal
    );

    bloco(
        5.3,
        0.45,
        6.4,
        0.12,
        0.9,
        0.12,
        COR.metal
    );


    // =================================================
    // 25 - BETONEIRA PROVISÓRIA
    // =================================================

    // Base
    bloco(
        5,
        0.35,
        -7,
        1.3,
        0.15,
        1.2,
        COR.metal
    );

    // Tambor
    cilindro(
        5,
        1.1,
        -7,
        0.55,
        1,
        COR.amarelo
    );

    // Rodas
    cilindro(
        4.4,
        0.25,
        -7,
        0.25,
        0.15,
        COR.preto
    );

    cilindro(
        5.6,
        0.25,
        -7,
        0.25,
        0.15,
        COR.preto
    );


    // =================================================
    // 26 - MATERIAIS NA ÁREA EXTERNA
    // =================================================

    // Tijolos empilhados no pátio superior.

    for (let linha = 0; linha < 3; linha++) {

        for (let coluna = 0; coluna < 5; coluna++) {

            bloco(
                -5 + coluna * 0.45,
                0.15 + linha * 0.30,
                -11,
                0.40,
                0.28,
                0.25,
                COR.tijolo
            );

        }

    }

    // Paletes
    bloco(
        4,
        0.10,
        -11,
        2,
        0.20,
        1,
        COR.madeira
    );

    bloco(
        4,
        0.35,
        -11,
        1.5,
        0.30,
        0.8,
        COR.tijoloClaro
    );


    // =================================================
    // 27 - LUMINÁRIAS INDUSTRIAIS
    // =================================================

    function luminaria(x, z) {

        // Estrutura da luminária
        bloco(
            x,
            7.3,
            z,
            2,
            0.10,
            0.35,
            "#E5E5E5"
        );

        // Luz
        const luz = document.createElement("a-light");

        luz.setAttribute("type", "point");

        luz.setAttribute(
            "position",
            `${x} 7 ${z}`
        );

        luz.setAttribute("intensity", "0.35");

        luz.setAttribute("distance", "12");

        luz.setAttribute("color", "#FFFFFF");

        cenario.appendChild(luz);

    }

    luminaria(-4, -5);

    luminaria(4, -5);

    luminaria(-4, 4);

    luminaria(4, 4);


    // =================================================
    // 28 - MARCAÇÕES DE SEGURANÇA
    // =================================================

    // Faixas amarelas no piso.

    bloco(
        0,
        0.05,
        -8,
        3,
        0.02,
        0.12,
        COR.amarelo
    );

    bloco(
        0,
        0.05,
        8,
        3,
        0.02,
        0.12,
        COR.amarelo
    );

    // Marcação na entrada da extensão
    bloco(
        1,
        0.05,
        9,
        3,
        0.02,
        0.20,
        COR.amarelo
    );


    // =================================================
    // 29 - POSIÇÃO INICIAL DO JOGADOR
    // =================================================

    const jogador = document.querySelector("#jogador");

    if (jogador) {

        jogador.setAttribute(
            "position",
            "0 0 5"
        );

    }


    // =================================================
    // 30 - FINALIZAÇÃO
    // =================================================

    if (status) {

        status.textContent =
            "Galpão SENAI 3D carregado!";

    }

    console.log(
        "GALPÃO SENAI - VERSÃO 4 CARREGADA!"
    );

}


// =====================================================
// AGUARDAR CARREGAMENTO DA CENA
// =====================================================

function prepararAmbiente() {

    const cena = document.querySelector("#cena");

    if (!cena) {

        console.error("Cena A-Frame não encontrada!");

        return;

    }

    if (cena.hasLoaded) {

        iniciarAmbiente();

    } else {

        cena.addEventListener(
            "loaded",
            iniciarAmbiente,
            { once: true }
        );

    }

}


// =====================================================
// INICIALIZAÇÃO DO DOCUMENTO
// =====================================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        prepararAmbiente
    );

} else {

    prepararAmbiente();

}