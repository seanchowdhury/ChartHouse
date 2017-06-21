{
  session: {
    currentUser: {
      id: 1,
      email: "seanchowdhury@gmail.com",
      fName: "Sean",
      lName: "Chowdhury",
      imageUrl: "seanchowdhury.png"
    },
    errors: []
    }
  },
  boats: {
    1: {
      id: 1,
      name: 'Storm Boat',
      speed: 3,
      imageUrl: "blazinglybluebeautifulboat.png"
    },
    2: {
      id: 4,
      name: 'JML',
      speed: 2.5
    }
  },
  courses: {
    1: {
      id: 1,
      title: "Some Course",
      description: "A nautical adventure",
      user_id: 1,
      waypoints: {
        google map data
      }
    }
  },
  charts: {
    1: {
      id: 1,
      title: "A Trip Down The Gowanus Canal",
      user_id: 1,
      description: "It was gross",
      course_id: 1,
      start_date: "Sun Jun 18 2017 19:44:12 GMT-0500 (EST)",
      chart_stats: {
        estimated_time: 4,
        weather: { weather details },
        peak_current: 3
      }
    }
  }
}
