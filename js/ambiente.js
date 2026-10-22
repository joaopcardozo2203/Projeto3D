// ============================================================
// CONSTRUÇÃO CIVIL 3D - V8
// AMBIENTE.JS COMPLETO E CORRIGIDO
// ============================================================

// ============================================================
// 1. CONFIGURAÇÕES
// ============================================================

const CONFIG = {
    largura: 15,
    comprimento: 18,
    altura: 8,
    alturaBaixa: 2.5,
    velocidade: 3.5,
    velocidadeCorrida: 6,
    raioJogador: 0.28
};

const CORES = {
    concreto: "#999999",
    concretoClaro: "#B8B8B8",
    concretoEscuro: "#666666",
    grama: "#568C42",
    tijolo: "#AD563A",
    madeira: "#93673E",
    metal: "#6D7882",
    telhado: "#65747F",
    amarelo: "#FFD400",
    branco: "#FFFFFF"
};

let cena;
let cenario;
let jogador;
let camera;

const OBSTACULOS = [];
const PORTAS = [];

const TECLAS = {
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false
};

const JOYSTICK = {
    x: 0,
    y: 0
};

// ============================================================
// 2. CRIAÇÃO DE ELEMENTOS
// ============================================================

function entidade(tipo, atributos = {}, pai = cenario) {
    const elemento = document.createElement(tipo);

    Object.entries(atributos).forEach(([chave, valor]) => {
        elemento.setAttribute(chave, valor);
    });

    pai.appendChild(elemento);

    return elemento;
}

function bloco(
    x, y, z,
    largura, altura, profundidade,
    cor = CORES.concreto,
    solido = true,
    pai = cenario
) {
    const elemento = entidade("a-box", {
        position: `${x} ${y} ${z}`,
        width: largura,
        height: altura,
        depth: profundidade,
        material: `color: ${cor}; roughness: 0.85`
    }, pai);

    if (solido) {
        OBSTACULOS.push({
            x,
            y,
            z,
            largura,
            altura,
            profundidade
        });
    }

    return elemento;
}

function paredeX(
    inicio,
    fim,
    z,
    altura = CONFIG.altura,
    cor = CORES.concreto
) {
    return bloco(
        (inicio + fim) / 2,
        altura / 2,
        z,
        fim - inicio,
        altura,
        0.2,
        cor
    );
}

function paredeZ(
    x,
    inicio,
    fim,
    altura = CONFIG.altura,
    cor = CORES.concreto
) {
    return bloco(
        x,
        altura / 2,
        (inicio + fim) / 2,
        0.2,
        altura,
        fim - inicio,
        cor
    );
}

function piso(x, z, largura, comprimento, cor) {
    return bloco(
        x,
        -0.12,
        z,
        largura,
        0.2,
        comprimento,
        cor,
        false
    );
}

function teto(x, z, largura, comprimento, altura) {
    return bloco(
        x,
        altura,
        z,
        largura,
        0.2,
        comprimento,
        CORES.telhado,
        false
    );
}

function texto(valor, x, y, z, largura = 3, rotacao = 0) {
    return entidade("a-text", {
        value: valor,
        position: `${x} ${y} ${z}`,
        rotation: `0 ${rotacao} 0`,
        align: "center",
        color: CORES.branco,
        width: largura,
        side: "double"
    });
}

// ============================================================
// 3. TERRENO E PISOS
// ============================================================

function criarTerreno() {
    // Grama abaixo do concreto para não piscar.
    entidade("a-plane", {
        position: "0 -0.35 4",
        rotation: "-90 0 0",
        width: 90,
        height: 90,
        material: `color: ${CORES.grama}; roughness: 1`
    });
}

function criarPisos() {
    // Galpão principal: 15 x 18 metros.
    piso(0, 0, 15, 18, CORES.concreto);

    // Área externa dos tijolos: 15 x 4 metros.
    piso(0, -11, 15, 4, CORES.concretoClaro);

    // Extensão posterior: 8 x 12 metros.
    piso(3.5, 15, 8, 12, CORES.concretoClaro);

    // Saída do corredor.
    piso(1.5, 22.5, 3, 3, CORES.concretoClaro);
}

// ============================================================
// 4. GALPÃO PRINCIPAL
// ============================================================

function criarGalpao() {
    // Paredes laterais.
    paredeZ(-7.5, -9, 9);
    paredeZ(7.5, -9, 9);

    // Frente do galpão.
    // Portão central aberto.
    paredeX(-7.5, -4, -9);
    paredeX(4, 7.5, -9);

    // Viga acima do portão.
    bloco(
        0, 6.5, -9,
        8, 3, 0.2,
        CORES.concretoEscuro
    );

    // Parede traseira com entrada para corredor
    // e entrada independente para o Depósito 3.
    paredeX(-7.5, -0.5, 9);
    paredeX(2.5, 4.5, 9);
    paredeX(6.5, 7.5, 9);

    // Fechamento acima da entrada do corredor.
    bloco(
        1, 5.1, 9,
        3, 5.8, 0.2,
        CORES.concreto
    );

    // Fechamento acima da entrada do Depósito 3.
    bloco(
        5.5, 5.1, 9,
        2, 5.8, 0.2,
        CORES.concreto
    );

    // TELHADO PRINCIPAL.
    teto(0, 0, 15.4, 18.4, 8.15);

    // Vigas do telhado.
    for (let z = -7.5; z <= 7.5; z += 3) {
        bloco(
            0, 7.85, z,
            15, 0.2, 0.2,
            CORES.metal,
            false
        );
    }

    texto(
        "GALPAO DE CONSTRUCAO",
        0, 7.2, -9.2, 8
    );
}

// ============================================================
// 5. DEPÓSITOS 1 E 2
// ============================================================

function criarDepositos() {
    // IMPORTANTE:
    // NÃO existem paredes na frente dos depósitos.
    // Apenas UMA parede entre eles.

    paredeX(
        -7.5,
        -3,
        0,
        CONFIG.alturaBaixa,
        CORES.concretoClaro
    );

    texto("DEPOSITO 1", -5.2, 2.2, -4.5, 3);
    texto("DEPOSITO 2", -5.2, 2.2, 4.5, 3);
}

// ============================================================
// 6. CONSTRUÇÕES DO LADO DIREITO
// ============================================================

// ============================================================
// CONSTRUÇÕES INDIVIDUAIS DO LADO DIREITO
// ============================================================

function criarConstrucao(inicio, fim, nome) {
    const altura = 3;
    const centro = (inicio + fim) / 2;

    const corParede = "#8B8D8E";

    // Parede frontal da divisão.
    paredeX(
        3,
        7.4,
        inicio,
        altura,
        corParede
    );

    // Parede traseira da divisão.
    paredeX(
        3,
        7.4,
        fim,
        altura,
        corParede
    );

    // Parede voltada para a circulação,
    // dividida para deixar a abertura da porta.
    paredeZ(
        3,
        inicio,
        centro - 0.7,
        altura,
        corParede
    );

    paredeZ(
        3,
        centro + 0.7,
        fim,
        altura,
        corParede
    );

    // Fechamento acima da porta.
    bloco(
        3,
        2.55,
        centro,
        0.2,
        0.9,
        1.4,
        corParede
    );

    // Teto individual.
    teto(
        5.25,
        centro,
        4.3,
        fim - inicio,
        3.1
    );

    // Identificação da construção.
    texto(
        nome,
        5.2,
        2.5,
        centro,
        3
    );
}

function criarConstrucoes() {
    criarConstrucao(
        -7.5,
        -2.5,
        "CONSTRUCAO 1"
    );

    criarConstrucao(
        -2.5,
        2.5,
        "CONSTRUCAO 2"
    );

    criarConstrucao(
        2.5,
        7.5,
        "CONSTRUCAO 3"
    );
}

// ============================================================
// 7. CORREDOR E DEPÓSITO 3
// ============================================================

function criarExtensao() {
    const altura = CONFIG.alturaBaixa;

    // Paredes externas.
    paredeZ(-0.5, 9, 21, altura);
    paredeZ(7.5, 9, 21, altura);

    // Divisão entre corredor e Depósito 3.
    // Sem porta entre os dois.
    paredeZ(3.5, 9, 21, altura);

    // Fundo do Depósito 3.
    paredeX(3.5, 7.5, 21, altura);

    // Saída do corredor.
    paredeX(-0.5, 0.5, 21, altura);
    paredeX(2.5, 3.5, 21, altura);

    // Viga da saída.
    bloco(
        1.5, 2.35, 21,
        2, 0.3, 0.2,
        CORES.concreto
    );

    // Tetos baixos.
    teto(1.5, 15, 4, 12, 2.6);
    teto(5.5, 15, 4, 12, 2.6);

    texto("CORREDOR", 1.5, 2.1, 13, 3);
    texto("DEPOSITO 3", 5.5, 2.1, 13, 3);
}

// ============================================================
// 8. OBJETOS
// ============================================================

function caixa(x, z, largura = 1, altura = 0.8) {
    bloco(
        x,
        altura / 2,
        z,
        largura,
        altura,
        1,
        CORES.madeira
    );
}

function tijolos(x, z, colunas = 4, camadas = 4) {
    for (let camada = 0; camada < camadas; camada++) {
        for (let coluna = 0; coluna < colunas; coluna++) {
            bloco(
                x + coluna * 0.37,
                0.06 + camada * 0.13,
                z,
                0.35,
                0.12,
                0.18,
                CORES.tijolo
            );
        }
    }
}

function prateleira(x, z) {
    for (let nivel = 0; nivel < 4; nivel++) {
        bloco(
            x,
            0.4 + nivel * 0.55,
            z,
            2.2,
            0.1,
            0.7,
            CORES.madeira
        );
    }

    [-1, 1].forEach(dx => {
        [-0.3, 0.3].forEach(dz => {
            bloco(
                x + dx,
                1.25,
                z + dz,
                0.08,
                2.5,
                0.08,
                CORES.metal
            );
        });
    });
}

function bancada(x, z) {
    bloco(
        x, 0.85, z,
        2, 0.12, 0.8,
        CORES.madeira
    );

    [-0.85, 0.85].forEach(dx => {
        [-0.3, 0.3].forEach(dz => {
            bloco(
                x + dx,
                0.4,
                z + dz,
                0.1,
                0.8,
                0.1,
                CORES.metal
            );
        });
    });
}

function criarObjetos() {
    // Depósito 1.
    prateleira(-5.8, -7);
    caixa(-5.8, -4.5);
    tijolos(-6.5, -2.5);

    // Depósito 2.
    prateleira(-5.8, 6.5);
    caixa(-5.5, 4);
    tijolos(-6.5, 2);

    // Construções.
    bancada(5.3, -5.5);
    caixa(5.3, 0);
    bancada(5.3, 5.3);

    // Depósito 3.
    prateleira(5.5, 12);
    prateleira(5.5, 16);
    prateleira(5.5, 19);
    caixa(4.3, 14);
    caixa(6.7, 18);
    tijolos(4, 20);

    // Área externa.
    tijolos(-5.8, -11.5, 6, 5);
    tijolos(-2.8, -11.5, 5, 4);
    tijolos(3.5, -11.5, 6, 5);
    tijolos(5.2, -10, 4, 4);

    caixa(-5.5, -10);
    caixa(5.5, -12);
}

// ============================================================
// 9. PORTAS INTERATIVAS
// ============================================================

function criarPorta(
    x,
    z,
    largura = 1.4,
    altura = 2.1,
    rotacao = 0
) {
    const grupo = entidade("a-entity", {
        position: `${x} 0 ${z}`,
        rotation: `0 ${rotacao} 0`
    });

    // A dobradiça fica em uma lateral.
    const dobradica = entidade("a-entity", {
        position: `${-largura / 2} 0 0`
    }, grupo);

    // Folha da porta.
    const folha = entidade("a-box", {
        position: `${largura / 2} ${altura / 2} 0`,
        width: largura,
        height: altura,
        depth: 0.08,
        material: "color: #69513B; roughness: 0.8"
    }, dobradica);

    // Maçaneta.
    entidade("a-sphere", {
        position: `${largura - 0.18} 1.05 0.075`,
        radius: 0.055,
        material: "color: #B7B7B7; metalness: 0.7; roughness: 0.3"
    }, dobradica);

    const porta = {
        x,
        z,
        grupo,
        dobradica,
        folha,
        aberta: false,
        animando: false
    };

    PORTAS.push(porta);

    return porta;
}
function criarPortas() {
    // Construção 1.
    criarPorta(
        3,
        -5,
        1.4,
        2.1,
        90
    );

    // Construção 2.
    criarPorta(
        3,
        0,
        1.4,
        2.1,
        90
    );

    // Construção 3.
    criarPorta(
        3,
        5,
        1.4,
        2.1,
        90
    );

    // Entrada do corredor.
    criarPorta(
        1,
        9,
        2.8,
        2.2,
        0
    );

    // Entrada do Depósito 3,
    // diretamente pelo galpão.
    criarPorta(
        5.5,
        9,
        1.8,
        2.2,
        0
    );
}

function interagirPorta() {
    const pos = jogador.object3D.position;

    let proxima = null;
    let distanciaMinima = 2.3;

    PORTAS.forEach(porta => {
        const distancia = Math.hypot(
            pos.x - porta.x,
            pos.z - porta.z
        );

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            proxima = porta;
        }
    });

    if (!proxima || proxima.animando) return;

    proxima.animando = true;

    const destino = proxima.aberta ? 0 : -90;

    proxima.dobradica.setAttribute("animation__porta", {
        property: "rotation",
        to: `0 ${destino} 0`,
        dur: 500,
        easing: "easeInOutQuad"
    });

    proxima.aberta = !proxima.aberta;

    setTimeout(() => {
        proxima.animando = false;
    }, 550);
}

// ============================================================
// 10. COLISÕES
// ============================================================

function colideComObstaculo(posicao, obstaculo) {
    const raio = CONFIG.raioJogador;

    // Ignorar objetos acima da cabeça ou abaixo dos pés.
    if (obstaculo.y - obstaculo.altura / 2 >= 1.75) {
        return false;
    }

    if (obstaculo.y + obstaculo.altura / 2 <= 0.1) {
        return false;
    }

    const minX = obstaculo.x - obstaculo.largura / 2;
    const maxX = obstaculo.x + obstaculo.largura / 2;

    const minZ = obstaculo.z - obstaculo.profundidade / 2;
    const maxZ = obstaculo.z + obstaculo.profundidade / 2;

    const proximoX = Math.max(
        minX,
        Math.min(posicao.x, maxX)
    );

    const proximoZ = Math.max(
        minZ,
        Math.min(posicao.z, maxZ)
    );

    const dx = posicao.x - proximoX;
    const dz = posicao.z - proximoZ;

    return dx * dx + dz * dz < raio * raio;
}

function colideComPorta(posicao) {
    for (const porta of PORTAS) {
        // Usa a posição real da porta, inclusive durante a animação.
        porta.folha.object3D.updateWorldMatrix(true, true);

        const caixa = new THREE.Box3().setFromObject(
            porta.folha.object3D
        );

        if (caixa.isEmpty()) continue;

        if (caixa.max.y <= 0.1 || caixa.min.y >= 1.75) {
            continue;
        }

        const x = Math.max(
            caixa.min.x,
            Math.min(posicao.x, caixa.max.x)
        );

        const z = Math.max(
            caixa.min.z,
            Math.min(posicao.z, caixa.max.z)
        );

        const dx = posicao.x - x;
        const dz = posicao.z - z;

        if (
            dx * dx + dz * dz <
            CONFIG.raioJogador * CONFIG.raioJogador
        ) {
            return true;
        }
    }

    return false;
}

function temColisao(posicao) {
    for (const obstaculo of OBSTACULOS) {
        if (colideComObstaculo(posicao, obstaculo)) {
            return true;
        }
    }

    return colideComPorta(posicao);
}

function moverComColisao(deslocamento) {
    const pos = jogador.object3D.position;

    const distancia = Math.hypot(
        deslocamento.x,
        deslocamento.z
    );

    if (distancia < 0.000001) return;

    // Passos pequenos impedem atravessar paredes finas.
    const passos = Math.max(
        1,
        Math.ceil(distancia / 0.06)
    );

    const passoX = deslocamento.x / passos;
    const passoZ = deslocamento.z / passos;

    const tentativa = new THREE.Vector3();

    for (let i = 0; i < passos; i++) {
        // Eixo X.
        tentativa.set(
            pos.x + passoX,
            pos.y,
            pos.z
        );

        if (!temColisao(tentativa)) {
            pos.x += passoX;
        }

        // Eixo Z.
        tentativa.set(
            pos.x,
            pos.y,
            pos.z + passoZ
        );

        if (!temColisao(tentativa)) {
            pos.z += passoZ;
        }
    }
}

// ============================================================
// 11. MOVIMENTAÇÃO CORRIGIDA - PC E CELULAR
// ============================================================

AFRAME.registerComponent("movimento-galpao", {
    init: function () {
        this.frente = new THREE.Vector3();
        this.direita = new THREE.Vector3();
        this.deslocamento = new THREE.Vector3();
        this.quaternion = new THREE.Quaternion();
    },

    tick: function (tempo, delta) {
        if (!jogador || !camera || !delta) return;

        const dt = Math.min(delta / 1000, 0.05);

        // =========================================
        // ENTRADAS DO TECLADO E JOYSTICK
        // =========================================

        let eixoX = 0;
        let eixoZ = 0;

        if (TECLAS.w) eixoZ -= 1;
        if (TECLAS.s) eixoZ += 1;
        if (TECLAS.a) eixoX -= 1;
        if (TECLAS.d) eixoX += 1;

        eixoX += JOYSTICK.x;
        eixoZ += JOYSTICK.y;

        // =========================================
        // CONTROLE VR
        // =========================================

        if (cena.is("vr-mode") && navigator.getGamepads) {
            const gamepads = navigator.getGamepads();

            for (const gamepad of gamepads) {
                if (!gamepad || !gamepad.axes) continue;

                // Alguns controles usam eixos 0/1;
                // outros usam 2/3.
                for (let i = 0; i + 1 < gamepad.axes.length; i += 2) {
                    const x = gamepad.axes[i];
                    const y = gamepad.axes[i + 1];

                    if (Math.abs(x) > 0.2) eixoX += x;
                    if (Math.abs(y) > 0.2) eixoZ += y;
                }
            }
        }

        // =========================================
        // NORMALIZAR
        // =========================================

        const intensidade = Math.hypot(eixoX, eixoZ);

        if (intensidade < 0.01) return;

        if (intensidade > 1) {
            eixoX /= intensidade;
            eixoZ /= intensidade;
        }

        // =========================================
        // DIREÇÃO DA CÂMERA
        // =========================================

        camera.object3D.getWorldQuaternion(this.quaternion);

        // Frente no A-Frame é -Z.
        this.frente.set(0, 0, -1);
        this.frente.applyQuaternion(this.quaternion);

        // Ignorar inclinação vertical.
        this.frente.y = 0;

        if (this.frente.lengthSq() < 0.000001) {
            return;
        }

        this.frente.normalize();

        // Vetor para a direita.
        this.direita.set(
            -this.frente.z,
            0,
            this.frente.x
        );

        // =========================================
        // DESLOCAMENTO CORRIGIDO
        // =========================================

        // Joystick para cima = eixoZ negativo.
        // W = eixoZ negativo.
        // Ambos devem andar para a frente.

        this.deslocamento.set(
            this.direita.x * eixoX -
            this.frente.x * eixoZ,

            0,

            this.direita.z * eixoX -
            this.frente.z * eixoZ
        );

        const velocidade = TECLAS.shift
            ? CONFIG.velocidadeCorrida
            : CONFIG.velocidade;

        this.deslocamento.multiplyScalar(
            velocidade * dt
        );

        // Aplicar movimento com colisão.
        moverComColisao(this.deslocamento);
    }
});

// ============================================================
// 12. TECLADO DO PC
// ============================================================

function configurarTeclado() {
    const teclasValidas = new Set([
        "w", "a", "s", "d", "shift",
        "arrowup", "arrowdown",
        "arrowleft", "arrowright"
    ]);

    document.addEventListener("keydown", evento => {
        const tecla = evento.key.toLowerCase();

        if (teclasValidas.has(tecla)) {
            evento.preventDefault();
        }

        if (tecla === "w" || tecla === "arrowup") {
            TECLAS.w = true;
        }

        if (tecla === "s" || tecla === "arrowdown") {
            TECLAS.s = true;
        }

        if (tecla === "a" || tecla === "arrowleft") {
            TECLAS.a = true;
        }

        if (tecla === "d" || tecla === "arrowright") {
            TECLAS.d = true;
        }

        if (tecla === "shift") {
            TECLAS.shift = true;
        }

        if (tecla === "e" && !evento.repeat) {
            interagirPorta();
        }
    });

    document.addEventListener("keyup", evento => {
        const tecla = evento.key.toLowerCase();

        if (tecla === "w" || tecla === "arrowup") {
            TECLAS.w = false;
        }

        if (tecla === "s" || tecla === "arrowdown") {
            TECLAS.s = false;
        }

        if (tecla === "a" || tecla === "arrowleft") {
            TECLAS.a = false;
        }

        if (tecla === "d" || tecla === "arrowright") {
            TECLAS.d = false;
        }

        if (tecla === "shift") {
            TECLAS.shift = false;
        }
    });

    window.addEventListener("blur", () => {
        TECLAS.w = false;
        TECLAS.a = false;
        TECLAS.s = false;
        TECLAS.d = false;
        TECLAS.shift = false;
    });
}

// ============================================================
// 13. CÂMERA E MOUSE
// ============================================================

function configurarCamera() {
    camera.setAttribute("look-controls", {
        enabled: true,
        pointerLockEnabled: true,
        magicWindowTrackingEnabled: false
    });

    // O próprio look-controls do A-Frame
    // controla a rotação da câmera.
    // Não criamos outro controle para evitar conflito.

    cena.addEventListener("click", () => {
        if (
            cena.canvas &&
            document.pointerLockElement !== cena.canvas &&
            cena.canvas.requestPointerLock
        ) {
            cena.canvas.requestPointerLock();
        }
    });
}

// ============================================================
// 14. JOYSTICK MOBILE
// ============================================================

function criarJoystickMobile() {
    const celular =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

    if (!celular) return;

    if (document.getElementById("joystick-base")) {
        return;
    }

    const base = document.createElement("div");
    base.id = "joystick-base";

    Object.assign(base.style, {
        position: "fixed",
        bottom: "35px",
        left: "35px",
        width: "130px",
        height: "130px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.20)",
        border: "2px solid rgba(255,255,255,0.8)",
        zIndex: "99999",
        touchAction: "none",
        userSelect: "none"
    });

    const controle = document.createElement("div");

    Object.assign(controle.style, {
        position: "absolute",
        left: "40px",
        top: "40px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.85)",
        pointerEvents: "none"
    });

    base.appendChild(controle);
    document.body.appendChild(base);

    let ponteiroAtivo = null;

    function atualizar(evento) {
        const rect = base.getBoundingClientRect();

        const centroX = rect.left + rect.width / 2;
        const centroY = rect.top + rect.height / 2;

        let dx = evento.clientX - centroX;
        let dy = evento.clientY - centroY;

        const limite = 40;
        const distancia = Math.hypot(dx, dy);

        if (distancia > limite) {
            dx = dx / distancia * limite;
            dy = dy / distancia * limite;
        }

        JOYSTICK.x = dx / limite;
        JOYSTICK.y = dy / limite;

        controle.style.transform =
            `translate(${dx}px, ${dy}px)`;
    }

    function soltar() {
        ponteiroAtivo = null;

        JOYSTICK.x = 0;
        JOYSTICK.y = 0;

        controle.style.transform = "translate(0px, 0px)";
    }

    base.addEventListener("pointerdown", evento => {
        evento.preventDefault();

        ponteiroAtivo = evento.pointerId;
        base.setPointerCapture(evento.pointerId);

        atualizar(evento);
    });

    base.addEventListener("pointermove", evento => {
        if (evento.pointerId !== ponteiroAtivo) return;

        evento.preventDefault();
        atualizar(evento);
    });

    base.addEventListener("pointerup", soltar);
    base.addEventListener("pointercancel", soltar);
    base.addEventListener("lostpointercapture", soltar);

    // Botão para abrir portas no celular.
    const botao = document.createElement("button");

    botao.textContent = "🚪 PORTA";

    Object.assign(botao.style, {
        position: "fixed",
        right: "25px",
        bottom: "45px",
        padding: "15px 20px",
        border: "none",
        borderRadius: "12px",
        background: "#FFD400",
        color: "#222222",
        fontSize: "15px",
        fontWeight: "bold",
        zIndex: "99999"
    });

    botao.addEventListener("click", evento => {
        evento.stopPropagation();
        interagirPorta();
    });

    document.body.appendChild(botao);

    console.log("Joystick mobile ativado!");
}

// ============================================================
// 15. ILUMINAÇÃO E CÉU
// ============================================================

function criarAmbiente() {
    // Céu azul menos intenso.
    entidade("a-sky", {
        color: "#7899AD",
        radius: 500
    }, cena);

    // Iluminação ambiente mais suave.
    entidade("a-entity", {
        light: {
            type: "ambient",
            color: "#D9DFE5",
            intensity: 0.42
        }
    }, cena);

    // Luz natural mais moderada.
    entidade("a-entity", {
        position: "-12 20 -10",
        light: {
            type: "directional",
            color: "#FFF4E5",
            intensity: 0.65,
            castShadow: true,
            shadowMapWidth: 2048,
            shadowMapHeight: 2048
        }
    }, cena);

    // Luminárias internas.
    for (let z = -6; z <= 6; z += 6) {
        for (let x = -4; x <= 4; x += 4) {
            entidade("a-entity", {
                position: `${x} 7.5 ${z}`,
                light: {
                    type: "point",
                    color: "#FFEAC4",
                    intensity: 0.28,
                    distance: 12,
                    decay: 2
                }
            });

            bloco(
                x, 7.7, z,
                1, 0.08, 0.35,
                "#D0D0C8",
                false
            );
        }
    }

    // Iluminação do corredor e Depósito 3.
    for (let z = 12; z <= 20; z += 4) {
        for (const x of [1.5, 5.5]) {
            entidade("a-entity", {
                position: `${x} 2.2 ${z}`,
                light: {
                    type: "point",
                    color: "#FFEAC4",
                    intensity: 0.3,
                    distance: 7,
                    decay: 2
                }
            });
        }
    }
}
// ============================================================
// 16. CONFIGURAR JOGADOR
// ============================================================

function configurarJogador() {
    jogador = document.querySelector("#jogador");

    if (!jogador) {
        jogador = document.createElement("a-entity");
        jogador.id = "jogador";
        cena.appendChild(jogador);
    }

    camera = document.querySelector("#camera");

    if (!camera) {
        camera = document.createElement("a-camera");
        camera.id = "camera";
        jogador.appendChild(camera);
    }

    // Garantir que a câmera esteja dentro do jogador.
    if (camera.parentElement !== jogador) {
        jogador.appendChild(camera);
    }

    // Posição inicial na área externa.
    jogador.object3D.position.set(0, 0, -11);

    camera.setAttribute("position", "0 1.6 0");

    // Desativar WASD padrão para não duplicar movimento.
    jogador.removeAttribute("wasd-controls");

    camera.setAttribute("wasd-controls", "enabled: false");

    // Nossa movimentação personalizada.
    jogador.setAttribute("movimento-galpao", "");

    configurarTeclado();
    configurarCamera();
    criarJoystickMobile();
}

// ============================================================
// 17. INICIALIZAÇÃO COMPLETA
// ============================================================

let INICIADO = false;

function iniciarGalpao() {
    if (INICIADO) return;

    cena = document.querySelector("a-scene");

    if (!cena) {
        console.error("Cena A-Frame não encontrada!");
        return;
    }

    INICIADO = true;

    cenario = document.querySelector("#cenario");

    if (!cenario) {
        cenario = document.createElement("a-entity");
        cenario.id = "cenario";
        cena.appendChild(cenario);
    }

    // Limpar cenário anterior, se existir.
    cenario.innerHTML = "";

    OBSTACULOS.length = 0;
    PORTAS.length = 0;

    // Construir o ambiente.
    criarTerreno();
    criarPisos();
    criarGalpao();
    criarDepositos();
    criarConstrucoes();
    criarExtensao();
    criarObjetos();
    criarPortas();
    criarAmbiente();

    // Configurar movimentação.
    configurarJogador();

    console.log("=================================");
    console.log("GALPÃO 3D V8 INICIADO!");
    console.log("=================================");
    console.log("WASD: movimentação");
    console.log("SHIFT: correr");
    console.log("MOUSE: olhar");
    console.log("E: abrir portas");
    console.log("CELULAR: joystick");
    console.log("OBSTÁCULOS:", OBSTACULOS.length);
    console.log("PORTAS:", PORTAS.length);
    console.log("=================================");
}

// ============================================================
// 18. INICIAR AUTOMATICAMENTE
// ============================================================

function aguardarCena() {
    const elemento = document.querySelector("a-scene");

    if (!elemento) {
        console.error("Elemento a-scene não encontrado!");
        return;
    }

    if (elemento.hasLoaded) {
        iniciarGalpao();
    } else {
        elemento.addEventListener(
            "loaded",
            iniciarGalpao,
            { once: true }
        );
    }
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        aguardarCena
    );
} else {
    aguardarCena();
}

// ============================================================
// FIM - CONSTRUÇÃO CIVIL 3D V8
// ============================================================
// ============================================================
// CONSTRUÇÃO CIVIL 3D - MELHORIA GRÁFICA V8
// TEXTURAS, MATERIAIS E DETALHES INDUSTRIAIS
// ============================================================

(function () {
    "use strict";

    const GRAFICOS = {
        aplicado: false,
        texturas: {},
        detalhes: []
    };

    // ========================================================
    // 1. GERADOR DE TEXTURAS
    // ========================================================

    function gerarTextura(tipo, tamanho = 512) {
        const canvas = document.createElement("canvas");
        canvas.width = tamanho;
        canvas.height = tamanho;

        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        const cores = {
            concreto: "#999999",
            concretoClaro: "#B8B8B8",
            tijolo: "#A85C43",
            madeira: "#946C45",
            metal: "#75818A",
            telhado: "#667680",
            grama: "#568C42"
        };

        ctx.fillStyle = cores[tipo] || "#999999";
        ctx.fillRect(0, 0, tamanho, tamanho);

        // Ruído visual determinístico.
        let semente = 123456;

        function aleatorio() {
            semente = (semente * 16807) % 2147483647;
            return (semente - 1) / 2147483646;
        }

        // Textura de concreto.
        if (
            tipo === "concreto" ||
            tipo === "concretoClaro"
        ) {
            for (let i = 0; i < 9000; i++) {
                const x = aleatorio() * tamanho;
                const y = aleatorio() * tamanho;

                const claro = aleatorio() > 0.5;

                ctx.fillStyle = claro
                    ? "rgba(255,255,255,0.045)"
                    : "rgba(0,0,0,0.055)";

                ctx.fillRect(
                    x,
                    y,
                    1 + aleatorio() * 4,
                    1 + aleatorio() * 4
                );
            }

            // Pequenas manchas.
            for (let i = 0; i < 35; i++) {
                ctx.beginPath();

                ctx.fillStyle = "rgba(50,50,50,0.025)";

                ctx.ellipse(
                    aleatorio() * tamanho,
                    aleatorio() * tamanho,
                    8 + aleatorio() * 30,
                    3 + aleatorio() * 15,
                    aleatorio() * Math.PI,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        }

        // Textura de tijolos.
        if (tipo === "tijolo") {
            const altura = 64;
            const largura = 128;

            ctx.strokeStyle = "#74534B";
            ctx.lineWidth = 5;

            for (let y = 0; y <= tamanho; y += altura) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(tamanho, y);
                ctx.stroke();

                const deslocamento =
                    (Math.floor(y / altura) % 2) * (largura / 2);

                for (
                    let x = -largura + deslocamento;
                    x < tamanho;
                    x += largura
                ) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + altura);
                    ctx.stroke();
                }
            }

            for (let i = 0; i < 3500; i++) {
                ctx.fillStyle = aleatorio() > 0.5
                    ? "rgba(255,190,130,0.08)"
                    : "rgba(50,20,10,0.07)";

                ctx.fillRect(
                    aleatorio() * tamanho,
                    aleatorio() * tamanho,
                    2 + aleatorio() * 7,
                    1 + aleatorio() * 4
                );
            }
        }

        // Veios de madeira.
        if (tipo === "madeira") {
            for (let i = 0; i < 140; i++) {
                const y = aleatorio() * tamanho;

                ctx.beginPath();
                ctx.strokeStyle = aleatorio() > 0.5
                    ? "rgba(55,30,15,0.13)"
                    : "rgba(230,180,110,0.12)";

                ctx.lineWidth = 1 + aleatorio() * 3;

                ctx.moveTo(0, y);

                ctx.bezierCurveTo(
                    tamanho * 0.3,
                    y + aleatorio() * 12,
                    tamanho * 0.7,
                    y - aleatorio() * 12,
                    tamanho,
                    y
                );

                ctx.stroke();
            }
        }

        // Metal escovado.
        if (tipo === "metal") {
            for (let y = 0; y < tamanho; y += 3) {
                ctx.fillStyle = aleatorio() > 0.5
                    ? "rgba(255,255,255,0.035)"
                    : "rgba(0,0,0,0.04)";

                ctx.fillRect(0, y, tamanho, 1);
            }
        }

        // Telhado metálico corrugado.
        if (tipo === "telhado") {
            for (let x = 0; x < tamanho; x += 28) {
                ctx.fillStyle = "rgba(0,0,0,0.13)";
                ctx.fillRect(x, 0, 5, tamanho);

                ctx.fillStyle = "rgba(255,255,255,0.10)";
                ctx.fillRect(x + 6, 0, 4, tamanho);
            }
        }

        // Grama com pequenas variações.
        if (tipo === "grama") {
            for (let i = 0; i < 12000; i++) {
                const x = aleatorio() * tamanho;
                const y = aleatorio() * tamanho;

                ctx.strokeStyle = aleatorio() > 0.5
                    ? "rgba(25,75,20,0.22)"
                    : "rgba(160,190,90,0.16)";

                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(
                    x + aleatorio() * 3,
                    y - 2 - aleatorio() * 5
                );
                ctx.stroke();
            }
        }

        const textura = new THREE.CanvasTexture(canvas);

        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;

        textura.colorSpace = THREE.SRGBColorSpace;
        textura.anisotropy = 4;

        return textura;
    }

    // ========================================================
    // 2. PREPARAR MATERIAIS
    // ========================================================

    function prepararTexturas() {
        const tipos = [
            "concreto",
            "concretoClaro",
            "tijolo",
            "madeira",
            "metal",
            "telhado",
            "grama"
        ];

        tipos.forEach(tipo => {
            GRAFICOS.texturas[tipo] = gerarTextura(tipo);
        });
    }

    // ========================================================
    // 3. IDENTIFICAR MATERIAL PELO OBJETO
    // ========================================================

    function identificarMaterial(elemento) {
        const material = elemento.getAttribute("material");

        if (!material) return null;

        const cor = (
            typeof material === "string"
                ? material
                : material.color || ""
        ).toUpperCase();

        if (cor.includes("#999999")) return "concreto";
        if (cor.includes("#B8B8B8")) return "concretoClaro";
        if (cor.includes("#AD563A")) return "tijolo";
        if (cor.includes("#93673E")) return "madeira";
        if (cor.includes("#6D7882")) return "metal";
        if (cor.includes("#65747F")) return "telhado";
        if (cor.includes("#568C42")) return "grama";

        return null;
    }

    // ========================================================
    // 4. APLICAR TEXTURAS AO CENÁRIO
    // ========================================================

    function aplicarTexturas() {
        const elementos = document.querySelectorAll(
            "#cenario a-box, #cenario a-plane"
        );

        let quantidade = 0;

        elementos.forEach(elemento => {
            const tipo = identificarMaterial(elemento);

            if (!tipo) return;

            const texturaOriginal = GRAFICOS.texturas[tipo];

            if (!texturaOriginal) return;

            const mesh = elemento.getObject3D("mesh");

            if (!mesh) return;

            mesh.traverse(objeto => {
                if (!objeto.isMesh) return;

                const geometria = objeto.geometry;

                if (!geometria) return;

                const tamanho = new THREE.Vector3();

                geometria.computeBoundingBox();
                geometria.boundingBox.getSize(tamanho);

                // Textura repetida conforme o tamanho do bloco.
                const textura = texturaOriginal.clone();

                textura.needsUpdate = true;

                textura.repeat.set(
                    Math.max(1, tamanho.x / 2),
                    Math.max(1, tamanho.y / 2)
                );

                if (
                    tipo === "telhado" ||
                    tipo === "grama"
                ) {
                    textura.repeat.set(
                        Math.max(1, tamanho.x / 2),
                        Math.max(1, tamanho.z / 2)
                    );
                }

                const materialNovo =
                    new THREE.MeshStandardMaterial({
                        map: textura,
                        color: "#FFFFFF",
                        roughness:
                            tipo === "metal" || tipo === "telhado"
                                ? 0.58
                                : 0.92,
                        metalness:
                            tipo === "metal" || tipo === "telhado"
                                ? 0.35
                                : 0,
                        side: THREE.DoubleSide
                    });

                objeto.material = materialNovo;
            });

            quantidade++;
        });

        console.log(
            "Texturas aplicadas em",
            quantidade,
            "elementos."
        );
    }

    // ========================================================
    // 5. DETALHES VISUAIS SEM COLISÃO
    // ========================================================

    function detalheBloco(
        x, y, z,
        largura, altura, profundidade,
        cor
    ) {
        const elemento = document.createElement("a-box");

        elemento.setAttribute(
            "position",
            `${x} ${y} ${z}`
        );

        elemento.setAttribute("width", largura);
        elemento.setAttribute("height", altura);
        elemento.setAttribute("depth", profundidade);

        elemento.setAttribute(
            "material",
            `color: ${cor}; roughness: 0.7; metalness: 0.15`
        );

        elemento.classList.add("sem-colisao");

        document.querySelector("#cenario").appendChild(elemento);

        GRAFICOS.detalhes.push(elemento);

        return elemento;
    }

    // ========================================================
    // 6. DETALHES NO TELHADO
    // ========================================================

    function detalharTelhado() {
        // Faixas metálicas longitudinais.
        for (let x = -7; x <= 7; x += 1.4) {
            detalheBloco(
                x,
                8.29,
                0,
                0.07,
                0.06,
                18.2,
                "#A4ADB3"
            );
        }

        // Calhas laterais.
        detalheBloco(
            -7.65, 8.05, 0,
            0.22, 0.2, 18.5,
            "#454F56"
        );

        detalheBloco(
            7.65, 8.05, 0,
            0.22, 0.2, 18.5,
            "#454F56"
        );
    }

    // ========================================================
    // 7. DETALHES NA ENTRADA
    // ========================================================

    function detalharEntrada() {
        // Batentes metálicos do portão principal.
        detalheBloco(
            -4, 2.5, -9.16,
            0.15, 5, 0.15,
            "#414B54"
        );

        detalheBloco(
            4, 2.5, -9.16,
            0.15, 5, 0.15,
            "#414B54"
        );

        // Trilho superior.
        detalheBloco(
            0, 5.04, -9.16,
            8.1, 0.13, 0.18,
            "#414B54"
        );

        // Faixas de segurança.
        for (let x = -3.5; x <= 3.5; x += 1) {
            detalheBloco(
                x, 0.008, -8.6,
                0.5, 0.012, 0.08,
                "#E8BE24"
            );
        }
    }

    // ========================================================
    // 8. JUNTAS DO PISO
    // ========================================================

    function detalharPiso() {
        // Juntas longitudinais.
        for (let x = -6; x <= 6; x += 3) {
            detalheBloco(
                x, -0.012, 0,
                0.018, 0.008, 17.8,
                "#747474"
            );
        }

        // Juntas transversais.
        for (let z = -7.5; z <= 7.5; z += 3) {
            detalheBloco(
                0, -0.012, z,
                14.8, 0.008, 0.018,
                "#747474"
            );
        }

        // Marcação das áreas de armazenamento.
        detalheBloco(
            -3.05, 0.005, -4.5,
            0.08, 0.012, 8.5,
            "#D8B532"
        );

        detalheBloco(
            -3.05, 0.005, 4.5,
            0.08, 0.012, 8.5,
            "#D8B532"
        );
    }

    // ========================================================
    // 9. ILUMINAÇÃO DECORATIVA
    // ========================================================

    function detalharIluminacao() {
        const cenario = document.querySelector("#cenario");

        for (const z of [-6, 0, 6]) {
            for (const x of [-4, 0, 4]) {
                // Corpo da luminária.
                detalheBloco(
                    x, 7.62, z,
                    1.15, 0.09, 0.42,
                    "#303A42"
                );

                // Difusor branco.
                detalheBloco(
                    x, 7.55, z,
                    1, 0.025, 0.3,
                    "#F3F0D8"
                );
            }
        }

        // Luz suave adicional para destacar materiais.
        const luz = document.createElement("a-entity");

        luz.setAttribute(
            "light",
            "type: hemisphere; color: #E8F2FF; groundColor: #8C877A; intensity: 0.12"
        );

        cenario.appendChild(luz);
    }

    // ========================================================
    // 10. ACABAMENTO DAS PAREDES
    // ========================================================

    function detalharParedes() {
        // Rodapé da parede lateral esquerda.
        detalheBloco(
            -7.36, 0.15, 0,
            0.08, 0.3, 17.7,
            "#777777"
        );

        // Rodapé da parede lateral direita.
        detalheBloco(
            7.36, 0.15, 0,
            0.08, 0.3, 17.7,
            "#777777"
        );

        // Faixa de segurança industrial.
        detalheBloco(
            -7.37, 0.85, 0,
            0.035, 0.12, 17.6,
            "#D9B72C"
        );

        detalheBloco(
            7.37, 0.85, 0,
            0.035, 0.12, 17.6,
            "#D9B72C"
        );
    }

    // ========================================================
    // 11. APLICAR MELHORIAS
    // ========================================================

    function melhorarGraficos() {
        if (GRAFICOS.aplicado) return;

        const cenario = document.querySelector("#cenario");

        if (!cenario || !cenario.querySelector("a-box")) {
            return;
        }

        GRAFICOS.aplicado = true;

        console.log("Aplicando melhorias gráficas...");

        prepararTexturas();

        aplicarTexturas();

        detalharTelhado();
        detalharEntrada();
        detalharPiso();
        detalharIluminacao();
        detalharParedes();

        console.log("Melhorias gráficas aplicadas!");
    }

    // ========================================================
    // 12. AGUARDAR O GALPÃO SER CONSTRUÍDO
    // ========================================================

    function iniciarMelhorias() {
        let tentativas = 0;

        const intervalo = setInterval(() => {
            tentativas++;

            const cenario = document.querySelector("#cenario");

            const pronto =
                cenario &&
                cenario.querySelectorAll("a-box").length > 20;

            if (pronto) {
                clearInterval(intervalo);

                // Aguarda as malhas 3D do A-Frame.
                setTimeout(melhorarGraficos, 500);
            }

            if (tentativas >= 40) {
                clearInterval(intervalo);

                console.warn(
                    "Melhorias gráficas: cenário não encontrado."
                );
            }
        }, 250);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarMelhorias
        );
    } else {
        iniciarMelhorias();
    }

})();

// ============================================================
// FIM DAS MELHORIAS GRÁFICAS V8
// ============================================================