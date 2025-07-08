import { Link } from 'react-router';

function Navigation() {
  return (
    <ul>
      <li>
        <Link to="/">home</Link>
      </li>
      <li>
        <Link to="/login">login</Link>
      </li>
      <li>
        <Link to="/register">register</Link>
      </li>
    </ul>
  );
}

export default Navigation;