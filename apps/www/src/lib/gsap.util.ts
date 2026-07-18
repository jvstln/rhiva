import { useGSAP } from "@gsap/react";
import gsap, { Draggable, DrawSVGPlugin, Flip, ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(Flip, ScrollTrigger, SplitText, Draggable, DrawSVGPlugin);

const useGSAPWrapper = (...wrapperArgs: Parameters<typeof useGSAP>) => {
  const [contextFunction, config] = wrapperArgs;

  return useGSAP(
    (...args) => {
      // Remove all gsap-reveal class making the elements to appear
      gsap.utils.toArray(".gsap-reveal").forEach((el) => {
        if (el instanceof Element) {
          el.classList.remove("gsap-reveal");
        }
      });

      if (typeof contextFunction === "function") {
        return contextFunction(...args);
      }
    },
    config ??
      (typeof contextFunction !== "function" ? contextFunction : undefined),
  );
};

export {
  gsap,
  Flip,
  ScrollTrigger,
  SplitText,
  Draggable,
  useGSAPWrapper as useGSAP,
};
