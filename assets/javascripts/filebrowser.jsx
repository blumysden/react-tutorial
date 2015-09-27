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
          <Dir {...tree} />
        </div>
      );
    }
  });

  var Dir = React.createClass({
    render: function() {
      var props = this.props,
          dirs = mapSorted(this.props.dirs, function(name) {
            return (
              <li className="dir">
                <span className="dir-name">{ name }</span>
                <Dir {...this[name]} />
              </li>
            );
          }),
          files = mapSorted(this.props.files, function(name) {
            return (<li className="file">{ name }</li>);
          });
      return (
        <ul className="dir">
          { dirs }
          { files }
        </ul>
      );
    }
  });

  React.render(
    <FileBrowser {...{session: foo}}/>,
    document.getElementById('here')
  );

})();