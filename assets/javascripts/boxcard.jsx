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
  };

  var userScores = {
    1: [8,10,10],
    2: [10,9,9]
  };

  var Card = React.createClass({
    getInitialState: function() {
      return {
        scores: userScores // fake API call
      };
    },
    getFighterScores: function(fighterId) {
      return this.state.scores[fighterId];
    },
    getFighterScore: function(fighterId, round) {
      return this.getFighterScores(fighterId)[round - 1];
    },
    setFighterScore: function(fighterId, round, score) {
      var updated = _.reduce(this.state.scores, function(memo, v, k) {
        memo[k] = v.slice();
        if (k == fighterId) {
          memo[k][round - 1] = score;
        }
        return memo;
      }, {});
      return this.setState({scores: updated});
    },
    render: function(){
      return (
        <div className="card">
          <CardHeader {...this.props}/>
          <Scores {...this.props} scores={this.state.scores} getFighterScore={this.getFighterScore.bind(this)}/>
          <ScorePad {...this.props} scores={this.state.scores} getFighterScore={this.getFighterScore.bind(this)} setFighterScore={this.setFighterScore.bind(this)}/>
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
      console.log(this.props);
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
              return (<FighterScores key={fighter.key} name={fighter.name} id={fighter.id} rounds={this.props.rounds} getFighterScore={this.props.getFighterScore} setFighterScore={this.props.setFighterScore}/>);
            }, this)}
          </tbody>
        </table>
      );
    }
  });

  var FighterScores = React.createClass({
    render: function() {
      var rounds = [];
      for (var i = 1; i <= this.props.rounds; i++) {
        rounds.push(<td>{ this.props.getFighterScore(this.props.id, i) }</td>)
      };
      return (
        <tr className="fighter-round">
          <td>{ this.props.name }</td>
          { rounds }
        </tr>
      );
    }
  });

  var ScorePad = React.createClass({
    propTypes: {
      round: React.PropTypes.number,
      scores: React.PropTypes.object.isRequired
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
            return (<FighterRoundScore name={fighter.name} key={fighter.key} id={fighter.id} round={this.state.round} getFighterScore={this.props.getFighterScore} setFighterScore={this.props.setFighterScore}/>);
          }, this)}
        </form>
      );
    }
  });

  var FighterRoundScore = React.createClass({
    updateScore: function(e) {
      this.props.setFighterScore(this.props.id, this.props.round, e.target.value);
    },
    render: function() {
      return (
        <fieldset>
          <label>{ this.props.name }</label>
          <input type="text" value={ this.props.getFighterScore(this.props.id, this.props.round) } onChange={this.updateScore} />
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