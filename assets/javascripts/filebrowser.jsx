(function() {

  var foo = {
    'b.html': '<div>Lorem ipsum</div>',
    '02/index.html': '<div>Lorem ipsum</div>',
    '01/d.html': '<div>Lorem ipsum</div>',
    '01/c.css': '<div>Lorem ipsum</div>',
    '01/01/index.html': '<div>Lorem ipsum</div>',
    'a.js': '<div>Lorem ipsum</div>',
  };

  var makeTree = function(session) {
    return _.reduce(session, function(memo, content, filename) {
      var parts = filename.split('/'),
          file = parts.pop(),
          parent = memo;
      _.each(parts, function(dir) {
        if (!parent.dirs[dir]) {
          parent.dirs[dir] = { files: {}, dirs: {} };
        }
        parent = parent.dirs[dir];
      });
      parent.files[file] = content;
      return memo;
    }, { files: {}, dirs: {} });
  };

  var mapSorted = function(obj, iteratee) {
    return _.chain(obj).
      keys().
      sort().
      map(_.bind(iteratee, obj)).
      value();
  }


  var FileBrowser = React.createClass({
    getInitialState: function() {
      return {};
    },
    render: function() {
      var tree = makeTree(this.props.session);
      return (
        <div className="file-browser">
          <Dir { ...tree } />
        </div>
      );
    }
  });

  var Dir = React.createClass({
   
    render: function() {
      var self = this,
          props = this.props,
          // className = 'dir' + ((this.state.expanded) ? ' expanded' : ''),
          dirs = mapSorted(this.props.dirs, function(name) {
            var key = _.uniqueId('dir_');
            return (
              <SubDir name={ name } contents={ this[name] } key={ key } />
            );
          }),
          files = mapSorted(this.props.files, function(name) {
            var key = _.uniqueId('file_');
            return (<li className="file" key={ key } >{ name }</li>);
          });
      return (
        <ul className={ this.props.expanded ? 'dir-expanded' : 'dir' }>
          { dirs }
          { files }
        </ul>
      );
    }
  });

  var SubDir = React.createClass({
     getInitialState: function() {
      return { expanded: false };
    },
    handleClick: function() {
      console.log('handleClick', this.props.children);
      this.setState({ expanded: !this.state.expanded });
    },
    render: function() {

      return (
        <li className="sub-dir">
          <div className='dir-name' onClick={ this.handleClick }>{ this.props.name }</div>
          <Dir { ...this.props.contents } expanded={ this.state.expanded } />
        </li>
      );
    }
  });

  React.render(
    <FileBrowser {...{session: foo}}/>,
    document.getElementById('here')
  );

})();