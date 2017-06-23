import React from 'react';

class Modal extends React.Component {

  render() {
    if (this.props.isOpen === false){
      return null;
    } else {
      let modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -%50)',
        zIndex: '9999',
        background: '#fff'
      };
      let backdropStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        zIndex: '9998',
        background: 'rgba(0, 0, 0, 0.3)'
      };
      return (
        <div className='saveModal'>
          <div className='innerSaveModal' style={modalStyle}>
            {this.props.children}
          </div>
          {!this.props.noBackdrop &&
              <div className={this.props.backdropClassName} style={backdropStyle}
                   onClick={e => this.close(e)}/>}
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
