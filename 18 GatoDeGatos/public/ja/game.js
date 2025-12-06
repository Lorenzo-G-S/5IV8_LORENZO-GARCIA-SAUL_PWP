// Estado del juego
let currentPlayer = 1; // 1 = Jugador 1 (O), 2 = Jugador 2 (X)
let gameActive = true;
let tablerosChicos = Array(9).fill(null).map(() => Array(9).fill(null));
let tablerosGanados = Array(9).fill(null); // null, 'O', 'X', 'draw'
let tablerosGanadosCount = { O: 0, X: 0 };

// Inicializar el tablero
function initializeBoard() {
    const mainBoard = document.getElementById('main-board');
    mainBoard.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const smallBoard = document.createElement('div');
        smallBoard.className = 'small-board';
        smallBoard.dataset.board = i;
        
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.board = i;
            cell.dataset.cell = j;
            cell.addEventListener('click', handleCellClick);
            smallBoard.appendChild(cell);
        }
        
        mainBoard.appendChild(smallBoard);
    }
    
    updateTurnMessage();
    updatePlayerCards();
}

// Manejar clic en celda
function handleCellClick(event) {
    if (!gameActive) return;
    
    const cell = event.target;
    const boardIndex = parseInt(cell.dataset.board);
    const cellIndex = parseInt(cell.dataset.cell);
    
    // Verificar si la celda ya está ocupada
    if (tablerosChicos[boardIndex][cellIndex] !== null) return;
    
    // Verificar si el tablero ya fue ganado o está en empate
    if (tablerosGanados[boardIndex] !== null) return;
    
    // Colocar símbolo
    const simbolo = currentPlayer === 1 ? 'O' : 'X';
    tablerosChicos[boardIndex][cellIndex] = simbolo;
    cell.textContent = simbolo;
    cell.classList.add('occupied', simbolo);
    
    // Verificar si se ganó el tablero chico
    checkSmallBoardWin(boardIndex);
    
    // Verificar si se ganó el juego completo
    if (checkMainBoardWin()) {
        endGame(currentPlayer);
        return;
    }
    
    // Cambiar turno
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnMessage();
    updatePlayerCards();
}

// Verificar victoria en tablero chico
function checkSmallBoardWin(boardIndex) {
    const board = tablerosChicos[boardIndex];
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6]              // Diagonales
    ];
    
    // Verificar patrones de victoria
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            tablerosGanados[boardIndex] = board[a];
            markSmallBoardWon(boardIndex, board[a]);
            tablerosGanadosCount[board[a]]++;
            updateTablerosCount();
            return;
        }
    }
    
    // Verificar empate (tablero lleno sin ganador)
    if (board.every(cell => cell !== null)) {
        tablerosGanados[boardIndex] = 'draw';
        markSmallBoardDraw(boardIndex);
    }
}

// Marcar tablero chico como ganado
function markSmallBoardWon(boardIndex, winner) {
    const smallBoard = document.querySelector(`.small-board[data-board="${boardIndex}"]`);
    smallBoard.classList.add('won');
    smallBoard.dataset.winner = winner;
}

// Marcar tablero chico como empate
function markSmallBoardDraw(boardIndex) {
    const smallBoard = document.querySelector(`.small-board[data-board="${boardIndex}"]`);
    smallBoard.classList.add('draw');
}

// Verificar victoria en tablero principal
function checkMainBoardWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6]              // Diagonales
    ];
    
    // Verificar si alguien conectó 3 en el tablero grande
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (tablerosGanados[a] && 
            tablerosGanados[a] !== 'draw' &&
            tablerosGanados[a] === tablerosGanados[b] && 
            tablerosGanados[a] === tablerosGanados[c]) {
            return true;
        }
    }
    
    // Verificar si todos los tableros están decididos
    const todosDecididos = tablerosGanados.every(t => t !== null);
    if (todosDecididos) {
        // Si no hay línea de 3, gana quien tenga más tableros
        if (tablerosGanadosCount.O !== tablerosGanadosCount.X) {
            return true;
        } else {
            // Empate total
            endGame('empate');
            return false;
        }
    }
    
    return false;
}

// Finalizar juego
function endGame(winner) {
    gameActive = false;
    
    let ganadorId;
    let tableros_j1 = tablerosGanadosCount.O;
    let tableros_j2 = tablerosGanadosCount.X;
    
    if (winner === 'empate') {
        ganadorId = 'empate';
    } else if (winner === 1) {
        ganadorId = gameData.jugador1.id;
    } else {
        ganadorId = gameData.jugador2.id;
    }
    
    // Guardar resultado en la base de datos
    fetch('/guardar-resultado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jugador1_id: gameData.jugador1.id,
            jugador2_id: gameData.jugador2.id,
            ganador_id: ganadorId,
            tableros_j1: tableros_j1,
            tableros_j2: tableros_j2
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirigir a pantalla de victoria
            window.location.href = `/victoria?ganador_id=${ganadorId}&jugador1_id=${gameData.jugador1.id}&jugador2_id=${gameData.jugador2.id}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar el resultado');
    });
}

// Actualizar mensaje de turno
function updateTurnMessage() {
    const turnMessage = document.getElementById('turn-message');
    const jugador = currentPlayer === 1 ? gameData.jugador1 : gameData.jugador2;
    turnMessage.textContent = `Turno de ${jugador.nombre} (${jugador.simbolo})`;
}

// Actualizar tarjetas de jugadores
function updatePlayerCards() {
    const player1Card = document.getElementById('player1-card');
    const player2Card = document.getElementById('player2-card');
    
    player1Card.classList.toggle('active', currentPlayer === 1);
    player2Card.classList.toggle('active', currentPlayer === 2);
}

// Actualizar contador de tableros ganados
function updateTablerosCount() {
    document.getElementById('tableros-j1').textContent = tablerosGanadosCount.O;
    document.getElementById('tableros-j2').textContent = tablerosGanadosCount.X;
}

// Reiniciar juego
function resetGame() {
    if (confirm('¿Estás seguro de que quieres reiniciar la partida?')) {
        currentPlayer = 1;
        gameActive = true;
        tablerosChicos = Array(9).fill(null).map(() => Array(9).fill(null));
        tablerosGanados = Array(9).fill(null);
        tablerosGanadosCount = { O: 0, X: 0 };
        initializeBoard();
        updateTablerosCount();
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', initializeBoard);