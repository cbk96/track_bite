const { Scales, Translate } = require("phosphor-react");
const { transform } = require("typescript");
import * as CT from "./src/constants";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transformOrigin: {
        "center-negative-20": "center -30px",
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"], // 추가된 폰트 패밀리
      },
      colors: {
        grayCustom: "rgba(81, 81, 81, 0.5)", // #515151 색상에 50% 투명도
        main: "#0d4384", //ce1224
        sub: "#634982", //ba8618
        "main-hover": "#092d51", //930924
        "sub-hover": "#44345b", //a57116
        "main-cust": "#D01C1F",
        "main-cust-hover": "#930924",
        "sub-cust": "#ba8618",
        "sub-cust-hover": "#a57116",
        shade: "#f7f7f7",
        inactive: "#9a9a9a",
        orange: "#e88f00",
        "orange-shade": "#fff5ca",
      },
      keyframes: {
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fadeUp: {
          "0%": { marginTop: "50px", opacity: 0 },
          "100%": { marginTop: "0px", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          "0%": { transform: "scale(1.0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1.0)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0px)" },
          "25%": { transform: "translateY(5px)" },
          "50%": { transform: "translateY(-5px)" },
          "75%": { transform: "translateY(5px)" },
        },
        appear: {
          "0%": { display: "none", opacity: "0" },
          "1%": { display: "inline-block", opacity: "0" },
          "100%": { display: "inline-block", opacity: "1" },
        },
        disappear: {
          "0%": { display: "inline-block", opacity: "1" },
          "1%": { display: "inline-block", opacity: "0" },
          "100%": { display: "none", opacity: "0" },
        },
        flyIn: {
          "0%": { transform: "translateY(-40px)" },
          "60%": { transform: "translateY(15px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        spinSlow: "spinSlow 1s linear infinite",
        fadeUp: "fadeUp 0.2s linear ",
        fadeIn: "fadeIn 0.2s linear ",
        pulse: "pulse 1.3s ease-in-out infinite",
        bounce: "bounce 1.3s ease infinite",
        appear: "appear 1.3s ease",
        disappear: "disappear 0.2s linear",
        flyIn: "flyIn 0.4s ease-in-out",
      },
    },
  },
  safelist: [{ pattern: /^line-clamp-(\d+)$/ }],
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
};
