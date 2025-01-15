import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="flex flex-row border-b px-4 py-3 justify-between">
      <div>Logo or smth</div>
      <div className="space-x-5">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/what-is-dca" end>
          Home
        </NavLink>
      </div>
    </div>
  );
}
