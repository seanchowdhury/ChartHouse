# == Schema Information
#
# Table name: courses
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  title       :string           not null
#  description :text
#  waypoints   :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Course < ActiveRecord::Base
  validates_presence_of :user_id, :waypoints, :distance, :esttime, :start_time
  validates :title, presence: { message: "Course name cannot be blank"}

  belongs_to :user
  has_many :charts

end
