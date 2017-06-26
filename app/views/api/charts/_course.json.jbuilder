charts.each do |chart|
  json.set! chart.id do
    json.extract! chart, :id, :title, :start_time
  end
end
