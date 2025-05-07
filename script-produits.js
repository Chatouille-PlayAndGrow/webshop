document.querySelectorAll('.product-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();  // Empêche la redirection pour l'exemple

    // On récupère l'ID du lien cliqué (par exemple "product1-link")
    const productId = link.id.split('-')[0];  // Récupère la partie avant le "-"
    
    // On change la couleur de l'encadré de la description
    const descriptionBox = document.querySelector(`#${productId}-description`);
    if (descriptionBox) {
      descriptionBox.style.borderColor = 'red';  // Exemple : couleur rouge
    }

    // Tu peux aussi ajouter des effets ou animations si tu veux
  });
});
