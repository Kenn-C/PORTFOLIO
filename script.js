const roles = ["Data Analyst", "Data Scientist"];
let roleIndex = 0; // Start with the first role

const roleElement = document.getElementById("dynamic-role");

function updateRole() {
    // Hide the text (fade out)
    roleElement.style.opacity = "0";

    // Change text after the fade-out is complete
    setTimeout(() => {
        roleElement.textContent = roles[roleIndex]; // Update role
        roleElement.style.opacity = "1"; // Fade back in

        // Cycle to the next role, looping back to the start
        roleIndex = (roleIndex + 1) % roles.length;
    }, 500); // Matches the fade-out duration
}

// Start the rotation immediately and repeat every 4 seconds
updateRole();
setInterval(updateRole, 4000);


// Select all certificates
const certificates = document.querySelectorAll('.certificate');

// Function to trigger the animation
function animateCertificates(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animation class with a delay for each certificate
            certificates.forEach((certificate, index) => {
                setTimeout(() => {
                    certificate.classList.add('visible');
                }, index * 150);
            });
        } else {
            // Reset the animation when leaving the viewport
            certificates.forEach(certificate => {
                certificate.classList.remove('visible');
            });
        }
    });
}

// Create an IntersectionObserver
const observer = new IntersectionObserver(animateCertificates, {
    threshold: 0.4, // Trigger when 30% of the section is visible
});

// Observe the "Accomplishments" section
observer.observe(document.getElementById('accomplishments'));





document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar');
    const inputField = document.getElementById('user-input');
    const updateButton = document.getElementById('update-bars');
    const errorContainer = document.querySelector('.error-message');

    // Function to update bar values with random percentages
    function updateBarValuesRandomly() {
        bars.forEach(bar => {
            const barFill = bar.querySelector('.bar-fill');
            const randomValue = Math.floor(Math.random() * 100) + 1; // Random value between 1 and 100
            const randomValuePercent = `${randomValue}%`;

            // Set the bar's data-value attribute and adjust its width
            bar.setAttribute('data-value', randomValuePercent);
            barFill.style.width = randomValuePercent;

            // Change color dynamically based on value
            barFill.style.backgroundColor = randomValue > 70 ? '#6808f8' : '#5e4598'; // Brighter for higher values
        });
    }

    // Function to start periodic bar updates
    function startBarUpdates() {
        setInterval(() => {
            updateBarValuesRandomly();

            // Optional: Delay logic before the next random update (if needed)
        }, 4000); // Adjust the interval (4000ms = 4 seconds per update cycle)
    }

    // Function to validate user input
    function validateInput(value) {
        if (isNaN(value)) {
            return 'Please enter a number.';
        }
        if (value < 0 || value > 100) {
            return 'Please enter a percentage between 0 and 100.';
        }
        return null;
    }

    // Function to display error messages
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        inputField.classList.add('error-highlight');
        inputField.focus();
    }

    // Function to clear error messages
    function clearError() {
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
        inputField.classList.remove('error-highlight');
    }

    // User input handler for manual bar updates
    updateButton.addEventListener('click', () => {
        const userValue = parseInt(inputField.value, 10);

        // Validate input
        const errorMessage = validateInput(userValue);
        if (errorMessage) {
            showError(errorMessage);
            return;
        }

        // If valid, update the bars
        bars.forEach(bar => {
            const barFill = bar.querySelector('.bar-fill');
            const userValuePercent = `${userValue}%`;
            bar.setAttribute('data-value', userValuePercent);
            barFill.style.width = userValuePercent;

            // Apply user-specific styles dynamically
            barFill.style.backgroundColor = userValue > 70 ? '#6808f8' : '#5e4598'; // Brighter for higher values
        });

        clearError(); // Clear error messages on successful update
    });

    // Start the automatic bar updates
    startBarUpdates();
});
