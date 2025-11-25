/**
 * Formate une date pour l'affichage
 * Gère différents formats d'entrée (string, Date, timestamp)
 */
export const formatDate = (
  date: string | Date | number | null | undefined,
  locale: string = 'fr-FR',
  fallback: string = 'Jamais'
): string => {
  if (!date || date === '' || date === 'null' || date === 'undefined') {
    return fallback
  }

  try {
    let parsedDate: Date

    // Si c'est déjà un objet Date
    if (date instanceof Date) {
      parsedDate = date
    }
    // Si c'est un timestamp (nombre)
    else if (typeof date === 'number') {
      parsedDate = new Date(date)
    }
    // Si c'est une chaîne de caractères
    else if (typeof date === 'string') {
      parsedDate = new Date(date)
    }
    else {
      return fallback
    }

    // Vérifier si la date est valide
    if (isNaN(parsedDate.getTime())) {
      return fallback
    }

    return parsedDate.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return fallback
  }
}

/**
 * Formate une date de manière relative (il y a X jours)
 */
export const formatRelativeDate = (
  date: string | Date | number | null | undefined,
  locale: string = 'fr-FR',
  fallback: string = 'Jamais'
): string => {
  if (!date || date === '' || date === 'null' || date === 'undefined') {
    return fallback
  }

  try {
    let parsedDate: Date

    if (date instanceof Date) {
      parsedDate = date
    } else if (typeof date === 'number') {
      parsedDate = new Date(date)
    } else if (typeof date === 'string') {
      parsedDate = new Date(date)
    } else {
      return fallback
    }

    if (isNaN(parsedDate.getTime())) {
      return fallback
    }

    const now = new Date()
    const diffMs = now.getTime() - parsedDate.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) {
      return locale === 'fr-FR' ? 'À l\'instant' : 'Just now'
    } else if (diffMin < 60) {
      return locale === 'fr-FR' ? `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}` : `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
    } else if (diffHour < 24) {
      return locale === 'fr-FR' ? `Il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}` : `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
    } else if (diffDay < 7) {
      return locale === 'fr-FR' ? `Il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}` : `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
    } else {
      return formatDate(date, locale, fallback)
    }
  } catch (error) {
    console.error('Error formatting relative date:', error)
    return fallback
  }
}
