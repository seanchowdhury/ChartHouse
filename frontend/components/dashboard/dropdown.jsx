import React from 'react';

export class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      showMenu: false
    };
  }

  toggleMenu() {
    let menuState = !this.state.showMenu;
    this.setState({
      showMenu: menuState
    });
  }

  render() {
    let menuItems;
    if(this.state.showMenu) {
      menuItems = <this.props.menu />
    } else {
      menuItems = "";
    }
    return (
      <div id="menu" onClick = { this.toggleMenu }>
        <div className='dash-title'>
          {this.props.navItem} <i className="fa fa-arrow-down" aria-hidden="true"></i>
        </div>
      <div className='menu-items'>
        {menuItems}
      </div>
    </div>
    )
  }
}
