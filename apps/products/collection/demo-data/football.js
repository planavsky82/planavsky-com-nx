// set user rankings local storage from API call or from the "move" function callback in the collection component
let setUserRankings = (rankings) => {
  if (rankings) {

  }
  // get API call

  // set local storage var
  localStorage.setItem('mffrUserRankings', JSON.stringify());
}

let loadLocalData = () => {
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

  let players = [];

  let getGroup = (position) => {
    return structuredData.find((group) => {
      return group.position === position;
    });
  };

  getGroup('RB').players.forEach((player) => {
    players.push({
      id: player.id,
      name: player.displayName,
      pic: player.headshot.href,
      picAlt: '',
      pic2: player.team.logos[0].href,
      picAlt2: player.team.displayName,
      summary: player.team.displayName,
      actions: [
        {
          label: 'View Player Details',
          event: () => {
            alert('A');
          }
        }
      ],
      desc: '<div>' + player.position.displayName + '</div><div>#' + player.number + '</div>',
      colors: [ '#000', '#fff', player.team.color, player.team.alternateColor ]
    })
  });

  return players;
}

// load player data
async function loadAPIlData() {
  if (!localStorage.hasOwnProperty('mffrPlayerData')) {
    return fetch('https://nfl-api-data.p.rapidapi.com/nfl-team-listing/v1/data', {
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

        async function fetchData(urls, teams) {
          const promises = urls.map(async (url, index) => {
            const response = await fetch(url, {
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
              let teamObj = teams[index];
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
              return playerList;
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
            return response;
          });

          const results = await Promise.all(promises);
          return results;
        }

        let urls = [];
        teams.forEach((teamObj) => {
          urls.push('https://nfl-api-data.p.rapidapi.com/nfl-player-listing/v1/data?id=' + teamObj.team.id);
          teamList.push(teamObj.team);
        });

        return fetchData(urls, teams)
          .then(data => {
            localStorage.setItem('mffrPlayerData', JSON.stringify(data[0]));
            localStorage.setItem('mffrTeamData', JSON.stringify(teamList));
            return loadLocalData();
          })
          .catch((error) => {
            return error;
          });
      })
      .catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
      });
  } else {
    return loadLocalData();
  }
}
