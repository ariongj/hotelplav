/**
 * Copy and imagery for the Experiences page (design/Experiences.dc.html).
 * Photography is placeholder — swap in the hotel's licensed images.
 */

export type Activity = {
  title: string;
  text: string;
  meta: string;
  image: { src: string; alt: string };
};

export type Season = {
  eyebrow: string;
  title: string;
  note: string;
  /** Light paper section or dark section. */
  tone: "light" | "dark";
  activities: readonly Activity[];
};

export const heroImage = {
  src: "https://static.wixstatic.com/media/1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg",
  alt: "Guests out on the mountain above the resort",
};

export const winter: Season = {
  eyebrow: "Winter · December — March",
  title: "Snow days, made effortless",
  note: "Lift pass & equipment arranged by the concierge",
  tone: "light",
  activities: [
    {
      title: "Ski-in, ski-out",
      text: "150 metres from lobby to lift. Boots warmed overnight, skis waiting at the door, first tracks before breakfast.",
      meta: "Private ski room · Valet",
      image: {
        src: "https://static.wixstatic.com/media/1de95c_da6dacf180bd433788972c2d0b719bcf~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_da6dacf180bd433788972c2d0b719bcf~mv2.jpg",
        alt: "A skier leaving the hotel door",
      },
    },
    {
      title: "School & mountain guides",
      text: "Licensed instructors for first turns, IFMGA guides for the high ridges — both booked through reception.",
      meta: "All levels · From age 4",
      // Empty slot in the prototype; this is the home page's "Winter Escape"
      // (snow peaks at sunrise) photo.
      image: {
        src: "https://static.wixstatic.com/media/1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg",
        alt: "Snow-covered slopes and peaks at sunrise",
      },
    },
    {
      title: "Nights at altitude",
      text: "Torch-lit snowshoe walks, sledding under the stars, and mulled wine on the terrace when you return.",
      meta: "Evenings · Weather permitting",
      image: {
        src: "https://static.wixstatic.com/media/1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg",
        alt: "The terrace at dusk, lanterns glowing in the snow",
      },
    },
  ],
};

export const summer: Season = {
  eyebrow: "Summer · June — September",
  title: "Green season, golden light",
  note: "Trail maps & picnics packed on request",
  tone: "dark",
  activities: [
    {
      title: "Guided peak hikes",
      text: "Dawn ascents of the Sharr ridgeline with a mountain guide — and breakfast waiting at the summit.",
      meta: "3–7 hrs · All levels",
      image: {
        src: "https://static.wixstatic.com/media/1de95c_aa8eaafdd55b4978a19a78a2cd03506d~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_aa8eaafdd55b4978a19a78a2cd03506d~mv2.jpg",
        alt: "A ridgeline hike at golden hour",
      },
    },
    {
      title: "Lakes & trails",
      text: "E-bikes to glacial lakes, wildflower meadows and shepherd villages — routes drawn to your appetite.",
      meta: "Self-guided · GPS routes",
      // Empty slot in the prototype; this is the lake panorama from the
      // 360° tour's valley scene.
      image: {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chiemsee_bei_Seebruck_Luftbild.jpg/3840px-Chiemsee_bei_Seebruck_Luftbild.jpg",
        alt: "Aerial view over a lake and the valley around it",
      },
    },
    {
      title: "The shepherd’s table",
      text: "A private lunch laid in a high meadow — cheeses from the village, bread still warm, nothing but bells and wind.",
      meta: "Private · By reservation",
      // Empty slot in the prototype; this is the home page's "Romance in the
      // Alps" (table set before a mountain window) photo.
      image: {
        src: "https://static.wixstatic.com/media/1de95c_491862344bf74e00b37b650f8249e6a8~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_491862344bf74e00b37b650f8249e6a8~mv2.jpg",
        alt: "A table laid by candlelight before a mountain window",
      },
    },
  ],
};

/** Reveal delays for the three-up grids, as in the prototype. */
export const staggerDelays = [undefined, "80", "160"] as const;
