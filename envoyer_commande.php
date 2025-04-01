<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $panier = $data["panier"];
    
    $email_client = "client@example.com"; // Remplace par l'email du client
    $email_admin = "tonemail@tonsite.com";

    // Construire le message
    $message_client = "Merci pour votre commande ! Voici le récapitulatif :\n\n";
    $message_admin = "Nouvelle commande reçue :\n\n";

    foreach ($panier as $produit) {
        $message_client .= $produit["nom"] . " - " . $produit["prix"] . "€\n";
        $message_admin .= $produit["nom"] . " - " . $produit["prix"] . "€\n";
    }

    $message_client .= "\nPaiement : Virement bancaire à [TON RIB ICI].";
    $message_admin .= "\nContact client : $email_client.";

    // Envoyer l'email au client
    mail($email_client, "Votre commande sur TonSite", $message_client, "From: contact@tonsite.com");

    // Envoyer l'email à toi-même
    mail($email_admin, "Nouvelle commande reçue", $message_admin, "From: contact@tonsite.com");

    echo "Commande envoyée ! Vérifiez votre email.";
}
?>
