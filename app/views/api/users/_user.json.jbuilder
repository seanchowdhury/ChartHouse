json.user do
  json.extract! user, :id, :email, :fname, :lname
end

json.courses do
  user.courses.each do |course|
    author = course.user
    json.set! course.id do
      json.extract! course, :id, :title, :description, :waypoints, :created_at
      json.author_fname author.fname
      json.author_lname author.lname
    end
  end
end
