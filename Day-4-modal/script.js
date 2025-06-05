// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const body = document.body;

    // Add blur effect to background
    body.classList.add('modal-open');

    // Show modal with animation
    modal.classList.add('active');

    // Focus management
    const firstFocusable = modal.querySelector('button, input, textarea, select');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 300);
    }

    // Auto-close loading modal after 3 seconds
    if (modalId === 'loadingModal') {
        setTimeout(() => closeModal(modalId), 3000);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const body = document.body;

    // Remove modal
    modal.classList.remove('active');

    // Remove blur effect
    setTimeout(() => {
        body.classList.remove('modal-open');
    }, 300);
}

function confirmAction() {
    alert('Action confirmed!');
    closeModal('confirmModal');
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Form submission handler
document.querySelector('#formModal form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Form submitted successfully!');
    closeModal('formModal');
});

// Prevent modal content clicks from closing modal
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});