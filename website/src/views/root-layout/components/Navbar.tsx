import { NavLink } from "react-router";
import { SunIcon, MoonIcon } from "lucide-react";
import GithubIcon from "@/assets/github-mark.svg";
import GithubIconDarkMode from "@/assets/github-mark-white.svg";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  return (
    <div className="flex flex-row border-b px-2 md:px-7 py-3 justify-between items-center">
      <div className="flex flex-row items-center">
        <div>Logo</div>
        <Button variant={"link"}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => cn(isActive && "underline")}
          >
            Dashboard
          </NavLink>
        </Button>
        <Button variant={"link"}>
          <NavLink
            to="/what-is-dca"
            end
            className={({ isActive }) => cn(isActive && "underline")}
          >
            What is DCA?
          </NavLink>
        </Button>
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
