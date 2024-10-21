const heroes = document.querySelectorAll('.hero');
const pickSlots = document.querySelectorAll('.pick-slot');
const banSlots = document.querySelectorAll('.ban-slot');
const heroList = document.getElementById('hero-list');

let selectedSlot = null; // To keep track of the clicked slot

// Drag Start
heroes.forEach(hero => {
    hero.addEventListener('dragstart', dragStart);
});

// Allow drop on pick and ban slots
[...pickSlots, ...banSlots].forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', drop);
    slot.addEventListener('dragenter', dragEnter);
    slot.addEventListener('dragleave', dragLeave);
    slot.addEventListener('click', function () {
        // If there is already a selected slot, clear its selection
        if (selectedSlot) {
            selectedSlot.classList.remove('selected-slot'); // Remove highlight from the previous slot
        }

        selectedSlot = slot; // Store the reference to the clicked slot
        slot.classList.add('selected-slot'); // Highlight the currently selected slot
    });
});

// Add click event listener for heroes
heroes.forEach(hero => {
    hero.addEventListener('click', function () {
        if (selectedSlot) {
            // Check if the selected slot already contains a hero
            const existingHero = selectedSlot.querySelector('.slot-content img');
            if (existingHero) {
                alert('This slot already contains a hero!'); // Alert the user
                return; // Prevent adding a new hero
            }

            // Create a new container for the hero and the remove button
            const slotContent = document.createElement('div');
            slotContent.className = 'slot-content';

            const removeButton = document.createElement('span');
            removeButton.className = 'remove-hero';
            removeButton.textContent = '✖';
            removeButton.onclick = function (event) {
                removeHero(event, hero); // Pass the hero to be removed
            };

            slotContent.appendChild(hero.cloneNode(true)); // Clone the hero image
            slotContent.appendChild(removeButton);

            selectedSlot.appendChild(slotContent); // Add the new container to the target slot

            // Remove the hero from the selection area
            hero.parentNode.removeChild(hero);

            // Clear selected slot after placing the hero
            selectedSlot.classList.remove('selected-slot');
            selectedSlot = null; // Reset the selected slot
        } else {
            alert('Please select a slot first!');
        }
    });
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id); // Store the id of the dragged hero
    e.dataTransfer.effectAllowed = "move"; // Allow move effect
}

function dragOver(e) {
    e.preventDefault(); // Prevent default to allow drop
}

function dragEnter(e) {
    e.preventDefault(); // Prevent default to allow drop
    e.target.classList.add('drag-over'); // Optional: Add class to show hover effect
}

function dragLeave(e) {
    e.target.classList.remove('drag-over'); // Optional: Remove hover effect
}

function drop(e) {
    e.preventDefault();
    const heroId = e.dataTransfer.getData('text/plain'); // Get the id of the dragged hero
    const hero = document.getElementById(heroId);

    // If the target is a slot
    if (e.target.classList.contains('pick-slot') || e.target.classList.contains('ban-slot')) {
        // Check if the slot already contains a hero
        const existingHero = e.target.querySelector('.slot-content img');
        if (existingHero) {
            alert('This slot already contains a hero!'); // Alert the user
            return; // Prevent dropping
        }

        // Remove hero from previous parent if it exists
        if (hero.parentNode) {
            hero.parentNode.removeChild(hero);
        }

        // Create a new container for the hero and the remove button
        const slotContent = document.createElement('div');
        slotContent.className = 'slot-content';

        const removeButton = document.createElement('span');
        removeButton.className = 'remove-hero';
        removeButton.textContent = '✖';
        removeButton.onclick = function (event) {
            removeHero(event, hero); // Pass the hero to be removed
        };

        slotContent.appendChild(hero.cloneNode(true)); // Clone the hero image
        slotContent.appendChild(removeButton);

        e.target.appendChild(slotContent); // Add the new container to the target slot
    }
    e.target.classList.remove('drag-over'); // Remove hover effect
}

function removeHero(e, hero) {
    // Stop the event from bubbling up
    e.stopPropagation();

    const slotContent = e.target.parentElement; // Get the parent of the button
    if (slotContent) {
        // Remove the hero from the slot and return to hero selection
        slotContent.parentElement.removeChild(slotContent);
        heroList.appendChild(hero); // Append the original hero back to the selection area
    }
}

function filterHeroes() {
    const searchBox = document.getElementById('searchBox');
    const filter = searchBox.value.toLowerCase(); // Get the input value and convert to lowercase
    const heroes = document.querySelectorAll('.hero'); // Select all hero images

    // Loop through all hero images
    heroes.forEach(hero => {
        const heroId = hero.id; // Get the ID of the hero
        // Check if the hero ID includes the search input
        if (heroId.toLowerCase().includes(filter)) {
            hero.style.display = ''; // Show the hero
        } else {
            hero.style.display = 'none'; // Hide the hero
        }
    });
}
