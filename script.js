document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    const statusElement = document.getElementById('status');
    const wordInput = document.getElementById('wordInput');
    const submitDrawingButton = document.getElementById('submitDrawing');
    const guessInput = document.getElementById('guessInput');
    const submitGuessButton = document.getElementById('submitGuess');
    const resetButton = document.getElementById('resetButton');

    let isDrawing = false;
    let drawingPlayer = 1;
    let wordToDraw = '';
    let guessedWord = '';
    let remainingChances = 3;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    submitDrawingButton.addEventListener('click', submitDrawing);
    submitGuessButton.addEventListener('click', handleGuess);
    resetButton.addEventListener('click', resetGame);

    function startDrawing() {
        isDrawing = true;
        context.beginPath();
    }

    function draw(event) {
        if (!isDrawing) return;

        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        context.lineCap = 'round';
        context.lineWidth = 5;
        context.strokeStyle = 'black';

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function submitDrawing() {
        if (drawingPlayer === 1 && !isDrawing) {
            wordToDraw = wordInput.value.toLowerCase();
            wordInput.placeholder = '';
            wordInput.value = '';
            saveCanvasState();
            statusElement.textContent = 'Player 2, guess the word! Remaining Chances: 3';
            drawingPlayer = 2;
        }
    }

    function saveCanvasState() {
        const imageData = canvas.toDataURL();
        localStorage.setItem(`drawingPlayer${drawingPlayer}`, imageData);
    }

    function loadCanvasState() {
        const imageData = localStorage.getItem(`drawingPlayer${drawingPlayer}`);
        if (imageData) {
            const img = new Image();
            img.src = imageData;
            img.onload = function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
            };
        }
    }


    function handleGuess() {
        guessedWord = guessInput.value.toLowerCase();
        if (guessedWord === wordToDraw) {
            showPopup('🎉 👈(❁´◡`❁)👉 🎉   Congratulations! You have Won The Game');
            resetGame();
        } else {
            remainingChances--;
            if (remainingChances === 0) {
                showPopup('😭😭😭  Sorry! You Have Lost The Game');
                resetGame();
            } else {
                showPopup('😰😰🥶  Wrong Answer! Try Again.');
                statusElement.textContent = `Player 2, guess the word! Remaining Chances: ${remainingChances}`;
            }
        }
        guessInput.value = '';
    }


    function resetGame() {
        localStorage.clear();
        context.clearRect(0, 0, canvas.width, canvas.height);
        statusElement.textContent = 'Game reset. Player 1, start drawing!';
        drawingPlayer = 1;
        wordToDraw = '';
        guessedWord = '';
        remainingChances = 3;
        wordInput.placeholder = 'Enter a word for drawing';
    }

    function showPopup(message) {
        alert(message);
    }

    // Load the previous drawing state if any
    loadCanvasState();
});