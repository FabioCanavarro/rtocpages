import { animate, stagger } from 'animejs';

export function anime(params: any) {
  if (typeof window === 'undefined') return;
  const { targets, ...rest } = params;
  if (!targets) return;
  return animate(targets, rest);
}

anime.stagger = stagger;
export default anime;
