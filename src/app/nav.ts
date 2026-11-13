import { Bookmark, HandHeart, Info, Settings, Tv, type LucideIcon } from 'lucide-react';

/** The More popover. Add a page here and it appears in the nav. */
export interface MoreItem { path: string; label: string; icon: LucideIcon }

export const MORE: MoreItem[] = [
  { path: '/watch', label: 'Watch', icon: Tv },
  { path: '/prayer', label: 'Prayer', icon: HandHeart },
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
];
