class Api::ChartsController < ApplicationController
  def index
    @charts = Chart.where(user_id: current_user.id)
    render "api/charts/index"
  end

  def show
    @chart = Chart.find(id)
    render "api/charts/show"
  end

  def create
    @chart = Chart.new(chart_params)
    if @chart.save
      render "api/charts/show"
    else
      render json: @chart.errors.messages, status: 422
    end
  end

  def destroy
  end

  private

  def chart_params
    params.require(:chart).permit(:user_id, :course_id, :boat_id, :title, :description, :start_time, :chart_stats)
  end
end
