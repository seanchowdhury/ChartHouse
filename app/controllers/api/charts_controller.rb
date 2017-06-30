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
    @chart.user_id = current_user.id
    if @chart.save
      render "api/charts/show"
    else
      render json: @chart.errors.messages, status: 422
    end
  end

  def update
    @chart = Chart.find(params['chart']['id'])
    if @chart.update(chart_params)
      render "api/charts/show"
    else
      render json: @chart.errors.messages, status: 422
    end
  end

  def destroy
    @chart = Chart.find(params['id'])
    if @chart.delete
      render "api/charts/index"
    else
      render json: @chart.errors.messages, status: 422
    end
  end

  private

  def chart_params
    params.require(:chart).permit(:course_id, :boat_id, :title, :description, :start_time, :duration)
  end
end
