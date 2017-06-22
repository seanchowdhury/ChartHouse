class Course < ActiveRecord::Base
  validates_presence_of :user_id, :title, :waypoints

  belongs_to :user

end
