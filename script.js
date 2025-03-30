// Fonction pour récupérer le panier depuis localStorage
function getPanier() {
    return JSON.parse(localStorage.getItem("panier")) || [];
}

// Fonction pour sauvegarder le panier dans localStorage
function savePanier(panier) {
    localStorage.setItem("panier", JSON.stringify(panier));
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(produit) {
    let panier = getPanier();
    
    // Vérifie si le produit est déjà dans le panier
    let produitExistant = panier.find(item => item.id === produit.id);
    if (produitExistant) {
        produitExistant.quantite += 1;
    } else {
        produit.quantite = 1;
        panier.push(produit);
    }

    savePanier(panier);
    alert(produit.nom + " ajouté au panier !");
}

// Écoute les clics sur tous les boutons "Ajouter au panier"
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".button-panier").forEach(button => {
        button.addEventListener("click", function() {
            let produitElement = this.closest(".product");
            let produit = {
                id: produitElement.getAttribute("data-id"),
                nom: produitElement.getAttribute("data-nom"),
                prix: parseFloat(produitElement.getAttribute("data-prix"))
            };

            ajouterAuPanier(produit);
        });
    });

    // Vérifie si on est sur la page panier et affiche le panier
    if (document.getElementById("liste-panier")) {
        afficherPanier();
    }
});

// Fonction pour afficher le panier
function afficherPanier() {
    let panier = getPanier();
    let listePanier = document.getElementById("liste-panier");
    let totalElement = document.getElementById("total");
    listePanier.innerHTML = "";
    let total = 0;

    panier.forEach((produit, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${produit.nom} - ${produit.prix}€ x ${produit.quantite} <button class="btn-action" onclick="supprimerProduit(${index})"><i class="bi bi-x-circle"></i></button>`;
        listePanier.appendChild(li);
        total += produit.prix * produit.quantite;
    });

    totalElement.textContent = total.toFixed(2);
}

// Fonction pour supprimer un produit du panier
function supprimerProduit(index) {
    let panier = getPanier();
    panier.splice(index, 1); // Supprime l'élément à cet index
    savePanier(panier);
    afficherPanier();
    mettreAJourCompteurPanier();
}

// Vider le panier
document.addEventListener("DOMContentLoaded", function() {
    let boutonVider = document.getElementById("vider-panier");
    if (boutonVider) {
        boutonVider.addEventListener("click", function() {
            localStorage.removeItem("panier");
            afficherPanier();
        });
    }
});
