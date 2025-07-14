document.addEventListener("DOMContentLoaded", () => {
  const puzzleBoard = document.getElementById("puzzle-board");
  const resetButton = document.getElementById("reset-button");
  const messageDisplay = document.getElementById("message");
  const backgroundMusic = document.getElementById("background-music");

  const imageUrl = "assets/princesa.jpg"; // Imagem da princesa
  const gridSize = 3; // Quebra-cabeça 3x3
  let pieces = []; // Array para armazenar as peças
  let originalPositions = []; // Para verificar a ordem correta

  let draggedPiece = null;
  let targetPiece = null;

  // Dimensões da sua imagem princesa.jpg
  // ***** AJUSTADAS PARA AS DIMENSÕES QUE VOCÊ FORNECEU (735x644) *****
  const imageOriginalWidth = 735;
  const imageOriginalHeight = 644;
  // Largura/Altura do tabuleiro do quebra-cabeça no CSS (450px)
  const boardSize = 450;

  // Função para tocar a música
  function playMusic() {
    if (backgroundMusic.paused) {
      backgroundMusic
        .play()
        .catch((e) => console.log("Erro ao tocar música:", e));
    }
  }

  // Tenta tocar a música assim que a página carrega
  playMusic();

  // Adiciona um listener para interação do usuário para garantir que a música toque
  document.body.addEventListener("click", playMusic, { once: true });
  document.body.addEventListener("touchstart", playMusic, { once: true });

  // Função para inicializar o quebra-cabeça
  function initializePuzzle() {
    puzzleBoard.innerHTML = ""; // Limpa o tabuleiro
    messageDisplay.textContent = ""; // Limpa a mensagem
    pieces = [];
    originalPositions = [];

    // Calcula o tamanho de cada peça
    const pieceWidth = 100 / gridSize; // Em porcentagem

    for (let i = 0; i < gridSize * gridSize; i++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.dataset.id = i; // ID da peça (0 a 8 para um 3x3)

      // Calcula a posição da imagem de fundo para cada peça
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      // ***** ALTERAÇÃO AQUI: USANDO AS DIMENSÕES REAIS DA IMAGEM *****
      // Calcula a posição da imagem de fundo com base no tamanho ORIGINAL da imagem
      // E na proporção do tabuleiro (450px) em relação ao tamanho da imagem.
      const backgroundPosX = -col * (imageOriginalWidth / gridSize);
      const backgroundPosY = -row * (imageOriginalHeight / gridSize);

      piece.style.backgroundImage = `url(${imageUrl})`;
      piece.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
      piece.style.width = `${pieceWidth}%`; // Define a largura da peça em porcentagem
      piece.style.height = `${pieceWidth}%`; // Define a altura da peça em porcentagem

      pieces.push(piece);
      originalPositions.push(i); // A ordem inicial é a ordem correta
    }

    shufflePieces(); // Embaralha as peças
    renderPuzzle(); // Desenha as peças no tabuleiro
    addDragAndDropListeners(); // Adiciona os listeners de arrastar e soltar
  }

  // Função para embaralhar as peças
  function shufflePieces() {
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]]; // Troca as posições
    }
  }

  // Função para renderizar (desenhar) as peças no tabuleiro
  function renderPuzzle() {
    pieces.forEach((piece) => {
      puzzleBoard.appendChild(piece);
    });
  }

  // Adiciona os eventos de arrastar e soltar
  function addDragAndDropListeners() {
    pieces.forEach((piece) => {
      piece.setAttribute("draggable", true); // Torna a peça arrastável

      piece.addEventListener("dragstart", (e) => {
        draggedPiece = e.target;
        e.target.classList.add("dragging");
        // Adiciona um pequeno atraso para permitir que a classe 'dragging' seja aplicada
        setTimeout(() => (e.target.style.opacity = "0.01"), 0); // Torna quase invisível durante o arrasto
      });

      piece.addEventListener("dragover", (e) => {
        e.preventDefault(); // Permite o drop
        targetPiece = e.target;
      });

      piece.addEventListener("dragenter", (e) => {
        e.preventDefault();
        e.target.classList.add("drag-over");
      });

      piece.addEventListener("dragleave", (e) => {
        e.target.classList.remove("drag-over");
      });

      piece.addEventListener("drop", () => {
        if (draggedPiece && targetPiece && draggedPiece !== targetPiece) {
          const draggedId = parseInt(draggedPiece.dataset.id);
          const targetId = parseInt(targetPiece.dataset.id);

          // Encontra os índices das peças no array 'pieces'
          const draggedIndex = pieces.findIndex(
            (p) => parseInt(p.dataset.id) === draggedId
          );
          const targetIndex = pieces.findIndex(
            (p) => parseInt(p.dataset.id) === targetId
          );

          // Troca as peças visualmente no DOM
          const tempDragged = puzzleBoard.replaceChild(
            targetPiece.cloneNode(true),
            draggedPiece
          );
          puzzleBoard.replaceChild(tempDragged, targetPiece);

          // Troca as peças no array 'pieces' para refletir a nova ordem
          [pieces[draggedIndex], pieces[targetIndex]] = [
            pieces[targetIndex],
            pieces[draggedIndex],
          ];

          checkWin(); // Verifica se o quebra-cabeça foi montado
        }
        targetPiece.classList.remove("drag-over");
      });

      piece.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        e.target.style.opacity = "1"; // Restaura a opacidade
        draggedPiece = null;
        targetPiece = null;
      });
    });
  }

  // Função para verificar se o quebra-cabeça foi completado
  function checkWin() {
    let isWin = true;
    for (let i = 0; i < pieces.length; i++) {
      // Verifica se a peça atual no tabuleiro está na sua posição original correta
      if (parseInt(pieces[i].dataset.id) !== originalPositions[i]) {
        isWin = false;
        break;
      }
    }

    if (isWin) {
      messageDisplay.textContent =
        "Parabéns, Princesa! Você montou o quebra-cabeça!";
      messageDisplay.style.color = "#4caf50"; // Verde de sucesso
      // Opcional: tocar um som de vitória
    } else {
      messageDisplay.textContent = ""; // Limpa a mensagem se não estiver completo
    }
  }

  // Event listener para o botão de reiniciar
  resetButton.addEventListener("click", initializePuzzle);

  // Inicializa o jogo quando a página carrega
  initializePuzzle();
});
