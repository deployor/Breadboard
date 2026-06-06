export const pageGridClass =
  "bg-[#fefffe] bg-[linear-gradient(to_right,rgba(25,26,35,0.22)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(25,26,35,0.22)_1.5px,transparent_1.5px),linear-gradient(to_right,rgba(25,26,35,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(25,26,35,0.14)_1px,transparent_1px)] bg-[length:128px_128px,128px_128px,32px_32px,32px_32px]";

export const focusClass =
  "focus-visible:outline-none focus-visible:ring-[5px] focus-visible:ring-[#bd0f3273] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const linkUnderlineClass =
  "relative no-underline after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100";

export const badgeLinkClass =
  "hc-badge-link inline-block origin-center transition duration-180 hover:-translate-y-0.5 hover:scale-105 hover:drop-shadow-[0_8px_14px_rgba(25,26,35,0.2)] focus-visible:-translate-y-0.5 focus-visible:scale-105 focus-visible:drop-shadow-[0_8px_14px_rgba(25,26,35,0.2)] after:hidden [&_img]:origin-center [&_img]:transition-transform hover:[&_img]:-rotate-[1.2deg] focus-visible:[&_img]:-rotate-[1.2deg]";

export const pressableClass =
  "relative overflow-hidden transition duration-180 ease-out hover:-translate-y-px hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(25,26,35,0.2)] active:translate-y-0 active:scale-[0.98]";

export const stepCardClass =
  "step-card relative overflow-hidden rounded-[5px] border-[1.1px] border-black bg-[#BD0F32] transition duration-[260ms] ease-out after:hidden hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(25,26,35,0.22)]";

export const stepImageShellClass =
  "relative mx-5 mb-5 overflow-hidden border-[1.1px] border-black bg-[#D9D9D9] after:absolute after:inset-0 after:translate-x-[-130%] after:bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.24)_50%,transparent_80%)] after:transition-transform after:duration-500 after:content-[''] group-hover:after:translate-x-[130%]";

export const stepImageClass =
  "object-cover transition duration-[360ms] ease-out group-hover:scale-[1.06] group-hover:rotate-[0.35deg] group-hover:saturate-[1.1] group-hover:contrast-[1.04]";
