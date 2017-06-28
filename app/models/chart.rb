class Chart < ActiveRecord::Base
  validates_presence_of :user_id, :course_id, :boat_id, :title, :start_time
  belongs_to :user
  belongs_to :course
  belongs_to :boat
end
