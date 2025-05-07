document.querySelectorAll('.product-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();  // Empêche la redirection pour l'exemple

    // On récupère l'ID du lien cliqué
    const productId = link.id;

    // On change la couleur de l'encadré de la description
    const descriptionBox = document.querySelector(`#${productId}-description`);
    descriptionBox.style.borderColor = 'red';  // Exemple : couleur rouge

    // Tu peux aussi ajouter des effets ou animations si tu veux
  });
});
