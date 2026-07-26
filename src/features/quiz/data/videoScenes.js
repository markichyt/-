// Maps each video-card step id to its media source.
// Раніше сцени були HTML-анімаціями в <iframe>; тепер це готові відео-шортси (.mp4)
// із public/videos/shorts. VideoSceneCard рендерить <video> для .mp4, інакше — iframe.
import { publicAsset } from './publicAsset.js'

export const videoSceneSources = {
  videoProof: publicAsset('videos/shorts/short-leads.mp4'),
  video1: publicAsset('videos/shorts/short-articles.mp4'),
  video2: publicAsset('videos/shorts/short-profile.mp4'),
  videoAds: publicAsset('videos/shorts/short-social.mp4'),
  videoQa: publicAsset('videos/shorts/short-qa.mp4')
}

// Тільки HTML-сцени префваримо у прихованому iframe; .mp4 вантажаться на вимогу,
// коли користувач доходить до кроку (щоб не тягнути ~7 МБ відео на старті).
export const allSceneSources = Object.values(videoSceneSources).filter((s) => !/\.mp4(\?|$)/i.test(s))
