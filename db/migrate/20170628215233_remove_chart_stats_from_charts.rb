class RemoveChartStatsFromCharts < ActiveRecord::Migration
  def change
    remove_column :charts, :chart_stats
  end
end
