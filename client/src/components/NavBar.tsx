import * as React from 'react';
import logo from './../logo.svg';

class NavBar extends React.Component {
  public render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/"><img src={logo} width="auto" height="30" alt="logo" /></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Awards</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/nominate">Nominate</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">My Nominations</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="/">Admin</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default NavBar;