{
  session: {
    currentUser: {
      id: 1,
      email: "seanchowdhury@gmail.com",
      firstName: "Sean",
      lastName: "Chowdhury",
      imageUrl: "seanchowdhury.png"
    },
    forms: {
      signUp: {errors: []},
      logIn: {errors: []},
      createCourse: {errors: ['Add title/description']}
    }
  },
  courses: {
    1: {
      id: 1,
      title: "Some Course",
      description: "A nautical adventure",
      user_id: 1,
      map: {
        map details...
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
      chart_map: {
        map details...
      },
      chart_stats: {
        estimated_time: 4,
        weather: { weather details },
        peak_current: 3
      }
    }
  }
}
