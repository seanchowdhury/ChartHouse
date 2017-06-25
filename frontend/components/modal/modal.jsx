import React from 'react';

class Modal extends React.Component {

  render() {
    if (this.props.isOpen === false){
      return null;
    } else {
      let modalStyle = {
        position: 'absolute',
        transform: 'translate(-50%, -%50)',
        zIndex: '9999',
        height: '310px',
        width: '600px',
        background: '#fff'
      };
      let backdropStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        zIndex: '9998',
        background: 'rgba(0, 0, 0, 0.78)'
      };
      return (
        <div className='save-modal'>
          <div className='inner-save-modal' style={modalStyle}>
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
