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

fetch('https://nfl-api-data.p.rapidapi.com/nfl-team-listing/v1/data', {
  cache: 'force-cache',
  method: 'GET',
  headers: {
    'Cache-Control': 'max-age=86400',
    'Content-Type': 'application/json',
    'X-Rapidapi-Host': 'nfl-api-data.p.rapidapi.com',
    'X-Rapidapi-Key': 'cf3cb436dcmsh713196812fbd533p195348jsnf6ac112ec393'
  }
}) // Replace with your API URL
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Assuming the API returns JSON data
  })
  .then(data => {
    // Process the received data
    let teams = data;
    console.log(teams);
    //teams.forEach((team) => {
    //  console.log(team);
      /* fetch('https://nfl-api-data.p.rapidapi.com/nfl-player-listing/v1/data?id=22', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Rapidapi-Host': 'nfl-api-data.p.rapidapi.com',
          'X-Rapidapi-Key': 'cf3cb436dcmsh713196812fbd533p195348jsnf6ac112ec393'
        }
      }) // Replace with your API URL
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the API returns JSON data
        })
        .then(data => {
          // Process the received data
          let teams = data;
          console.log(teams);
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching data:', error);
        }); */
    //});
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
  });
