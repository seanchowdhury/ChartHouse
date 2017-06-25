json.user do
  json.extract! user, :id, :email, :fname, :lname
end

json.courses do
  user.courses.each do |course|
    json.set! course.id do
      json.extract! course, :id, :title, :description, :waypoints, :created_at
    end
  end
end
