document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();  // Empêche la redirection pour l'exemple

            // Récupère l'ID du lien cliqué (exemple : "product1-link")
            const productId = link.id.split('-')[0];

            // On cherche la description associée
            const descriptionBox = document.querySelector(`#${productId}-description`);
            if (descriptionBox) {
                descriptionBox.style.borderColor = 'red';  // Change la couleur du bord
            } else {
                console.log(`Description non trouvée pour ${productId}`);
            }
        });
    });
});
