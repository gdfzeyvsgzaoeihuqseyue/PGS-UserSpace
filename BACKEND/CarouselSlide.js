module.exports = {
  attributes: {
    order: {
      type: 'number',
      unique: true,
      required: true,
      description: 'Ordre d\'affichage de la diapositive dans le carrousel.',
      example: 1,
    },
    type: {
      type: 'string',
      isIn: ['quote', 'text', 'image'],
      required: true,
      description: 'Type de contenu de la diapositive (citation, texte ou image).',
      example: 'quote',
    },
    mainTitle: {
      type: 'string',
      required: true,
      maxLength: 200,
      description: 'Titre principal affiché en haut de la section carrousel.',
      example: 'Transformez votre entreprise',
    },
    mainDescription: {
      type: 'string',
      required: true,
      maxLength: 500,
      description: 'Description principale affichée sous le titre.',
      example: 'Découvrez comment nos outils simplifient votre quotidien...',
    },
    content: {
      type: 'string',
      allowNull: true,
      description: 'Contenu textuel principal de la diapositive (citation ou texte détaillé).',
      example: "J'ai boosté mon entreprise en 1 semaine...",
    },
    author: {
      type: 'string',
      allowNull: true,
      maxLength: 100,
      description: 'Auteur de la citation, si le type est "quote".',
      example: 'Christelle AKIOLLA, Développeuse à HODD',
    },
    image: {
      type: 'string',
      allowNull: true,
      description: 'URL de l\'image principale affichée dans le contenu de la diapositive.',
      example: 'https://www.example.com/slide-image.jpg',
    },
    backgroundImage: {
      type: 'string',
      allowNull: true,
      description: 'URL de l\'image d\'arrière-plan subtile de la diapositive.',
      example: 'https://www.example.com/bg-image.jpg',
    },
    isActive: {
      type: 'boolean',
      defaultsTo: true,
      description: 'Si la diapositive est actuellement active et doit être affichée.',
    },
  },
};
