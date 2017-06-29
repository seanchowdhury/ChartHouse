json.user do
  json.extract! user, :id, :email, :fname, :lname
end

json.courses do
  user.courses.each do |course|
    author = course.user
    json.set! course.id do
      json.extract! course, :id, :title, :description, :waypoints, :created_at, :distance, :esttime
      json.author_fname author.fname
      json.author_lname author.lname
    end
  end
end

json.charts do
  user.charts.each do |chart|
    author = chart.user
    json.set! chart.id do
      json.extract! chart, :id, :title, :start_time, :description, :boat_id, :course_id, :duration
      json.author_fname author.fname
      json.author_lname author.lname
    end
  end
end
