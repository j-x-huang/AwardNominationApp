import * as React from "react";
import ilogo from "../images/ilogo.png";
import { getUser, logOutUser } from "../auth";
import { getAdminStatus, getMyImage } from "../MicrosoftGraphClient";
import { NavLink } from "react-router-dom";
import * as firebase from "firebase";

class NavBar extends React.Component<any, any> {
  public state = {
    profilePic:
      "http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg",
    isLocked: false,
    isAdmin: false,
    lockPath: firebase.database().ref("/lockdown")
  };

  public componentDidMount() {
    this.readLockState();
    getMyImage((picUrl, err) => {
      if (err) {
        // nothing
      } else {
        this.setState({
          profilePic: picUrl
        });
      }
      return;
    });
    getAdminStatus((isAdmin, err) => {
      if (err) {
        // todo
      } else {
        this.setState({ isAdmin });
      }
    });
  }
  private readLockState = () => {
    this.state.lockPath.on("value", snap =>
      this.setState({ isLocked: snap!.val().lockState })
    );
  };

  public render() {
    const user = getUser();

    const isAdmin = this.state.isAdmin;

    const profileName = user.profile.name
      .split(" ")
      .slice(0, -1)
      .join(" ");

    return (
      <nav className="navbar navbar-expand-xl navbar-light bg-light">
        <NavLink className="navbar-brand" to="/home">
          <img src={ilogo} height="24" alt="" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li
              className="nav-item"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
            >
              <NavLink
                activeClassName="activeLink"
                to="/home"
                className="nav-link"
              >
                <span>HOME</span>
              </NavLink>
            </li>
            <li
              className="nav-item"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
            >
              <NavLink
                activeClassName="activeLink"
                to="/awards"
                className="nav-link"
              >
                <span>AWARDS</span>
              </NavLink>
            </li>
            <li
              className="nav-item"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
              style={this.state.isLocked ? { display: "none" } : {}}
            >
              <NavLink
                activeClassName="activeLink"
                to="/nominate"
                className="nav-link"
              >
                <span>NOMINATE</span>
              </NavLink>
            </li>

            <li
              className="nav-item"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
            >
              {" "}
              <NavLink
                activeClassName="activeLink"
                to="/mynominations"
                className="nav-link"
              >
                <span>MY NOMINATIONS</span>
              </NavLink>
            </li>
            {isAdmin ? (
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target=".navbar-collapse.show"
              >
                <NavLink
                  activeClassName="activeLink"
                  to="/admin"
                  className="nav-link"
                >
                  <span>ADMIN</span>
                </NavLink>
              </li>
            ) : null}
          </ul>
          <ul className="nav navbar-nav ml-auto">
            <li className="dropdown links nav-item">
              <a
                className="nav-link"
                id="dropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img className="profilePic" src={this.state.profilePic} />
                <span id="profileName">{profileName}</span>
              </a>

              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a
                  className="dropdown-item profileDropdownItem"
                  onClick={logOutUser}
                >
                  Sign Out
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
export default NavBar;
