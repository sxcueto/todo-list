import { NavLink } from "react-router";
import styles from "./Header.module.css";

const Header = ({ title }) => {
  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
