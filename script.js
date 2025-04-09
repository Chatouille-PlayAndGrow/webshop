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

     if (panier.length === 0) {
        // Ajoute une ligne dans le tbody si le panier est vide
        let ligneVide = document.createElement("tr");
        ligneVide.innerHTML = `<td colspan="5" class="panier-vide">Votre panier est vide</td>`;
        listePanier.appendChild(ligneVide);
    } else {
        panier.forEach((produit, index) => {
            let ligne = document.createElement("tr");
            ligne.innerHTML = `<td>${produit.nom}</td> <td>${produit.prix.toFixed(2)}€</td> <td>${produit.quantite}</td> <td>${(produit.prix * produit.quantite).toFixed(2)}€</td> <td><button onclick="supprimerProduit(${index})"><i class="bi bi-x-circle"></i></button></td>`;
            listePanier.appendChild(ligne);
            total += produit.prix * produit.quantite;
        });
    }
    
    totalElement.textContent = total.toFixed(2);
}

// Appel initial pour afficher le panier dès le chargement
document.addEventListener("DOMContentLoaded", afficherPanier);

// Fonction pour supprimer un produit du panier
function supprimerProduit(index) {
    let panier = getPanier();
    panier.splice(index, 1); // Supprime l'élément à cet index
    savePanier(panier);
    afficherPanier();
    mettreAJourCompteurPanier();
}

document.getElementById("commander").addEventListener("click", function() {
    let panier = getPanier();

    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    let emailClient = prompt("Veuillez entrer votre adresse email pour recevoir la confirmation :");

    // Créer le contenu de l'email
    let contenu = panier.map(p =>
        `${p.nom} - ${p.quantite} x ${p.prix.toFixed(2)}€ = ${(p.quantite * p.prix).toFixed(2)}€`
    ).join("\n");

    let total = panier.reduce((t, p) => t + p.prix * p.quantite, 0).toFixed(2);
    
    alert("ici");
    // Envoyer l'email avec EmailJS
    emailjs.send("service_wwi2hca", "template_8qiiggq", {
        produits: contenu,
        total: total,
        email: emailClient
    })
        
    .then(function () {
        alert("Commande envoyée par email !");
        localStorage.removeItem("panier");
        afficherPanier(); // ou window.location.reload();
    }, function (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi de l'email.");
    });
});
