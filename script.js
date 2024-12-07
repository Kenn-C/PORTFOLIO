const roles = ["Data Analyst", "Data Scientist"];
let roleIndex = 0; 

const roleElement = document.getElementById("dynamic-role");

function updateRole() {

    roleElement.style.opacity = "0";

  
    setTimeout(() => {
        roleElement.textContent = roles[roleIndex]; 
        roleElement.style.opacity = "1"; // Fade back

        
        roleIndex = (roleIndex + 1) % roles.length;
    }, 500); 
}

updateRole();
setInterval(updateRole, 4000);


const certificates = document.querySelectorAll('.certificate');

function animateCertificates(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            certificates.forEach((certificate, index) => {
                setTimeout(() => {
                    certificate.classList.add('visible');
                }, index * 150);
            });
        } else {

            certificates.forEach(certificate => {
                certificate.classList.remove('visible');
            });
        }
    });
}

const observer = new IntersectionObserver(animateCertificates, {
    threshold: 0.4, 
});

observer.observe(document.getElementById('accomplishments'));





document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar');
    const inputField = document.getElementById('user-input');
    const updateButton = document.getElementById('update-bars');
    const errorContainer = document.querySelector('.error-message');

   
    function updateBarValuesRandomly() {
        bars.forEach(bar => {
            const barFill = bar.querySelector('.bar-fill');
            const randomValue = Math.floor(Math.random() * 100) + 1; 
            const randomValuePercent = `${randomValue}%`;

            bar.setAttribute('data-value', randomValuePercent);
            barFill.style.width = randomValuePercent;

            // Change color
            barFill.style.backgroundColor = randomValue > 70 ? '#6808f8' : '#5e4598'; 
        });
    }

    function startBarUpdates() {
        setInterval(() => {
            updateBarValuesRandomly();

        
        }, 4000);
    }


    function validateInput(value) {
        if (isNaN(value)) {
            return 'Please enter a number.';
        }
        if (value < 0 || value > 100) {
            return 'Please enter a percentage between 0 and 100.';
        }
        return null;
    }


    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        inputField.classList.add('error-highlight');
        inputField.focus();
    }

    function clearError() {
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
        inputField.classList.remove('error-highlight');
    }


    updateButton.addEventListener('click', () => {
        const userValue = parseInt(inputField.value, 10);
        const errorMessage = validateInput(userValue);
        if (errorMessage) {
            showError(errorMessage);
            return;
        }
        bars.forEach(bar => {
            const barFill = bar.querySelector('.bar-fill');
            const userValuePercent = `${userValue}%`;
            bar.setAttribute('data-value', userValuePercent);
            barFill.style.width = userValuePercent;

            barFill.style.backgroundColor = userValue > 70 ? '#6808f8' : '#5e4598';
        });

        clearError(); 
    });


    startBarUpdates();
});
