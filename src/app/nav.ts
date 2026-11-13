import { Bookmark, Info, Settings, type LucideIcon } from 'lucide-react';

/** The More popover. Add a page here and it appears in the nav. */
export interface MoreItem { path: string; label: string; icon: LucideIcon }

export const MORE: MoreItem[] = [
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
];
