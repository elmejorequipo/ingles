document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS ---
    const welcomeModal = document.getElementById('welcome-modal');
    const nameInput = document.getElementById('player-name-input');
    const startStoryButton = document.getElementById('start-story-button'); // Botón renombrado
    
    // NUEVO: Elementos de la ventana de historia
    const storyModal = document.getElementById('story-modal');
    const storyTextElement = document.getElementById('story-text');
    const playGameButton = document.getElementById('play-game-button');

    const gameContainer = document.querySelector('.container');
    const playerNameSpan = document.getElementById('player-name');
    const playerNameSuccessSpan = document.getElementById('player-name-success');
    
    const objects = document.querySelectorAll('.object');
    const backpack = document.getElementById('backpack');
    // ... (resto de selectores del juego)
    const packedItemsContainer = document.getElementById('packed-items-display');
    const successMessage = document.getElementById('success-message');
    const resetButton = document.getElementById('reset-button');
    const progressTracker = document.getElementById('progress-tracker');
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const synth = window.speechSynthesis;
    
    let playerName = '';
    // ... (resto de variables del juego)
    let draggedObject = null;
    let objectsInBackpack = 0;
    const totalObjects = objects.length;


    // --- NUEVO: LÓGICA DE LA HISTORIA Y EL INICIO ---

    // 1. Cuando se pulsa el botón en la bienvenida
    startStoryButton.addEventListener('click', showStory);
    nameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') showStory();
    });

    // 2. Función para mostrar la historia
    function showStory() {
        playerName = nameInput.value.trim() || 'Superstar';
        playerNameSpan.textContent = playerName;
        playerNameSuccessSpan.textContent = playerName;

        // El texto de la historia de Beatriz
        const story_part_1 = `<p>En un rincón soleado, una mochila nueva y brillante llamada Bucky sonreía. ¡Hoy era su primer día de clases!</p>`;
        const story_part_2 = `<p>"¡Hola, <strong>${playerName}</strong>!" —dijo Bucky—. "¡Estoy tan feliz de ser tu nueva mochila! Para nuestra primera aventura, ¡necesito tu ayuda!"</p>`;
        const story_part_3 = `<p>"Mis amigos, los útiles escolares, están listos para la acción. ¿Podrías ayudarme a reunirlos a todos dentro de mí? ¡Así estaremos preparados para crear cosas maravillosas!"</p>`;

        storyTextElement.innerHTML = story_part_1 + story_part_2 + story_part_3;
        
        welcomeModal.classList.add('hidden');
        storyModal.classList.remove('hidden');
    }

    // 3. Cuando se pulsa el botón en la historia para empezar a jugar
    playGameButton.addEventListener('click', () => {
        storyModal.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameContainer.focus();
    });


    // --- (El resto del código del juego es el mismo que en la v1.2) ---
    function playSound(type) { /* ... */ }
    function speak(text) { /* ... */ }
    objects.forEach(object => { /* ... */ });
    backpack.addEventListener('dragenter', (e) => { /* ... */ });
    backpack.addEventListener('dragover', (e) => { /* ... */ });
    backpack.addEventListener('dragleave', () => { /* ... */ });
    backpack.addEventListener('drop', () => { /* ... */ });
    function updateProgress() { /* ... */ }
    function showSuccess() { /* ... */ }
    function resetGame() { /* ... */ }
    resetButton.addEventListener('click', resetGame);
    updateProgress();

    // --- Pegando el resto de las funciones para que sea completo ---
    function playSound(type) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        if (type === 'pickup') { oscillator.type = 'square'; oscillator.frequency.setValueAtTime(150, audioContext.currentTime); gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); }
        else if (type === 'drop') { oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(440, audioContext.currentTime); gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); }
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    function speak(text) { if (synth.speaking) return; const utterThis = new SpeechSynthesisUtterance(text); utterThis.lang = 'en-US'; synth.speak(utterThis); }
    objects.forEach(object => {
        object.addEventListener('dragstart', (e) => { draggedObject = e.target; playSound('pickup'); setTimeout(() => e.target.classList.add('dragging'), 0); });
        object.addEventListener('dragend', () => { if (draggedObject) draggedObject.classList.remove('dragging'); });
        object.addEventListener('mouseenter', () => { speak(object.dataset.name); });
    });
    backpack.addEventListener('dragenter', (e) => { e.preventDefault(); backpack.classList.add('drag-over'); });
    backpack.addEventListener('dragover', (e) => { e.preventDefault(); });
    backpack.addEventListener('dragleave', () => { backpack.classList.remove('drag-over'); });
    backpack.addEventListener('drop', () => {
        backpack.classList.remove('drag-over');
        if (draggedObject && !draggedObject.classList.contains('packed')) {
            playSound('drop');
            const packedItem = document.createElement('div');
            packedItem.className = 'packed-item';
            packedItem.innerHTML = draggedObject.innerHTML;
            packedItemsContainer.appendChild(packedItem);
            draggedObject.classList.add('hidden');
            draggedObject.classList.add('packed');
            objectsInBackpack++;
            updateProgress();
            if (objectsInBackpack === totalObjects) { setTimeout(showSuccess, 500); }
        }
        draggedObject = null;
    });
    function updateProgress() { progressTracker.textContent = `Objects Packed: ${objectsInBackpack} / ${totalObjects}`; }
    function showSuccess() {
        document.querySelector('.game-area').classList.add('hidden');
        progressTracker.classList.add('hidden');
        document.getElementById('instructions').classList.add('hidden');
        successMessage.classList.remove('hidden');
    }
    function resetGame() {
        objectsInBackpack = 0;
        updateProgress();
        packedItemsContainer.innerHTML = '';
        objects.forEach(object => { object.classList.remove('hidden'); object.classList.remove('packed'); });
        successMessage.classList.add('hidden');
        document.querySelector('.game-area').classList.remove('hidden');
        progressTracker.classList.remove('hidden');
        document.getElementById('instructions').classList.remove('hidden');
    }
    resetButton.addEventListener('click', resetGame);
    updateProgress();
});
