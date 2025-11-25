# 🔍 Script de Debug Backend pour LastLogin

## Étape 1 : Vérifier la base de données

Dans MongoDB, exécutez cette requête pour voir votre utilisateur complet :

```javascript
db.user.findOne({ email: "steveasterafovo@gmail.com" })
```

**Vérifiez si le champ `last_login` existe et contient une valeur.**

---

## Étape 2 : Ajouter du debug temporaire dans get-session.js

Ajoutez ces logs dans votre fichier `api/controllers/user/auth/get-session.js` :

**Après la ligne où vous récupérez l'utilisateur :**

```javascript
// Récupérer l'utilisateur
const user = await User.findOne({ id: decoded.userId });

// ✅ AJOUTEZ CES LIGNES DE DEBUG
console.log('========================================');
console.log('🔍 DEBUG GET-SESSION');
console.log('========================================');
console.log('User ID:', decoded.userId);
console.log('User trouvé:', user ? 'OUI' : 'NON');
console.log('User complet:', JSON.stringify(user, null, 2));
console.log('lastLogin dans user:', user.lastLogin);
console.log('Type de lastLogin:', typeof user.lastLogin);
console.log('lastLogin est null?:', user.lastLogin === null);
console.log('lastLogin est undefined?:', user.lastLogin === undefined);
console.log('========================================');

if (!user || !user.isActive) {
  throw 'noSession';
}
```

---

## Étape 3 : Redémarrer le serveur backend

1. Arrêtez votre serveur Sails.js
2. Redémarrez-le
3. Rechargez la page `/debug-session` dans le frontend
4. Cliquez sur "Forcer le rechargement"
5. **Regardez les logs dans la console du serveur backend**

---

## Étape 4 : Solutions possibles

### Si `lastLogin` est `undefined` dans les logs :
**➡️ La colonne n'existe pas dans la base de données**

Solution : Créer/mettre à jour la colonne manuellement :

```javascript
// Dans MongoDB
db.user.updateOne(
  { email: "steveasterafovo@gmail.com" },
  { $set: { last_login: new Date() } }
)
```

### Si `lastLogin` est `null` dans les logs :
**➡️ Le login ne met pas à jour le champ correctement**

Solution : Vérifier que le contrôleur `login.js` fonctionne correctement. Ajoutez des logs :

```javascript
// Dans api/controllers/user/auth/login.js
// Après "Mettre à jour la dernière connexion"
const loginTime = new Date();

console.log('🔍 Mise à jour lastLogin pour user:', user.id);
console.log('🔍 loginTime:', loginTime);

await User.updateOne({ id: user.id })
  .set({ lastLogin: loginTime });

console.log('✅ lastLogin mis à jour');

// Vérifier que ça a bien marché
const updatedUser = await User.findOne({ id: user.id });
console.log('🔍 User après update - lastLogin:', updatedUser.lastLogin);
```

### Si `lastLogin` contient une date dans les logs MAIS n'apparaît pas dans la réponse API :
**➡️ Problème de sérialisation**

Solution : Forcer l'inclusion dans la réponse avec une conversion explicite :

```javascript
return exits.success({
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null
  },
  // ... reste
});
```

---

## Étape 5 : Vérifier le mapping des colonnes

Le modèle User utilise `columnName: 'last_login'` mais MongoDB utilise normalement des noms de champs sans underscore.

**Vérifiez dans votre base MongoDB si le champ s'appelle :**
- `last_login` (avec underscore)
- `lastLogin` (camelCase)

Si c'est `lastLogin` dans MongoDB, **retirez** le `columnName: 'last_login'` du modèle :

```javascript
lastLogin: {
  type: 'ref',
  columnType: 'datetime'
  // ❌ Retirez cette ligne si vous utilisez MongoDB : columnName: 'last_login'
},
```

---

## Checklist de diagnostic

- [ ] Vérifier les données utilisateur dans MongoDB
- [ ] Ajouter les logs de debug dans `get-session.js`
- [ ] Ajouter les logs de debug dans `login.js`
- [ ] Redémarrer le serveur backend
- [ ] Se reconnecter et vérifier les logs serveur
- [ ] Vérifier que le champ est bien créé/mis à jour dans la base
- [ ] Vérifier le nom du champ (last_login vs lastLogin)
