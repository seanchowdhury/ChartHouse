class AddDurationToCharts < ActiveRecord::Migration
  def change
    add_column :charts, :duration, :int, null: false, :default => 0
  end
end
