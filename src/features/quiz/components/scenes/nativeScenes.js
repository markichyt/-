import SocialProofScene from './SocialProofScene.vue'
import GoogleRankingScene from './GoogleRankingScene.vue'
import ContentFactoryScene from './ContentFactoryScene.vue'
import AiAdsScene from './AiAdsScene.vue'
import AiSocialsScene from './AiSocialsScene.vue'

// Scene ids that have a native Vue rebuild (Phase 2). Any id not listed here
// falls back to the embedded iframe scene from Phase 1.
//   videoProof → htmlTOvideo/8 (social proof)
//   video1     → htmlTOvideo/2 (#1 in Google Search)
//   video2     → htmlTOvideo/9 (AI Content Factory)
//   videoAds   → htmlTOvideo/1 (AI Ads Promo)
//   videoSocials → htmlTOvideo/3 (AI Socials Promo)
export const nativeScenes = {
  videoProof: SocialProofScene,
  video1: GoogleRankingScene,
  video2: ContentFactoryScene,
  videoAds: AiAdsScene,
  videoSocials: AiSocialsScene
}
