Rails.application.routes.draw do
  namespace :api, defaults: { format: JSON } do
    resource :user, only: [:create]
    resource :session, only: [:create, :destroy]
    resources :courses, only: [:show, :create, :destroy]
  end

  root "static_pages#root"
end
