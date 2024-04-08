import { Outlet } from "react-router-dom";
import MenuAppBarStatick from "./components/MenuAppBarStatick";

export default function Root2() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateRows: '50px auto' }}>
        <div style={{ backgroundColor: 'blue', height: '50px', width: '100%' }}>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
          <MenuAppBarStatick />
          <div>
            <Outlet />
          </div>
        </div>
      </div>    
    </>
  );
}
