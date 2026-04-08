const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// Create Task
function createNewTask() {
    const val = taskInput.value.trim();
    if (!val) return;

    const timestamp = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
    const id = "id-" + Date.now();

    const card = document.createElement('div');
    card.className = "task-card";
    card.id = id;
    card.draggable = true;

    card.innerHTML = `
        <strong>${val}</strong>
        <span class="time-box"><i class="far fa-clock"></i> ${timestamp}</span>
        <div class="card-actions">
            <button class="action-btn next-btn">Move <i class="fas fa-arrow-right"></i></button>
            <button class="action-btn complete-trigger"><i class="fas fa-check"></i></button>
        </div>
    `;

    // Internal Button Logic: Move to Next Column
    card.querySelector('.next-btn').addEventListener('click', () => {
        const currentParent = card.parentElement.id;
        if (currentParent === 'todo') {
            document.getElementById('progress').appendChild(card);
        } else if (currentParent === 'progress') {
            document.getElementById('completed').appendChild(card);
            markAsDone(card);
        }
    });

    // Internal Button Logic: Jump to Completed
    card.querySelector('.complete-trigger').addEventListener('click', () => {
        document.getElementById('completed').appendChild(card);
        markAsDone(card);
    });

    // Drag Events
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', id);
        card.style.opacity = "0.4";
    });

    card.addEventListener('dragend', () => card.style.opacity = "1");

    document.getElementById('todo').appendChild(card);
    taskInput.value = "";
}

// Drag & Drop Handling
document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.style.background = "rgba(56, 189, 248, 0.05)";
    });

    zone.addEventListener('dragleave', () => {
        zone.style.background = "transparent";
    });

    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.style.background = "transparent";
        const id = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(id);
        zone.appendChild(card);

        if (zone.id === 'completed') {
            markAsDone(card);
        } else {
            resetTask(card);
        }
    });
});

function markAsDone(card) {
    card.classList.add('done');
    if (!card.querySelector('.success-tag')) {
        const tag = document.createElement('span');
        tag.className = 'success-tag';
        tag.innerHTML = 'Task Completed Successfully';
        card.appendChild(tag);
    }
    card.querySelector('.next-btn').style.display = 'none';
}

function resetTask(card) {
    card.classList.remove('done');
    const tag = card.querySelector('.success-tag');
    if (tag) tag.remove();
    card.querySelector('.next-btn').style.display = 'inline-block';
}

addTaskBtn.addEventListener('click', createNewTask);
taskInput.addEventListener('keypress', e => { if(e.key === 'Enter') createNewTask(); });