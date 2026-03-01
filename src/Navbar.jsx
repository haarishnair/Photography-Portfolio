import './styles/Navbar.css'
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

function Navbar() {
    return (
        <>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><HashLink smooth to="/#featured">Featured</HashLink></li>
                    <li><Link to="/projects">Projects</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar