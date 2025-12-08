import { Home, NoteText } from "iconsax-react";

export const sidebarItems = [
  {
    group: "FitPulse",
    childrens: [
      {
        label: "Dashboard",
        href: "/",
        icon: Home,
      },
      {
        label: "Logs",
        href: "/logs",
        icon: NoteText,
      },
    ],
  },
];
