Yogadiscoveryproject::Application.routes.draw do
  get 'auth/facebook/callback', to: 'facebook/sessions#create'

  # Send all other traffic to the javascript application entry point
  get '*path', to: redirect('/')
end
