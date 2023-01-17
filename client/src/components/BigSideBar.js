import Wrapper from "../assets/wrappers/BigSidebar";
// import { FaTimes } from "react-icons/fa";
import { useAppContext } from "../context/appContext";
import NavLinks from "./NavLink";

import Logo from "./Logo";

const BigSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          {/* <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button> */}
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
