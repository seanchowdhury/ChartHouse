class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.integer :user_id, null: false
      t.string :title, null: false
      t.text :description
      t.text :waypoints, null: false
      t.timestamps null: false
    end

    add_index :courses, :user_id
  end
end
