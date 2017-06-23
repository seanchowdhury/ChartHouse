class Course < ActiveRecord::Base
  validates_presence_of :user_id, :waypoints
  validates :title, presence: { message: "Course name cannot be blank"}

  belongs_to :user

end
