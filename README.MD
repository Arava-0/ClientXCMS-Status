# ClientXCMS Status Discord BOT

Ce bot permet d'afficher en temps réel le statut des différents services proposés par ClientXCMS directement sur un salon Discord. Grâce à des commandes simples, vous pouvez configurer les catégories, ajouter des services et surveiller leur disponibilité. Le bot met automatiquement à jour le message de statut en fonction de l'état des services, offrant ainsi un suivi clair et efficace.

---

## Comment utiliser ce bot ?

1. **Configurer votre bot** :
   - Récupérez le token de votre bot depuis le [portail Discord Developer](https://discord.com/developers/applications).
   - Configurez dans le fichier `.env` votre token.

2. **Mise en place** :
   - La commande `/setup <channel>` permets de définir le channel discord où le message de status sera envoyé et mis à jour.
   - Vous pouvez modifier les domaines à ping en éxécutant `/info <add/remove> ...`

## Points forts de ce bot
- **Ultra flexible** : Ce bot utilise la template [DiscordJS-Bot-V14](https://github.com/Arava-0/DiscordBot-Template-V14/) inventé par Arava [[Plus d'informations](https://github.com/Arava-0/DiscordBot-Template-V14/blob/main/README.MD)].

## Propriété
- Ce bot a été développé par Arava pour ClientXCMS. Ce projet est sous licence propriétaire. Tous droits réservés.
- Le contenu de ce référentiel ne peut être utilisé, copié, modifié ou distribué sans l'autorisation écrite expresse de l'auteur / de ClientXCMS.

## Infos pratiques
- Le code lié au status en lui même se trouve dans `/Bot/Status`