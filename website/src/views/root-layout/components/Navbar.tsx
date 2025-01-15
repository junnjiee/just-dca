import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <div className="flex flex-row border-b px-2 md:px-7 py-3 justify-between">
      <div>Logo or smth</div>
      <div>
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
    </div>
  );
}
