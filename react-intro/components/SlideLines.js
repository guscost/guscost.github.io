var SlideLines = React.createClass({
  
  displayName: "SlideLines",
  
  propTypes: {
    lines: React.PropTypes.array.isRequired
  },
  
    _rawMarkup: function() {
    var rawMarkup = marked(this.props.lines.join("\r\n"), { sanitize: true });
    return { __html: rawMarkup };
    },

  render: function render() {
    var el = React.createElement;
    var cmp = this;
  
    // render all visible lines, formatted as markdown
    return el("div", {
      style: { 
        fontSize: "24px",
        lineHeight: "32px"
      },
      dangerouslySetInnerHTML: this._rawMarkup()
    });
  }
});
