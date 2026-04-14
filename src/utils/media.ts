import media, { setBreakPoints } from "css-in-js-media";

setBreakPoints({
  smallPhone: 320,
  phone: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
});

export { media };