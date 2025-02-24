#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "❌ Erreur : Ce script doit être exécuté avec sudo !"
    exit 1
fi

echo "✅ Démarrage de l'installation de ClientXCMS-Status-Bot..."

echo "🔧 Configuration des permissions pour ping..."
PING_PATH=$(which ping)
if [ -z "$PING_PATH" ]; then
    echo "❌ Erreur : Impossible de trouver la commande 'ping'."
    exit 1
fi
sudo chmod u+s "$PING_PATH" && echo "✅ Permissions de ping mises à jour." || { echo "❌ Échec de la configuration des permissions pour ping."; exit 1; }

echo "📦 Installation des dépendances npm..."
npm install && echo "✅ Installation terminée." || { echo "❌ Échec de l'installation des dépendances."; exit 1; }

echo "🚀 Démarrage du bot avec PM2..."
pm2 start index.js --name ClientXCMS-Status-Bot && echo "✅ Bot démarré avec succès !" || { echo "❌ Échec du démarrage du bot."; exit 1; }

echo "💾 Sauvegarde du processus PM2..."
pm2 save && echo "✅ Processus sauvegardé." || { echo "❌ Échec de la sauvegarde du processus."; exit 1; }

echo "🎉 Installation terminée avec succès !"
exit 0
