class Api::CoursesController < ApplicationController
  def show
    render "api/courses/show"
  end

  def create
    @course = Course.new(course_params)
    if @course.save
      render "api/courses/show"
    else
      render json: @course.errors.messages, status: 422
  end

  def destroy
  end

  private

  def course_params
    params.require(:course).permit(:user_id, :title, :description, :waypoints)
  end
end
