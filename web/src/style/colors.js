import Color from "color";

export default {
  // primary colors. Naming these after what they really are; it's an easy find-replace
  // when the names change or the color changes so the name no longer matches
  red: "#E34444",
  green: "#219653",
  blue: "#2D95D6",
  black: "#000000",

  sand: Color("#F2EFEE").lighten(0.03).string(), // light gray background
  border: "#F0EBEB",                             // gray color for most borders

  // gray shades for foreground text
  lightGray: "#B8B2B2",
  medGray: "#595454",
  darkGray: "#141414",

  primary: "#ec0b43",       // red
  detail: "#56666b",        // gray
  background: "#ffffff",    // white
};
