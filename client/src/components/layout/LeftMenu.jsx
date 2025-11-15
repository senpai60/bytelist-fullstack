import React from "react";
import {
  Bookmark,
  Home,
  BookOpen,
  User2,
  Settings,
  PlusCircle,
  Trophy,
  LayoutList,
  LogOut,
} from "lucide-react";

const navLinks = [
  { link: "/", linkIcon: Home, label: "Home" },
  { link: "/add-repo-post", linkIcon: PlusCircle, label: "Create" },
  { link: "/archive", linkIcon: Bookmark, label: "Archive" },
  { link: "/challenges", linkIcon: Trophy, label: "Challenges" },
  { link: "/tasks", linkIcon: LayoutList, label: "My Tasks" },
  { link: "/playlists", linkIcon: BookOpen, label: "Playlists" },
  { link: "/settings", linkIcon: Settings, label: "Settings" },
];

function LeftMenu({ handleLogout,isLoggedIn }) {
  const authLink = {
    link: isLoggedIn ? "/profile" : "/auth/login",
    linkIcon: User2,
    label: isLoggedIn ? "Profile" : "Sign In",
  };

  return (
    <>
    <nav className="hidden md:flex md:flex-col bg-zinc-950">
      {/* ===== Logo ===== */}
      <div className="logo mt-4">
        <img src="/images/btye-list.png" alt="Logo" />
        <span className="logo-text">ByteList</span>
      </div>

      {/* ===== Menu ===== */}
      <div className="menu mt-8">
        {navLinks.map((link) => {
          const Icon = link.linkIcon;
          return (
            <a key={link.link} href={link.link} className="nav-item">
              <Icon className="w-6 h-6" />
              <span className="label">{link.label}</span>
            </a>
          );
        })}
      </div>

      {/* ===== Bottom Section ===== */}
      <div className="logIn">
        <a href={authLink.link} className="nav-item">
          <authLink.linkIcon className="w-5 h-5" />
          <span className="label">{authLink.label}</span>
        </a>

        {
            isLoggedIn? (<a onClick={(e)=>handleLogout(e)} className="nav-item">
          <LogOut className="w-5 h-5" />
          <span className="label">Logout</span>
        </a>):""
        }
      </div>
    </nav>
    <div className="mob-nav w-full fixed top-0 left-0 z-999 md:hidden">
<h1 className="text-white bg-amber-300">logo</h1>
    </div>
    </>
  );
}

export default LeftMenu;
