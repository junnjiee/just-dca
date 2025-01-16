import { useState } from "react";
import { Link, useLocation } from "react-router";
import { SunIcon, MoonIcon, MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import GithubIcon from "@/assets/github-mark.svg";
import GithubIconDarkMode from "@/assets/github-mark-white.svg";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const links = [
  { url: "/", title: "Dashboard" },
  { url: "/what-is-dca", title: "What is DCA?" },
];

export function Navbar() {
  return (
    <div className="flex flex-row border-b px-2 md:px-7 py-3 justify-between items-center">
      <div className="flex flex-row items-center">
        <NavDrawer className="md:hidden mx-2" />
        <div>Logo</div>
        <NavLinks className="hidden md:block" />
      </div>

      <div className="flex flex-row gap-x-2 items-center">
        <a
          href="https://github.com/junnjiee16/just-dca-lah"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={GithubIcon} alt="Github" className="w-5 h-5 dark:hidden" />
          <img
            src={GithubIconDarkMode}
            alt="Github"
            className="w-5 h-5 hidden dark:block"
          />
        </a>
        <ToggleDarkModeButton />
      </div>
    </div>
  );
}

function NavLinks({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <div className={className}>
      {links.map((link) => (
        <Button
          className={cn(
            "font-normal",
            location.pathname === link.url && "font-medium"
          )}
          variant={"ghost"}
          key={link.url}
          asChild
        >
          <Link to={link.url}>{link.title}</Link>
        </Button>
      ))}
    </div>
  );
}

function NavDrawer({ className }: { className?: string }) {
  return (
    <Drawer>
      <DrawerTrigger className={className}>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="hidden">Navbar</DrawerTitle>
        {links.map((link) => (
          <DrawerClose className="ms-7 pb-4" key={link.url} asChild>
            <Link to={link.url}>{link.title}</Link>
          </DrawerClose>
        ))}
      </DrawerContent>
    </Drawer>
  );
}

function ToggleDarkModeButton() {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeChange = () => {
    const isDarkMode = !darkMode;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  return (
    <Button variant={"ghost"} onClick={handleDarkModeChange}>
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
