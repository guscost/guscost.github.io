var LoadingPopup = React.createClass({
  
  displayName: "LoadingPopup",
  
  propTypes: {
    visible: React.PropTypes.bool.isRequired
  },

  render: function render() {
    var el = React.createElement;
    var cmp = this;
  
    // just a bootstrap modal that says "loading"
    return el("div",  { 
      className: "modal loadingWindow", 
      role: "dialog", 
      id: "loadingPopup", 
      style: { 
        display: cmp.props.visible ? "block" : "none" 
      }
    },
      el("div", { 
        className: "modal-dialog modal-sm" 
      },
        el("div", { 
          className: "modal-content" 
        },
          el("div", { 
            style: { 
              textAlign: 'center', 
              padding: '80px 32px' 
            }, 
            className: "modal-body" 
          },
            "LOADING"
          )
        )
      )
    );
  }
});