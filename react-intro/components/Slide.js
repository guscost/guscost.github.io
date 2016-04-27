var Slide = React.createClass({
  
  displayName: "Slide",
  
  propTypes: {
    title: React.PropTypes.string.isRequired,
    lines: React.PropTypes.array.isRequired,
    displayUpToLine: React.PropTypes.number
  },

  render: function render() {
    var el = React.createElement;
    var cmp = this;
    
    var linesToDisplay = cmp.props.lines.slice(0, cmp.props.displayUpToLine || 0);
    
    return el("div", null,
      el("h1", { className: "page-header" }, cmp.props.title),
      el(SlideLines, {
        lines: linesToDisplay
      })
    );
  }
});
