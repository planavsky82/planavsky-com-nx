let players = [
  {
    "name": "New York City",
    "pic": "/demo-images/city.jpeg",
    "summary": "This is summary text.",
    "summaryData": [
      {
        "label": "A",
        "value": "B"
      },
      {
        "label": "A",
        "value": "B"
      },
      {
        "label": "A",
        "value": "B"
      }
    ],
    "desc": "Description",
    "colors": [ "#32a852", "#a83238", "#a83238" ]
  }
];

if (localStorage.hasOwnProperty('players')) {
  console.log('local storage set');
} else {
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
            console.log(teamObj.team.displayName);
            let playerData = data;
            console.log(playerData.athletes.find((athlete) => {
              return athlete.position === 'offense';
            }).items);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      });
      localStorage.setItem('players', {});
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
    });
}
