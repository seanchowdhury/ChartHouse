class Api::CoursesController < ApplicationController
  def index
    @courses = Course.where(user_id: current_user.id)
    render "api/courses/index"
  end

  def show
    @course = Course.find(id)
    render "api/courses/show"
  end

  def create
    @course = Course.new(course_params)
    if @course.save
      render "api/courses/show"
    else
      render json: @course.errors.messages, status: 422
    end
  end

  def destroy
  end

  private

  def course_params
    params.require(:course).permit(:user_id, :title, :description, :waypoints)
  end
end
