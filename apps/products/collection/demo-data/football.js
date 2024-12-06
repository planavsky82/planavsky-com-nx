if (!localStorage.hasOwnProperty('mffrPlayerData')) {
  fetch('https://nfl-api-data.p.rapidapi.com/nfl-team-listing/v1/data', {
    cache: 'force-cache',
    method: 'GET',
    headers: {
      'Cache-Control': 'max-age=86400',
      'Content-Type': 'application/json',
      'X-Rapidapi-Host': 'nfl-api-data.p.rapidapi.com',
      'X-Rapidapi-Key': 'cf3cb436dcmsh713196812fbd533p195348jsnf6ac112ec393'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Assuming the API returns JSON data
    })
    .then(data => {
      // Process the received data
      let teams = data;
      let playerList = [];
      let teamList = [];
      teams.forEach((teamObj) => {
        fetch('https://nfl-api-data.p.rapidapi.com/nfl-player-listing/v1/data?id=' + teamObj.team.id, {
          cache: 'force-cache',
          method: 'GET',
          headers: {
            'Cache-Control': 'max-age=86400',
            'Content-Type': 'application/json',
            'X-Rapidapi-Host': 'nfl-api-data.p.rapidapi.com',
            'X-Rapidapi-Key': 'cf3cb436dcmsh713196812fbd533p195348jsnf6ac112ec393'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            teamList.push(teamObj.team);
            let playerData = data;
            let players = playerData.athletes.find((athlete) => {
              return athlete.position === 'offense';
            }).items;
            players.forEach((player) => {
              playerList.push({
                headshot: player.headshot,
                id: player.id,
                uid: player.uid,
                guid: player.guid,
                shortName: player.shortName,
                slug: player.slug,
                status: player.status,
                number: player.jersey,
                position: player.position,
                firstName: player.firstName,
                lastName: player.lastName,
                experience: player.experience,
                college: player.college,
                displayName: player.displayName,
                injuries: player.injuries,
                team: teamObj.team
              });
            });
            localStorage.setItem('mffrPlayerData', JSON.stringify(playerList));
            localStorage.setItem('mffrTeamData', JSON.stringify(teamList));
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      });
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
    });
}

let localPlayerData = JSON.parse(localStorage.getItem('mffrPlayerData'));
let localTeamData = JSON.parse(localStorage.getItem('mffrTeamData'));
let structuredData = [];
let qb = localPlayerData.filter((player) => {
  return player.position.abbreviation === 'QB';
});
let rb = localPlayerData.filter((player) => {
  return player.position.abbreviation === 'RB';
});
let wr = localPlayerData.filter((player) => {
  return player.position.abbreviation === 'WR';
});
let te = localPlayerData.filter((player) => {
  return player.position.abbreviation === 'TE';
});
let k = localPlayerData.filter((player) => {
  return player.position.abbreviation === 'K';
});
structuredData.push({
  position: 'QB',
  players: qb
});
structuredData.push({
  position: 'RB',
  players: rb
});
structuredData.push({
  position: 'WR',
  players: wr
});
structuredData.push({
  position: 'TE',
  players: te
});
structuredData.push({
  position: 'FLEX',
  players: [rb,...wr,...te]
});
structuredData.push({
  position: 'ALL',
  players: [qb,...rb,...wr,...te]
});
structuredData.push({
  position: 'K',
  players: [k]
});
structuredData.push({
  position: 'DST',
  players: localTeamData
});
console.log(structuredData);

let players = [];

let getGroup = (position) => {
  return structuredData.find((group) => {
    return group.position === position;
  });
};

getGroup('RB').players.forEach((player) => {
  players.push({
    name: player.displayName,
    pic: player.headshot.href,
    picAlt: '',
    pic2: player.team.logos[0].href,
    picAlt2: player.team.displayName,
    summary: player.team.displayName,
    summaryData: [
      {
        label: 'A',
        value: 'B'
      },
      {
        label: 'A',
        value: 'B'
      },
      {
        label: 'A',
        value: 'B'
      }
    ],
    desc: player.position.displayName,
    colors: [ '#000', '#fff', player.team.color, player.team.alternateColor ]
  })
});
