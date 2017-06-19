# ChartHouse

[Heroku Link][heroku]
[Trello Link][trello]

[heroku]: http://www.herokuapp.com
[trello]: https://trello.com/b/ChartHouse

## Minimum Viable Product

ChartHouse is a web application inspired by Strava built using Ruby on Rails and React/Redux.
By the end of an initial two week development phase ChartHouse will, at a minimum, satisfy the
following criteria with smooth, big-free navigation, adequate seed data and sufficient CSS styling:

- [ ] Hosting on Heroku
- [ ] New account creation, login, and guest/demo login
- [ ] Allow the user to draw courses on water.
- [ ] Allow the user to save courses to charts with times and distance.
- [ ] Display a feed of the user's charts.
- [ ] Allow users to share formatted versions of their chart.
- [ ] Implement tide/current integration for select rivers.
- [ ] Implement inclement weather alerts.
- [ ] BONUS: Search public charts by user and location.
- [ ] BONUS: Implement friending and following features.
- [ ] Production README [sample](docs/production_readme.md)

## Design Docs

* [View Wireframes][wireframes]
* [React Components][Components]
* [API endpoints][api-endpoints]
* [DB schema][schema]
* [Sample State][sample-state]

## Implementation Timeline

### Phase 1: Backend setup and Front End User Authentication (2 days)

**Objective:** Functioning rails project with front-end Authentication.

### Phase 2: Course Model, API, and Components (2 days)

**Objective:** Courses can be created, read, edited and destroyed through the API.

### Phase 3: Charts Model, API, and Components (2 days)

**Objective:** Charts can be created, read, edited and destroyed through the API.

### Phase 4: Tide and Current Calculation Utility (4 days)

**Objective:** Use the NOAA Currents Prediction API to give charts more accurate estimated completion times.

### Phase 5: Inclement Weather Utility (2 days)

**Objective:** Use NWS API to provide weather forecasts and alerts for Inclement for charts.

### Bonus Features (TBD)

Search all charts
Friends
Infinite scroll on all feeds
