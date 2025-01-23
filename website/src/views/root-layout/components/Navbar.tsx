import { Link, useLocation } from "react-router";
import { SunIcon, MoonIcon, MenuIcon, TrendingUpIcon } from "lucide-react";
import { useBoolean } from "usehooks-ts";

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
  { url: "/", title: "Dashboard", shortTitle: "Dashboard" },
  { url: "/what-is-dca", title: "What is DCA?", shortTitle: "What is DCA?" },
  { url: "/about", title: "About this App", shortTitle: "About" },
];

export function Navbar() {
  return (
    <div className="flex flex-row border-b px-2 md:px-7 py-3 justify-between items-center sticky top-0 backdrop-blur-md z-50">
      <div className="flex flex-row items-center gap-x-1">
        <NavDrawer className="md:hidden mx-2" />
        <JustDcaLogo />
        <NavLinks className="hidden md:block" />
      </div>

      <div className="flex flex-row gap-x-2 items-center">
        <a
          href="https://github.com/junnjiee16/just-dca"
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
            location.pathname === link.url &&
              "font-medium text-accent-foreground",
          )}
          variant={"ghost"}
          key={link.url}
          onClick={() => (document.title = `just:dca | ${link.shortTitle}`)}
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
          <DrawerClose
            className="ms-7 pb-4"
            key={link.url}
            onClick={() => (document.title = `just:dca | ${link.shortTitle}`)}
            asChild
          >
            <Link to={link.url}>{link.title}</Link>
          </DrawerClose>
        ))}
      </DrawerContent>
    </Drawer>
  );
}

function ToggleDarkModeButton() {
  const { value: isDarkMode, toggle } = useBoolean(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  if (isDarkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  return (
    <Button
      variant={"ghost"}
      className="text-accent-foreground"
      onClick={toggle}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

function JustDcaLogo() {
  return (
    <a
      className="flex flex-row gap-x-1 items-center"
      href={import.meta.env.VITE_WEBSITE_URL!}
    >
      <TrendingUpIcon />
      <p className="font-bold tracking-wide">just:dca</p>
    </a>
  );
}
