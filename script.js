document.addEventListener('DOMContentLoaded', () => {

    // --- GESTIÓN GLOBAL ---
    let playerName = '';
    const synth = window.speechSynthesis;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const gameContainer = document.getElementById('game-container');
    const modalManager = document.getElementById('modal-manager');
    let game1Initialized = false;
    let game2Initialized = false;
    let game3Initialized = false;

    // --- GESTIÓN DE MODALES Y NARRATIVA ---
    const modals = {
        'welcome': document.getElementById('welcome-modal'),
        'story-1': document.getElementById('story-1-modal'),
        'story-2': document.getElementById('story-2-modal'),
        'story-3': document.getElementById('story-3-modal'),
    };
    const games = {
        'game-1': document.getElementById('game-1-backpack'),
        'game-2': document.getElementById('game-2-find'),
        'game-3': document.getElementById('game-3-commands'),
    };

    modalManager.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-button')) {
            const next = e.target.dataset.next;
            if (modals[next] || games[next]) {
                handleFlow(next);
            }
        }
    });
    
    function handleFlow(step) {
        Object.values(modals).forEach(m => m.classList.add('hidden'));
        Object.values(games).forEach(g => g.classList.add('hidden'));
        
        if (modals[step]) {
            if(step === 'story-1') setupStory1();
            if(step === 'story-2') setupStory2();
            if(step === 'story-3') setupStory3();
            modals[step].classList.remove('hidden');
        } else if (games[step]) {
            modalManager.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            games[step].classList.remove('hidden');
            
            if (step === 'game-1' && !game1Initialized) initGame1();
            if (step === 'game-2' && !game2Initialized) initGame2();
            if (step === 'game-3' && !game3Initialized) initGame3();
        }
    }

    function setupStory1() { playerName = document.getElementById('player-name-input').value.trim() || 'Superstar'; document.querySelectorAll('.player-name').forEach(span => span.textContent = playerName); modals['story-1'].querySelector('.story-text').innerHTML = `<p>¡Hola, <strong>${playerName}</strong>! Soy Bucky, tu nueva mochila. Para nuestra primera aventura, ¿me ayudas a guardar a mis amigos, los útiles escolares?</p>`; }
    function setupStory2() { modals['story-2'].querySelector('.story-text').innerHTML = `<p>¡Buen trabajo, <strong>${playerName}</strong>! Pero... ¡mira! ¡El resto de los útiles quieren jugar a las escondidas! Ayúdame a encontrarlos.</p>`; }
    function setupStory3() { modals['story-3'].querySelector('.story-text').innerHTML = `<p>¡Eres un gran explorador, <strong>${playerName}</strong>! Para la última misión, la pizarra mágica nos enseñará algunas acciones. ¡Vamos a hacer magia!</p>`; }

    // --- UTILIDADES DE SONIDO Y VOZ ---
    function playSound(type) {const o=audioContext.createOscillator();const g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);if(type==='pickup'){o.type='square';o.frequency.setValueAtTime(150,audioContext.currentTime);g.gain.setValueAtTime(0.1,audioContext.currentTime);}else if(type==='drop'){o.type='sine';o.frequency.setValueAtTime(440,audioContext.currentTime);g.gain.setValueAtTime(0.2,audioContext.currentTime);}o.start();o.stop(audioContext.currentTime+0.1);}
    function speak(text) { if(synth.speaking) return; const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; synth.speak(u); }

    // --- LÓGICA JUEGO 1: PACK YOUR BACKPACK ---
    const objects = document.querySelectorAll('.object');
    const backpack = document.getElementById('backpack');
    const packedItemsContainer = document.getElementById('packed-items-display');
    const progressTracker1 = document.querySelector('#game-1-backpack .progress-tracker');
    let draggedObject = null;
    let objectsInBackpack = 0;
    
    function initGame1() {
        game1Initialized = true;
        objects.forEach(object => {
            object.addEventListener('dragstart', (e) => { 
                // ***** CAMBIO IMPORTANTE AQUÍ *****
                // Esta línea es esencial para la compatibilidad con todos los navegadores
                e.dataTransfer.setData('text/plain', e.currentTarget.id);
                e.dataTransfer.effectAllowed = 'move';

                draggedObject = e.currentTarget; // Usamos currentTarget para más robustez
                playSound('pickup'); 
                setTimeout(() => {
                    e.currentTarget.classList.add('dragging');
                }, 0); 
            });
            object.addEventListener('dragend', (e) => { 
                e.currentTarget.classList.remove('dragging');
            });
            object.addEventListener('mouseenter', () => speak(object.dataset.name));
        });
        backpack.addEventListener('dragenter', (e) => { e.preventDefault(); backpack.classList.add('drag-over'); });
        backpack.addEventListener('dragover', (e) => { 
            e.preventDefault(); // Permitir que se suelte el objeto
        });
        backpack.addEventListener('dragleave', () => { backpack.classList.remove('drag-over'); });
        backpack.addEventListener('drop', (e) => {
            e.preventDefault();
            backpack.classList.remove('drag-over');
            if (draggedObject && !draggedObject.classList.contains('packed')) {
                playSound('drop');
                packedItemsContainer.innerHTML += `<div class="packed-item">${draggedObject.innerHTML.split('<span')[0]}</div>`;
                draggedObject.classList.add('hidden');
                draggedObject.classList.add('packed');
                objectsInBackpack++;
                progressTracker1.textContent = `Objects Packed: ${objectsInBackpack} / ${objects.length}`;
                if (objectsInBackpack === objects.length) {
                    setTimeout(() => {
                        modalManager.classList.remove('hidden');
                        handleFlow('story-2');
                    }, 1000);
                }
            }
        });
    }

    // --- LÓGICA JUEGO 2: FIND THE OBJECT ---
    const findScene = document.getElementById('find-scene');
    const findableObjects = Array.from(findScene.querySelectorAll('.findable-object'));
    const findCommand = document.getElementById('find-command');
    let objectsToFind = [];
    let currentObjectToFind = null;
    
    function initGame2() {
        game2Initialized = true;
        objectsToFind = [...findableObjects].sort(() => 0.5 - Math.random());
        findableObjects.forEach(obj => {
            obj.style.top = `${Math.random() * 80 + 10}%`;
            obj.style.left = `${Math.random() * 80 + 10}%`;
            obj.classList.remove('hidden', 'found');
            obj.addEventListener('click', handleFindClick);
        });
        nextObjectToFind();
    }
    
    function nextObjectToFind() {
        if (objectsToFind.length === 0) { setTimeout(() => { modalManager.classList.remove('hidden'); handleFlow('story-3'); }, 1000); return; }
        currentObjectToFind = objectsToFind.pop();
        const nameToFind = currentObjectToFind.dataset.name;
        findCommand.textContent = `Find the ${nameToFind}`; speak(`Find the ${nameToFind}`);
    }

    function handleFindClick(e) {
        const clickedObject = e.currentTarget;
        if (clickedObject === currentObjectToFind) {
            playSound('drop'); clickedObject.classList.add('found');
            clickedObject.removeEventListener('click', handleFindClick);
            setTimeout(nextObjectToFind, 1000);
        } else { playSound('pickup'); }
    }

    // --- LÓGICA JUEGO 3: LISTEN AND DO ---
    const commandObjects = document.querySelectorAll('.command-object');
    const doCommand = document.getElementById('do-command');
    const actions = [
        { action: 'open', element: document.querySelector('[data-action="open"]'), text: 'Open the book' },
        { action: 'draw', element: document.querySelector('[data-action="draw"]'), text: 'Draw with the pencil' },
        { action: 'glue', element: document.querySelector('[data-action="glue"]'), text: 'Use the glue' }
    ];
    let currentAction = 0;

    function initGame3() {
        game3Initialized = true;
        currentAction = 0;
        commandObjects.forEach(obj => {
            obj.classList.remove('animated');
            obj.addEventListener('click', handleCommandClick);
        });
        nextCommand();
    }

    function nextCommand() {
        if (currentAction >= actions.length) {
            setTimeout(() => {
                games['game-3'].classList.add('hidden');
                document.getElementById('final-success-message').classList.remove('hidden');
            }, 1000); return;
        }
        doCommand.textContent = actions[currentAction].text; speak(actions[currentAction].text);
    }

    function handleCommandClick(e) {
        const clickedAction = e.currentTarget.dataset.action;
        if(clickedAction === actions[currentAction].action) {
            playSound('drop'); e.currentTarget.classList.add('animated');
            currentAction++;
            setTimeout(() => { e.currentTarget.classList.remove('animated'); nextCommand(); }, 1500);
        } else { playSound('pickup'); }
    }
    
    // --- LÓGICA DE REINICIO ---
    document.getElementById('reset-button').addEventListener('click', () => {
        location.reload();
    });
});
