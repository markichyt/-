// Maps each video-card step id to its pre-built HTML animation scene.
// Phase 1 embeds these scenes in an <iframe>; Phase 2 will swap selected
// entries for native Vue scene components.
export const videoSceneSources = {
  videoProof: './htmlTOvideo/8/ConsultantLM Promo.html',
  video1: './htmlTOvideo/2/ConsultantLM Promo 2.html',
  video2: './htmlTOvideo/9/ConsultantLM Promo.html',
  videoAds: './htmlTOvideo/1/ConsultantLM Promo 1.html',
  videoSocials: './htmlTOvideo/3/ConsultantLM Promo 3.html'
}

// All scenes, pre-warmed in a hidden iframe at quiz start so they are cached
// by the time the user swipes to an animation step.
export const allSceneSources = Object.values(videoSceneSources)
