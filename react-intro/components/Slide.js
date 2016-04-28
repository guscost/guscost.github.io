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
    
    // get the list of lines we should actually show on screen based on "displayUpToLine"
    var linesToDisplay = cmp.props.lines.slice(0, cmp.props.displayUpToLine || 0);
    
    return el("div", null,
    
      // slide title
      el("h1", { className: "page-header" }, cmp.props.title),
      
      // lines (this component will join the array of lines and format as markdown)
      el(SlideLines, {
        lines: linesToDisplay
      }),
      
      // any children render at the end of the slide (TodoApp and ItineraryApp)
      cmp.props.children
    );
  }
});
