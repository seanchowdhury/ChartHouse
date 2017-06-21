json.extract! user, :id, :email, :fname, :lname
json.courses do
  user.courses.each do |course|
    json.extract! course, :id, :title, :description
  end
end
