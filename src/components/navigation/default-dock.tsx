import { Home, List, Search, Settings } from "react-feather";
import { DockLink } from "./dock-link";

export function DefaultDock() {
  return (
    <div className="dock bg-base-200 text-base-content">
      <DockLink href="/">
        <Home />
      </DockLink>

      <DockLink href="/search">
        <Search />
      </DockLink>

      <DockLink href="/orders">
        <List />
      </DockLink>

      <DockLink href="/settings">
        <Settings />
      </DockLink>
    </div>
  );
}
