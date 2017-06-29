class ChangeDateFormatInChart < ActiveRecord::Migration
  def up
    change_column :charts, :start_time, :datetime
  end

  def down
    change_column :charts, :start_time, :date
  end
end
