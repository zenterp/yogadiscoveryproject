Yogadiscoveryproject::Application.routes.draw do
  devise_for :users

  get 'auth/facebook/callback', to: 'facebook/sessions#create'

  get '*', to: 'studios#nearby'
end
