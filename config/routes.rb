Yogadiscoveryproject::Application.routes.draw do
  devise_for :users

  namespace :api do 
    resources :studios
  end 

  get 'auth/facebook/callback', to: 'facebook/sessions#create'
  get 'studios/new', to: 'studios#new'

  get '/', to: 'studios#nearby'
end
