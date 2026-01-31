const columnsOrder = ['todo', 'process', 'done'];

let draggedCard = null;
let currentColumn = null;
let editingCard = null;

/* ---------- MODAL ---------- */
function openModal(columnId, card = null) {
    currentColumn = columnId;
    editingCard = card;

    const modal = document.getElementById('modal');
    const titleInput = document.getElementById('modal-title');
    const descInput = document.getElementById('modal-desc');
    const actionBtn = document.getElementById('modal-action');

    if (card) {
        titleInput.value = card.querySelector('.card-title').textContent;
        descInput.value = card.querySelector('.card-desc').textContent;
        actionBtn.textContent = 'Save';
    } else {
        titleInput.value = '';
        descInput.value = '';
        actionBtn.textContent = 'Create';
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editingCard = null;
}

function saveCard() {
    const title = document.getElementById('modal-title').value.trim();
    const desc = document.getElementById('modal-desc').value.trim();

    if (!title || !desc) {
        alert('Заполните все поля');
        return;
    }

    if (editingCard) {
        editingCard.querySelector('.card-title').textContent = title;
        editingCard.querySelector('.card-desc').textContent = desc;
    } else {
        addCard(currentColumn, title, desc);
    }

    closeModal();
}

/* ---------- CARD ---------- */
function addCard(columnId, title, desc) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.column = columnId;
    card.draggable = true;

    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);

    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title;

    const cardDesc = document.createElement('div');
    cardDesc.className = 'card-desc';
    cardDesc.textContent = desc;

    const buttons = document.createElement('div');
    buttons.className = 'card-buttons';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => openModal(columnId, card);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => card.remove();

    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    card.appendChild(buttons);

    document.getElementById(columnId).appendChild(card);
}

/* ---------- DRAG & DROP ---------- */
function dragStart() {
    draggedCard = this;
    this.classList.add('dragging');
}

function dragEnd() {
    this.classList.remove('dragging');
    draggedCard = null;
}

document.querySelectorAll('.cards').forEach(column => {
    column.addEventListener('dragover', e => e.preventDefault());

    column.addEventListener('dragenter', function () {
        this.classList.add('drag-over');
    });

    column.addEventListener('dragleave', function () {
        this.classList.remove('drag-over');
    });

    column.addEventListener('drop', function () {
        this.classList.remove('drag-over');
        if (!draggedCard) return;
        this.appendChild(draggedCard);
        draggedCard.dataset.column = this.id;
    });
});
