document.addEventListener('DOMContentLoaded', () => {
    console.log("¡Aventura de Bucky iniciada! La página se ha cargado.");

    // --- GESTIÓN GLOBAL ---
    let playerName = '';
    const synth = window.speechSynthesis;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const gameContainer = document.getElementById('game-container');
    const modalManager = document.getElementById('modal-manager');
    let game1Initialized = false, game2Initialized = false, game3Initialized = false;

    // --- GESTIÓN DE MODALES Y NARRATIVA ---
    const modals = {
        'welcome': document.getElementById('welcome-modal'), 'story-1': document.getElementById('story-1-modal'),
        'story-2': document.getElementById('story-2-modal'), 'story-3': document.getElementById('story-3-modal'),
    };
    const games = {
        'game-1': document.getElementById('game-1-backpack'), 'game-2': document.getElementById('game-2-find'),
        'game-3': document.getElementById('game-3-commands'),
    };

    modalManager.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-button')) {
            console.log("Botón de modal presionado. Avanzando...");
            const next = e.target.dataset.next;
            handleFlow(next);
        }
    });
    
    function handleFlow(step) {
        console.log(`Manejando flujo al paso: ${step}`);
        Object.values(modals).forEach(m => m.classList.add('hidden'));
        Object.values(games).forEach(g => g.classList.add('hidden'));
        
        if (modals[step]) {
            if(step === 'story-1') setupStory1(); if(step === 'story-2') setupStory2(); if(step === 'story-3') setupStory3();
            modals[step].classList.remove('hidden');
        } else if (games[step]) {
            modalManager.classList.add('hidden'); gameContainer.classList.remove('hidden'); games[step].classList.remove('hidden');
            if (step === 'game-1' && !game1Initialized) initGame1();
            if (step === 'game-2' && !game2Initialized) initGame2();
            if (step === 'game-3' && !game3Initialized) initGame3();
        }
    }

    function setupStory1() { playerName = document.getElementById('player-name-input').value.trim() || 'Superstar'; document.querySelectorAll('.player-name').forEach(span => span.textContent = playerName); modals['story-1'].querySelector('.story-text').innerHTML = `<p>¡Hola, <strong>${playerName}</strong>! Soy Bucky, tu nueva mochila. ¿Me ayudas a guardar a mis amigos?</p>`; console.log("Historia 1 configurada.");}
    function setupStory2() { modals['story-2'].querySelector('.story-text').innerHTML = `<p>¡Buen trabajo, <strong>${playerName}</strong>! ¡Ahora vamos a jugar a las escondidas!</p>`; console.log("Historia 2 configurada.");}
    function setupStory3() { modals['story-3'].querySelector('.story-text').innerHTML = `<p>¡Eres un gran explorador, <strong>${playerName}</strong>! Última misión: ¡las palabras mágicas!</p>`; console.log("Historia 3 configurada.");}

    // --- UTILIDADES ---
    function playSound(type) { /*...*/ }
    function speak(text) { /*...*/ }

    // --- JUEGO 1: PACK YOUR BACKPACK ---
    const objects = document.querySelectorAll('.object');
    const backpack = document.getElementById('backpack');
    let draggedObject = null;
    
    function initGame1() {
        console.log("Inicializando Juego 1: Arrastrar a la mochila.");
        game1Initialized = true;
        
        objects.forEach(object => {
            console.log(`Añadiendo listeners al objeto: ${object.id}`);
            object.addEventListener('dragstart', (e) => { 
                console.log(`--- DRAGSTART: Empezando a arrastrar ${e.currentTarget.id}`);
                e.dataTransfer.setData('text/plain', e.currentTarget.id);
                e.dataTransfer.effectAllowed = 'move';
                draggedObject = e.currentTarget;
                setTimeout(() => e.currentTarget.classList.add('dragging'), 0); 
            });
            object.addEventListener('dragend', (e) => { 
                console.log(`--- DRAGEND: Se terminó de arrastrar ${e.currentTarget.id}`);
                e.currentTarget.classList.remove('dragging');
            });
        });

        backpack.addEventListener('dragenter', (e) => { 
            e.preventDefault(); 
            console.log("--- DRAGENTER: Objeto entrando en la mochila.");
            backpack.classList.add('drag-over'); 
        });
        backpack.addEventListener('dragover', (e) => { 
            e.preventDefault();
            // console.log("--- DRAGOVER: Objeto sobre la mochila."); // Se comenta para no llenar la consola
        });
        backpack.addEventListener('dragleave', () => { 
            console.log("--- DRAGLEAVE: Objeto saliendo de la mochila.");
            backpack.classList.remove('drag-over'); 
        });
        backpack.addEventListener('drop', (e) => {
            e.preventDefault();
            console.log("--- DROP: ¡Objeto soltado en la mochila!");
            backpack.classList.remove('drag-over');
            if (draggedObject && !draggedObject.classList.contains('packed')) {
                console.log(`Acción de drop válida para: ${draggedObject.id}`);
                draggedObject.classList.add('hidden', 'packed');
                // ... resto de la lógica de éxito
                handleFlow('story-2');
            } else {
                console.log("Acción de drop inválida.");
            }
        });
    }

    // El resto de la lógica de los juegos 2 y 3 no se incluye aquí para enfocarnos en el problema principal.
    // ...
});
