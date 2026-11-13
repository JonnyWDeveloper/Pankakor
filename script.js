// Register the service worker to enable local caching and offline support.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Add fallback support for :has() selector in older browsers
// This adds/removes the .checked class on ingredient list items for CSS fallback styling
document.addEventListener('DOMContentLoaded', () => {
    const ingredientCheckboxes = document.querySelectorAll('.ingredients input[type="checkbox"]');
    
    ingredientCheckboxes.forEach(checkbox => {
        // Set initial state on page load
        const listItem = checkbox.closest('li');
        if (listItem && checkbox.checked) {
            listItem.classList.add('checked');
        }
        
        // Update class when checkbox state changes
        checkbox.addEventListener('change', (event) => {
            const listItem = event.target.closest('li');
            if (listItem) {
                listItem.classList.toggle('checked', event.target.checked);
            }
        });
    });
});

// Handle form submission on the recipe sharing page
const recipeForm = document.getElementById('recipeForm');
if (recipeForm) {
    recipeForm.addEventListener('submit', (e) => {
        if (e.target.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault();
            // Reset form and reload page
            setTimeout(() => {
                e.target.reset();
                location.reload();
            }, 100);
        }
    });

    // Add visual feedback for form validation
    recipeForm.addEventListener('change', () => {
        const inputs = recipeForm.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            if (input.checkValidity()) {
                input.classList.add('valid');
                input.classList.remove('invalid');
            }
        });
    });

    recipeForm.addEventListener('blur', (e) => {
        if (e.target.matches('input, textarea, select')) {
            if (!e.target.checkValidity()) {
                e.target.classList.add('invalid');
                e.target.classList.remove('valid');
            }
        }
    }, true);
}

