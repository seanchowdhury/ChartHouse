json.set! @course.id do
  json.extract! @course, :id, :title, :description, :waypoints
end
