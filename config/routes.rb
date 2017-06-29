Rails.application.routes.draw do
  namespace :api, defaults: { format: JSON } do
    resource :user, only: [:create]
    resource :session, only: [:create, :destroy]
    resources :courses, only: [:index, :show, :create, :destroy]
    resources :charts, only: [:index, :show, :create, :update]
  end

  root "static_pages#root"
end
