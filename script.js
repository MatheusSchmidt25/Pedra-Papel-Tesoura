// Configurações iniciais
const gameArea = document.getElementById('game-area');
const elements = [];
const numberOfElements = 10; // Número inicial de cada tipo
const resultDiv = document.getElementById('result');

// Pontuações dos jogadores
const scores = {
    'rock': 0,
    'paper': 0,
    'scissors': 0
};

// Função para criar elementos (pedra, papel, tesoura)
function createElement(type) {
    const element = document.createElement('div');
    element.classList.add('element', type);
    element.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    element.style.top = Math.random() * (window.innerHeight - 50) + 'px';
    gameArea.appendChild(element);
    elements.push({ element, type });
}

// Função para inicializar o jogo
function initializeGame() {
    for (let i = 0; i < numberOfElements; i++) {
        createElement('rock');
        createElement('paper');
        createElement('scissors');
    }
}

// Função para mover os elementos em direção uns aos outros
function moveElements() {
    elements.forEach((el1) => {
        const targetIndex = Math.floor(Math.random() * elements.length);
        const el2 = elements[targetIndex];

        if (el1 !== el2) {
            // Mover em direção ao alvo
            let x1 = parseFloat(el1.element.style.left);
            let y1 = parseFloat(el1.element.style.top);
            let x2 = parseFloat(el2.element.style.left);
            let y2 = parseFloat(el2.element.style.top);

            // Calcular a distância
            const distX = x2 - x1;
            const distY = y2 - y1;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Se estiver próximo o suficiente, mova-os
            if (distance < 2000) { // Ajustar a distância conforme necessário
                x1 += (distX / distance) * 5; // Ajustar a velocidade
                y1 += (distY / distance) * 5; // Ajustar a velocidade
                el1.element.style.left = x1 + 'px';
                el1.element.style.top = y1 + 'px';

                // Verifica colisões
                if (isColliding(el1.element, el2.element)) {
                    handleCollision(el1, el2);
                }
            }
        }
    });

    checkWinner(); // Verifica se há um vencedor
}

// Função para verificar se dois elementos colidiram
function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Função para lidar com a colisão entre dois elementos
function handleCollision(el1, el2) {
    const type1 = el1.type;
    const type2 = el2.type;

    if (
        (type1 === 'rock' && type2 === 'scissors') ||
        (type1 === 'scissors' && type2 === 'paper') ||
        (type1 === 'paper' && type2 === 'rock')
    ) {
        transformElement(el2, type1);
    } else if (
        (type2 === 'rock' && type1 === 'scissors') ||
        (type2 === 'scissors' && type1 === 'paper') ||
        (type2 === 'paper' && type1 === 'rock')
    ) {
        transformElement(el1, type2);
    }
}

// Função para transformar um elemento em outro
function transformElement(el, newType) {
    el.element.classList.remove('rock', 'paper', 'scissors');
    el.element.classList.add(newType);
    el.type = newType; // Atualiza o tipo
}

// Função para atualizar o placar
function updateScores() {
    document.getElementById('score1').innerText = scores['rock']/41;
    document.getElementById('score2').innerText = scores['paper']/41;
    document.getElementById('score3').innerText = scores['scissors']/41;
}

// Função para verificar se há um vencedor
function checkWinner() {
    const types = new Set(elements.map(el => el.type));
    if (types.size === 1) {
        const winnerType = [...types][0];
        scores[winnerType]++; // Incrementa a pontuação do tipo restante
        

        // Reinicia o jogo após 2 segundos
        setTimeout(() => {
            restartGame(); // Reinicia o jogo
        }, 2000);
    }
}

// Função para reiniciar o jogo
function restartGame() {
    updateScores();
    // Remove todos os elementos da área do jogo
    elements.forEach(el => el.element.remove());
    elements.length = 0; // Limpa a lista de elementos

    // Recria os elementos
    initializeGame();

    resultDiv.innerText = ''; // Limpa o resultado
}

// Inicializa o jogo pela primeira vez
initializeGame();

// Atualização constante
setInterval(moveElements, 50);
