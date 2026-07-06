// Profile-completeness score (0–100) shown in the top-bar scale and reused by
// the assessment card. Weights are ported verbatim from the original.
export function calculateProfileScore(quizData) {
  let score = 0
  if (Array.isArray(quizData.profession) ? quizData.profession.length > 0 : quizData.profession) score += 15
  if (quizData.city || quizData.zip) score += 10
  if (quizData.role) score += 10
  if (quizData.services && quizData.services.length > 0) score += 10
  if (quizData.channels && quizData.channels.length > 0) score += 5
  if (quizData.preferred_way) score += 5
  if (quizData.marketing_time) score += 5
  if (quizData.ad_budget) score += 5
  if (quizData.team && quizData.team.length > 0) score += 3
  if (quizData.desired_clients !== undefined) score += 2
  if (quizData.desired_revenue !== undefined) score += 2
  if (quizData.period) score += 5
  if (quizData.time_on_platform) score += 3
  if (quizData.first_name) score += 3
  if (quizData.last_name) score += 3
  if (quizData.email) score += 4
  if (quizData.phone) score += 4
  return Math.min(score, 100)
}
