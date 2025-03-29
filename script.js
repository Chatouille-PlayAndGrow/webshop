<script>
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
            produitExistant.quantite += 1; // Augmente la quantité
        } else {
            produit.quantite = 1; // Ajoute une nouvelle entrée avec quantité 1
            panier.push(produit);
        }

        savePanier(panier);
        alert(produit.nom + " ajouté au panier !");
    }

    // Écoute les clics sur tous les boutons "Ajouter au panier"
    document.querySelectorAll(".btn-ajouter").forEach(button => {
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
</script>
