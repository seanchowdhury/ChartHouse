class CreateCharts < ActiveRecord::Migration
  def change
    create_table :charts do |t|
      t.integer :user_id, null: false
      t.integer :course_id, null: false
      t.integer :boat_id, null: false
      t.string :title, null: false
      t.text :description
      t.date :start_time, null: false
      t.text :chart_stats, null: false

      t.timestamps null: false
    end

    add_index :charts, :user_id
    add_index :charts, :boat_id
    add_index :charts, :start_time
  end
end
