author = @chart.user

json.set! @chart.id do
  json.extract! @chart, :id, :title, :description, :boat_id, :start_time, :duration, :course_id
  json.author_fname author.fname
  json.author_lname author.lname
end
