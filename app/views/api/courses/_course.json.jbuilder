courses.each do |course|
  json.set! course.id do
    json.extract! course, :id, :title, :description, :waypoints, :created_at
  end
end
