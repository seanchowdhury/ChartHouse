author = @chart.user

json.set! @chart.id do
  json.extract! @chart, :id, :title, :description, :boat_id, :start_time, :chart_stats
  json.course do
    json.extract! chart.course, :id, :waypoints
  end
  json.author_fname author.fname
  json.author_lname author.lname
end
