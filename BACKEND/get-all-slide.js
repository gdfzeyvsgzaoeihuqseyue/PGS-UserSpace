module.exports = {
  friendlyName: 'Récupérer toutes les diapositives',
  description: 'Récupère toutes les diapositives actives du carrousel, triées selon leur ordre d’affichage.',

  inputs: {
    isActive: {
      type: 'boolean',
      description: 'Filtrer les diapositives par statut d’activation.',
      defaultsTo: true, 
    },
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Diapositives du carrousel récupérées avec succès.',
    },
    serverError: {
      statusCode: 500,
      description: 'Une erreur inattendue s’est produite.',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const slides = await CarouselSlide.find({
        where: { isActive: inputs.isActive },
        sort: 'order ASC', 
      });

      return exits.success({
        success: true,
        nb: slides.length,
        message: 'Diapositives récupérées avec succès.',
        slides: slides,
      });
    } catch (err) {
      sails.log.error('Erreur lors de la récupération des diapositives du carrousel :', err);
      return exits.serverError({
        message: 'Une erreur interne est survenue lors de la récupération des diapositives.',
        error: err.message,
      });
    }
  },
};
