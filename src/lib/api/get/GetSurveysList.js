import { get, getQuery, firestore } from 'firebase_config'

export const getSurveysList = async (currentUser, type) => {
  let surveys = []
  if (type === 'unansweredSurveysList') {
    surveys = await getQuery(
      firestore.collection('surveys').where('active', '==', true).get()
    )
    const responses = await getQuery(
      firestore.collection('survey_responses').where('userId', '==', currentUser.id).get()
    )
    surveys = surveys.map(sur => {
      const res = responses.find(r => r.surveyId === sur.id)
      if (res) return null
      return sur
    })
    surveys = surveys.filter(s => s !== null)
  } else {
    if (currentUser.admin) {
      surveys = await get('surveys')
    } else {
      surveys = await getQuery(
        firestore.collection('surveys').where('active', '==', true).get()
      )
    }
  }
  surveys = surveys.sort((a, b) => a.createdAt - b.createdAt)
  return surveys
}
