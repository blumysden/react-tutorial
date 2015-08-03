(function() {

  var fight = {
    id: 123,
    weight: 'Welterweight',
    catchWeight: false,
    rounds: 12,
    location: 'MGM Grand, Las Vegas, NV',
    date: new Date(Date.UTC(2015, 4, 2)),
    fighters: [
      {
        name: 'Floyd Mayweather',
        id: 1,
        key: 1,
        record: {
          wins: 48,
          losses: 0,
          draws: 0
        }
      },
      {
        name: 'Manny Pacquiao',
        id: 2,
        key: 2,
        record: {
          wins: 45,
          losses: 3,
          draws: 1
        }
      }
    ]
  }

  var Card = React.createClass({
    getInitialState: function() {
      return {
        scores: this.props.fighters.reduce(function(memo, fighter) {
          memo[fighter.id] = [10, 10, 9, 8];
          return memo;
        }, {})
      }
    },
    render: function(){
      return (
        <div className="card">
          <CardHeader {...this.props}/>
          <Scores {...this.props} scores={this.state.scores}/>
          <ScorePad {...this.props} scores={this.state.scores}/>
        </div>
      )
    }
  });

  var CardHeader = React.createClass({
    render: function(){
      var fighters = this.props.fighters.map(function(fighter) {
        return <Fighter {...fighter} />
      });
      return (
        <div className="card-header">
          <h2>{ fighters }</h2>
          <h3>{ this.props.location}, { this.props.date.toString() }</h3>
        </div>
      );
    }
  });

  var Scores = React.createClass({
    render: function() {
      var rounds = [];
      for (var i = 1; i <= this.props.rounds; i++) {
        rounds.push(<td key={i}>{i}</td>);
      };
      return (
        <table className="scores">
          <thead>
            <tr>
              <td>Fighter</td>
              { rounds }
            </tr>
          </thead>
          <tbody>
            {this.props.fighters.map(function(fighter) {
              return (<FighterScores key={fighter.key} fighter={fighter} rounds={this.props.rounds} scores={this.props.scores[fighter.key]}/>);
            }, this)}
          </tbody>
        </table>
      );
    }
  });

  var ScorePad = React.createClass({
    propTypes: {
      round: React.PropTypes.number.isRequired,
      scores: React.PropTypes.array.isRequired
    },
    getDefaultProps: function() {
      return {
        round: 1
      };
    },
    getInitialState: function() {
      return { round: this.props.round };
    },
    updateRound: function(e) {
      this.setState({round: e.target.value});
    },
    render: function() {
      return (
        <form className="score-pad">
          <label>Round</label>
          <input type="text" name="round" value={this.state.round} onChange={this.updateRound}/>
          { this.props.fighters.map(function(fighter) {
            return (<FighterRoundScore name={fighter.name} key={fighter.key} round={this.state.round} score={this.props.scores[fighter.id][this.state.round - 1]}/>);
          }, this)}
        </form>
      );
    }
  });

  var FighterScores = React.createClass({
    render: function() {
      var rounds = [];
      for (var i = 1; i <= this.props.rounds; i++) {
        rounds.push(<FighterRound key={i} score={this.props.scores[i - 1]}/>);
      };
      return (
        <tr className="fighter-round">
          <td>{ this.props.fighter.name }</td>
          { rounds }
        </tr>
      );
    }
  });

  var FighterRound = React.createClass({
    render: function() {
      return (<td>{ this.props.score }</td>);
    }
  });

  var FighterRoundScore = React.createClass({
    updateScore: function(e) {
      console.log('update?', this.props);
      console.log(e.target.value);

      // this.setState({ fighter: this.})
    },
    render: function() {
      console.log(this.props.round);
      return (
        <fieldset>
          <label>{ this.props.name }</label>
          <input type="text" value={this.props.score} onChange={this.updateScore} />
        </fieldset>
      );
    }
  });

  var Fighter = React.createClass({
    render: function() {
      return (
        <div className="fighter">
          <strong className="fighter-name">{this.props.name}</strong>
          <span className="fighter-record">({this.props.record.wins}-{this.props.record.losses}-{this.props.record.draws})</span>
        </div>
      )
    }
  });

  React.render(
    <Card {...fight}/>,
    document.getElementById('cards')
  );

})();