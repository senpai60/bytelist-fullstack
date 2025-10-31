import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Bookmark,
  Home,
  BookOpen,
  User2,
  Settings,
  PlusCircleIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { link: "/", linkIcon: <Home /> },
  { link: "/add-repo-post", linkIcon: <PlusCircleIcon /> },
  { link: "/archive", linkIcon: <Bookmark /> },
];

function NavBar({ isLoggedIn }) {
  const rightLinks = [
    { link: "/playlists", linkIcon: <BookOpen /> },
    { link: "/settings", linkIcon: <Settings /> },
    {
      link: `${isLoggedIn ? "/profile" : "/auth/:signup"}`,
      linkIcon: <User2 />,
    },
  ];
  return (
    <nav className="w-full fixed z-999 bg-zinc-950 flex flex-wrap items-center justify-between px-5 py-2 text-white">
      {/* LOGO */}
      <div className="logo w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
        <h3 className="text-lg font-medium text-zinc-600">
          <span className="italic underline text-zinc-400">Byte</span> List
        </h3>
      </div>

      {/* LEFT LINKS */}
      <NavigationMenu className="flex-1 sm:flex-none">
        <NavigationMenuList className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <div className="links flex flex-wrap gap-3 justify-center">
            {navLinks.map((link, linkIndex) => (
              <NavigationMenuLink
                key={linkIndex}
                href={link.link}
                className="cursor-pointer hover:text-gray-300 transition-colors text-sm sm:text-base"
              >
                {link.linkIcon}
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* RIGHT LINKS */}
      <NavigationMenu className="flex-1 sm:flex-none mt-2 sm:mt-0">
        <NavigationMenuList className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
          <div className="nav-right flex flex-wrap items-center gap-3 justify-center">
            {rightLinks.map((link, linkIndex) => (
              <NavigationMenuLink
                key={linkIndex}
                href={link.link}
                className="cursor-pointer hover:text-gray-300 transition-colors text-sm sm:text-base"
              >
                {link.linkIcon}
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default NavBar;
