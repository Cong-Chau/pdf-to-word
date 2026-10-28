import type { SVGProps } from "react";

const paths = {
  document: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h5",
  upload: "M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  shield: "M12 3 4 6v6c0 4 8 9 8 9s8-5 8-9V6l-8-3Zm-4 9 3 3 5-6",
  close: "m6 6 12 12M6 18 18 6",
} as const;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
