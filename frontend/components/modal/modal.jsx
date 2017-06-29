import React from 'react';

class Modal extends React.Component {
  render() {
    if (this.props.isOpen === false){
      return null;
    } else {
      let modalStyle = {
        position: 'absolute',
        zIndex: '9999',
        height: '310px',
        width: '600px',
        background: 'white'
      };
      let backdropStyle = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        zIndex: '9998',
        background: 'rgba(0, 0, 0, 0.78)'
      };
      return (
        <div className='save-modal' onClick={this.close.bind(this)}>
          <div className='inner-save-modal' style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {this.props.children}
          </div>
        </div>
      );
    }
  }

  close(e) {
    e.preventDefault();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}


export default Modal;
