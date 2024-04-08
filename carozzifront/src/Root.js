import { Outlet } from "react-router-dom";
import MenuAppBar from "./components/MenuAppBar";

export default function Root() {
  return (
    <>
      <div id="sidebar">
        <MenuAppBar />
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
